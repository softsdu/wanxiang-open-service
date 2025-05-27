import { Object3D, Vector3, BufferGeometry, Line } from '../../../../node_modules/three/build/three.module.js';

class S3dCameraOrbitCircle extends Object3D {
  constructor(options = {}) {
    super();
    this.options = options;
    let cameraOrbitObject = this.createCameraOrbitObject(options);
    this.add(cameraOrbitObject);
  }
  createCameraOrbitObject(p) {
    let pointsLine = [];
    for (let i = 0; i <= p.points.length; i++) {
      let start = p.points[i];
      let end = i === p.points.length - 1 ? p.points[0] : p.points[i + 1];
      pointsLine.push(new Vector3(start.x, start.y, start.z));
      pointsLine.push(new Vector3(end.x, end.y, end.z));
    }
    let geometry = new BufferGeometry().setFromPoints(pointsLine);
    return new Line(geometry, p.orbitLineMaterial);
  }
}

export { S3dCameraOrbitCircle };
