import { Water } from '../../../../node_modules/three/examples/jsm/objects/Water.js';
import { PlaneGeometry, TextureLoader, RepeatWrapping, Vector3, Clock } from '../../../../node_modules/three/build/three.module.js';

class S3dParticleWater extends Water {
  constructor(options = {}) {
    let waterGeometry = new PlaneGeometry(100, 100);
    let waterOptions = {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new TextureLoader().load(options.normalImageUrl, function (texture) {
        texture.wrapS = texture.wrapT = RepeatWrapping;
      }),
      sunDirection: new Vector3(),
      sunColor: 0xffffff,
      waterColor: options.waterColor,
      distortionScale: 1
    };
    super(waterGeometry, waterOptions);
    this.clock = new Clock();
    this.clock.start();
    this.speed = options.speed;
  }
  update() {
    this.clock.getDelta();
    this.material.uniforms['time'].value = this.clock.getElapsedTime() * this.speed;
  }
}

export { S3dParticleWater };
