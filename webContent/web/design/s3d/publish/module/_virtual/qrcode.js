import { getDefaultExportFromCjs } from './_commonjsHelpers.js';
import { __require as requireQrcode } from '../node_modules/qrcode-generator/qrcode.js';

var qrcodeExports = requireQrcode();
var qrcode = /*@__PURE__*/getDefaultExportFromCjs(qrcodeExports);

export { qrcode as default };
