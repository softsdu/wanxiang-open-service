import * as THREE from "three";

let JS3BaseMaterials =  function(){

	const thatBaseMaterials = this;

	this.commonWidth = 256;
	this.commonHeight = 256;

	this.creators = {};

	this.defaultCreator = function (p){
		return thatBaseMaterials.createStandardMaterial(p, {});
	}

	this.getTextureByImageName = function (imageName, scaleWidth, scaleHeight, rotation, isMirror){
		let textureLoader = new THREE.TextureLoader();
		let texture = textureLoader.load(basePath + "/web/design/common/img/material/" + imageName + ".jpg", function (texture) {
			let repeatWidth = texture.userData.config.scale.width == null ? thatBaseMaterials.commonWidth / texture.source.data.width : texture.userData.config.scale.width;
			let repeatHeight = texture.userData.config.scale.height == null ? thatBaseMaterials.commonHeight / texture.source.data.height : texture.userData.config.scale.height;
			texture.repeat.set(repeatWidth, repeatHeight);
			let repeatType = texture.userData.config.isMirror ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
			texture.wrapS = repeatType;
			texture.wrapT = repeatType;
			texture.rotation = -Math.PI / 2 + (texture.userData.config.rotation == null ? 0 : Math.PI * texture.userData.config.rotation / 180);
		});
		texture.userData.config = {
			scale: {
				width: scaleWidth,
				height: scaleHeight
			},
			rotation: rotation,
			isMirror: isMirror
		};
		return texture;
	}

	//塑料（亮光）
	this.creators["PlasticsSmoothy"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,    // 金色
			roughness: 0.1,      // 较低的粗糙度，使表面光滑
			metalness: 0.2,        // 较高的金属度，增强金属感
			transparent: true,   // 开启透明度
			opacity:  p.opacity ? p.opacity : 1,		// 透明度，可以根据需要进行调整
		}
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//塑料（哑光）
	this.creators["PlasticsFrosted"] = function (p){
		let defaultConfig = {
			color: 0xCCCCCC,    // 金色
			roughness: 0.6,      // 较低的粗糙度，使表面光滑
			metalness: 0.0,        // 较高的金属度，增强金属感
		}
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//金属（亮光）
	this.creators["MetalPolished"] = function (p){
		let defaultConfig = {
			color: 0xB87333,    // 金色
			roughness: 0.2,      // 较低的粗糙度，使表面光滑
			metalness: 1.0,        // 较高的金属度，增强金属感
		}
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//金属（哑光）
	this.creators["MetalFrosted"] = function (p){
		let defaultConfig = {
			color: 0xB87333,    // 金色
			roughness: 0.6,      // 中等的粗糙度，使表面既有光滑感又有哑光效果
			metalness: 0.3,        // 一定的金属感
		}
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//金属（生锈）
	this.creators["MetalRusted"] = function (p){
		let defaultConfig = {
			color: 0xB87333,    // 金色
			roughness: 0.2,      // 较低的粗糙度，使表面光滑
			metalness: 1.0,        // 较高的金属度，增强金属感
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//大理石（亮光）
	this.creators["MarblePolished"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,
			roughness: 0.2,
			metalness: 0.1,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//大理石（哑光）
	this.creators["MarbleFrosted"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,
			roughness: 0.6,
			metalness: 0.1,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//木材（亮光）
	this.creators["WoodPolished"] = function (p){
		let defaultConfig = {
			color: 0xD2B48C,
			roughness: 0.2,
			metalness: 0.1,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//木材（原木）
	this.creators["WoodNatural"] = function (p){
		let defaultConfig = {
			color: 0xD2B48C,
			roughness: 0.2,
			metalness: 0.1,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//木材（哑光）
	this.creators["WoodFrosted"] = function (p){
		let defaultConfig = {
			color: 0xD2B48C,
			roughness: 0.5,
			metalness: 0,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//自发光
	this.creators["SelfLuminous"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,
			emissive: 0x000000,
			emissiveIntensity: 0.5,
			transparent: true,
			opacity:  p.opacity ? p.opacity : 0.99,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//地面
	this.creators["GroundLand"] = function (p){
		let defaultConfig = {
			color: 0xD2B48C,
			roughness: 1.0,
			metalness: 0.0,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//混凝土
	this.creators["Concrete"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,
			roughness: 1.0,
			metalness: 0.0,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//皮革
	this.creators["Leather"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,
			roughness: 0.5,
			metalness: 0.0,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//玻璃（透明）
	this.creators["GlassClearly"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,
			roughness: 0.1,
			metalness: 0.0,
			transparent: true,
			opacity: 0.8
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//玻璃（哑光）
	this.creators["GlassFrosted"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,
			roughness: 0.5,
			metalness: 0.0,
			transparent: true,
			opacity: 0.8
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//石材
	this.creators["Stone"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,
			roughness: 0.9,
			metalness: 0.0,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//砖
	this.creators["Brick"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,
			roughness: 1.0,
			metalness: 0.0,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//瓷（亮光）
	this.creators["CeramicPolished"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,
			roughness: 0.1,
			metalness: 0.0,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}

	//瓷（哑光）
	this.creators["CeramicFrosted"] = function (p){
		let defaultConfig = {
			color: 0xFFFFFF,
			roughness: 0.5,
			metalness: 0.0,
		};
		return thatBaseMaterials.createStandardMaterial(p, defaultConfig);
	}


	this.createStandardMaterial = function (p, config){
		config.name = p.name;
		if(p.imageName.length !== 0){
			config.map = thatBaseMaterials.getTextureByImageName(p.imageName, p.scaleWidth, p.scaleHeight, p.rotation, p.isMirror);
			delete config.color;
		}
		if(p.color) {
			config.color = p.color;
		}
		if(p.normalImageName.length !== 0){
			config.normalMap = thatBaseMaterials.getTextureByImageName(p.normalImageName, p.scaleWidth, p.scaleHeight, p.rotation, p.isMirror);
		}
		if(p.opacity != null) {
			config.opacity = p.opacity;
		}
		if(config.opacity < 1.0){
			config.transparent = true;
		}

		if(p.opacityImageName.length !== 0){
			config.alphaMap = thatBaseMaterials.getTextureByImageName(p.opacityImageName, p.scaleWidth, p.scaleHeight, p.rotation, p.isMirror);
			config.opacity = p.opacity ? p.opacity : 1;
			config.transparent = true;
		}
		if(p.roughness != null) {
			config.roughness = p.roughness;
		}
		if(p.roughnessImageName.length !== 0){
			config.roughnessMap = thatBaseMaterials.getTextureByImageName(p.roughnessImageName, p.scaleWidth, p.scaleHeight, p.rotation, p.isMirror);
			config.roughness = p.roughness ? p.roughness :1;
		}
		if(p.metalness != null) {
			config.metalness = p.metalness;
		}
		if(p.metalnessImageName.length !== 0){
			config.metalnessMap = thatBaseMaterials.getTextureByImageName(p.metalnessImageName, p.scaleWidth, p.scaleHeight, p.rotation, p.isMirror);
			config.metalness = p.metalness ? p.metalness : 1;
		}
		return new THREE.MeshStandardMaterial(config);
	}
}
export default JS3BaseMaterials