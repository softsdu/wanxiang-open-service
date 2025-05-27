import { UNDEFINED_VALUE, FUNCTION_TYPE } from './constants.js';
import './configuration.js';

/*
 Copyright (c) 2022 Gildas Lormeau. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright 
 notice, this list of conditions and the following disclaimer in 
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const ERR_ITERATOR_COMPLETED_TOO_SOON = "Writer iterator completed too soon";
const HTTP_HEADER_CONTENT_TYPE = "Content-Type";
const DEFAULT_CHUNK_SIZE = 64 * 1024;
const PROPERTY_NAME_WRITABLE = "writable";
class Stream {
  constructor() {
    this.size = 0;
  }
  init() {
    this.initialized = true;
  }
}
class Reader extends Stream {
  get readable() {
    const reader = this;
    const {
      chunkSize = DEFAULT_CHUNK_SIZE
    } = reader;
    const readable = new ReadableStream({
      start() {
        this.chunkOffset = 0;
      },
      async pull(controller) {
        const {
          offset = 0,
          size,
          diskNumberStart
        } = readable;
        const {
          chunkOffset
        } = this;
        controller.enqueue(await readUint8Array(reader, offset + chunkOffset, Math.min(chunkSize, size - chunkOffset), diskNumberStart));
        if (chunkOffset + chunkSize > size) {
          controller.close();
        } else {
          this.chunkOffset += chunkSize;
        }
      }
    });
    return readable;
  }
}
class BlobReader extends Reader {
  constructor(blob) {
    super();
    Object.assign(this, {
      blob,
      size: blob.size
    });
  }
  async readUint8Array(offset, length) {
    const reader = this;
    const offsetEnd = offset + length;
    const blob = offset || offsetEnd < reader.size ? reader.blob.slice(offset, offsetEnd) : reader.blob;
    let arrayBuffer = await blob.arrayBuffer();
    if (arrayBuffer.byteLength > length) {
      arrayBuffer = arrayBuffer.slice(offset, offsetEnd);
    }
    return new Uint8Array(arrayBuffer);
  }
}
class BlobWriter extends Stream {
  constructor(contentType) {
    super();
    const writer = this;
    const transformStream = new TransformStream();
    const headers = [];
    if (contentType) {
      headers.push([HTTP_HEADER_CONTENT_TYPE, contentType]);
    }
    Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
      get() {
        return transformStream.writable;
      }
    });
    writer.blob = new Response(transformStream.readable, {
      headers
    }).blob();
  }
  getData() {
    return this.blob;
  }
}
class TextWriter extends BlobWriter {
  constructor(encoding) {
    super(encoding);
    Object.assign(this, {
      encoding,
      utf8: !encoding || encoding.toLowerCase() == "utf-8"
    });
  }
  async getData() {
    const {
      encoding,
      utf8
    } = this;
    const blob = await super.getData();
    if (blob.text && utf8) {
      return blob.text();
    } else {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        Object.assign(reader, {
          onload: ({
            target
          }) => resolve(target.result),
          onerror: () => reject(reader.error)
        });
        reader.readAsText(blob, encoding);
      });
    }
  }
}
class SplitDataReader extends Reader {
  constructor(readers) {
    super();
    this.readers = readers;
  }
  async init() {
    const reader = this;
    const {
      readers
    } = reader;
    reader.lastDiskNumber = 0;
    reader.lastDiskOffset = 0;
    await Promise.all(readers.map(async (diskReader, indexDiskReader) => {
      await diskReader.init();
      if (indexDiskReader != readers.length - 1) {
        reader.lastDiskOffset += diskReader.size;
      }
      reader.size += diskReader.size;
    }));
    super.init();
  }
  async readUint8Array(offset, length, diskNumber = 0) {
    const reader = this;
    const {
      readers
    } = this;
    let result;
    let currentDiskNumber = diskNumber;
    if (currentDiskNumber == -1) {
      currentDiskNumber = readers.length - 1;
    }
    let currentReaderOffset = offset;
    while (currentReaderOffset >= readers[currentDiskNumber].size) {
      currentReaderOffset -= readers[currentDiskNumber].size;
      currentDiskNumber++;
    }
    const currentReader = readers[currentDiskNumber];
    const currentReaderSize = currentReader.size;
    if (currentReaderOffset + length <= currentReaderSize) {
      result = await readUint8Array(currentReader, currentReaderOffset, length);
    } else {
      const chunkLength = currentReaderSize - currentReaderOffset;
      result = new Uint8Array(length);
      result.set(await readUint8Array(currentReader, currentReaderOffset, chunkLength));
      result.set(await reader.readUint8Array(offset + chunkLength, length - chunkLength, diskNumber), chunkLength);
    }
    reader.lastDiskNumber = Math.max(currentDiskNumber, reader.lastDiskNumber);
    return result;
  }
}
class SplitDataWriter extends Stream {
  constructor(writerGenerator, maxSize = 4294967295) {
    super();
    const zipWriter = this;
    Object.assign(zipWriter, {
      diskNumber: 0,
      diskOffset: 0,
      size: 0,
      maxSize,
      availableSize: maxSize
    });
    let diskSourceWriter, diskWritable, diskWriter;
    const writable = new WritableStream({
      async write(chunk) {
        const {
          availableSize
        } = zipWriter;
        if (!diskWriter) {
          const {
            value,
            done
          } = await writerGenerator.next();
          if (done && !value) {
            throw new Error(ERR_ITERATOR_COMPLETED_TOO_SOON);
          } else {
            diskSourceWriter = value;
            diskSourceWriter.size = 0;
            if (diskSourceWriter.maxSize) {
              zipWriter.maxSize = diskSourceWriter.maxSize;
            }
            zipWriter.availableSize = zipWriter.maxSize;
            await initStream(diskSourceWriter);
            diskWritable = value.writable;
            diskWriter = diskWritable.getWriter();
          }
          await this.write(chunk);
        } else if (chunk.length >= availableSize) {
          await writeChunk(chunk.slice(0, availableSize));
          await closeDisk();
          zipWriter.diskOffset += diskSourceWriter.size;
          zipWriter.diskNumber++;
          diskWriter = null;
          await this.write(chunk.slice(availableSize));
        } else {
          await writeChunk(chunk);
        }
      },
      async close() {
        await diskWriter.ready;
        await closeDisk();
      }
    });
    Object.defineProperty(zipWriter, PROPERTY_NAME_WRITABLE, {
      get() {
        return writable;
      }
    });
    async function writeChunk(chunk) {
      const chunkLength = chunk.length;
      if (chunkLength) {
        await diskWriter.ready;
        await diskWriter.write(chunk);
        diskSourceWriter.size += chunkLength;
        zipWriter.size += chunkLength;
        zipWriter.availableSize -= chunkLength;
      }
    }
    async function closeDisk() {
      diskWritable.size = diskSourceWriter.size;
      await diskWriter.close();
    }
  }
}
async function initStream(stream, initSize) {
  if (stream.init && !stream.initialized) {
    await stream.init(initSize);
  }
}
function initReader(reader) {
  if (Array.isArray(reader)) {
    reader = new SplitDataReader(reader);
  }
  if (reader instanceof ReadableStream) {
    reader = {
      readable: reader
    };
  }
  return reader;
}
function initWriter(writer) {
  if (writer.writable === UNDEFINED_VALUE && typeof writer.next == FUNCTION_TYPE) {
    writer = new SplitDataWriter(writer);
  }
  if (writer instanceof WritableStream) {
    writer = {
      writable: writer
    };
  }
  const {
    writable
  } = writer;
  if (writable.size === UNDEFINED_VALUE) {
    writable.size = 0;
  }
  const splitZipFile = writer instanceof SplitDataWriter;
  if (!splitZipFile) {
    Object.assign(writer, {
      diskNumber: 0,
      diskOffset: 0,
      availableSize: Infinity,
      maxSize: Infinity
    });
  }
  return writer;
}
function readUint8Array(reader, offset, size, diskNumber) {
  return reader.readUint8Array(offset, size, diskNumber);
}

export { BlobReader, BlobWriter, ERR_ITERATOR_COMPLETED_TOO_SOON, Reader, SplitDataReader, SplitDataWriter, TextWriter, initReader, initStream, initWriter, readUint8Array };
