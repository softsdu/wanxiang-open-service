import { LineBasicMaterial } from '../../../node_modules/three/build/three.module.js';
import { s3dLayerType, s3dClockDirection } from '../../../commonjs/common/common.js';
import { S3dCameraOrbitCircle } from './cameraOrbit/S3dCameraOrbitCircle.js';

let S3dCameraOrbitCreator = function () {
  var thatCameraOrbitCreator = this;
  this.manager = null;
  this.init = function (p) {
    thatCameraOrbitCreator.manager = p.manager;
  };
  this.orbitLineMaterial = new LineBasicMaterial({
    color: 0x888888,
    linewidth: 1,
    opacity: 0.0
  });
  this.create = function (p) {
    let objectSetting = p.objectSetting;
    let componentInfo = p.componentInfo;
    let cameraOrbitObj = null;
    switch (objectSetting.code) {
      case "CameraOrbit-Circle":
        {
          cameraOrbitObj = thatCameraOrbitCreator.createCircleCameraOrbit(objectSetting, componentInfo);
          break;
        }
      default:
        {
          throw "未知的相机轨道类型. Code=" + objectSetting.code;
        }
    }
    thatCameraOrbitCreator.manager.viewer.enableObjectLayer(cameraOrbitObj, s3dLayerType.editLayer, true);
    return cameraOrbitObj;
  };
  this.createHelper = function (cameraOrbit3D) {
    let info = cameraOrbit3D.userData.info;
    let helper = null;
    switch (info.code) {
          }
    return helper;
  };
  this.createCircleCameraOrbit = function (objectSetting, componentInfo) {
    let parameters = objectSetting.parameters;
    let radius = parameters.radius.value;
    let height = parameters.height.value;
    let startAngle = parameters.startAngle.value;
    let frequency = parameters.frequency.value;
    let duration = parameters.duration.value;
    let direction = parameters.direction.value;
    let points = thatCameraOrbitCreator.calcCirclePoints(radius, height, startAngle, frequency, duration, direction);
    let cameraOrbit = new S3dCameraOrbitCircle({
      radius: radius,
      height: height,
      startAngle: startAngle,
      frequency: frequency,
      duration: duration,
      points: points,
      orbitLineMaterial: thatCameraOrbitCreator.orbitLineMaterial
    });
    cameraOrbit.position.set(objectSetting.position[0], objectSetting.position[1], objectSetting.position[2]).normalize();
    return cameraOrbit;
  };
  this.calcCirclePoints = function (radius, height, startAngle, frequency, duration, direction) {
    let points = {};
    let defaultFPS = thatCameraOrbitCreator.manager.userAnimations.defaultFPS;
    let frameCount = duration * defaultFPS;
    let radianStep = 2 * Math.PI / frameCount;
    let startRadian = Math.PI * startAngle / 180;
    for (let i = 0; i < frameCount; i++) {
      let tempRadian = startRadian + i * radianStep;
      let x = radius * Math.cos(tempRadian);
      let y = 0;
      let z = radius * Math.sin(tempRadian);
      points.push({
        x: x,
        y: y,
        z: z
      });
    }
    if (direction === s3dClockDirection.anticlockwise) {
      points.reverse();
    }
    let yRadianStep = frequency * 2 * Math.PI / frameCount;
    for (let i = 0; i < frameCount; i++) {
      let tempRadian = i * yRadianStep;
      points[i].y = height * Math.sin(tempRadian) / 2;
    }
    return points;
  };
};

export { S3dCameraOrbitCreator as default };
