import { Object3D, CanvasTexture, MeshStandardMaterial, DoubleSide, PlaneGeometry, Mesh, LineBasicMaterial, BufferGeometry, Vector3, Line } from '../../../../node_modules/three/build/three.module.js';
import '../../../../commonjs/common/common.js';
import S3dTagText3DCreator from './s3dTagText3DCreator.js';

class S3dTagDistanceText extends Object3D {
  constructor(options = {}) {
    super();
    this.defaultFontSize = 200;
    this.options = options;
    this.inited3D = false;
    this.addLineObjects(options);
    this.createTextObject(options);
  }
  createTextObject(p) {
    let text3DCreator = new S3dTagText3DCreator();
    let canvas = text3DCreator.createHTextCanvas(p);
    let texture = new CanvasTexture(canvas);
    let material = new MeshStandardMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0,
      color: p.textColor,
      alphaTest: 0.5,
      side: DoubleSide
    });
    let textSize = text3DCreator.getText3DHSize(p.text, p.fontSize, p.letterSpacing);
    let geometry = new PlaneGeometry(1, 1);
    let plane = new Mesh(geometry, material);
    plane.scale.set(textSize.x, textSize.y, textSize.z);
    plane.position.set(0, textSize.y / 2 + p.terminalLineLength / 4, 0);
    this.add(plane);
  }
  addLineObjects(p) {
    let lineMaterial = new LineBasicMaterial({
      color: p.lineColor
    });
    let lineGeometry = new BufferGeometry().setFromPoints([new Vector3(-0.5, 0, 0), new Vector3(0.5, 0, 0)]);
    let lineObject = new Line(lineGeometry, lineMaterial);
    lineObject.scale.set(p.lineLength, 1, 1);
    lineObject.position.set(0, 0, 0);
    this.add(lineObject);
    let terminalMaterial = new LineBasicMaterial({
      color: p.terminalLineColor
    });
    let terminalAGeometry = new BufferGeometry().setFromPoints([new Vector3(0, -0.5, 0), new Vector3(0, 0.5, 0)]);
    let terminalAObject = new Line(terminalAGeometry, terminalMaterial);
    terminalAObject.scale.set(1, p.terminalLineLength, 1);
    terminalAObject.position.set(-p.lineLength / 2, 0, 0);
    this.add(terminalAObject);
    let terminalBGeometry = new BufferGeometry().setFromPoints([new Vector3(0, -0.5, 0), new Vector3(0, 0.5, 0)]);
    let terminalBObject = new Line(terminalBGeometry, terminalMaterial);
    terminalBObject.scale.set(1, p.terminalLineLength, 1);
    terminalBObject.position.set(p.lineLength / 2, 0, 0);
    this.add(terminalBObject);
  }
}

export { S3dTagDistanceText };
