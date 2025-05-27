import * as THREE from "three";
import {FontLoader} from "three/addons/loaders/FontLoader.js";
import {CSS2DRenderer} from "three/addons/renderers/CSS2DRenderer.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {TransformControls} from "three/addons/controls/TransformControls.js";
import PointControlProcessor from "common/js/pointControlProcessor.js";
import OrbitControlsGizmo from "common/js/controls/OrbitControlsGizmo.js";
import Object3DCreator from "common/js/object3DCreator.js";
import JS3UvMaterialEditor from "common/js/js3UvMaterialEditor.js";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";
import {Line2} from "three/addons/lines/Line2.js";
import {LineMaterial} from 'three/addons/lines/LineMaterial.js';
import {LineGeometry} from 'three/addons/lines/LineGeometry.js';
import HitDetection from "common/js/js3HitDetection.js";

let CoreEditor = function(){
	var thatCE = this;

	//模型
	this.componentInfo = null;

	//造型构造类
	this.object3DCreator = null;

	//粘贴板
	this.clipBoard = {};

	this.containerId = null;
	this.componentId = null;
	this.expProcessor = null;
	this.scene = null; //场景
	this.camera = null; //相机
	this.renderer = null; //渲染器
	this.renderer2d = null; //渲染器2D
	this.orbitControl = null; //控制器
	this.orbitControlGizmo = null; //控制器三维图标
	this.raycaster = null; //光投射器
	this.sphereInter = null; //绘制选中的点
	this.transformControl = null; //变换用的控制器
	this.status = js3CoreEditorStatus.normal; //编辑器状态
	this.stats = null;//性能统计 added by ls 20230529

	//最后一次手工添加的构件 added by ls 20230628
	this.lastAddComponentInfo = {
		code: null,
		versionNum: null,
		imgId: null
	};

	//记录历史新增的子构件类型和参数值 added by ls 202330717
	this.addedHistoryComParamList = [];

	this.mouseDownPosition = null; //鼠标点下的位置
	this.mouse3DPosition = null;

	this.selectedOpacity = 0.2; //选中后透明度设置 0.9改0.2  modified by liyh 20230908
	this.selectedColor = 0x0094FF;

	this.frustumSize = 500;

	this.previewPageUrl = "../common/corePreview.jsp";

	this.pointCtrlProcessor = null;

	this.containerPos = {
		x: 0,
		y: 0
	};

	//基准面 added by ls 20230608
	this.workPlaneObjects = {
		xy: null,
		xz: null,
		yz: null
	};

	this.valueMultiply = 1000; //显示值转换

	//网格的起始刻度，为了解决plane和grid覆盖显示的问题 modified by ls 20230608
	this.gridZero = 0.0;

	//忽略误差的值（有时候double运算会出现不精确的问题）
	this.ignoreSize = 0.0001;

	this.selectedUnitObject3D = null; //当前被选中的控件
	this.multiSelectedUnitObject3Ds = new Array();

	this.attachLines = null; //可吸附的网格线
	this.attachHelpLines = {
		color: 0xFF0000, //吸附辅助帮助线的颜色
		opacity: 0.8,
		//xLine: null,
		//zLine: null,
		xzLineX: null,
		xzLineZ: null,
		xyLineX: null,
		xyLineY: null,
		yzLineY: null,
		yzLineZ: null,

		//连接点吸附box
		jointBoxes: null,
		jointColor: 0xFF0000
	};

	//吸附线的材质 added by ls 20230614
	this.attachHelpLineMaterial = new THREE.LineBasicMaterial({
    	color: thatCE.attachHelpLines.color,
    	transparent: true,
    	opacity: thatCE.attachHelpLines.opacity,
    	depthTest: false
	});

	//连接点材质 added by ls 20230614
	this.jointBoxMaterial = new THREE.MeshLambertMaterial({
    	color: thatCE.attachHelpLines.jointColor,
    	transparent: true,
    	depthTest: false
	})

	//边栏状态
	this.leftSideStatus = {
		groupName: "leftSingleSelect",
		lastTabNames: {
			leftSingleSelect: "groupUnitList",
			leftMultiSelect: "multiUnitSelectedList"
		}
	};
	this.rightSideStatus = {
		groupName: "rightComponentSelect",
		lastTabNames: {
			rightUnitSelect: "unitBasePropertyList",
			rightComponentSelect: "componentBasePropertyList",
			rightMultiSelect: "commandPropertyList"
		}
	};

	//快捷按钮
	this.shortcutList = [ {code: "save", name: "保存"}, {code: "topView", name: "俯视"}, {code: "preview", name: "预览"}];

	this.transformControlVisible = true; //是否在选中件上显示坐标轴
	this.attachLine2dVisible = true; //是否实时显示距离标识
	this.unitInfoVisible = true; // 是否显示构件属性信息
	this.unitListVisible = true; //是否显示构件列表
	this.groupVisible = true; //是否显示分组
	this.gridVisible = true; //是否显示网格
	this.groundContextMenuVisible = true; //是否显示地平面的右键菜单
	this.unitContenxtMenuVisible = true; //是否显示构件的右键菜单
	this.titleVisible = true; //是否显示标题
	this.canSelectObject3D = true; //是否可以选中组件
	this.hasShadow = false; //是否有阴影

	//事件
	this.afterSelectUnitFunc = null;
	this.afterShowUnitFunc = null;

	this.backgroundColor = 0x111111;
	this.backgroundAlpha = 1;

	//基准面颜色透明度 added by ls 20230608
	this.workPlaneColor = 0xffffff;
	this.workPlaneOpacity = 0.2;

	//基准面材质 added by ls 20230614
    this.workPlaneMaterial = new THREE.MeshLambertMaterial({
    	color: thatCE.workPlaneColor,
    	side: THREE.DoubleSide,
    	opacity: thatCE.workPlaneOpacity,
    	transparent: true
    });

	this.multiSelectBoxMaterial = new THREE.MeshBasicMaterial({
    	color: 0xFF0000,
  		transparent: true,
  		opacity: 0.3,
		flatShading: true,
    	side: THREE.FrontSide
	});
	this.multiSelectBoxEdgeMaterial = new THREE.LineBasicMaterial({
		color: 0x666666,
		linewidth: 1
	});

	//主光 added by ls 20230921
	this.mainLight = null;

	//修改轴网的颜色 modified by liyh 20221115
	//this.gridColor = 0xCCCCCC;
	//修改轴网的颜色 modified by ls 20230208
	this.gridColor = 0xFFB27F;

	//网格的材质 added by ls 20230614
	this.gridLineMatertial = new THREE.LineBasicMaterial({
    	color: thatCE.gridColor,
    	opacity: 1
	});

	this.gridMarkColor = 0xFFFFFF;
	this.gridMarkTextColor = 0xEEEEEE;

	this.defaultFont = null;

	this.axesLineMaterial = new THREE.LineBasicMaterial({
     	color: this.gridColor,
		flatShading: true,
    	side: THREE.DoubleSide,
     	opacity: 1
 	});
	this.axesTextMaterial = new THREE.MeshBasicMaterial({
     	color: this.gridMarkColor
 	});

    //导出gltf开发 modified by ls 20230529
    this.OnExportGLTF = function(params){
		thatCE.doBtnClick("exportGLTF");
    }

	//新增导出DAE开发 modified by ls  20230313
	this.OnExportDAE = function(params){
		thatCE.doBtnClick("exportDAE");
	}

	this.eventFunctions = {};
	this.doEvent = function(eventName, params){
		var funcList = thatCE.eventFunctions[eventName];
		if(funcList != null){
			switch(eventName){
				//顺序执行
				case "afterAnimate":
				case "afterAddNewPointCtrl":
				case "afterInitPointCtrlProcessor":
				case "afterPointCtrlChangePosition":
				case "afterLoadAllUnits":
				case "onMouseUp":

				//当在scene添加新的unitObject3D时 added by ls 20230830
				case "afterAddUnitObject3DToScene":{
					for(var i = 0; i < funcList.length; i++){
						var func = funcList[i];
						func(params);
					}
					break;
				}

				//未支持的事件类型
				default:{
					var message = "未支持的事件类型";
					msgBox.alert({info: message});
					throw message;
				}
			}
		}
	}
	this.bindEvent = function(eventName, func){
		var funcList = thatCE.eventFunctions[eventName];
		if(funcList == null){
			funcList = new Array();
			thatCE.eventFunctions[eventName] = funcList;
		}
		funcList.push(func);
	}
	this.unbindEvent = function(eventName, func){
		if(func == null){
			thatCE.eventFunctions[eventName] = null;
		}
		else {
			var funcList = thatCE.eventFunctions[eventName];
			var newFuncList = new Array();
			if(funcList != null){
				for(var i = 0; i < funcList.length; i++){
					var f = funcList[i];
					if(f != func){
						newFuncList.push(f);
					}
				}
				thatCE.eventFunctions[eventName] = newFuncList;
			}
		}
	}

    this.placeSettings = {
		placedPoints: [], //每段的参数，例如长度、与前序线段的夹角、圆弧的半径圆心和角度
		btnName: null,
		commandProcessor: null,
	    waitingPlacePoint: null,
	    waitingPlaceLine: null,
	    placedPointColor: 0xff0000,
	    waitingPlacePointColor: 0xFF6A00,
	    waitingPlaceLineColor: 0xFFFF00,
	    drawingPlacePoint: false,
	    pointOpacity: 0.7
    }

    //修改place点位置的设置 added by ls 20230614
    this.placeModifySettings = {
		placedPoints: [],
		placedLines: [],
		object3D: null,
	    waitingPlacePointIndex: null,
	    waitingPlaceFromLineIndex: null,
	    waitingPlaceToLineIndex: null,
	    drawingPlacePoint: false
    }

	this.waitingPlaceBallMaterial = new THREE.MeshStandardMaterial({
    	color: thatCE.placeSettings.waitingPlacePointColor,

    	//不受其他构件遮挡 modified by ls 20221026
    	transparent: true,
    	depthTest: false,

		flatShading: true,
    	side: THREE.FrontSide,
    	roughness: 1,
    	metalness: 0,
     	opacity: thatCE.placeSettings.pointOpacity
	});

	//划线的材质 added by ls 20230614
	this.waitingPlaceLineMaterial = new LineMaterial({
    	color: thatCE.placeSettings.waitingPlaceLineColor,
    	transparent: true,
    	depthTest: false,
        linewidth: 3,
	});
	this.waitingPlaceLineMaterial.resolution.set(window.innerWidth, window.innerHeight);

	this.endPlaceLimit3DPoints = function(){
		var allPlaceObjects = [];
		for(var i = 0; i < thatCE.scene.children.length; i++){
			var obj = thatCE.scene.children[i];
			if(obj.isPlaceObject){
				allPlaceObjects.push(obj);
			}
		}
		for(var i = 0; i < allPlaceObjects.length; i++){
			var obj = allPlaceObjects[i];
			thatCE.scene.remove(obj);
		}
		thatCE.placeSettings.placedPoints = [];
		thatCE.placeSettings.waitingPlacePoint = null;
		thatCE.placeSettings.waitingPlaceLine = null;
		thatCE.refreshAttachHelpLine();
		thatCE.showWaitingPlacePointMessge();
		return true;
	}

	this.endPlaceLimit2DPoints = function(){
		var allPlaceObjects = [];
		for(var i = 0; i < thatCE.scene.children.length; i++){
			var obj = thatCE.scene.children[i];
			if(obj.isPlaceObject){
				allPlaceObjects.push(obj);
			}
		}
		for(var i = 0; i < allPlaceObjects.length; i++){
			var obj = allPlaceObjects[i];
			thatCE.scene.remove(obj);
		}
		thatCE.placeSettings.placedPoints = [];
		thatCE.placeSettings.waitingPlacePoint = null;
		thatCE.placeSettings.waitingPlaceLine = null;
		thatCE.refreshDrawHelpLine2D();
        thatCE.refreshDrawHelpArc2D();

        //隐藏线 added by ls 20230208
		thatCE.refreshAttachHelpLine();
		thatCE.showWaitingPlacePointMessge();
		return true;
	}


	this.endPointCtrl = function(){
		var allPlaceObjects = [];
		for(var i = 0; i < thatCE.scene.children.length; i++){
			var obj = thatCE.scene.children[i];
			if(obj.isPlaceObject){
				allPlaceObjects.push(obj);
			}
		}
		for(var i = 0; i < allPlaceObjects.length; i++){
			var obj = allPlaceObjects[i];
			thatCE.scene.remove(obj);
		}
		thatCE.placeSettings.placedPoints = [];
		thatCE.placeSettings.waitingPlacePoint = null;
		thatCE.placeSettings.waitingPlaceLine = null;
		thatCE.refreshDrawHelpLine2D();
        thatCE.refreshDrawHelpArc2D();
		thatCE.showWaitingPlacePointMessge();
		return true;
	}

	this.endRuler = function(){
		var allPlaceObjects = [];
		for(var i = 0; i < thatCE.scene.children.length; i++){
			var obj = thatCE.scene.children[i];
			if(obj.isPlaceObject){
				allPlaceObjects.push(obj);
			}
		}
		for(var i = 0; i < allPlaceObjects.length; i++){
			var obj = allPlaceObjects[i];
			thatCE.scene.remove(obj);
		}
		thatCE.placeSettings.placedPoints = [];
		thatCE.placeSettings.waitingPlacePoint = null;
		thatCE.placeSettings.waitingPlaceLine = null;
		thatCE.refreshRuler3D();
		thatCE.refreshAttachHelpLine();
		thatCE.showWaitingPlacePointMessge();

		//结束测距，隐藏ruler的容器 added by ls 20210901
    	$("#" + thatCE.containerId).find(".rulerContainer").css({display: "none"});
		return true;
	}

    this.drawLimit3DPoints = function(p){
    	var intersectObj = thatCE.getIntersect3DPoint(p.intersects);
    	if(intersectObj != null){
    		thatCE.createPlace3DPoint(intersectObj.point);
    	}
    }

    this.drawLimit2DPoints = function(p){
    	var intersectObj = thatCE.getIntersect2DPoint(p.intersects);
    	if(intersectObj != null){
    		thatCE.createPlace2DPoint(intersectObj.point);
    	}
    }
    this.drawPointCtrlPoints = function(p){
    	var intersectObj = thatCE.getIntersect2DPoint(p.intersects);
    	if(intersectObj != null){
    		thatCE.createPointCtrlPoint(intersectObj.point);
    	}
    }

    this.drawRulerPoints = function(p){
    	var intersectObj = thatCE.getIntersect3DPoint(p.intersects);
    	if(intersectObj != null){
    		thatCE.createRulerPoint(intersectObj.point);
    	}
    }

    //选多个点，每个点放置一个组件
    this.runCommandByPointsMulti = function(points, commandProcessor){
		thatCE.setStatus(js3CoreEditorStatus.normal);
		var valueParameters = {};
		if(commandProcessor.run == null){
			var refComponentInfo = thatCE.getRefComponentInfo(commandProcessor.componentCode, commandProcessor.componentVersionNum);
			var unitComProcessor = thatCE.object3DCreator.createJs3UnitComponentProcessor(commandProcessor.componentCode, commandProcessor.componentVersionNum);
			var parentParameters = thatCE.getComponentParametersForEditExp();
			unitComProcessor.init({
				editor: thatCE,
				unitId: null,
				mixType: js3UnitMixType.none,

				//显示级别 added by ls 20230403
				viewLevel: js3ViewLevelType.always,

				useWorldPosition: false,
				useParameterPosition: false,
				position: null,
				positions: points,
				rotation: {x: 0, y: 0, z: 0},
				componentInfo: refComponentInfo,
				valueParameters: valueParameters,
				positionExps: {},
				rotationExps: {},
				parentParameters: parentParameters
			});

			var refComponentParameterCount = 0;
			for(var paramName in refComponentInfo.parameters){
				refComponentParameterCount++;
			}

			if(refComponentParameterCount == 0){
				unitComProcessor.afterGetNewParameters({});
			}
			else{
				unitComProcessor.showForm({
					formWidth: js3RefComponentParameterEditFormSetting.formWidth,
					formHeight: js3RefComponentParameterEditFormSetting.formHeight,
					title: refComponentInfo.name + " (" + refComponentInfo.code + ", " + refComponentInfo.versionNum + ")",
					pageUrl: js3RefComponentParameterEditFormSetting.pageUrl,

					//增加组件图例 added by liyh 20210825
					imgId:commandProcessor.imgId == null ? "" : commandProcessor.imgId
				});
			}
		}
		else{
			var refComponentInfo = thatCE.getRefComponentInfo(commandProcessor.componentCode, commandProcessor.componentVersionNum);
			commandProcessor.run({
				editor: thatCE,
				unitId: null,
				points: points,
				position: null,
				positions: points,
				rotation: {x: 0, y: 0, z: 0},
				valueParameters: valueParameters,
				componentInfo: refComponentInfo
			});
	    }
    }

    //从点中获取参数信息 added by ls 20230614
    this.convertLocationTypeParamValue = function(refComponentInfo, points, pointCount){
		var paramType = refComponentInfo.parameters[refComponentInfo.init.locationType.parameter].paramType;
		var paramValue = "";
		switch(paramType){
			case js3ParameterType.point2D:
			case js3ParameterType.polyline2D:
			case js3ParameterType.line2D:{
				for(var i = 0; i < pointCount; i++){
					var point = points[i];
					paramValue += ((i == 0 ? "" : ";") + thatCE.object3DCreator.m2mm(thatCE.roundAttachValue(point.x)) + "," + thatCE.object3DCreator.m2mm(thatCE.roundAttachValue(point.z)));
				}
				break;
			}
			case js3ParameterType.point3D:
			case js3ParameterType.polyline3D:
			case js3ParameterType.line3D: {
				for(var i = 0; i < pointCount; i++){
					var point = points[i];
					paramValue += ((i == 0 ? "" : ";") + thatCE.object3DCreator.m2mm(thatCE.roundAttachValue(point.x)) + "," + thatCE.object3DCreator.m2mm(thatCE.roundAttachValue(point.y)) + "," + thatCE.object3DCreator.m2mm(thatCE.roundAttachValue(point.z)));
				}
				break;
			}

			//长度 added by ls 20230810
			case js3ParameterType.decimal:{
				var pointA = points[0];
				var pointB = points[1];
				paramValue = thatCE.object3DCreator.m2mm(Math.sqrt((pointA.x - pointB.x) * (pointA.x - pointB.x) + (pointA.y - pointB.y) * (pointA.y - pointB.y) + (pointA.z - pointB.z) * (pointA.z - pointB.z)));
			}
			default: {
				//不做处理
			}
		}
		return paramValue;
    }

    this.runCommandByPoints = function(points, commandProcessor){
		thatCE.setStatus(js3CoreEditorStatus.normal);
		var refComponentInfo = thatCE.getRefComponentInfo(commandProcessor.componentCode, commandProcessor.componentVersionNum);

		//根据历史添加记录，初始化默认值 modified by ls 20230717
		var valueParameters = {};
		var historyAddedInfo = thatCE.getAddedHistory(commandProcessor.componentCode);
		if(historyAddedInfo){
			for(var paramName in historyAddedInfo.parameters){
				valueParameters[paramName] = {
					value: historyAddedInfo.parameters[paramName]
				};
			}
		}

		var position = {
			x: 0,
			y: 0,
			z: 0
		}
		var rotation = {
			x: 0,
			y: 0,
			z: 0
		}
		if(refComponentInfo != null){
			if(refComponentInfo.init.locationType.parameter == null || refComponentInfo.init.locationType.parameter.length == 0){
				if(points.length > 1){
					var minX = 100000;
					var minZ = 100000;
					var maxX = -100000;
					var maxZ = -100000;
					for(var i = 0; i < points.length; i++){
						var point = points[i];
						if(minX > point.x){
							minX = point.x;
						}
						if(minZ > point.z){
							minZ = point.z;
						}
						if(maxX < point.x){
							maxX = point.x;
						}
						if(maxZ < point.z){
							maxZ = point.z;
						}
					}
					position = {
						x: (minX + maxX) / 2,
						y: 0,
						z: (minZ + maxZ) / 2
					};

					var polygon = "";
					for(var i = 0; i < points.length; i++){
						var point = points[i];
						if(i != 0){
							polygon += ";";
						}
						polygon += (thatCE.object3DCreator.m2mm(point.x  - minX) + "," + thatCE.object3DCreator.m2mm(point.z - minZ));
					}
					valueParameters["polygon"] = {
						value: polygon
					};
				}
				else if (points.length == 1){
					position = points[0];
				}
			}
			else{
				//根据参数初始化位置 added by ls 20230613
				var pointCount = commandProcessor.pointCount == 0 ? points.length : commandProcessor.pointCount;
				var paramValue = thatCE.convertLocationTypeParamValue(refComponentInfo, points, pointCount);
				valueParameters[refComponentInfo.init.locationType.parameter] = {
					value: paramValue
				};

				//如果是使用长度作为位置参数，那么就是根据两个point的中心点作为position的值 added by ls 20230810
			    if(thatCE.checkIsDecimalLengthLocationParameter(commandProcessor, refComponentInfo)){
			    	var pointA = points[0];
			    	var pointB = points[1];
					position = {
						x: (pointA.x + pointB.x) / 2,
						y: (pointA.y + pointB.y) / 2,
						z: (pointA.z + pointB.z) / 2
					};
					rotation = js3CommonFunction.getRotation(pointA, pointB);
			    }
			}
		}

		if(commandProcessor.run == null){
			var unitComProcessor = thatCE.object3DCreator.createJs3UnitComponentProcessor(commandProcessor.componentCode, commandProcessor.componentVersionNum);
			var parentParameters = thatCE.getComponentParametersForEditExp();
			unitComProcessor.init({
				editor: thatCE,
				unitId: null,
				mixType: js3UnitMixType.none,

				//显示级别 added by ls 20230403
				viewLevel: js3ViewLevelType.always,

				//取消默认为false deleted by ls 20220606
				//useWorldPosition: false,

				position: position,
				rotation: rotation,
				componentInfo: refComponentInfo,
				valueParameters: valueParameters,
				positionExps: {},
				rotationExps: {},
				parentParameters: parentParameters
			});

			var refComponentParameterCount = 0;
			for(var paramName in refComponentInfo.parameters){
				refComponentParameterCount++;
			}

			if(refComponentParameterCount == 0 || !refComponentInfo.init.popWindow){
				unitComProcessor.afterGetNewParameters(valueParameters);
			}
			else{
				unitComProcessor.showForm({
					formWidth: js3RefComponentParameterEditFormSetting.formWidth,
					formHeight: js3RefComponentParameterEditFormSetting.formHeight,
					title: refComponentInfo.name + " (" + refComponentInfo.code + ", " + refComponentInfo.versionNum + ")",
					pageUrl: js3RefComponentParameterEditFormSetting.pageUrl,

					//增加组件图例 added by liyh 20210825
					imgId:commandProcessor.imgId == null ? "" : commandProcessor.imgId
				});
			}
		}
		else{
			commandProcessor.run({
				editor: thatCE,
				unitId: null,
				points: points,
				position: position,
				rotation: rotation,
				valueParameters: valueParameters,
				componentInfo: refComponentInfo
			});
	    }
    }

	this.getRefComponentInfo = function(componentCode, versionNum){
		var componentKey = componentCode + "_" + versionNum;
		var refComponentInfo = thatCE.componentInfo.refComponents[componentKey];
		return refComponentInfo;
	}

	this.getRefComponentInfoByName = function(componentName, versionNum){
		for(let componentKey in thatCE.componentInfo.refComponents){
			let refComponentInfo = thatCE.componentInfo.refComponents[componentKey];
			if(refComponentInfo.name === componentName && refComponentInfo.versionNum === versionNum){
				return refComponentInfo;
			}
		}
		return null;
	}

    this.addNewUnitByObject3D = function(object3D, unitSetting, unitComponentInfo, afterAddFunc, doesSelectUnitObject){
    	var idAndName = thatCE.getNewUnitIdAndName(unitComponentInfo.name + "_1", unitComponentInfo.name);
    	unitSetting.id = idAndName.id;
    	unitSetting.name = idAndName.name;

        var mainScene = thatCE.getMainScene();
        object3D.unitData = {
        	id: unitSetting.id,
        	name: unitSetting.name,
        	code: unitSetting.code,
        	versionNum: unitSetting.versionNum,
        	mixType: unitSetting.mixType,

			//显示级别 added by ls 20230403
			viewLevel: unitSetting.viewLevel,

			useWorldPosition: unitSetting.useWorldPosition,
			useParameterPosition: unitSetting.useParameterPosition,
        	parameters: unitSetting.parameters,
        	positionExps: unitSetting.positionExps,
        	rotationExps: unitSetting.rotationExps,

        	//增加position和rotation的赋值 added by ls 20220606
        	position: unitSetting.position,
        	rotation: unitSetting.rotation,

        	count: null,
        	countExp: null,

        	//是否支持展开BOM added by ls 20230726
        	hasBOM: true
        };
        mainScene.add(object3D);
        object3D.isUnitObject = true;
      	thatCE.setObject3DRotation(object3D, unitSetting, false);
      	thatCE.setObject3DPosition(object3D, unitSetting, false);

      	//先添加到构件列表，再选中 modified by ls 20220906
      	thatCE.addUnitToList(unitSetting);
    	//触发afterAddUnitObject3DToScene added by ls 20230830
    	thatCE.doEvent("afterAddUnitObject3DToScene", {
    		object3D: object3D
    	});

      	if(doesSelectUnitObject){
      		thatCE.selectUnitObject(object3D);
      	}

    	thatCE.refreshListItemCount();

    	//刷新初始位置辅助点下拉 added by ls 20230612
    	if(thatCE.checkIsAssistPoint(unitSetting.code)){
    		var componentInfo = thatCE.getLastComponentInfo();
    		thatCE.initLocationTypePointSelectValues(componentInfo);
    	}

    	//更新记录历史新增的子构件类型和参数值 added by ls 20230717
    	thatCE.addToAddedHistory(unitSetting);

    	if(afterAddFunc != null){
          	afterAddFunc(unitSetting.id);
    	}
    }

    this.addNewUnitObject3DByUser = function(unit3DInfo){
        var mainScene = thatCE.getMainScene();
        unit3DInfo.object3D.unitData = unit3DInfo.unitSetting;
        mainScene.add(unit3DInfo.object3D);
        unit3DInfo.object3D.isUnitObject = true;
      	thatCE.setObject3DRotation(unit3DInfo.object3D, unit3DInfo.unitSetting, false);
      	thatCE.setObject3DPosition(unit3DInfo.object3D, unit3DInfo.unitSetting, false);

      	thatCE.addUnitToList(unit3DInfo.unitSetting);
    	//触发afterAddUnitObject3DToScene added by ls 20230830
    	thatCE.doEvent("afterAddUnitObject3DToScene", {
    		object3D: unit3DInfo.object3D
    	});

    	thatCE.refreshListItemCount();

    	//刷新初始位置辅助点下拉 added by ls 20230612
    	if(thatCE.checkIsAssistPoint(unit3DInfo.unitSetting.code)){
    		var componentInfo = thatCE.getLastComponentInfo();
    		thatCE.initLocationTypePointSelectValues(componentInfo);
    	}
	}

	this.refreshUnitByObject3D = function(object3D, unitSetting){
		var oldObject3D = thatCE.getObject3DByUnitId(unitSetting.id);
		thatCE.scene.remove(oldObject3D);
        var mainScene = thatCE.getMainScene();
        object3D.unitData = {
        	id: unitSetting.id,
        	name: unitSetting.name,
        	code: unitSetting.code,
        	versionNum: unitSetting.versionNum,
        	mixType: unitSetting.mixType,

			//显示级别 added by ls 20230403
			viewLevel: unitSetting.viewLevel,

			useWorldPosition: unitSetting.useWorldPosition,
			useParameterPosition: unitSetting.useParameterPosition,
        	parameters: unitSetting.parameters,

        	//重新造型后，把position和rotation都带回来 added by ls 20220606
        	position: unitSetting.position,
        	rotation: unitSetting.rotation,

        	positionExps: unitSetting.positionExps,
        	rotationExps: unitSetting.rotationExps,
        	count: unitSetting.count,
        	countExp: unitSetting.countExp,
        	uvs: unitSetting.uvs,

			//支持展开BOM added by ls 20220726
			hasBOM: unitSetting.hasBOM,
        };
        mainScene.add(object3D);
        object3D.isUnitObject = true;
      	thatCE.setObject3DRotation(object3D, unitSetting, false);
      	thatCE.setObject3DPosition(object3D, unitSetting, false);

    	var userParameters = thatCE.getComponentExpEditParameters(true, true, true);
    	var ps = {};
    	for(var i = 0; i < userParameters.length; i++){
    		var userParameter = userParameters[i];
    		ps[userParameter.name] = userParameter.value;
    	}
    	thatCE.object3DCreator.runUnitRotationExpJs(object3D, object3D.unitData.rotationExps, ps);
    	thatCE.object3DCreator.runUnitPositionExpJs(object3D, object3D.unitData.positionExps, ps);
    	thatCE.refreshObject3DUvMaterial(object3D, object3D.unitData.uvs, true);

    	//触发afterAddUnitObject3DToScene added by ls 20230830
    	thatCE.doEvent("afterAddUnitObject3DToScene", {
    		object3D: object3D
    	});

    	thatCE.selectUnitObject(object3D);
    }

    this.createPlace3DPoint = function(intersectPoint){
        var ballGeometry = new THREE.SphereGeometry(thatCE.componentInfo.placePointRadius, 16, 16);
        var ball = new THREE.Mesh(ballGeometry, thatCE.waitingPlaceBallMaterial);
        ball.receiveShadow = false;
        ball.castShadow = false;
        ball.isPlaceObject = true;
        if(intersectPoint != null){
        	ball.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z);
        }
        thatCE.scene.add(ball);
        if(thatCE.placeSettings.waitingPlacePoint != null){
    		thatCE.addAttachLineValue(thatCE.attachLines.x, thatCE.placeSettings.waitingPlacePoint.position.x);
    		thatCE.addAttachLineValue(thatCE.attachLines.y, thatCE.placeSettings.waitingPlacePoint.position.y);
    		thatCE.addAttachLineValue(thatCE.attachLines.z, thatCE.placeSettings.waitingPlacePoint.position.z);
        	thatCE.placeSettings.waitingPlacePoint.material.color = new THREE.Color(thatCE.placeSettings.placedPointColor);
            thatCE.placeSettings.placedPoints.push(thatCE.placeSettings.waitingPlacePoint);
        }
        thatCE.placeSettings.waitingPlacePoint = ball;

        if(thatCE.placeSettings.placedPoints.length >= 1){
            var beginPoint = thatCE.placeSettings.placedPoints[thatCE.placeSettings.placedPoints.length - 1];
            var endPoint = thatCE.placeSettings.waitingPlacePoint;
            /*
			var lineGeometry = new THREE.BufferGeometry();
			lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute([beginPoint.position.x,
			                                                                        beginPoint.position.y,
			                                                                        beginPoint.position.z,
			                                                                        endPoint.position.x,
			                                                                        endPoint.position.y,
			                                                                        endPoint.position.z], 3));
			                                                                        */

            var lineGeometry = new LineGeometry();
            var pointArr = [beginPoint.position.x,
                            beginPoint.position.y,
                            beginPoint.position.z,
                            endPoint.position.x,
                            endPoint.position.y,
                            endPoint.position.z];
            lineGeometry.setPositions(pointArr);

            var line = new Line2(lineGeometry, thatCE.waitingPlaceLineMaterial);
            line.isPlaceObject = true;
            thatCE.scene.add(line);
            thatCE.placeSettings.waitingPlaceLine = line;
        }

		var pointCount = thatCE.placeSettings.commandProcessor.pointCount;
		if(thatCE.placeSettings.placedPoints.length == pointCount){
			var points = [];
			for(var i = 0; i < thatCE.placeSettings.placedPoints.length; i++){
				var placedPoint = thatCE.placeSettings.placedPoints[i];
				points.push({
					x: placedPoint.position.x,
					y: placedPoint.position.y,
					z: placedPoint.position.z
				});
			}
			var commandProcessor = thatCE.placeSettings.commandProcessor;
	    	thatCE.runCommandByPoints(points, commandProcessor);
			thatCE.endPlaceLimit3DPoints();
		}
    }

    this.createRulerPoint = function(intersectPoint){
    	if(thatCE.placeSettings.placedPoints.length == 2){
    		thatCE.placeSettings.placedPoints = new Array();
    		var allPlaceObjects = [];
    		for(var i = 0; i < thatCE.scene.children.length; i++){
    			var obj = thatCE.scene.children[i];
    			if(obj.isPlaceObject && obj != thatCE.placeSettings.waitingPlacePoint){
    				allPlaceObjects.push(obj);
    			}
    		}
    		for(var i = 0; i < allPlaceObjects.length; i++){
    			var obj = allPlaceObjects[i];
    			thatCE.scene.remove(obj);
    		}
    	}
        var ballGeometry = new THREE.SphereGeometry(thatCE.componentInfo.placePointRadius, 16, 16);
        var ball = new THREE.Mesh(ballGeometry, thatCE.waitingPlaceBallMaterial);
        ball.receiveShadow = false;
        ball.castShadow = false;
        ball.isPlaceObject = true;
        if(intersectPoint != null){
        	ball.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z);
        }
        thatCE.scene.add(ball);
        if(thatCE.placeSettings.waitingPlacePoint != null){
    		thatCE.addAttachLineValue(thatCE.attachLines.x, thatCE.placeSettings.waitingPlacePoint.position.x);
    		thatCE.addAttachLineValue(thatCE.attachLines.y, thatCE.placeSettings.waitingPlacePoint.position.y);
    		thatCE.addAttachLineValue(thatCE.attachLines.z, thatCE.placeSettings.waitingPlacePoint.position.z);
        	thatCE.placeSettings.waitingPlacePoint.material.color = new THREE.Color(thatCE.placeSettings.placedPointColor);
            thatCE.placeSettings.placedPoints.push(thatCE.placeSettings.waitingPlacePoint);
        }
        thatCE.placeSettings.waitingPlacePoint = ball;

        if(thatCE.placeSettings.placedPoints.length == 1){
			var lineGeometry = new LineGeometry();
            var beginPoint = thatCE.placeSettings.placedPoints[thatCE.placeSettings.placedPoints.length - 1];
            var endPoint = thatCE.placeSettings.waitingPlacePoint;
            var pointArr = [beginPoint.position.x,
                            beginPoint.position.y,
                            beginPoint.position.z,
                            endPoint.position.x,
                            endPoint.position.y,
                            endPoint.position.z];
            lineGeometry.setPositions(pointArr);
            var line = new Line2(lineGeometry, thatCE.waitingPlaceLineMaterial);
            line.isPlaceObject = true;
            thatCE.scene.add(line);
            thatCE.placeSettings.waitingPlaceLine = line;
        }
        else if(thatCE.placeSettings.placedPoints.length == 2){
            thatCE.placeSettings.waitingPlaceLine = null;
        }
    }

    this.createPlace2DPoint = function(intersectPoint){
        var ballGeometry = new THREE.SphereGeometry(thatCE.componentInfo.placePointRadius, 16, 16);
        var ball = new THREE.Mesh(ballGeometry, thatCE.waitingPlaceBallMaterial);
        ball.receiveShadow = false;
        ball.castShadow = false;
        ball.isPlaceObject = true;
        if(intersectPoint != null){
        	ball.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z);
        }
        thatCE.scene.add(ball);
        if(thatCE.placeSettings.waitingPlacePoint != null){
    		thatCE.addAttachLineValue(thatCE.attachLines.x, thatCE.placeSettings.waitingPlacePoint.position.x);
    		thatCE.addAttachLineValue(thatCE.attachLines.y, thatCE.placeSettings.waitingPlacePoint.position.y);
    		thatCE.addAttachLineValue(thatCE.attachLines.z, thatCE.placeSettings.waitingPlacePoint.position.z);
        	thatCE.placeSettings.waitingPlacePoint.material.color = new THREE.Color(thatCE.placeSettings.placedPointColor);
            thatCE.placeSettings.placedPoints.push(thatCE.placeSettings.waitingPlacePoint);
        }
        thatCE.placeSettings.waitingPlacePoint = ball;

        if(thatCE.placeSettings.placedPoints.length >= 1){
            var beginPoint = thatCE.placeSettings.placedPoints[thatCE.placeSettings.placedPoints.length - 1];
            var endPoint = thatCE.placeSettings.waitingPlacePoint;
            var lineGeometry = new LineGeometry();
            var pointArr = [beginPoint.position.x,
                            beginPoint.position.y,
                            beginPoint.position.z,
                            endPoint.position.x,
                            endPoint.position.y,
                            endPoint.position.z];
            lineGeometry.setPositions(pointArr);
            var line = new Line2(lineGeometry, thatCE.waitingPlaceLineMaterial);
            line.isPlaceObject = true;
            thatCE.scene.add(line);
            thatCE.placeSettings.waitingPlaceLine = line;
        }

		var pointCount = thatCE.placeSettings.commandProcessor.pointCount;
		if(thatCE.placeSettings.placedPoints.length == pointCount){
			var points = [];
			for(var i = 0; i < thatCE.placeSettings.placedPoints.length; i++){
				var placedPoint = thatCE.placeSettings.placedPoints[i];
				points.push({
					x: placedPoint.position.x,
					y: placedPoint.position.y,
					z: placedPoint.position.z
				});
			}
			var commandProcessor = thatCE.placeSettings.commandProcessor;
	    	thatCE.runCommandByPoints(points, commandProcessor);
			thatCE.endPlaceLimit2DPoints();
		}
    }

    this.createPointCtrlPoint = function(intersectPoint){
		var waitingPoint = thatCE.placeSettings.waitingPlacePoint;
    	var object3D = thatCE.pointCtrlProcessor.addNewPointCtrl(waitingPoint.position);
		thatCE.setStatus(js3CoreEditorStatus.normal);
		thatCE.pointCtrlProcessor.selectPointCtrlObject(object3D);
		thatCE.refreshAttachHelpLine();
		thatCE.endPointCtrl();

		thatCE.doEvent("afterAddNewPointCtrl", {editor: editor, object3D: object3Dm, isNew: true});
    }

	this.beginRuler = function(){
		//执行测距时，显示ruler的容器 added by ls 20210901
    	$("#" + thatCE.containerId).find(".rulerContainer").css({display: "block"});
		thatCE.selectUnitObject();
		thatCE.placeSettings.placedPoints = [];
		thatCE.placeSettings.waitingPlacePoint = null;
		thatCE.placeSettings.waitingPlaceLine = null;
		thatCE.placeSettings.drawingPlacePoint = true;
		thatCE.attachLines = thatCE.getAttachLines();
		thatCE.createRulerPoint();
    }

	this.beginPlaceLimit3DPoints = function(btnName, commandProcessor){
		thatCE.selectUnitObject();
		thatCE.placeSettings.btnName = btnName;
		thatCE.placeSettings.commandProcessor = commandProcessor;
		thatCE.placeSettings.placedPoints = [];
		thatCE.placeSettings.waitingPlacePoint = null;
		thatCE.placeSettings.waitingPlaceLine = null;
		thatCE.placeSettings.drawingPlacePoint = true;
		thatCE.attachLines = thatCE.getAttachLines();
		thatCE.createPlace3DPoint();
    }

	this.beginPointCtrl  = function(btnName, commandProcessor){
		thatCE.selectUnitObject();
		thatCE.placeSettings.btnName = btnName;
		thatCE.placeSettings.commandProcessor = commandProcessor;
		thatCE.placeSettings.placedPoints = [];
		thatCE.placeSettings.waitingPlacePoint = null;
		thatCE.placeSettings.waitingPlaceLine = null;
		thatCE.placeSettings.drawingPlacePoint = true;
		thatCE.attachLines = thatCE.getAttachLines();
		thatCE.createPlace2DPoint();
    }

	this.beginPlaceLimit2DPoints = function(btnName, commandProcessor){
		thatCE.selectUnitObject();
		thatCE.placeSettings.btnName = btnName;
		thatCE.placeSettings.commandProcessor = commandProcessor;
		thatCE.placeSettings.placedPoints = [];
		thatCE.placeSettings.waitingPlacePoint = null;
		thatCE.placeSettings.waitingPlaceLine = null;
		thatCE.placeSettings.drawingPlacePoint = true;
		thatCE.attachLines = thatCE.getAttachLines();
		thatCE.createPlace2DPoint();
    }

	this.checkIsNormalStatus = function(){
		if(thatCE.status == js3CoreEditorStatus.normal){
			return true;
		}
		else{
			var message = "当前为" + js3GetStatusName(thatCE.status) + "状态，不可进行此操作."
			msgBox.alert({info: message});
			return false;
		}
	}

	this.setStatus = function(newStatus, btnName, commandJson) {
		if (newStatus === js3CoreEditorStatus.none) {
			//如果新状态为none，那么直接执行
			thatCE.doOtherBtnClickEvent(btnName, commandJson);
			return true;
		}
		else {
			var oldStatus = thatCE.status;
			switch (oldStatus) {
				case js3CoreEditorStatus.disabled: {
					msgBox.alert({info: "设计器不可用."});
					break;
				}
				case js3CoreEditorStatus.placeLimit3DPoints: {
					if (!thatCE.endPlaceLimit3DPoints()) {
						return false;
					}
					break;
				}
				case js3CoreEditorStatus.placeLimit2DPoints: {
					if (!thatCE.endPlaceLimit2DPoints()) {
						return false;
					}
					break;
				}
				case js3CoreEditorStatus.ruler: {
					if (!thatCE.endRuler()) {
						return false;
					}
					break;
				}
				case js3CoreEditorStatus.pointCtrl: {
					if (!thatCE.endPointCtrl()) {
						return false;
					}
					break;
				}
				case js3CoreEditorStatus.multiSelect: {
					if (newStatus != js3CoreEditorStatus.multiSelect) {
						thatCE.cancelAllMultiSelectUnitObjects();
					}
					break;
				}
				case js3CoreEditorStatus.normal: {
					//不需要提前做处理
					break;
				}
			}

			switch (newStatus) {
				case js3CoreEditorStatus.disabled: {
					//不需要做处理
					thatCE.setCoreContainerStatus(false);
					break;
				}
				case js3CoreEditorStatus.placeLimit3DPoints: {
					thatCE.setCoreContainerStatus(true);
					thatCE.beginPlaceLimit3DPoints(btnName, commandJson);
					break;
				}
				case js3CoreEditorStatus.placeLimit2DPoints: {
					thatCE.setCoreContainerStatus(true);
					thatCE.beginPlaceLimit2DPoints(btnName, commandJson);
					break;
				}
				case js3CoreEditorStatus.ruler: {
					thatCE.setCoreContainerStatus(true);
					thatCE.beginRuler();
					break;
				}
				case js3CoreEditorStatus.pointCtrl: {
					thatCE.setCoreContainerStatus(true);
					thatCE.beginPointCtrl(btnName, commandJson);
					break;
				}
				case js3CoreEditorStatus.normal: {
					thatCE.setCoreContainerStatus(false);
					if (btnName != null) {
						switch (btnName) {
							case "save": {
								thatCE.saveComponent();
								break;
							}

							//导出GLTF added by liyh 20220718
							case "componentExportGLTF": {
								thatCE.OnExportGLTF();
								ev.stopPropagation();
								break;
							}

							//导出DAE added by ls 20230313
							case "componentExportDAE": {
								thatCE.OnExportDAE();
								ev.stopPropagation();
								break;
							}

							case "normalViewport": {
								//thatCE.setNormalViewport(js3NormalViewport.front);
								thatCE.setInitViewport();
								break;
							}
							case "frontView": {
								thatCE.setNormalViewport(js3NormalViewport.front);
								break;
							}
							case "topView": {
								thatCE.setNormalViewport(js3NormalViewport.top);
								break;
							}
							case "backView": {
								thatCE.setNormalViewport(js3NormalViewport.back);
								break;
							}
							case "bottomView": {
								thatCE.setNormalViewport(js3NormalViewport.bottom);
								break;
							}
							case "leftView": {
								thatCE.setNormalViewport(js3NormalViewport.left);
								break;
							}
							case "rightView": {
								thatCE.setNormalViewport(js3NormalViewport.right);
								break;
							}
							default: {
								thatCE.doOtherBtnClickEvent(btnName, commandJson);
								break;
							}
						}
					}
					break;
				}
			}

			thatCE.status = newStatus;
			return true;
		}
	}

	this.setCoreContainerStatus = function(drawing){
		if(drawing){
			$("#" + thatCE.containerId).find(".coreInnerContainer").addClass("coreInnerContainerDraw");
		}
		else {
			$("#" + thatCE.containerId).find(".coreInnerContainer").removeClass("coreInnerContainerDraw");
		}
	}

	this.doOtherBtnClickEvent = function(btnName, commandJson){
		if(commandJson != null && commandJson.run != null){
			commandJson.run({
				editor: thatCE,
				commandJson: commandJson
			});
		}
		else{
			msgBox.alert({info: "尚未实现的按钮事件. btnName = " + btnName});
		}
	}

    this.getRefComponentInfoFromCache = function(code, versionNum){
    	var key = code + "_" + versionNum;
    	var refComponentInfo = thatCE.componentInfo.refComponents[key];
    	return refComponentInfo;
    }

    this.addComponentInfoToCache = function(code, versionNum, componentInfo){
    	var key = code + "_" + versionNum;

    	//模型默认的标准材质
    	var materialHash = {};
    	if(componentInfo.standardMaterials != null && componentInfo.standardMaterials.length > 0){
    		for(var i = 0; i < componentInfo.standardMaterials.length; i++){
    			var standardMaterial = componentInfo.standardMaterials[i];
    			materialHash[standardMaterial.name] = standardMaterial;
    		}
    	}
    	componentInfo.standardMaterialHash = materialHash;

    	thatCE.componentCache[key] = componentInfo;
    }

    this.showStatusInfo = function(p){
    	var currentTimeStr = cmnPcr.datetimeToStr(new Date(), " (HH:mm:ss)");
    	$("#" + thatCE.containerId).find(".editorFooterStatusBtn").text(p.statusText + currentTimeStr);
    }

    this.loadFont = function(p){
    	var textLoad = new FontLoader().load(basePath + '/web/design/common/font/helvetiker_bold.typeface.json',function(font){
    		thatCE.defaultFont = font;

    		//加载完字体后，再加载模型
    		thatCE.openComponent(p);
    	});
    }

    //初始化,入口方法
	this.init = function(p) {
		thatCE.containerId = p.containerId;
		thatCE.componentId = p.componentId;
		thatCE.transformControlVisible = p.transformControlVisible == null ? true : p.transformControlVisible;
		thatCE.attachLine2dVisible = p.attachLine2dVisible == null ? true : p.attachLine2dVisible;
		thatCE.unitInfoVisible = p.unitInfoVisible == null ? true : p.unitInfoVisible;
		thatCE.unitListVisible = p.unitListVisible == null ? true : p.unitListVisible;
		thatCE.groupVisible = p.groupVisible == null ? true : p.groupVisible;
		thatCE.gridVisible = p.gridVisible == null ? true : p.gridVisible;
		thatCE.groundContextMenuVisible = p.groundContextMenuVisible == null ? true : p.groundContextMenuVisible;
		thatCE.componentContextMenuVisible = p.componentContextMenuVisible == null ? true : p.componentContextMenuVisible;
		thatCE.titleVisible = p.titleVisible == null ? true : p.titleVisible;
		thatCE.canSelectObject3D = p.canSelectObject3D == null ? true : p.canSelectObject3D;
		thatCE.hasShadow = p.hasShadow == null ? false : p.hasShadow;

		//初始化插件 added by ls 20230830
		thatCE.initPlugins();

		thatCE.afterSelectUnitFunc = p.afterSelectUnitFunc;
		thatCE.afterShowUnitFunc = p.afterShowUnitFunc;
		thatCE.loadFont(p);
    };

	//初始化插件 added by ls 20230830
    this.initPlugins = function(){
    	for(let pluginName in js3CommandProcessors){
    		let pluginProcessor = js3CommandProcessors[pluginName];
    		if(pluginProcessor.init){
    			pluginProcessor.init({
    				editor: thatCE
    			});
    		}
    	}
    }

    this.openComponent = function(p){
		var requestParam = {
			componentId: p.componentId
		};
		serverAccess.request({
			serviceName:"mdlComponentNcpService",
			funcName:"getComponentFile",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)},
			successFunc: function(obj) {
		        $("#" + thatCE.containerId).find(".coreInnerContainer").empty();
				var componentInfo = new MdlComponent();
				componentInfo.parse(obj.result.componentInfo.id, obj.result.componentInfo.categoryId, decodeURIComponent(obj.result.componentInfo.content));
				componentInfo.metadata=decodeURIComponent(obj.result.componentInfo.metadata)//增加元数据扩展信息 added by yay 20221109
				thatCE.componentInfo = componentInfo;
		        thatCE.load(componentInfo);
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});
    }

    this.initTitle = function(componentInfo){
    	if(thatCE.titleVisible){
	    	var title = componentInfo.name + "(" + componentInfo.code + " | " + componentInfo.versionNum + ")";
	    	$("#" + thatCE.containerId).find(".core3dTitleContainer .core3dFileName").text(title);
	    	$("title").text("组件 - " + title);
    	}
    }

    this.beginNormal = function(options){
    	if(options != null){
    		if(options.viewport != null){
    			thatCE.setNormalViewport(options.viewport);
    		}
    	}
    }

    /* 循环渲染 */
    thatCE.animate = function(time) {
        thatCE.renderer.render(thatCE.scene, thatCE.camera);
        thatCE.renderer2d.render(thatCE.scene, thatCE.camera);

        //刷新统计显示 added by ls 20230529
        thatCE.stats.update();

        requestAnimationFrame( thatCE.animate );
        thatCE.doEvent("afterAnimate", {editor: thatCE, time: time});
    };

    this.getGuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    this.onOrbitChange = function(ev){
    }

    /* 加载组件 */
    this.load = function(componentInfo) {
    	thatCE.initScene();
    	thatCE.initRender();
    	thatCE.initRender2D();
    	thatCE.initCamera();
    	thatCE.initControls();
    	thatCE.initGrid(componentInfo);
    	thatCE.initAxes(componentInfo);
    	thatCE.initWorkPlaneSelectValues(componentInfo);
    	thatCE.initLocationTypeSelectValues(componentInfo);
        thatCE.initLight();
    	thatCE.initTransformControl(componentInfo);
    	thatCE.initRaycaster();
        thatCE.setInitViewport();
        thatCE.initObject3DCreator();
    	thatCE.initPointCtrlProcessor();
    	thatCE.initContent(componentInfo);

    	//性能统计 added ls 20230529
    	thatCE.initRenderStats();

    	thatCE.animate();
    	thatCE.initSide();
    	thatCE.initToolbar();
    	thatCE.initContextMenu();
    	thatCE.initWorkPlanes(componentInfo);
    	thatCE.initAttachHelpLines();
    	thatCE.initRuler();
    	thatCE.initTitle(componentInfo);
    	thatCE.initComponentPropertyValues(componentInfo);
    	thatCE.initMultiSelectPropertyInputEvent();
    	thatCE.initComponentPropertyInputEvent();
    	thatCE.initUnitPropertyInputEvent();
    	thatCE.initExpProcessor();
    	thatCE.initTabEvent();
    	thatCE.initToolbarEvent();
        window.addEventListener('resize', thatCE.onWindowResize, false);
        $("#" + thatCE.containerId).find(".coreContainer").mousedown(thatCE.onMouseDown);
        $("#" + thatCE.containerId).find(".coreContainer").mousemove(thatCE.onMouseMove);
        $("#" + thatCE.containerId).find(".coreContainer").mouseup(thatCE.onMouseUp);
        $("#" + thatCE.containerId).find(".coreContainer").contextmenu(thatCE.onContextMenu);

        //快捷键设为全局的 modified by ls 20230510
        $("#" + thatCE.containerId).keydown(thatCE.onKeyDown);

        $("#" + thatCE.containerId).find(".coreContainer").focus();
    };

	//性能统计 added ls 20230529
    this.initRenderStats = function(){
    	thatCE.stats = new Stats();
    	$("#" + thatCE.containerId).find(".coreContainer")[0].appendChild(thatCE.stats.domElement);
    	thatCE.stats.domElement.style.position ="absolute";
    	thatCE.stats.domElement.style.left = "auto";
    	thatCE.stats.domElement.style.top = "auto";
    	thatCE.stats.domElement.style.right = "10px";
    	thatCE.stats.domElement.style.bottom = "10px";
    	thatCE.stats.domElement.style.display = "none";
    }

    this.initObject3DCreator = function(){
    	var object3DCreator = new Object3DCreator();
    	object3DCreator.init({
    		editor: thatCE
    	});
    	thatCE.object3DCreator = object3DCreator;
    }

    this.initPointCtrlProcessor = function(){
    	var pointCtrlProcessor = new PointControlProcessor();
    	pointCtrlProcessor.init({
    		editor: thatCE
    	});
    	thatCE.pointCtrlProcessor = pointCtrlProcessor;

    	thatCE.doEvent("afterInitPointCtrlProcessor", {editor: thatCE, pointCtrlProcessor: pointCtrlProcessor});
    }

    this.createObject3D = function(unitSetting, parentParameters, afterCreateFunc){
    	thatCE.object3DCreator.createObject3D(unitSetting, thatCE.componentInfo.refComponents, parentParameters, afterCreateFunc);
    }

    this.createObject3Ds = function(unitComInfoHash, parentParameters, afterCreateFunc){
    	thatCE.object3DCreator.createObject3Ds(unitComInfoHash, thatCE.componentInfo.refComponents, parentParameters, afterCreateFunc);
    }

    this.setZoom = function(zoom){
		var position = [thatCE.camera.position.x, thatCE.camera.position.y, thatCE.camera.position.z];
		var target = [thatCE.orbitControl.target0.x, thatCE.orbitControl.target0.y, thatCE.orbitControl.target0.z];
		thatCE.setViewportByPoint(position, target, zoom);
    }

    this.setInitViewport = function(){
    	if(thatCE.componentInfo.camera != null){
    		//老的模型的camera的位置，要重新设置为init状态
    		var cameraPos = thatCE.componentInfo.camera.position;
    		var value = Math.sqrt(cameraPos[0] * cameraPos[0] + cameraPos[1] * cameraPos[1] + cameraPos[2] * cameraPos[2]);
    		if(value > 2000){
                thatCE.setNormalViewport(js3NormalViewport.init);
    		}
    		else{
    			thatCE.setViewportByPoint(thatCE.componentInfo.camera.position, thatCE.componentInfo.camera.target, thatCE.componentInfo.camera.zoom);
    		}
    	}
    	else{
            thatCE.setNormalViewport(js3NormalViewport.init);
    	}
    }

    this.getComponentParametersForEditExp = function(){
    	var parameters = thatCE.componentInfo.parameters;
    	var comParameters = [];
    	for(var paramName in parameters){
    		var param = parameters[paramName];
    		var pValueType = getValueTypeByParameterType(param.paramType);
    		var value = cmnPcr.strToObject(param.defaultValue, pValueType);
    		comParameters.push({
    			name: paramName,
    			value: value,
    			valueType: pValueType
    		});
    	}


    	//增加轴网的轴号作为参数 modified by ls 20230609
		var allAxesParamters = thatCE.getAxesParamters([thatCE.componentInfo.axes.left,
		                                              thatCE.componentInfo.axes.right,
		                                              thatCE.componentInfo.axes.top,
		                                              thatCE.componentInfo.axes.bottom,
		                                              thatCE.componentInfo.axes.vertical]);
		var axesNameKeys = {};
		for(var i = 0; i < allAxesParamters.length; i++){
			var axesParamter = allAxesParamters[i];
			if(axesNameKeys[axesParamter.name] == null){
				comParameters.push(axesParamter);
		    	axesNameKeys[axesParamter.name] = true;
			}
		}

    	return comParameters;
    }

    this.editUnitComponentParameters = function(object3D){
		var unitData = object3D.unitData;
		var unitComProcessor = thatCE.object3DCreator.createJs3UnitComponentProcessor(unitData.code, unitData.versionNum);
		var refComponentKey = unitData.code + "_" + unitData.versionNum;
		var refComponentInfo = thatCE.componentInfo.refComponents[refComponentKey];
		var parentParameters = thatCE.getComponentParametersForEditExp();
		unitComProcessor.init({
			editor: thatCE,
			unitId: unitData.id,
			unitName: unitData.name,
			mixType: unitData.mixType,

			//显示级别 added by ls 20230403
			viewLevel: unitData.viewLevel,

			useWorldPosition: unitData.useWorldPosition,
			useParameterPosition: unitData.useParameterPosition,
			position: {x: object3D.position.x, y: object3D.position.y, z: object3D.position.z},
			rotation: {x: object3D.rotation.x, y: object3D.rotation.y, z: object3D.rotation.z},
			count: unitData.count,
			countExp: unitData.countExp,
			uvs:unitData.uvs,
			componentInfo: refComponentInfo,
			valueParameters: unitData.parameters,
			positionExps: unitData.positionExps,
			rotationExps: unitData.rotationExps,
			parentParameters: parentParameters
		});
		unitComProcessor.showForm({
			formWidth: js3RefComponentParameterEditFormSetting.formWidth,
			formHeight: js3RefComponentParameterEditFormSetting.formHeight,
			title: refComponentInfo.name + " (" + refComponentInfo.code + ", " + refComponentInfo.versionNum + ")",
			pageUrl: js3RefComponentParameterEditFormSetting.pageUrl
		});
    }

    this.editComponentParameters = function(){
		var popContainer = new PopupContainer( {
			width: 1200,
			height: 600,
			top : 50,
			title: "自定义参数"
		});

		popContainer.show();
		var inputId = cmnPcr.getRandomValue();
		var titleId = inputId + "_title";
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
			//去掉overflow的设置 deleted by ls 20210823
		 	+ "<div id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"
		 	+ "</div>"
		 	+ "</div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
			//展示元数据扩展属性 textare added by yay 20221109
		 	+ "<textare type=\"textare\" rows=\"3\"   style=\"overflow-y: scroll;position:absolute;left:0px;right:200px;height:46px;bottom:0px;font-size:11px;text-align:left;\">"
			+ thatCE.componentInfo.metadata+ "</textare>"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		var componentParametersEditor = new JS3ComponentParametersEditor();
		componentParametersEditor.init({
			//增加categoryId作为参数 added by ls 20210824
			categoryId: thatCE.componentInfo.categoryId,
			containerId: editorFrameId,
			detailLevel: thatCE.object3DCreator.detailLevel,

			//显示级别 added by ls 20230403
			viewLevel: thatCE.object3DCreator.viewLevel,

			parameters: thatCE.componentInfo.parameters,
			sortedRunExpParameters: thatCE.componentInfo.sortedRunExpParameters
    	});

		$("#" + okBtnId).click(function(p){
			var parameterResult = componentParametersEditor.getParameters();
			if(parameterResult.errors.length > 0){
				var errorStr = cmnPcr.arrayToString(parameterResult.errors, "\r\n");
				msgBox.alert({info: errorStr});
			}
			else{
				thatCE.componentInfo.parameters = parameterResult.parameters;

				thatCE.componentInfo.sortedRunExpParameters = parameterResult.sortedRunExpParameters;

				for(let paramName in thatCE.componentInfo.parameters){
					if(!thatCE.componentInfo.sortedRunExpParameters.contains(paramName)){
						thatCE.componentInfo.sortedRunExpParameters.push(paramName);
					}
				}

				//重新计算辅助线
				thatCE.runComponentAllSizePimExpJs();

				//重新驱动生成所有object3D
				thatCE.rebuildAllUnitObject3Ds();

				//重新计算所有Unit的位置
				//改为后台构造返回后，重新计算位置
				//thatCE.runAllUnitPositionExpJs();

				//更新初始化位置方式的参数下拉值 added by ls 20230612
				thatCE.initLocationTypeParameterSelectValues(thatCE.componentInfo);

				popContainer.close();
			}
		});
		$("#" + cancelBtnId).click(function(){
			popContainer.close();
		});
    }

    this.editObject3DFaceMaterial = function(object3D){
    	//改小uv贴图窗口 modified by ls 20210825
		var popContainer = new PopupContainer( {
			width : 1000 ,
			height : 600,
			top : 50,
			title: "设置UV贴图 - " + object3D.unitData.name
		});

		popContainer.show();
		var inputId = cmnPcr.getRandomValue();
		var titleId = inputId + "_title";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var exportGltfBtnId = inputId + "_exportGltf";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:50px;font-size:11px;text-align:center;\">"
		 	+ "<div id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"
		 	+ "</div>"
		 	+ "</div>"
		 	//增加导出gltf、导入uv贴图值的功能 added by ls 20210825
		 	+ "<div style=\"position:absolute;left:10px;width:300px;height:45px;bottom:0px;font-size:11px;text-align:left;\">"
		 	+ "<input type=\"button\" id=\"" + exportGltfBtnId +"\" value=\"导出gLTF\" class=\"commonBtn\" />"
 			+ "</div>"
		 	+ "<div style=\"position:absolute;left:300px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		$("#" + editorFrameId).append($("#" + thatCE.containerId).find(".coreUvMaterialEditContainer").children().clone());
		var uvMaterialEditor = new JS3UvMaterialEditor();
		uvMaterialEditor.init({
			containerId: editorFrameId,
			name: object3D.unitData.name,
			sourceObject3D: object3D,
			faceSegBallRadius: thatCE.componentInfo.placePointRadius
    	});

	 	//增加导出gltf、导入uv贴图值的功能 added by ls 20210825
		$("#" + exportGltfBtnId).click(function(){
			uvMaterialEditor.exportGltf();
		});

		$("#" + okBtnId).click(function(p){
			var resultInfo = uvMaterialEditor.getParameters();
			if(resultInfo.error != null){
				msgBox.alert({info: resultInfo.error});
			}
			else{
				thatCE.setObject3DUvs(resultInfo.unitUvInfo);
				popContainer.close();
			}
		});
		$("#" + cancelBtnId).click(function(){
			popContainer.close();
		});
    }

    this.setObject3DUvs = function(unitUvInfo){
		var object3D = thatCE.getObject3DByUnitId(unitUvInfo.id);
    	object3D.unitData.uvs = unitUvInfo.uvs;
    	thatCE.refreshObject3DUvMaterial(object3D, object3D.unitData.uvs, true);
    }

    this.refreshObject3DUvMaterial = function(object3D, uvs, isForced){
    	if(uvs != null){
    		var meshUvCount = 0;
    		for(var meshKey in uvs){
    			meshUvCount++;
    		}
    		if(meshUvCount > 0 || isForced){
    			for(var i = 0; i < object3D.children.length; i++){
    				var mesh = object3D.children[i];
    				var meshKey = mesh.name;
    				var meshUv = uvs[meshKey];
    				thatCE.refreshMeshUvMaterial(mesh, meshUv, isForced);
    			}
    		}
    	}
    }

	//获取面对应的material的group added by ls 20231011
	this.getUvGroup = function(mesh, faceUv){
		var faceIndexes = mesh.geometry.index.array;
		var pointArray = mesh.geometry.attributes.position.array;
		var groupStart = faceIndexes[faceUv.faceIndex * 3];
		var groups = mesh.geometry.groups;

		//从第2个group找起
		for(var i = 1; i < groups.length; i++){
			var g = groups[i];
			if(g.start == groupStart){
				return g;
			}
		}
		return null;
	}

    this.refreshMeshUvMaterial = function(mesh, meshUv, isForced){
		if(meshUv != null){
			var faceIndexes = mesh.geometry.index.array;
			var uvs = mesh.geometry.attributes.uv.array;
			var groups = mesh.geometry.groups;
			for(var key in meshUv){
				var faceUv = meshUv[key];
				var group = thatCE.getUvGroup(mesh, faceUv);
				if(faceUv.imageName != null
						&& faceUv.a.x != null
						&& faceUv.a.y != null
						&& faceUv.b.x != null
						&& faceUv.b.y != null
						&& faceUv.c.x != null
						&& faceUv.c.y != null){
					var materialIndex = 0;
					for(var i = 0; i < mesh.material.length; i++){
						var m = mesh.material[i];
						if(m.name == faceUv.imageName){
							materialIndex = i;
						}
					}
					if(materialIndex == 0){
						var imageUrl = basePath + "/cms/getCMSImage?name=" + faceUv.imageName;
		  				let textureLoader = new THREE.TextureLoader();
						var texture = textureLoader.load(imageUrl, function () { });
						var faceMaterial = new THREE.MeshPhongMaterial( {
							name: faceUv.imageName,
							map: texture,
							flatShading: true,
				        	side: THREE.FrontSide
						});
						mesh.material.push(faceMaterial);
						materialIndex = mesh.material.length - 1;
					}

					var groupStart = faceIndexes[faceUv.faceIndex * 3];
					uvs[groupStart * 2] = faceUv.a.x;
					uvs[groupStart * 2 + 1] = faceUv.a.y;
					uvs[(groupStart + 1) * 2] = faceUv.b.x;
					uvs[(groupStart + 1) * 2 + 1] = faceUv.b.y;
					uvs[(groupStart + 2) * 2] = faceUv.c.x;
					uvs[(groupStart + 2)* 2 + 1] = faceUv.c.y;
					if(group == null){
						group = {
							count: 3,
							materialIndex: materialIndex,
							start: groupStart
						};
						mesh.geometry.groups.push(group);
					}
					else{
						group.materialIndex = materialIndex;
					}
				}
				else{
					if(group != null){
						var newGroups = new Array();
						for(var i = 0; i < groups.length; i++){
							var g = groups[i];
							if(g != group){
								newGroups.push(g);
							}
						}
					}
				}
			}
			//mesh.geometry.uvsNeedUpdate = true;
			//mesh.geometry.groupsNeedUpdate = true;
			mesh.geometry.setAttribute("uv", new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );
		}
		else if(isForced){
			for(var j = 0; j < mesh.geometry.faces.length; j++){
				var face = mesh.geometry.faces[j];
				face.materialIndex = 0;
			}
			mesh.geometry.uvsNeedUpdate = true;
			mesh.geometry.groupsNeedUpdate = true;
		}
    }

    this.showEditAxesWindow = function(){
    	var lastComponentInfo = thatCE.getLastComponentInfo();
		var popContainer = new PopupContainer( {
			width : 800 ,
			height : 500,
			top : 50,
			title: "设置轴网"
		});

		popContainer.show();
		var inputId = cmnPcr.getRandomValue();
		var titleId = inputId + "_title";
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:50px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"
		 	+ "</iframe>"
		 	+ "</div>"
		 	+ "<div style=\"position:absolute;left:300px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		var parameterStr = cmnPcr.jsonToStr(lastComponentInfo.axes);
		$("#" + editorFrameId).attr("src", "../../design/common/axesEditor.jsp?parameters=" + cmnPcr.encodeURI(parameterStr));
		$("#" + okBtnId).click(function(){
			var newParameters = $("#" + editorFrameId)[0].contentWindow.getParameters();
			if(newParameters != null) {
				thatCE.componentInfo.axes = newParameters;

				//新增设置轴网后，自动计算更新辅助线SizeX、SizeY、SizeZ的值  added by liyh 20230720
				thatCE.setComponentSize({
					x: thatCE.calcSumValue(newParameters.top) / thatCE.valueMultiply,
					y: thatCE.calcSumValue(newParameters.vertical) / thatCE.valueMultiply,
					z: thatCE.calcSumValue(newParameters.left) / thatCE.valueMultiply
				});

				//重新计算辅助线
				thatCE.runComponentAllSizePimExpJs();

				//重新驱动生成所有object3D added by ls 20221028
				thatCE.rebuildAllUnitObject3Ds();

				popContainer.close();
			}
		});
		$("#" + cancelBtnId).click(function(){
			thatCE.setStatus(js3CoreEditorStatus.normal);
			popContainer.close();
		});

    }

    //修改构件总体尺寸 added by ls 20230726
    this.setComponentSize = function(newSize){
		thatCE.componentInfo.size.x = newSize.x;
		thatCE.componentInfo.size.y = newSize.y;
		thatCE.componentInfo.size.z = newSize.z
    }

	//计算某个轴网的合计值  added by liyh 20230720
	this.calcSumValue = function(axesValue) {
		var sumValue = 0;

        //解决合计值返回为NaN的问题 modified by ls 20221026
        var partValues = axesValue != null && axesValue.trim().length > 0 ? axesValue.trim().split(",") : null;
        if (partValues != null) {
            for (var i = 0; i < partValues.length; i++) {
                var partValue = partValues[i].trim();
                var pvs = partValue.split(":");
                var mark = "";
                var distance = null;
                if (pvs.length == 1) {
                    distance = cmnPcr.strToDecimal(pvs[0].trim());
                } else if (pvs.length == 2) {
                    mark = pvs[0].trim();
                    distance = cmnPcr.strToDecimal(pvs[1].trim());
                }
                if (distance != null) {
                    sumValue += distance;
                }
            }
        }

		return sumValue;
    }

    this.showExportLZWWindow = function(){
    	var lastComponentInfo = thatCE.getLastComponentInfo();
		var popContainer = new PopupContainer( {
			width : 300 ,
			height : 150,
			top : 50,
			title: "导出LZW文件"
		});

		popContainer.show();
		var inputId = cmnPcr.getRandomValue();
		var titleId = inputId + "_title";
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var exportLZWStatusId = inputId + "_div";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:30px;bottom:0px;font-size:16px;text-align:center;\">"
		 	+ "<div id=\"" + exportLZWStatusId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;overflow:auto;\" >"
		 	+ "</div>"
		 	+ "</div>"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		$("#" + exportLZWStatusId).text("正在导出");
		thatCE.exportLZW(exportLZWStatusId);
    }

    this.exportLZW = function(exportLZWStatusId){
    	var componentInfo = thatCE.getLastComponentInfo();
		var parentParameters = thatCE.getComponentParametersForEditExp();
		var geoContents = {};
    	var allUnitSettings = new Array();
    	var materials = {};
		for(var i = 0; i < thatCE.scene.children.length; i++){
			var childObj3D = thatCE.scene.children[i];
			if(childObj3D.isUnitObject){
				var unitSetting = thatCE.getUnitSettingFromObject3D(childObj3D);

				var parameters = {};
				var componentKey = unitSetting.code + "_" + unitSetting.versionNum;
				var refComponentInfo = thatCE.componentInfo.refComponents[componentKey];
				for(var paramName in unitSetting.parameters){
					var refParameter = refComponentInfo.parameters[paramName];

					//如果组件存在这个参数（有可能之前有这个参数，后来被删除了） added by ls 20220623
					if(refParameter != null){
                        var unitParameter = unitSetting.parameters[paramName];
                        parameters[paramName] = {
                            name: paramName,
                            value: unitParameter.value,

                            //refParameter可能不存在 modified by ls 20210823
                            isGeo: refParameter == null || refParameter.isGeo == null ? true : refParameter.isGeo
                        };
                    }
				}

				//增加显示级别作为参数 modified by ls 20230403
				var cacheKey = thatCE.object3DCreator.object3DCache.getComponentObject3DKey(unitSetting.code, unitSetting.versionNum, parameters, unitSetting.useWorldPosition, thatCE.object3DCreator.detailLevel,  thatCE.object3DCreator.viewLevel);

				unitSetting.geoKey = cacheKey;
				allUnitSettings.push(unitSetting);

				if(geoContents[cacheKey] == null){
					var geoJson = thatCE.object3DCreator.object3DCache.getGeoJson(cacheKey);
					geoContents[cacheKey] = geoJson;
	    			thatCE.getGeoJsonMaterials(materials, geoJson);
				}
			}
		}

		var mainInfo = {
			id: componentInfo.id,
			name: encodeURIComponent(componentInfo.name),
			code: encodeURIComponent(componentInfo.code),
			size: componentInfo.size,
			camera: componentInfo.camera,
			parameters: parentParameters
		};

		var requestParam = {
			id: thatCE.componentInfo.id,
			name: encodeURIComponent(thatCE.componentInfo.name),
			code: encodeURIComponent(thatCE.componentInfo.code),
			mainInfo: mainInfo,
			unitSettings: allUnitSettings,
			geoContents: geoContents,
			materials: materials
		};
		serverAccess.request({
			serviceName:"mdlComponentNcpService",
			funcName:"exportLZW",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)},
			successFunc: function(obj) {
				$("#" + exportLZWStatusId).text("导出成功!");

				//使用去掉特殊字符后的文件名 modified by ls 20220623
				//var downloadUrl = "../export/" + thatCE.componentInfo.code + ".lzw";
				var downloadUrl = "../export/" + obj.result.exportFileName;

				window.open(downloadUrl);
			},
			failFunc: function(obj) {
				$("#" + exportLZWStatusId).text("导出失败!\r\n" + obj.message);
			}
		});
    }

    this.getGeoJsonMaterials = function(materials, geoJson){
    	var materialName = geoJson.material;
    	if(materialName != null && materialName.length > 0 && materials[materialName] == null){
    		var material = js3StandardMaterials.getMaterialInfo(materialName);
    		if(material != null){
    			materials[materialName] = material;
    		}
    	}
    	if(geoJson.children != null){
    		for(var i = 0; i < geoJson.children.length; i++){
    			var childGeoJson = geoJson.children[i];
    			thatCE.getGeoJsonMaterials(materials, childGeoJson);
    		}
    	}
    }

    //检测是否正在弹出模态窗口 added ls 20230506
    this.checkModalWindow = function(){
    	return $("#" + thatCE.containerId).find(".zlpPopOverlay").filter(function() {
    	    return $(this).css("display") === "block";
    	  }).length > 0;
    }

    this.onKeyDown = function(ev){
    	if(!thatCE.checkModalWindow()){
			thatCE.hideContextMenu();
	    	if(thatCE.status == js3CoreEditorStatus.placeLimit3DPoints){
	    		switch(ev.keyCode){
		    		case 13:{
		        		if(thatCE.placeSettings.drawingPlacePoint){
		        			var commandProcessor = thatCE.placeSettings.commandProcessor;
		        	    	var placedPoints = thatCE.placeSettings.placedPoints;
		        	    	if(commandProcessor.pointCount > 0 && placedPoints.length < commandProcessor.pointCount){
		        	    		//选的点数还不够
		        	    		msgBox.alert({info: "请选择" + commandProcessor.pointCount + "个点"});
		        	    	}
		        	    	else{
			        	    	thatCE.placeSettings.drawingPlacePoint = false;
			        	    	var points = [];

				    			//修改选择多个点后，返回点坐标的方法 modified by ls 20220706
			        	    	for(var i = 0; i < placedPoints.length; i++){
			        	    		var waitingPlacePoint = placedPoints[i];
			        	    		var point = {
			        	    			x: waitingPlacePoint.position.x,
			        	    			y: waitingPlacePoint.position.y,
			        	    			z: waitingPlacePoint.position.z
			        	    		};
			        	    		points.push(point);
			        	    	}

			        	    	thatCE.runCommandByPoints(points, commandProcessor);
			        			thatCE.endPlaceLimit3DPoints();
			        			thatCE.refreshAttachHelpLine();
		        	    	}
		        		}
		        		break;
		    		}
		    		case 27:{
		    			thatCE.setStatus(js3CoreEditorStatus.normal);
	        			thatCE.refreshAttachHelpLine();

	        			//执行取消操作 added by ls 20220606
	        			var commandProcessor = thatCE.placeSettings.commandProcessor;
	        			if(commandProcessor.cancel != null){
	        				commandProcessor.cancel();
	        			}
		    			break;
		    		}
	    		}
	    	}
	    	else if(thatCE.status == js3CoreEditorStatus.placeLimit2DPoints){
	    		switch(ev.keyCode){
		    		case 13:{
		        		if(thatCE.placeSettings.drawingPlacePoint){
		        			var commandProcessor = thatCE.placeSettings.commandProcessor;
		        	    	var placedPoints = thatCE.placeSettings.placedPoints;
		        	    	if(commandProcessor.pointCount > 0 && placedPoints.length < commandProcessor.pointCount){
		        	    		//选的点数还不够
		        	    		msgBox.alert({info: "请选择" + commandProcessor.pointCount + "个点"});
		        	    	}
		        	    	else{
			        	    	thatCE.placeSettings.drawingPlacePoint = false;
			        	    	var points = [];
			        	    	for(var i = 0; i < placedPoints.length; i++){
			        	    		var waitingPlacePoint = placedPoints[i];
			        	    		var point = {
			        	    			x: waitingPlacePoint.position.x,
			        	    			z: waitingPlacePoint.position.z
			        	    		};
			        	    		points.push(point);
			        	    	}
			        	    	var box = {
			        				minX: 10000,
			        	    		minZ: 10000,
			        	    		maxX: -10000,
			        	    		maxZ: -10000
			        	    	};
			        	    	for(var i = 0; i < points.length; i++){
			        	    		var point = points[i];
			        	    		if(point.x > box.maxX){
			        	    			box.maxX = point.x;
			        	    		}
			        	    		if(point.z > box.maxZ){
			        	    			box.maxZ = point.z;
			        	    		}
			        	    		if(point.x < box.minX){
			        	    			box.minX = point.x;
			        	    		}
			        	    		if(point.z < box.minZ){
			        	    			box.minZ = point.z;
			        	    		}
			        	    	}
			        	        var xCenter = (box.minX + box.maxX) / 2;
			        	        var zCenter = (box.minZ + box.maxZ) / 2;
			        	        var yCenter = 0;
			        	        var position = [xCenter, yCenter, zCenter];
			        	        var rotation = [0, 0, 0];

			        			var paintPoints = [];
			        			var pointCount = points.length;
			        			var checkWisePoints = [];
			        			var allVert2ds = [];
			        			for(var i = 0; i < pointCount; i++){
			        				var point = points[i];
			        				checkWisePoints.push({
			        					x: point.x,
			        					y: point.z
			        				});
			        				allVert2ds.push(new THREE.Vector2(point.x - xCenter, point.z - zCenter));
			        				paintPoints.push({
			        					x: point.x - xCenter,
			        					z: point.z - zCenter
			        				});
			        			}

			        	    	thatCE.runCommandByPoints(points, commandProcessor);
			        			thatCE.endPlaceLimit2DPoints();
			        			thatCE.refreshAttachHelpLine();
		        	    	}
		        		}
		        		break;
		    		}
		    		case 27:{
		    			thatCE.setStatus(js3CoreEditorStatus.normal);
	        			thatCE.refreshAttachHelpLine();

	        			//执行取消操作 added by ls 20220606
	        			var commandProcessor = thatCE.placeSettings.commandProcessor;
	        			if(commandProcessor.cancel != null){
	        				commandProcessor.cancel();
	        			}
		    			break;
		    		}
		    		case 76:{
		    			thatCE.showPopLengthditor();
		    			break;
		    		}
	    		}
	    	}
	    	else if(thatCE.status == js3CoreEditorStatus.ruler){
	    		switch(ev.keyCode){
		    		case 27:{
		    			thatCE.setStatus(js3CoreEditorStatus.normal);
	        			thatCE.endRuler();
		    			break;
		    		}
	    		}
	    	}
	    	else if(thatCE.status == js3CoreEditorStatus.pointCtrl){
	    		switch(ev.keyCode){
		    		case 27:{
		    			thatCE.setStatus(js3CoreEditorStatus.normal);
	        			thatCE.refreshAttachHelpLine();
	        			thatCE.endPointCtrl();
		    			break;
		    		}
	    		}
	    	}
	    	else if(thatCE.status == js3CoreEditorStatus.multiSelect){
	    		switch(ev.keyCode){
		    		case 27:{
		    			thatCE.setStatus(js3CoreEditorStatus.normal);
		    			break;
		    		}
		    		case 46: {
		    	    	var object3Ds = thatCE.multiSelectedUnitObject3Ds;
	                	thatCE.removeUnitObject3Ds(object3Ds);
		                break;
		            };
		    		case 67: {
		    	    	var object3Ds = thatCE.multiSelectedUnitObject3Ds;
	                	thatCE.copyObject3Ds(object3Ds);
		    			break;
		            };
		    		case 86: {
	                	msgBox.alert({info: "请使用鼠标右键进行批量粘贴操作."});
		    			break;
		    		};
	    		}
	    	}
	    	else if(thatCE.status == js3CoreEditorStatus.normal){
	    		switch(ev.keyCode){
		    		case 27:{
		    			//按下esc后，取消对任何组件的选择 added by ls 20210820
		    			thatCE.selectUnitObject(null);
		    			break;
		    		}
		    		case 65:{
		    			//按下A建，弹出插入构件框 added by ls 20221208
		        		thatCE.doBtnClick("insert");
		    			break;
		    		}
		    		case 71:{
		    			//按下G建，显示全局变量编辑窗口 added by ls 20230525
		    			thatCE.selectUnitObject(null);
		            	thatCE.editComponentParameters();
		    			break;
		    		}
		    		case 70:{
		    			//按下F建，将当前构件设为居中显示 added by ls 20221208
		                if (thatCE.selectedUnitObject3D != null) {
		                	var object3D = thatCE.selectedUnitObject3D;
		                	thatCE.setCenterObject(object3D);
		                }
		    			break;
		    		}
		    		case 69:{
		    			//按下E建，显示当前构件的参数编辑窗口 added by ls 20230506
		                if (thatCE.selectedUnitObject3D != null) {
		                	var object3D = thatCE.selectedUnitObject3D;
		                	thatCE.editUnitComponentParameters(object3D);
		                }
		    			break;
		    		}
		    		case 77:{
		    			//按下M建，切换到移动模式 added by ls 20230506
		                if (thatCE.selectedUnitObject3D != null) {
		                	thatCE.transformControl.setMode("translate");
		                }
		    			break;
		    		}
		    		case 82:{
		    			//按下R建，切换到旋转模式 added by ls 20230506
		                if (thatCE.selectedUnitObject3D != null) {
		                	thatCE.transformControl.setMode("rotate");
		                }
		    			break;
		    		}
		    		case 46: {
		    			//删除快捷键 added by ls 20210820
		        		thatCE.hideContextMenu();
		                if (thatCE.selectedUnitObject3D != null) {
		                	var object3D = thatCE.selectedUnitObject3D;
		                	thatCE.removeUnitObject3D(object3D);
		                }
		                else if (thatCE.pointCtrlProcessor.selectedPointCtrlObject3D != null) {
		                	var object3D = thatCE.pointCtrlProcessor.selectedPointCtrlObject3D;
		                	thatCE.pointCtrlProcessor.removePointCtrlByObject3D(object3D);
		                }
		                else{
		                	msgBox.alert({info: "请先选中组件."});
		                }
		                break;
		            };
		    		case 67: {
		    			//复制快捷键 added by ls 20210820
		    			if(ev.ctrlKey){
			                if (thatCE.selectedUnitObject3D != null) {
			                	var object3D = thatCE.selectedUnitObject3D;
			                	thatCE.copyObject3D(object3D);
			                }
			                else{
			                	msgBox.alert({info: "请先选中组件."});
			                }
		                }
		    			break;
		            };
		    		case 86: {
		    			//粘贴快捷键 added by ls 20210820
		    			if(ev.ctrlKey){
		    				if(thatCE.clipBoard.unitSetting != null){
		    					var unitSetting = thatCE.clipBoard.unitSetting;
			    				thatCE.mouse3DPosition = {
			    					x: unitSetting.position[0],
			    					y: unitSetting.position[1],
			    					z: unitSetting.position[2]
			    				};
			    				thatCE.pasteObject3D();
			                	msgBox.alert({info: "已粘贴完成. 注意: 新组件与原组件重合."});

		    				}
		    				else{
			                	msgBox.alert({info: "请先执行复制."});
		    				}
		                }
		    			break;
		    		};
		    		case 83: {
		    			//保存快捷键 added by ls 20230615
		    			if(ev.ctrlKey){
		    		        ev.preventDefault(); // 阻止默认保存行为
			        		thatCE.doBtnClick("save");
		                }
		    			break;
		    		};
		    		case 49:
		    		case 50:
		    		case 51:
		    		case 52:
		    		case 53:
		    		case 54:
		    		case 55:
		    		case 56:
		    		case 57:{
		    			//侧边栏快捷键 added by ls 20230615
		    			if(ev.ctrlKey || ev.altKey){
		    		        ev.preventDefault();
		    				var index = parseInt(ev.key) - 1;
			    			if(ev.ctrlKey){
			    				//左侧边栏
			    				thatCE.switchLeftSideVisibleByIndex(index);
			    			}
			    			else if(ev.altKey){
			    				//右侧边栏
			    				thatCE.switchRightSideVisibleByIndex(index);
			    			}
		    			}
		    			break;
		    		}
		    		case 32:{
		    			//空格，继续添加最后一次的构件 added by ls 20230628
		    			if(thatCE.lastAddComponentInfo.code != null){
		    				if(js3CommandProcessors[thatCE.lastAddComponentInfo.code] == null){
		    					js3CommandProcessors[thatCE.lastAddComponentInfo.code] = {
		    						componentCode: thatCE.lastAddComponentInfo.code,
		    						componentVersionNum: thatCE.lastAddComponentInfo.versionNum,
		    						imgId: thatCE.lastAddComponentInfo.imgId,
		    						pointCount: 1,
		    						toStatus: "placeLimit3DPoints"
		    					};
		    				}
		    				thatCE.doBtnClick(thatCE.lastAddComponentInfo.code);
		    			}
		    		}
				}
	    	}
    	}
    }

    this.initExpProcessor = function(){
    	var expProcessor = new M3dExpProcessor();
    	expProcessor.init({core: thatCE});
    	thatCE.expProcessor = expProcessor;

    	$("#" + thatCE.containerId).find(".cmdLineHelperBtn").click(function(ev){
    		thatCE.doBtnClick("bimFunctionHelper");
    	});

    	$("#" + thatCE.containerId).find(".cmdLineRunBtn").click(function(ev){
			thatCE.runUserCommand();
    	});

    	$("#" + thatCE.containerId).find(".core3dFooterContainer").keydown(function(ev){
    		ev.stopPropagation();
            return true;
    	});

    	$("#" + thatCE.containerId).find(".cmdLineInput").keydown(function(ev){
			var inputDom = $("#" + thatCE.containerId).find(".cmdLineInput")[0];
    		if(ev.keyCode == 13){
    			thatCE.runUserCommand();
        		return false;
    		}
    	    //上翻获取倒数第几个历史命令 added by ls 20220905
    		else if(ev.keyCode == 38){
    			$(inputDom).val(thatCE.getLastCmdText(-1));
        		return false;
    		}
    	    //下翻获取倒数第几个历史命令 added by ls 20220905
    		else if(ev.keyCode == 40){
    			$(inputDom).val(thatCE.getLastCmdText(1));
        		return false;
    		}
    		else{
    			ev.stopPropagation();
    			return true;
    		}
    	});
    }

    this.runUserCommand = function(){
		var inputDom = $("#" + thatCE.containerId).find(".cmdLineInput")[0];
		var exp = $(inputDom).val().trim();
    	if(exp.length > 0){
			//更新命令行日志  modified by ls 20220905
			var spanId= "codeSpan_" + cmnPcr.getRandomValue();
			var spanDom = "<div class=\"cmdLogTime\">" + cmnPcr.datetimeToStr(new Date(), "HH:mm:ss") +  "</div><hr class=\"cmdLogHr\" /><span class=\"cmdLogKeyWord\">命令:&nbsp;</span><span class=\"cmdLogCommand\" id=\"" + spanId + "\"></span><br/>";
			$("#" + thatCE.containerId).find(".cmdRunLog").append(spanDom);
			$("#" + spanId).text(exp);
			$("#" + spanId).click(function(){
				var expText = $(this).text();
				$(inputDom).val(expText);
				$(inputDom).focus();
			});
			$(this).val("");
			thatCE.expProcessor.run(exp);

			//重置现在使用的是历史上哪个命令 added by ls 20220905
			$(inputDom).attr("historyIndex", "0");
    	}
    }

    //获取倒数第几个历史命令
    this.getLastCmdText = function(direction){
		var inputDom = $("#" + thatCE.containerId).find(".cmdLineInput")[0];
		var historyIndex = $(inputDom).attr("historyIndex") == null ? 0 : parseInt($(inputDom).attr("historyIndex"));
		var logCmds = $("#" + thatCE.containerId).find(".cmdLogCommand");
		var newHistoryIndex = historyIndex + direction;
		var cmdIndex = logCmds.length + newHistoryIndex;
		var cmdText = "";
		if(cmdIndex < 0){
			cmdText = $(logCmds[0]).text();
			$(inputDom).attr("historyIndex", -logCmds.length);
		}
		else if(cmdIndex >= logCmds.length){
			cmdText = $(logCmds[logCmds.length - 1]).text();
			$(inputDom).attr("historyIndex", 0);
		}
		else{
			cmdText = $(logCmds[cmdIndex]).text();
			$(inputDom).attr("historyIndex", newHistoryIndex);
		}
		return cmdText;
    }

    this.clearCmdLog = function(){
    	$("#" + thatCE.containerId).find(".cmdRunLog").empty();
    }

	this.runJsCode = function(p){
		var result = null;
		var error = null;
		try{
			result = eval(p.jsCode);
		}
		catch(ex){
			error = ex;
		}

		var cmnRunLogDiv = $("#" + thatCE.containerId).find(".cmdRunLog");
		if(error != null){
			var errorHtml = cmnPcr.html_encode(error);
	    	$(cmnRunLogDiv).append( "<span class=\"cmdLogKeyWord\">结果:&nbsp;</span><span class=\"cmdLogResult\">失败 - " + errorHtml + "</span><br/>");
		}
		else{
			var resultStr = thatCE.convertToString(result, p.valueType);
			if(resultStr != null && resultStr.length != 0){
				var resultHtml = cmnPcr.html_encode(resultStr);
		    	$(cmnRunLogDiv).append( "<span class=\"cmdLogKeyWord\">结果:&nbsp;</span><span class=\"cmdLogResult\">" + resultHtml + "</span><br/>");
			}
			else{
		    	$(cmnRunLogDiv).append( "<span class=\"cmdLogKeyWord\">结果:&nbsp;</span><span class=\"cmdLogResult\">(空值)</span><br/>");
			}
		}
        $(cmnRunLogDiv)[0].scrollTop =  $(cmnRunLogDiv)[0].scrollHeight;
        $("#" + thatCE.containerId).find(".cmdLineInput").focus();
	}

	this.convertToString = function(resultValue, valueType){
		if(resultValue === undefined){
			return "(无需返回值)";
		}
		else if(resultValue == null){
			return null;
		}
		else{
			switch(valueType){
				case "string":{
					return resultValue;
				}
				case "decimal":{
					return cmnPcr.decimalToStr(resultValue);
				}
				case "boolean":{
					return cmnPcr.booleanToStr(resultValue);
				}
				case "date":{
					return cmnPcr.datetimeToStr(resultValue, "yyyy-MM-dd HH:mm:ss");
				}
				case "void":{
					return "执行完成, 无返回值";
				}
				default:{
					return vesultValue.toString();
				}
			}
		}
	}

    //命令行执行的返回值 modified by ls 20220905
    this.showCmdInfos = function(messages){
    	var msgHtml = "";
    	for(var i = 0; i < messages.length; i++){
    		var message = messages[i];
    		msgHtml += (( i == 0 ? "" : "; " ) + cmnPcr.html_encode(message));
    	}
		var cmnRunLogDiv = $("#" + thatCE.containerId).find(".cmdRunLog");
    	$(cmnRunLogDiv).append( "<span class=\"cmdLogKeyWord\">结果:&nbsp;</span><span class=\"cmdLogResult\">" + msgHtml + "</span><br/>");
        $(cmnRunLogDiv)[0].scrollTop =  $(cmnRunLogDiv)[0].scrollHeight;
        $("#" + thatCE.containerId).find(".cmdLineInput").focus();
    }

    //设置命令行里的表达式 added by ls 20220905
    this.setCmdText = function(exp){
    	var cmdInput = $("#" + thatCE.containerId).find(".cmdLineInput")[0];
    	$(cmdInput).val(exp);
    	$(cmdInput).focus();
    }

    this.onContextMenu = function(){
    	return false;
    }

    this.get2DPosition = function(vec3d){
    	vec3d.project(thatCE.camera); //1
        var canvasWidth = $("#" + thatCE.containerId).find(".coreContainer").width() ;
        var canvasHeight = $("#" + thatCE.containerId).find(".coreContainer").height() ;
        var result = {
                x: Math.round((0.5 + vec3d.x / 2) * (canvasWidth)),
                y: Math.round((0.5 - vec3d.y / 2) * (canvasHeight))
                /*
                x: Math.round((0.5 + vec3d.x / 2) * (canvasWidth * window.devicePixelRatio)),
                y: Math.round((0.5 - vec3d.y / 2) * (canvasHeight * window.devicePixelRatio))
                */
        };
        return result;
    }

    this.refreshAttachHelpLine2d = function(){
    	//当显示屏弃用缩放功能时，位置计算有问题，暂时屏蔽 added by ls 20221028
    	return;

    	if(thatCE.attachLine2dVisible){
	    	if(thatCE.selectedUnitObject3D != null){
	    		var textRectWidth = 40;
	    		var textRectHeight = 18;
		    	var propertyValues = thatCE.getOtherPropertyValues(thatCE.selectedUnitObject3D);
		    	var posXLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='posX']")[0];
		    	var posXPA = thatCE.get2DPosition(new THREE.Vector3(0, 0, propertyValues.minZ));
		    	var posXPB = thatCE.get2DPosition(new THREE.Vector3(propertyValues.minX, 0, propertyValues.minZ));
		    	posXLine.setAttribute("x1", posXPA.x);
		    	posXLine.setAttribute("y1", posXPA.y);
		    	posXLine.setAttribute("x2", posXPB.x);
		    	posXLine.setAttribute("y2", posXPB.y);
		    	$(posXLine).css({display: "block"});

		    	var posZLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='posZ']")[0];
		    	var posZPA = thatCE.get2DPosition(new THREE.Vector3(propertyValues.minX, 0, 0));
		    	var posZPB = thatCE.get2DPosition(new THREE.Vector3(propertyValues.minX, 0, propertyValues.minZ));
		    	posZLine.setAttribute("x1", posZPA.x);
		    	posZLine.setAttribute("y1", posZPA.y);
		    	posZLine.setAttribute("x2", posZPB.x);
		    	posZLine.setAttribute("y2", posZPB.y);
		    	$(posZLine).css({display: "block"});

		    	var lenXLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='lenX']")[0];
		    	var lenXPA = thatCE.get2DPosition(new THREE.Vector3(propertyValues.minX, 0, propertyValues.minZ));
		    	var lenXPB = thatCE.get2DPosition(new THREE.Vector3(propertyValues.maxX, 0, propertyValues.minZ));
		    	lenXLine.setAttribute("x1", lenXPA.x);
		    	lenXLine.setAttribute("y1", lenXPA.y);
		    	lenXLine.setAttribute("x2", lenXPB.x);
		    	lenXLine.setAttribute("y2", lenXPB.y);
		    	$(lenXLine).css({display: "block"});

		    	var lenZLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='lenZ']")[0];
		    	var lenZPA = thatCE.get2DPosition(new THREE.Vector3(propertyValues.minX, 0, propertyValues.minZ));
		    	var lenZPB = thatCE.get2DPosition(new THREE.Vector3(propertyValues.minX, 0, propertyValues.maxZ));
		    	lenZLine.setAttribute("x1", lenZPA.x);
		    	lenZLine.setAttribute("y1", lenZPA.y);
		    	lenZLine.setAttribute("x2", lenZPB.x);
		    	lenZLine.setAttribute("y2", lenZPB.y);
		    	$(lenZLine).css({display: "block"});

		    	var maxXLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='maxX']")[0];
		    	var maxXPA = thatCE.get2DPosition(new THREE.Vector3(propertyValues.minX, 0, propertyValues.maxZ));
		    	var maxXPB = thatCE.get2DPosition(new THREE.Vector3(propertyValues.maxX, 0, propertyValues.maxZ));
		    	maxXLine.setAttribute("x1", maxXPA.x);
		    	maxXLine.setAttribute("y1", maxXPA.y);
		    	maxXLine.setAttribute("x2", maxXPB.x);
		    	maxXLine.setAttribute("y2", maxXPB.y);
		    	$(maxXLine).css({display: "block"});

		    	var maxZLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='maxZ']")[0];
		    	var maxZPA = thatCE.get2DPosition(new THREE.Vector3(propertyValues.maxX, 0, propertyValues.minZ));
		    	var maxZPB = thatCE.get2DPosition(new THREE.Vector3(propertyValues.maxX, 0, propertyValues.maxZ));
		    	maxZLine.setAttribute("x1", maxZPA.x);
		    	maxZLine.setAttribute("y1", maxZPA.y);
		    	maxZLine.setAttribute("x2", maxZPB.x);
		    	maxZLine.setAttribute("y2", maxZPB.y);
		    	$(maxZLine).css({display: "block"});

		    	var posXLineLen = Math.sqrt((posXPB.x - posXPA.x) * (posXPB.x - posXPA.x) + (posXPB.y - posXPA.y) * (posXPB.y - posXPA.y));
		    	var posXTextCenter = {
	    			x: (posXPB.x + posXPA.x) / 2,
	    			y: (posXPB.y + posXPA.y) / 2
		    	};
		    	var posXArc = posXLineLen == 0 ? 0 : ((posXPB.x > posXPA.x ) ? (Math.asin((posXPB.y - posXPA.y) / posXLineLen) * 180 / Math.PI) : (Math.asin((posXPA.y - posXPB.y) / posXLineLen) * 180 / Math.PI));
		    	var posXText = $("#" + thatCE.containerId).find(".attachHelpText[name='posX']")[0];
		    	$(posXText).css({display: posXLineLen > textRectWidth ? "block" : "none"});
		    	posXText.setAttribute("x", posXTextCenter.x );
		    	posXText.setAttribute("y", posXTextCenter.y );
		    	posXText.setAttribute("transform", "rotate("+posXArc+","+posXTextCenter.x+","+posXTextCenter.y+")");
		    	posXText.textContent = thatCE.getDisplayValueStr(propertyValues.minX);

		    	var posZLineLen = Math.sqrt((posZPB.x - posZPA.x) * (posZPB.x - posZPA.x) + (posZPB.y - posZPA.y) * (posZPB.y - posZPA.y));
		    	var posZTextCenter = {
	    			x: (posZPB.x + posZPA.x) / 2,
	    			y: (posZPB.y + posZPA.y) / 2
		    	};
		    	var posZArc = posZLineLen == 0 ? 0: ((posZPB.x > posZPA.x ) ? (Math.asin((posZPB.y - posZPA.y) / posZLineLen) * 180 / Math.PI) : (Math.asin((posZPA.y - posZPB.y) / posZLineLen) * 180 / Math.PI));
		    	var posZText = $("#" + thatCE.containerId).find(".attachHelpText[name='posZ']")[0];
		    	$(posZText).css({display: posZLineLen > textRectWidth ? "block" : "none"});
		    	posZText.setAttribute("x", posZTextCenter.x );
		    	posZText.setAttribute("y", posZTextCenter.y );
		    	posZText.setAttribute("transform", "rotate("+posZArc+","+posZTextCenter.x+","+posZTextCenter.y+")");
		    	posZText.textContent = thatCE.getDisplayValueStr(propertyValues.minZ);

		    	var lenXLineLen = Math.sqrt((lenXPB.x - lenXPA.x) * (lenXPB.x - lenXPA.x) + (lenXPB.y - lenXPA.y) * (lenXPB.y - lenXPA.y));
		    	var lenXTextCenter = {
	    			x: (lenXPB.x + lenXPA.x) / 2,
	    			y: (lenXPB.y + lenXPA.y) / 2
		    	};
		    	var lenXArc = lenXLineLen == 0 ? 0 : ((lenXPB.x > lenXPA.x ) ? (Math.asin((lenXPB.y - lenXPA.y) / lenXLineLen) * 180 / Math.PI) : (Math.asin((lenXPA.y - lenXPB.y) / lenXLineLen) * 180 / Math.PI));
		    	var lenXText = $("#" + thatCE.containerId).find(".attachHelpText[name='lenX']")[0];
		    	$(lenXText).css({display: lenXLineLen > textRectWidth ? "block" : "none"});
		    	lenXText.setAttribute("x", lenXTextCenter.x );
		    	lenXText.setAttribute("y", lenXTextCenter.y );
		    	lenXText.setAttribute("transform", "rotate("+lenXArc+","+lenXTextCenter.x+","+ lenXTextCenter.y+")");
		    	lenXText.textContent = thatCE.getDisplayValueStr(propertyValues.lenX);

		    	var lenZLineLen = Math.sqrt((lenZPB.x - lenZPA.x) * (lenZPB.x - lenZPA.x) + (lenZPB.y - lenZPA.y) * (lenZPB.y - lenZPA.y));
		    	var lenZTextCenter = {
	    			x: (lenZPB.x + lenZPA.x) / 2,
	    			y: (lenZPB.y + lenZPA.y) / 2
		    	};
		    	var lenZArc = lenZLineLen == 0 ? 0 : ((lenZPB.x > lenZPA.x ) ? (Math.asin((lenZPB.y - lenZPA.y) / lenZLineLen) * 180 / Math.PI) : (Math.asin((lenZPA.y - lenZPB.y) / lenZLineLen) * 180 / Math.PI));
		    	var lenZText = $("#" + thatCE.containerId).find(".attachHelpText[name='lenZ']")[0];
		    	$(lenZText).css({display: lenZLineLen > textRectWidth ? "block" : "none"});
		    	lenZText.setAttribute("x", lenZTextCenter.x );
		    	lenZText.setAttribute("y", lenZTextCenter.y );
		    	lenZText.setAttribute("transform", "rotate("+lenZArc+","+lenZTextCenter.x+","+ lenZTextCenter.y+")");
		    	lenZText.textContent = thatCE.getDisplayValueStr(propertyValues.lenZ);

		    	var posXRect = $("#" + thatCE.containerId).find(".attachHelpRect[name='posX']")[0];
		    	$(posXRect).css({display: posXLineLen > textRectWidth ? "block" : "none"});
		    	posXRect.setAttribute("x", posXTextCenter.x - textRectWidth /2 );
		    	posXRect.setAttribute("y", posXTextCenter.y - textRectHeight /2 );
		    	posXRect.setAttribute("transform", "rotate("+posXArc+","+posXTextCenter.x+","+posXTextCenter.y+")");

		    	var posZRect = $("#" + thatCE.containerId).find(".attachHelpRect[name='posZ']")[0];
		    	$(posZRect).css({display: posZLineLen > textRectWidth ? "block" : "none"});
		    	posZRect.setAttribute("x", posZTextCenter.x - textRectWidth /2 );
		    	posZRect.setAttribute("y", posZTextCenter.y - textRectHeight /2 );
		    	posZRect.setAttribute("transform", "rotate("+posZArc+","+posZTextCenter.x+","+posZTextCenter.y+")");

		    	var lenXRect = $("#" + thatCE.containerId).find(".attachHelpRect[name='lenX']")[0];
		    	$(lenXRect).css({display: lenXLineLen > textRectWidth ? "block" : "none"});
		    	lenXRect.setAttribute("x", lenXTextCenter.x - textRectWidth /2 );
		    	lenXRect.setAttribute("y", lenXTextCenter.y - textRectHeight /2 );
		    	lenXRect.setAttribute("transform", "rotate("+lenXArc+","+lenXTextCenter.x+","+lenXTextCenter.y+")");

		    	var lenZRect = $("#" + thatCE.containerId).find(".attachHelpRect[name='lenZ']")[0];
		    	$(lenZRect).css({display: lenZLineLen > textRectWidth ? "block" : "none"});
		    	lenZRect.setAttribute("x", lenZTextCenter.x - textRectWidth /2 );
		    	lenZRect.setAttribute("y", lenZTextCenter.y - textRectHeight /2 );
		    	lenZRect.setAttribute("transform", "rotate("+lenZArc+","+lenZTextCenter.x+","+lenZTextCenter.y+")");
	    	}
	    	else{
		    	var posXLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='posX']")[0];
		    	$(posXLine).css({display: "none"});

		    	var posZLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='posZ']")[0];
		    	$(posZLine).css({display: "none"});

		    	var lenXLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='lenX']")[0];
		    	$(lenXLine).css({display: "none"});

		    	var lenZLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='lenZ']")[0];
		    	$(lenZLine).css({display: "none"});

		    	var maxXLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='maxX']")[0];
		    	$(maxXLine).css({display: "none"});

		    	var maxZLine = $("#" + thatCE.containerId).find(".attachHelpLine[name='maxZ']")[0];
		    	$(maxZLine).css({display: "none"});

		    	var posXText = $("#" + thatCE.containerId).find(".attachHelpText[name='posX']")[0];
		    	$(posXText).css({display: "none"});

		    	var posZText = $("#" + thatCE.containerId).find(".attachHelpText[name='posZ']")[0];
		    	$(posZText).css({display: "none"});

		    	var lenXText = $("#" + thatCE.containerId).find(".attachHelpText[name='lenX']")[0];
		    	$(lenXText).css({display: "none"});

		    	var lenZText = $("#" + thatCE.containerId).find(".attachHelpText[name='lenZ']")[0];
		    	$(lenZText).css({display: "none"});

		    	var posXRect = $("#" + thatCE.containerId).find(".attachHelpRect[name='posX']")[0];
		    	$(posXRect).css({display: "none"});

		    	var posZRect = $("#" + thatCE.containerId).find(".attachHelpRect[name='posZ']")[0];
		    	$(posZRect).css({display: "none"});

		    	var lenXRect = $("#" + thatCE.containerId).find(".attachHelpRect[name='lenX']")[0];
		    	$(lenXRect).css({display: "none"});

		    	var lenZRect = $("#" + thatCE.containerId).find(".attachHelpRect[name='lenZ']")[0];
		    	$(lenZRect).css({display: "none"});
	    	}
    	}
    }

    this.refreshDrawHelpLine2D = function(fromPoint, toPoint){
    	if(fromPoint != null){
    		var textRectWidth = 40;
    		var textRectHeight = 18;
	    	var fromPoint2D = thatCE.get2DPosition(new THREE.Vector3(fromPoint.x, fromPoint.y, fromPoint.z));
	    	var toPoint2D = thatCE.get2DPosition(new THREE.Vector3(toPoint.x, toPoint.y, toPoint.z));

	    	var line3DLen = Math.sqrt((toPoint.x - fromPoint.x) * (toPoint.x - fromPoint.x) + (toPoint.z - fromPoint.z) * (toPoint.z - fromPoint.z));
	    	var line2DLen = Math.sqrt((toPoint2D.x - fromPoint2D.x) * (toPoint2D.x - fromPoint2D.x) + (toPoint2D.y - fromPoint2D.y) * (toPoint2D.y - fromPoint2D.y));
	    	var lineTextCenter = {
    			x: (toPoint2D.x + fromPoint2D.x) / 2,
    			y: (toPoint2D.y + fromPoint2D.y) / 2
	    	};
	    	var line2DArc = line2DLen == 0 ? 0 : ((toPoint2D.x > fromPoint2D.x ) ? (Math.asin((toPoint2D.y - fromPoint2D.y) / line2DLen) * 180 / Math.PI) : (Math.asin((fromPoint2D.y - toPoint2D.y) / line2DLen) * 180 / Math.PI));
	    	var lineLengthText = $("#" + thatCE.containerId).find(".drawHelpText[name='lineLength']")[0];
	    	$(lineLengthText).css({display: line2DLen > textRectWidth ? "block" : "none"});
	    	lineLengthText.setAttribute("x", lineTextCenter.x );
	    	lineLengthText.setAttribute("y", lineTextCenter.y );
	    	lineLengthText.setAttribute("transform", "rotate(" + line2DArc + "," + lineTextCenter.x + "," + lineTextCenter.y + ")");
	    	lineLengthText.textContent = thatCE.getDisplayValueStr(line3DLen);

	    	var line2DRect = $("#" + thatCE.containerId).find(".drawHelpRect[name='lineLength']")[0];
	    	$(line2DRect).css({display: line2DLen > textRectWidth ? "block" : "none"});
	    	line2DRect.setAttribute("x", lineTextCenter.x - textRectWidth /2 );
	    	line2DRect.setAttribute("y", lineTextCenter.y - textRectHeight /2 );
	    	line2DRect.setAttribute("transform", "rotate(" + line2DArc + "," + lineTextCenter.x + "," + lineTextCenter.y + ")");
    	}
    	else{
    		var lineLengthText = $("#" + thatCE.containerId).find(".drawHelpText[name='lineLength']")[0];
	    	$(lineLengthText).css({display: "none"});

	    	var line2DRect = $("#" + thatCE.containerId).find(".drawHelpRect[name='lineLength']")[0];
	    	$(line2DRect).css({display: "none"});
    	}
    }

    this.refreshRuler3D = function(fromPoint, toPoint){
    	if(fromPoint != null && toPoint != null){
    		var textRectWidth = 70;
    		var textRectHeight = 18;
	    	var fromPoint2D = thatCE.get2DPosition(new THREE.Vector3(fromPoint.x, fromPoint.y, fromPoint.z));
	    	var toPoint2D = thatCE.get2DPosition(new THREE.Vector3(toPoint.x, toPoint.y, toPoint.z));

	    	var line3DLen = Math.sqrt((toPoint.x - fromPoint.x) * (toPoint.x - fromPoint.x) + (toPoint.y - fromPoint.y) * (toPoint.y - fromPoint.y) + (toPoint.z - fromPoint.z) * (toPoint.z - fromPoint.z));
	    	var line2DLen = Math.sqrt((toPoint2D.x - fromPoint2D.x) * (toPoint2D.x - fromPoint2D.x) + (toPoint2D.y - fromPoint2D.y) * (toPoint2D.y - fromPoint2D.y));

	    	var lineTextCenter = {
    			x: (toPoint2D.x + fromPoint2D.x) / 2,
    			y: (toPoint2D.y + fromPoint2D.y) / 2
	    	};
	    	var line2DArc = line2DLen == 0 ? 0 : ((toPoint2D.x > fromPoint2D.x ) ? (Math.asin((toPoint2D.y - fromPoint2D.y) / line2DLen) * 180 / Math.PI) : (Math.asin((fromPoint2D.y - toPoint2D.y) / line2DLen) * 180 / Math.PI));
	    	var rulerText = $("#" + thatCE.containerId).find(".rulerText[name='rulerText']")[0];
	    	$(rulerText).css({display: line2DLen > textRectWidth ? "block" : "none"});
	    	rulerText.setAttribute("x", lineTextCenter.x );
	    	rulerText.setAttribute("y", lineTextCenter.y );
	    	rulerText.setAttribute("transform", "rotate(" + line2DArc + "," + lineTextCenter.x + "," + lineTextCenter.y + ")");
	    	rulerText.textContent = "测距:" + thatCE.getDisplayValueStr(line3DLen);

	    	var rulerRect = $("#" + thatCE.containerId).find(".rulerRect[name='rulerRect']")[0];
	    	$(rulerRect).css({display: line2DLen > textRectWidth ? "block" : "none"});
	    	rulerRect.setAttribute("x", lineTextCenter.x - textRectWidth /2 );
	    	rulerRect.setAttribute("y", lineTextCenter.y - textRectHeight /2 );
	    	rulerRect.setAttribute("transform", "rotate(" + line2DArc + "," + lineTextCenter.x + "," + lineTextCenter.y + ")");
    	}
    	else{
    		var rulerText = $("#" + thatCE.containerId).find(".rulerRect[name='rulerRect']")[0];
	    	$(rulerText).css({display: "none"});

	    	var rulerRect = $("#" + thatCE.containerId).find(".rulerText[name='rulerText']")[0];
	    	$(rulerRect).css({display: "none"});
    	}
    }

    this.getAngleByThreePoints = function(fromPoint, crossPoint, toPoint){
        var abx = fromPoint.x - crossPoint.x;
        var abz = fromPoint.z - crossPoint.z;
        var cbx = toPoint.x - crossPoint.x;
        var cbz = toPoint.z - crossPoint.z;
        var abMulCb = abx * cbx + abz * cbz;
        var distAb = Math.sqrt(abx * abx + abz * abz);
        var distCd = Math.sqrt(cbx * cbx + cbz * cbz);
        var cosValue = abMulCb / (distAb * distCd);
        return Math.round(Math.acos(cosValue) * 180 * 100 / Math.PI) / 100;
    }

    this.refreshDrawHelpArc2D = function(fromPoint, crossPoint, toPoint){
    	if(fromPoint != null && crossPoint != null){
    		var textRectWidth = 40;
    		var textRectHeight = 18;

    		var angleDegree = thatCE.getAngleByThreePoints(fromPoint, crossPoint, toPoint);

	    	var fromPoint2D = thatCE.get2DPosition(new THREE.Vector3(fromPoint.x, fromPoint.y, fromPoint.z));
	    	var crossPoint2D = thatCE.get2DPosition(new THREE.Vector3(crossPoint.x, crossPoint.y, crossPoint.z));
	    	var toPoint2D = thatCE.get2DPosition(new THREE.Vector3(toPoint.x, toPoint.y, toPoint.z));

 	    	var arc2DRect = $("#" + thatCE.containerId).find(".drawHelpArcRect[name='arcDegree']")[0];
	    	$(arc2DRect).css({display: Math.round(angleDegree) > 0 ? "block" : "none"});
	    	arc2DRect.setAttribute("x", crossPoint2D.x - textRectWidth /2 );
	    	arc2DRect.setAttribute("y", crossPoint2D.y - textRectHeight /2 );
 	    	var arc2DText = $("#" + thatCE.containerId).find(".drawHelpArcText[name='arcDegree']")[0];
	    	$(arc2DText).css({display: Math.round(angleDegree) > 0 ? "block" : "none"});
	    	arc2DText.setAttribute("x", crossPoint2D.x );
	    	arc2DText.setAttribute("y", crossPoint2D.y );
	    	arc2DText.textContent = angleDegree + "°";
    	}
    	else{
    		var arc2DRect = $("#" + thatCE.containerId).find(".drawHelpArcRect[name='arcDegree']")[0];
	    	$(arc2DRect).css({display: "none"});
    		var arc2DText = $("#" + thatCE.containerId).find(".drawHelpArcText[name='arcDegree']")[0];
	    	$(arc2DText).css({display: "none"});
    	}
    }

    this.initDrawHelpLine2dHtml = function(containerElement){
    	var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svgElement.setAttribute("version", "1.1");
		svgElement.setAttribute("width", "100%");
		svgElement.setAttribute("height", "100%");
		svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

		//长度
    	var rectLengthDom = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    	rectLengthDom.setAttribute("name", "lineLength");
    	rectLengthDom.setAttribute("x", 100);
    	rectLengthDom.setAttribute("y", 100);
    	rectLengthDom.setAttribute("class", "drawHelpRect");
    	rectLengthDom.setAttribute("is2D", "true");
    	rectLengthDom.textContent = "";
    	svgElement.appendChild(rectLengthDom);
    	var textLengthDom = document.createElementNS("http://www.w3.org/2000/svg", "text");
    	textLengthDom.setAttribute("name", "lineLength");
    	textLengthDom.setAttribute("x", 100);
    	textLengthDom.setAttribute("y", 100);
    	textLengthDom.setAttribute("class", "drawHelpText");
    	textLengthDom.setAttribute("is2D", "true");
    	textLengthDom.textContent = "";
    	svgElement.appendChild(textLengthDom);

    	//弧度
    	var rectArcDom = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    	rectArcDom.setAttribute("name", "arcDegree");
    	rectArcDom.setAttribute("x", 100);
    	rectArcDom.setAttribute("y", 100);
    	rectArcDom.setAttribute("class", "drawHelpArcRect");
    	rectArcDom.setAttribute("is2D", "true");
    	rectArcDom.textContent = "";
    	svgElement.appendChild(rectArcDom);
    	var textArcDom = document.createElementNS("http://www.w3.org/2000/svg", "text");
    	textArcDom.setAttribute("name", "arcDegree");
    	textArcDom.setAttribute("x", 100);
    	textArcDom.setAttribute("y", 100);
    	textArcDom.setAttribute("class", "drawHelpArcText");
    	textArcDom.setAttribute("is2D", "true");
    	textArcDom.textContent = "";
    	svgElement.appendChild(textArcDom);

    	containerElement.appendChild(svgElement);
    }

    this.initAttachHelpLine2dHtml = function(containerElement){
    	var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svgElement.setAttribute("version", "1.1");
		svgElement.setAttribute("width", "100%");
		svgElement.setAttribute("height", "100%");
		svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    	var linePosXDom = document.createElementNS("http://www.w3.org/2000/svg", "line");
    	linePosXDom.setAttribute("name", "posX");
    	linePosXDom.setAttribute("x1", 0);
    	linePosXDom.setAttribute("y1", 0);
    	linePosXDom.setAttribute("x2", 300);
    	linePosXDom.setAttribute("y2", 300);
    	linePosXDom.setAttribute("class", "attachHelpLine");
    	svgElement.appendChild(linePosXDom);

    	var linePosZDom = document.createElementNS("http://www.w3.org/2000/svg", "line");
    	linePosZDom.setAttribute("name", "posZ");
    	linePosZDom.setAttribute("x1", 0);
    	linePosZDom.setAttribute("y1", 0);
    	linePosZDom.setAttribute("x2", 300);
    	linePosZDom.setAttribute("y2", 300);
    	linePosZDom.setAttribute("class", "attachHelpLine");
    	svgElement.appendChild(linePosZDom);

    	var lineLenXDom = document.createElementNS("http://www.w3.org/2000/svg", "line");
    	lineLenXDom.setAttribute("name", "lenX");
    	lineLenXDom.setAttribute("x1", 0);
    	lineLenXDom.setAttribute("y1", 0);
    	lineLenXDom.setAttribute("x2", 300);
    	lineLenXDom.setAttribute("y2", 300);
    	lineLenXDom.setAttribute("class", "attachHelpLine");
    	svgElement.appendChild(lineLenXDom);

    	var lineLenZDom = document.createElementNS("http://www.w3.org/2000/svg", "line");
    	lineLenZDom.setAttribute("name", "lenZ");
    	lineLenZDom.setAttribute("x1", 0);
    	lineLenZDom.setAttribute("y1", 0);
    	lineLenZDom.setAttribute("x2", 300);
    	lineLenZDom.setAttribute("y2", 300);
    	lineLenZDom.setAttribute("class", "attachHelpLine")
    	svgElement.appendChild(lineLenZDom);

    	var lineMaxXDom = document.createElementNS("http://www.w3.org/2000/svg", "line");
    	lineMaxXDom.setAttribute("name", "maxX");
    	lineMaxXDom.setAttribute("x1", 0);
    	lineMaxXDom.setAttribute("y1", 0);
    	lineMaxXDom.setAttribute("x2", 300);
    	lineMaxXDom.setAttribute("y2", 300);
    	lineMaxXDom.setAttribute("class", "attachHelpLine");
    	svgElement.appendChild(lineMaxXDom);

    	var lineMaxZDom = document.createElementNS("http://www.w3.org/2000/svg", "line");
    	lineMaxZDom.setAttribute("name", "maxZ");
    	lineMaxZDom.setAttribute("x1", 0);
    	lineMaxZDom.setAttribute("y1", 0);
    	lineMaxZDom.setAttribute("x2", 300);
    	lineMaxZDom.setAttribute("y2", 300);
    	lineMaxZDom.setAttribute("class", "attachHelpLine")
    	svgElement.appendChild(lineMaxZDom);

    	var rectPosXDom = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    	rectPosXDom.setAttribute("name", "posX");
    	rectPosXDom.setAttribute("x", 100);
    	rectPosXDom.setAttribute("y", 100);
    	rectPosXDom.setAttribute("class", "attachHelpRect");
    	rectPosXDom.setAttribute("is2D", "true");
    	rectPosXDom.textContent = "";
    	svgElement.appendChild(rectPosXDom);

    	var rectPosZDom = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    	rectPosZDom.setAttribute("name", "posZ");
    	rectPosZDom.setAttribute("x", 100);
    	rectPosZDom.setAttribute("y", 100);
    	rectPosZDom.setAttribute("class", "attachHelpRect");
    	rectPosZDom.setAttribute("is2D", "true");
    	rectPosZDom.textContent = "";
    	svgElement.appendChild(rectPosZDom);

    	var rectLenXDom = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    	rectLenXDom.setAttribute("name", "lenX");
    	rectLenXDom.setAttribute("x", 100);
    	rectLenXDom.setAttribute("y", 100);
    	rectLenXDom.setAttribute("class", "attachHelpRect attachHelpReadonlyRect");
    	rectLenXDom.textContent = "";
    	svgElement.appendChild(rectLenXDom);

    	var rectLenZDom = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    	rectLenZDom.setAttribute("name", "lenZ");
    	rectLenZDom.setAttribute("x", 100);
    	rectLenZDom.setAttribute("y", 100);
    	rectLenZDom.setAttribute("class", "attachHelpRect attachHelpReadonlyRect");
    	rectLenZDom.textContent = "";
    	svgElement.appendChild(rectLenZDom);

    	var textPosXDom = document.createElementNS("http://www.w3.org/2000/svg", "text");
    	textPosXDom.setAttribute("name", "posX");
    	textPosXDom.setAttribute("x", 100);
    	textPosXDom.setAttribute("y", 100);
    	textPosXDom.setAttribute("class", "attachHelpText");
    	textPosXDom.setAttribute("is2D", "true");
    	textPosXDom.textContent = "";
    	svgElement.appendChild(textPosXDom);

    	var textPosZDom = document.createElementNS("http://www.w3.org/2000/svg", "text");
    	textPosZDom.setAttribute("name", "posZ");
    	textPosZDom.setAttribute("x", 100);
    	textPosZDom.setAttribute("y", 100);
    	textPosZDom.setAttribute("class", "attachHelpText");
    	textPosZDom.setAttribute("is2D", "true");
    	textPosZDom.textContent = "";
    	svgElement.appendChild(textPosZDom);

    	var textLenXDom = document.createElementNS("http://www.w3.org/2000/svg", "text");
    	textLenXDom.setAttribute("name", "lenX");
    	textLenXDom.setAttribute("x", 100);
    	textLenXDom.setAttribute("y", 100);
    	textLenXDom.setAttribute("class", "attachHelpText attachHelpReadonlyText");
    	textLenXDom.textContent = "";
    	svgElement.appendChild(textLenXDom);

    	var textLenZDom = document.createElementNS("http://www.w3.org/2000/svg", "text");
    	textLenZDom.setAttribute("name", "lenZ");
    	textLenZDom.setAttribute("x", 100);
    	textLenZDom.setAttribute("y", 100);
    	textLenZDom.setAttribute("class", "attachHelpText attachHelpReadonlyText");
    	textLenZDom.textContent = "";
    	svgElement.appendChild(textLenZDom);

    	containerElement.appendChild(svgElement);


    	$("#" + thatCE.containerId).find(".popPosSettingBackground").click(function(){
			thatCE.closePopPosEditor();
    	});
    	$("#" + thatCE.containerId).find(".popPosSettingInput").keydown(function(ev){
    		switch(ev.keyCode){
	    		case 13:{
	    			if(thatCE.selectedUnitObject3D != null){
		    			if(thatCE.unitPopChangePos()){
		        			thatCE.closePopPosEditor();
		    			}
	    			}
	    			else if(thatCE.pointCtrlProcessor.selectedPointCtrlObject3D != null){
		    			if(thatCE.pointCtrlProcessor.pointCtrlPopChangePos()){
		        			thatCE.closePopPosEditor();
		    			}
	    			}
	        		break;
	    		}
	    		case 27:{
	    			thatCE.closePopPosEditor();
	    			break;
	    		}
			}
    	});

    	$("#" + thatCE.containerId).find(".popLengthSettingBackground").click(function(){
			thatCE.closePopLengthEditor();
    	});
    	$("#" + thatCE.containerId).find(".popLengthSettingInput").keydown(function(ev){
    		switch(ev.keyCode){
	    		case 13:{
	    			if(thatCE.popChangeLength()){
	        			thatCE.closePopLengthEditor();
	    			}
	        		break;
	    		}
	    		case 27:{
	    			thatCE.closePopLengthEditor();
	    			break;
	    		}
			}
    	});
    }

    this.initRuler2dHtml = function(containerElement){
    	var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svgElement.setAttribute("version", "1.1");
		svgElement.setAttribute("width", "100%");
		svgElement.setAttribute("height", "100%");
		svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    	var rulerRectDom = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    	rulerRectDom.setAttribute("name", "rulerRect");
    	rulerRectDom.setAttribute("x", 100);
    	rulerRectDom.setAttribute("y", 100);
    	rulerRectDom.setAttribute("class", "rulerRect");
    	rulerRectDom.textContent = "";
    	svgElement.appendChild(rulerRectDom);

    	var rulerTextDom = document.createElementNS("http://www.w3.org/2000/svg", "text");
    	rulerTextDom.setAttribute("name", "rulerText");
    	rulerTextDom.setAttribute("x", 100);
    	rulerTextDom.setAttribute("y", 100);
    	rulerTextDom.setAttribute("class", "rulerText");
    	rulerTextDom.setAttribute("is2D", "true");
    	rulerTextDom.textContent = "";
    	svgElement.appendChild(rulerTextDom);

    	containerElement.appendChild(svgElement);
    }

    this.unitPopChangePos = function(){
    	var inputElemnt = $("#" + thatCE.containerId).find(".popPosSettingInput");
    	var newValue = $(inputElemnt).val().trim();
		if(newValue.length != 0){
			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
			if(!isNaN(newDecimalValue)){
				var object3D = thatCE.selectedUnitObject3D;
		    	var posName = $(inputElemnt).attr("posName");
				var newPos = [object3D.position.x, object3D.position.y, object3D.position.z];
    	        var box = new THREE.Box3().setFromObject(object3D, true);
    			if(posName == "posX"){
					var canReValue = object3D.unitData.positionExps.posX == null && object3D.unitData.positionExps.minX == null && object3D.unitData.positionExps.maxX == null;
					if(canReValue){
	    				var newMinX = newDecimalValue;
	    				var lenX = Math.abs(box.max.x - box.min.x);
	    				newPos[0] = newMinX + lenX / 2;
					}
    			}
    			else if(posName == "posZ"){
					var canReValue = object3D.unitData.positionExps.posZ == null && object3D.unitData.positionExps.minZ == null && object3D.unitData.positionExps.maxZ == null;
					if(canReValue){
	    				var newMinZ = newDecimalValue;
	    				var lenZ = Math.abs(box.max.z - box.min.z);
	    				newPos[2] = newMinZ + lenZ / 2;
					}
    			}
    	        object3D.position.set(newPos[0], newPos[1], newPos[2]);
    	     	thatCE.refreshUnitPropertyValues(object3D);

    	        //当object3D的位置旋转角度改变时 added by ls 20221208
    	        thatCE.afterObject3DPositionRotationChanged(object3D);

    			thatCE.attachTransformControl(object3D);
    	       	thatCE.refreshAttachHelpLine2d();
    	       	return true;
			}
			else{
				msgBox.alert({info: "请输入数值."});
			}
		}
		return false;
    }

    this.popChangeLength = function(){
    	var inputElemnt = $("#" + thatCE.containerId).find(".popLengthSettingInput");
    	var newValue = $(inputElemnt).val().trim();
		if(newValue.length != 0){
			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
			if(!isNaN(newDecimalValue)){
                var fromPoint = thatCE.placeSettings.placedPoints[thatCE.placeSettings.placedPoints.length - 1].position;
                var toPoint = thatCE.placeSettings.waitingPlacePoint.position;

                var oldLength = Math.sqrt((toPoint.x - fromPoint.x) * (toPoint.x - fromPoint.x) + (toPoint.z - fromPoint.z) * (toPoint.z - fromPoint.z));

                var newX = (toPoint.x - fromPoint.x) * newDecimalValue / oldLength + fromPoint.x;
                var newZ = (toPoint.z - fromPoint.z) * newDecimalValue / oldLength + fromPoint.z;
                var intersectPoint = {x: newX, y: toPoint.y, z: newZ};
                thatCE.placeSettings.waitingPlacePoint.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z);
        		thatCE.movePlace2DPoint(intersectPoint, true);
        		thatCE.createPlace2DPoint(intersectPoint);
    	       	return true;
			}
			else{
				msgBox.alert({info: "请输入数值."});
			}
		}
		return false;
    }

    this.closePopPosEditor = function(){
    	$("#" + thatCE.containerId).find(".attachHelpText").css({display:"block"});
    	$("#" + thatCE.containerId).find(".popPosSettingContainer").css({display: "none"});
    }

    this.closePopLengthEditor = function(){
    	$("#" + thatCE.containerId).find(".drawHelpText").css({display:"block"});
    	$("#" + thatCE.containerId).find(".popLengthSettingContainer").css({display: "none"});
    	$("#" + thatCE.containerId).find(".coreContainer").focus();
    }

    this.showPopPosEditor = function(svgElement){
		var textRectWidth = 40;
		var textRectHeight = 18;
    	var centerX = parseFloat(svgElement.getAttribute("x")) + thatCE.containerPos.x;
    	var centerY = parseFloat(svgElement.getAttribute("y")) + thatCE.containerPos.y;
    	var posName = svgElement.getAttribute("name");
    	var left = centerX - textRectWidth / 2;
    	var top = centerY - textRectHeight / 2;

    	$("#" + thatCE.containerId).find(".attachHelpText[name='" + posName + "']").css({display:"none"});

    	var value = $("#" + thatCE.containerId).find(".attachHelpText[name='" + posName + "']")[0].textContent;
    	$("#" + thatCE.containerId).find(".popPosSettingInput").val(value);


    	$("#" + thatCE.containerId).find(".popPosSettingInputContainer").css({left: left + "px", top: top + "px"});
    	$("#" + thatCE.containerId).find(".popPosSettingContainer").css({display: "block"});
    	$("#" + thatCE.containerId).find(".popPosSettingInput").attr("posName", posName);

    	$("#" + thatCE.containerId).find(".popPosSettingInput").select();
    }

    this.showPopLengthditor = function(){
    	var lineLengthElement = $("#" + thatCE.containerId).find(".drawHelpText[name='lineLength']")[0];
    	if($(lineLengthElement).css("display") == "block"){
			var textRectWidth = 40;
			var textRectHeight = 18;
	    	var centerX = parseFloat(lineLengthElement.getAttribute("x")) + thatCE.containerPos.x;
	    	var centerY = parseFloat(lineLengthElement.getAttribute("y")) + thatCE.containerPos.y;
	    	var posName = lineLengthElement.getAttribute("name");
	    	var left = centerX - textRectWidth / 2;
	    	var top = centerY - textRectHeight / 2;

	    	$("#" + thatCE.containerId).find(".drawHelpText[name='" + posName + "']").css({display:"none"});

	    	var value = $("#" + thatCE.containerId).find(".drawHelpText[name='" + posName + "']")[0].textContent;

	    	$("#" + thatCE.containerId).find(".popLengthSettingInputContainer").css({left: left + "px", top: top + "px"});
	    	$("#" + thatCE.containerId).find(".popLengthSettingContainer").css({display: "block"});
	    	$("#" + thatCE.containerId).find(".popLengthSettingInput").attr("posName", posName);
	    	setTimeout(function(){
	    		$("#" + thatCE.containerId).find(".popLengthSettingInput").val(value);
		    	$("#" + thatCE.containerId).find(".popLengthSettingInput").select();
	    	}, 100);
	    }
    }

    //创建位置显示控件
    this.addAttachHelpLine = function() {
		var attachHelpDiv = document.createElement("div");
		attachHelpDiv.className = "attachHelpLineContainer";
		thatCE.renderer2d.domElement.appendChild( attachHelpDiv );
		thatCE.initAttachHelpLine2dHtml(attachHelpDiv);
    };

    //创建画线标尺显示控件
    this.addDrawHelpLine = function() {
		var drawHelpDiv = document.createElement("div");
		drawHelpDiv.className = "drawHelpLineContainer";
		thatCE.renderer2d.domElement.appendChild( drawHelpDiv );
		thatCE.initDrawHelpLine2dHtml(drawHelpDiv);
    };

    this.initTransformControl = function(componentInfo){
    	componentInfo.controlSize = componentInfo.controlSize == null ? 1 : componentInfo.controlSize;
    	if(thatCE.transformControlVisible){
			var control = new TransformControls(thatCE.camera, thatCE.renderer2d.domElement);
			//control.addEventListener("change", thatCE.transformCtrlChange);
			control.addEventListener("mouseUp", thatCE.transformMouseUp);
			control.addEventListener("objectChange", thatCE.transformDrag);
			control.addEventListener("attachChange", thatCE.transformAttachChange);
			thatCE.scene.add(control);
			thatCE.transformControl = control;
    		thatCE.refreshTransformControlSize();
    	}
    }

    this.attachTransformControl = function(object3D){
    	if(thatCE.transformControlVisible){
    		if(object3D.unitData.useWorldPosition || object3D.unitData.useParameterPosition){
        		thatCE.transformControl.detach();

        		//worldPosition组件的控制器 added by ls 20230614
    			thatCE.attachWorldPositionTransformControl(object3D);
    		}
    		else{
	    		thatCE.transformControl.attach(object3D);
	    		thatCE.refreshTransformControlSize();
    		}
    	}
    }

    this.detachTransformControl = function(){
    	if(thatCE.transformControlVisible){
    		thatCE.transformControl.detach();
    		thatCE.detachWorldPositionTransformControl();
    	}
    }

    this.transformAttachChange = function(){
    }

    //绑定worldPosition组件的控制器 added by ls 20230614
    this.attachWorldPositionTransformControl = function(object3D){
    	var unitData = object3D.unitData;
		var refComponentInfo = thatCE.getRefComponentInfo(unitData.code, unitData.versionNum);
		var locationTypeParameter = refComponentInfo.init.locationType.parameter;
		if(locationTypeParameter != null && locationTypeParameter.length > 0){
			thatCE.placeModifySettings.placedPoints = [];
			thatCE.placeModifySettings.placedLines = [];
			thatCE.placeModifySettings.waitingPlacePointIndex = null;
			thatCE.placeModifySettings.waitingPlaceFromLineIndex = null;
			thatCE.placeModifySettings.waitingPlaceToLineIndex = null;
			thatCE.placeModifySettings.drawingPlacePoint = false;

	    	var paramValue = object3D.unitData.parameters[locationTypeParameter].value;
	    	var points = expGeometry.getXYZs(paramValue);
	    	for(var i = 0; i < points.length; i++){
	    		var point = points[i];
	    		var pointBall = thatCE.createPlaceModifyPointBall({
	    			x: js3CommonFunction.mm2m(point[0]),
	    			y: js3CommonFunction.mm2m(point[1]),
	    			z: js3CommonFunction.mm2m(point[2])
	    		});
	    		thatCE.placeModifySettings.placedPoints.push(pointBall);
	            thatCE.scene.add(pointBall);
	            if(i > 0){
		    		var beginPoint = points[i - 1];
		    		var endPoint = points[i];
		    		var line = thatCE.createPlaceModifyLine({
		    			x: js3CommonFunction.mm2m(beginPoint[0]),
		    			y: js3CommonFunction.mm2m(beginPoint[1]),
		    			z: js3CommonFunction.mm2m(beginPoint[2])
		    		},{
		    			x: js3CommonFunction.mm2m(endPoint[0]),
		    			y: js3CommonFunction.mm2m(endPoint[1]),
		    			z: js3CommonFunction.mm2m(endPoint[2])
		    		});
		    		thatCE.placeModifySettings.placedLines.push(line);
		            thatCE.scene.add(line);
	            }
	    	}
		}
    }

    this.createPlaceModifyPointBall = function(point){
        var ballGeometry = new THREE.SphereGeometry(thatCE.componentInfo.placePointRadius, 16, 16);
        var ball = new THREE.Mesh(ballGeometry, thatCE.waitingPlaceBallMaterial);
        ball.receiveShadow = false;
        ball.castShadow = false;
        ball.isWpTransCtrlPoint = true;
        ball.isPoint = true;
    	ball.position.set(point.x, point.y, point.z);
        return ball;
    }

    this.createPlaceModifyLine = function(beginPoint, endPoint){
		var lineGeometry = new LineGeometry();
        var pointArr = [beginPoint.x,
                        beginPoint.y,
                        beginPoint.z,
                        endPoint.x,
                        endPoint.y,
                        endPoint.z];
        lineGeometry.setPositions(pointArr);
        var line = new Line2(lineGeometry, thatCE.waitingPlaceLineMaterial);
        line.isWpTransCtrlLine = true;
        return line;
    }

    //取消绑定worldPosition组件的控制器 added by ls 20230614
    this.detachWorldPositionTransformControl = function(){
    	var mainScene = thatCE.getMainScene();
    	var wpTransCtrls = [];
    	for(var i = 0; i < mainScene.children.length; i++){
    		var childObj = mainScene.children[i];
    		if(childObj.isWpTransCtrlLine || childObj.isWpTransCtrlPoint){
    			wpTransCtrls.push(childObj);
    		}
    	}
    	for(var i = 0; i < wpTransCtrls.length; i++){
    		var wpTransCtrl = wpTransCtrls[i];
    		mainScene.remove(wpTransCtrl);
    	}
		thatCE.placeModifySettings.drawingPlacePoint = false;
    	return false;
    }

    this.setCenterObject = function(object3D){
		if(object3D != null){
    		var box = new THREE.Box3().setFromObject(object3D, true);
			var vec3 = [(box.min.x + box.max.x) / 2, (box.min.y + box.max.y) / 2, (box.min.z + box.max.z) / 2];
			var cameraPosition = [thatCE.orbitControl.object.position.x, thatCE.orbitControl.object.position.y, thatCE.orbitControl.object.position.z];
	    	thatCE.setCenter(vec3, cameraPosition, thatCE.orbitControl.object.zoom);
    	}
    }

    this.transformCtrlChange = function(){
    	thatCE.render();
    }

    this.transformMouseUp = function(upEv, sysEv){
		thatCE.refreshAttachHelpLine();

		//取消连接点 added by ls 20221101
		thatCE.refreshObject3DJointBoxes();
    }

    this.transformDrag = function(transformEv, sysEv){
    	var object3D = thatCE.selectedUnitObject3D;
    	if(!sysEv.shiftKey){
	    	if(thatCE.attachLines == null){
	    		thatCE.attachLines = thatCE.getAttachLines(object3D);
	    	}
			var currentPointInfos = thatCE.getOtherPropertyValues(object3D);

	    	var axisName = transformEv.target.axis;
	    	var workPlaneNames = [];
	    	switch(axisName){
		    	case "XZ":{
		    		workPlaneNames.push("xz");
		    		workPlaneNames.push("xy");
		    		workPlaneNames.push("yz");
		    		break;
		    	}
		    	case "X":{
		    		workPlaneNames.push("xz");
		    		workPlaneNames.push("xy");
		    		break;
		    	}
		    	case "Y":{
		    		workPlaneNames.push("yz");
		    		workPlaneNames.push("xy");
		    		break;
		    	}
		    	case "Z":{
		    		workPlaneNames.push("xz");
		    		workPlaneNames.push("yz");
		    		break;
		    	}
	    	}

    		if(object3D.assistPoints == null){
    			//使用边框和中点做吸附
    			//更改获取最近吸附点的方法 modified by ls 20221026
		    	if(axisName == "X"){
		    		var attachValueObj = thatCE.calcNearestCenterValue(thatCE.attachLines.x, [currentPointInfos.minX, currentPointInfos.centerX, currentPointInfos.maxX], currentPointInfos.centerX);
		    		if(attachValueObj.newValue != null){
		    			object3D.position.set(attachValueObj.newValue, object3D.position.y, object3D.position.z);
		    		}
	    			thatCE.refreshAttachHelpLine("X", attachValueObj.helpLineValue, workPlaneNames);
		    	}
		    	else if(axisName == "Y"){
		    		var attachValueObj = thatCE.calcNearestCenterValue(thatCE.attachLines.y, [currentPointInfos.minY, currentPointInfos.centerY, currentPointInfos.maxY], currentPointInfos.centerY);
		    		if(attachValueObj.newValue != null){
		    			object3D.position.set(object3D.position.x, attachValueObj.newValue, object3D.position.z);
		    		}
	    			thatCE.refreshAttachHelpLine("Y", attachValueObj.helpLineValue, workPlaneNames);
		    	}
		    	else if(axisName == "Z" ){
		    		var attachValueObj = thatCE.calcNearestCenterValue(thatCE.attachLines.z, [currentPointInfos.minZ, currentPointInfos.centerZ, currentPointInfos.maxZ], currentPointInfos.centerZ);
		    		if(attachValueObj.newValue != null){
		    			object3D.position.set(object3D.position.x, object3D.position.y, attachValueObj.newValue);
		    		}
	    			thatCE.refreshAttachHelpLine("Z", attachValueObj.helpLineValue, workPlaneNames);
		    	}
		    	else if(axisName == "XZ"){
		    		var attachValueObjX = thatCE.calcNearestCenterValue(thatCE.attachLines.x, [currentPointInfos.minX, currentPointInfos.centerX, currentPointInfos.maxX], currentPointInfos.centerX);
		    		var attachValueObjZ = thatCE.calcNearestCenterValue(thatCE.attachLines.z, [currentPointInfos.minZ, currentPointInfos.centerZ, currentPointInfos.maxZ], currentPointInfos.centerZ);
		    		if(attachValueObjX.newValue != null && attachValueObjZ.newValue != null){
		    			object3D.position.set(attachValueObjX.newValue, object3D.position.y, attachValueObjZ.newValue);
		    		}
		    		else if(attachValueObjX.newValue != null){
		    			object3D.position.set(attachValueObjX.newValue, object3D.position.y, object3D.position.z);
		    		}
		    		else  if(attachValueObjZ.newValue != null){
		    			object3D.position.set(object3D.position.x, object3D.position.y, attachValueObjZ.newValue);
		    		}
	    			thatCE.refreshAttachHelpLine("X", attachValueObjX.helpLineValue, workPlaneNames);
	    			thatCE.refreshAttachHelpLine("Z", attachValueObjZ.helpLineValue, workPlaneNames);
		    	}

		    	//不显示吸附点提示 added by ls 20221101
	    		thatCE.refreshObject3DJointBoxes();
    		}
    		else{
    			var assistInfo = thatCE.getObject3DAssistInfo(object3D);
    			//使用辅助点做吸附 added by ls 20221026
		    	if(axisName == "X"){
		    		var attachValueObj = thatCE.calcNearestCenterValue(thatCE.attachLines.x, assistInfo.assistXs, currentPointInfos.centerX);
		    		if(attachValueObj.newValue != null){
		    			object3D.position.set(attachValueObj.newValue, object3D.position.y, object3D.position.z);
		    		}
	    			thatCE.refreshAttachHelpLine("X", attachValueObj.helpLineValue, workPlaneNames);
		    	}
		    	else if(axisName == "Y"){
		    		var attachValueObj = thatCE.calcNearestCenterValue(thatCE.attachLines.y, assistInfo.assistYs, currentPointInfos.centerY);
		    		if(attachValueObj.newValue != null){
		    			object3D.position.set(object3D.position.x, attachValueObj.newValue, object3D.position.z);
		    		}
	    			thatCE.refreshAttachHelpLine("Y", attachValueObj.helpLineValue, workPlaneNames);
		    	}
		    	else if(axisName == "Z" ){
		    		var attachValueObj = thatCE.calcNearestCenterValue(thatCE.attachLines.z, assistInfo.assistZs, currentPointInfos.centerZ);
		    		if(attachValueObj.newValue != null){
		    			object3D.position.set(object3D.position.x, object3D.position.y, attachValueObj.newValue);
		    		}
	    			thatCE.refreshAttachHelpLine("Z", attachValueObj.helpLineValue, workPlaneNames);
		    	}
		    	else if(axisName == "XZ"){
		    		var attachValueObjX = thatCE.calcNearestCenterValue(thatCE.attachLines.x, assistInfo.assistXs, currentPointInfos.centerX);
		    		var attachValueObjZ = thatCE.calcNearestCenterValue(thatCE.attachLines.z, assistInfo.assistZs, currentPointInfos.centerZ);
		    		if(attachValueObjX.newValue != null && attachValueObjZ.newValue != null){
		    			object3D.position.set(attachValueObjX.newValue, object3D.position.y, attachValueObjZ.newValue);
		    		}
		    		else if(attachValueObjX.newValue != null){
		    			object3D.position.set(attachValueObjX.newValue, object3D.position.y, object3D.position.z);
		    		}
		    		else  if(attachValueObjZ.newValue != null){
		    			object3D.position.set(object3D.position.x, object3D.position.y, attachValueObjZ.newValue);
		    		}
	    			thatCE.refreshAttachHelpLine("X", attachValueObjX.helpLineValue, workPlaneNames);
	    			thatCE.refreshAttachHelpLine("Z", attachValueObjZ.helpLineValue, workPlaneNames);
		    	}
    		}

    	    //判断是否辅助点吸附，如果存在那么显示吸附位置 added by ls 20221101
    		thatCE.refreshObject3DJointBoxes(object3D, thatCE.attachLines.assistValues);
    	}
    	else{
    		thatCE.refreshAttachHelpLine();
	    	//不显示吸附点提示 added by ls 20221101
    		thatCE.refreshObject3DJointBoxes();
    	}

    	var userParameters = thatCE.getComponentExpEditParameters(true, true, true);
    	var ps = {};
    	for(var i = 0; i < userParameters.length; i++){
    		var userParameter = userParameters[i];
    		ps[userParameter.name] = userParameter.value;
    	}

    	//先从object3D.position获取位置，然后计算exp modified by ls 20220607
		var newPosition = [object3D.position.x, object3D.position.y, object3D.position.z];
		var newPos =  thatCE.object3DCreator.getPositionByUnitExpJs(newPosition, object3D.unitData.positionExps, ps, object3D);
       	object3D.position.set(newPos[0], newPos[1], newPos[2]);
       	object3D.unitData.position = [newPos[0], newPos[1], newPos[2]];

    	if(object3D.isUnitObject){
        	thatCE.refreshUnitPropertyValues(object3D);

	        //当object3D的位置旋转角度改变时 added by ls 20221208
	        thatCE.afterObject3DPositionRotationChanged(object3D);
    	}
    	thatCE.refreshAttachHelpLine2d();
    }

    //获取构件辅助点信息 added by ls 20221101
    this.getObject3DAssistInfo = function(object3D){
		var assistXs = new Array();
		var assistYs = new Array();
		var assistZs = new Array();
      	var euler = new THREE.Euler(object3D.rotation.x, object3D.rotation.y, object3D.rotation.z);
      	var shift = object3D.position;
		var assistVertices = new Array();

		//增加辅助点是否为空的判断 added by liyh 20221128
		if(object3D.assistPoints !=null) {
			for (var i = 0; i < object3D.assistPoints.length; i++) {
				var assistPoint = object3D.assistPoints[i];
				var assistVertice = new THREE.Vector3(assistPoint.x, assistPoint.y, assistPoint.z);
				assistVertice.applyEuler(euler);
				assistVertice.x = assistVertice.x + shift.x;
				assistVertice.y = assistVertice.y + shift.y;
				assistVertice.z = assistVertice.z + shift.z;

				//增加记录辅助点类型 added by ls 20230208
				assistVertice.pointType = assistPoint.pointType;

				assistXs.push(assistVertice.x);
				assistYs.push(assistVertice.y);
				assistZs.push(assistVertice.z);
				assistVertices.push(assistVertice);
			}
		}

		return {
			assistXs: assistXs,
			assistYs: assistYs,
			assistZs: assistZs,
			assistVertices: assistVertices
		};
    }

    //判断是否辅助点吸附，形成连接，如果存在那么显示吸附位置 added by ls 20221031
    this.refreshObject3DJointBoxes = function(object3D,  assistValues){

    	//去除历史jointBoxes
		if(thatCE.attachHelpLines.jointBoxes != null){
			for(var i = 0; i < thatCE.attachHelpLines.jointBoxes.length; i++){
				var jointBox = thatCE.attachHelpLines.jointBoxes[i];
	    		thatCE.scene.remove(jointBox);
			}
			thatCE.attachHelpLines.jointBoxes = null;
		}

    	if(object3D != null){
    		thatCE.attachHelpLines.jointBoxes = [];
			var assistInfo = thatCE.getObject3DAssistInfo(object3D);
	    	for(var i = 0; i < assistInfo.assistVertices.length; i++){
	    		var assistVertice = assistInfo.assistVertices[i];
	    		for(var key in assistValues){
	    			var assistValue = assistValues[key];
	    			if(Math.abs(assistVertice.x - assistValue.x) < thatCE.ignoreSize
					&& Math.abs(assistVertice.y - assistValue.y) < thatCE.ignoreSize
					&& Math.abs(assistVertice.z - assistValue.z) < thatCE.ignoreSize){
	    				//显示连接点box
	    		    	var jointSize = thatCE.componentInfo.placePointRadius == null ? 0.01 : thatCE.componentInfo.attachDistance / 2;
	    				var jointBox = new THREE.Mesh(
	    			        new THREE.BoxGeometry(jointSize, jointSize, jointSize),
	    			        thatCE.jointBoxMaterial
	    			    );
	    				jointBox.position.set(assistVertice.x, assistVertice.y, assistVertice.z);
	    				jointBox.isAttachHelpBox = true;
	    				thatCE.scene.add(jointBox);
	    				thatCE.attachHelpLines.jointBoxes.push(jointBox);
	    			}
	    		}
	    	}
    	}
    	else{
    		var a = 1;
    	}
    }

    //获取距离最近的吸附点 modified by ls 20221026
    this.calcNearestCenterValue = function(valueArray, checkValues, centerValue){
    	var attachDistance = thatCE.componentInfo.attachDistance;
    	var biggestValue = 100000;
    	var nearestValue = biggestValue;
    	var helpLineValue = biggestValue;
    	for(var i = 0; i < checkValues.length; i++){
    		var checkValue = checkValues[i];
    		if(checkValue != null){
	        	for(var j = 0; j < valueArray.length; j++){
	        		var value = valueArray[j];
	        		if(Math.abs(value - checkValue) < Math.abs(nearestValue)){
	        			nearestValue = value - checkValue;
	        			helpLineValue = value;
	        		}
	        	}
    		}
    	}
    	var newCenterValue = Math.abs(nearestValue) > attachDistance ? null : (nearestValue + centerValue);
    	return {newValue: newCenterValue, helpLineValue: ( newCenterValue == null ? null : helpLineValue)};
    }

    //获取可吸附的点
    this.getAttachLines = function(object3D){
    	var gridSpace = thatCE.componentInfo.gridSpace;
    	var attachLines = {x: [], y: [], z: [], assistValues: {}};

    	//所有的图元和辅助点
		for(var i = 0; i < thatCE.scene.children.length; i++){
			var childObj3D = thatCE.scene.children[i];
			 if(childObj3D.isUnitObject && object3D != childObj3D){
				if(thatCE.checkIsAssistPoint(childObj3D.unitData.code)){
					//与辅助点的中心点吸附 modified by ls 20230821
					thatCE.addAttachLineValue(attachLines.x, childObj3D.position.x);
					thatCE.addAttachLineValue(attachLines.y, childObj3D.position.y);
					thatCE.addAttachLineValue(attachLines.z, childObj3D.position.z);
				}
				else if(childObj3D.assistPoints != null){
					//如果构件内部包含辅助点 added by ls 20221026
					for(var j = 0; j < childObj3D.assistPoints.length; j++){
						var assistPoint = childObj3D.assistPoints[j];
						var assistVertice = new THREE.Vector3(assistPoint.x, assistPoint.y, assistPoint.z);
						assistVertice.applyMatrix4(childObj3D.matrixWorld);
						thatCE.addAttachLineValue(attachLines.x, assistVertice.x);
						thatCE.addAttachLineValue(attachLines.y, assistVertice.y);
						thatCE.addAttachLineValue(attachLines.z, assistVertice.z);

						//记录辅助点
						var assistPointKey = assistVertice.x + "_" + assistVertice.y + "_" + assistVertice.z;
						if(attachLines.assistValues[assistPointKey] == null){
							attachLines.assistValues[assistPointKey] = {
								x: assistVertice.x,
								y: assistVertice.y,
								z: assistVertice.z
							};
						}
					}
				}
				else{
					//如果构件内部没有定义辅助点，那么按照原来的做法，用其边框和中点作为吸附点
					var pointInfos = thatCE.getOtherPropertyValues(childObj3D);
					thatCE.addAttachLineValue(attachLines.x, pointInfos.minX);
					thatCE.addAttachLineValue(attachLines.x, pointInfos.maxX);
					thatCE.addAttachLineValue(attachLines.y, pointInfos.minY);
					thatCE.addAttachLineValue(attachLines.y, pointInfos.maxY);
					thatCE.addAttachLineValue(attachLines.z, pointInfos.minZ);
					thatCE.addAttachLineValue(attachLines.z, pointInfos.maxZ);

					//位置
					thatCE.addAttachLineValue(attachLines.x, childObj3D.position.x);
					thatCE.addAttachLineValue(attachLines.y, childObj3D.position.y);
					thatCE.addAttachLineValue(attachLines.z, childObj3D.position.z);
				}
			}
		}

		if(thatCE.hasAxes(thatCE.componentInfo)){
			thatCE.addAttachLineValue(attachLines.x, 0);
			thatCE.addAttachLineValue(attachLines.y, 0);
			thatCE.addAttachLineValue(attachLines.z, 0);
			//如果定义了轴网，那么使用轴网吸附
			//修改返回值类型 20221026
	    	var leftAxesValues = thatCE.getAxesPartValues(thatCE.componentInfo.axes.left);
	    	if(leftAxesValues != null){
	    		var lastZ = 0;
	    		for(var i = 0; i < leftAxesValues.length; i++){
	    			lastZ += leftAxesValues[i].value;
					thatCE.addAttachLineValue(attachLines.z, lastZ);
	    		}
	    	}
	    	var rightAxesValues = thatCE.getAxesPartValues(thatCE.componentInfo.axes.right);
	    	if(rightAxesValues != null){
	    		var lastZ = 0;
	    		for(var i = 0; i < rightAxesValues.length; i++){
	    			lastZ += rightAxesValues[i].value;
					thatCE.addAttachLineValue(attachLines.z, lastZ);
	    		}
	    	}
	    	var topAxesValues = thatCE.getAxesPartValues(thatCE.componentInfo.axes.top);
	    	if(topAxesValues != null){
	    		var lastX = 0;
	    		for(var i = 0; i < topAxesValues.length; i++){
	    			lastX += topAxesValues[i].value;
					thatCE.addAttachLineValue(attachLines.x, lastX);
	    		}
	    	}
	    	var bottomAxesValues = thatCE.getAxesPartValues(thatCE.componentInfo.axes.bottom);
	    	if(bottomAxesValues != null){
	    		var lastX = 0;
	    		for(var i = 0; i < bottomAxesValues.length; i++){
	    			lastX += bottomAxesValues[i].value;
					thatCE.addAttachLineValue(attachLines.x, lastX);
	    		}
	    	}
	    	var verticalAxesValues = thatCE.getAxesPartValues(thatCE.componentInfo.axes.vertical);
	    	if(verticalAxesValues != null){
	    		var lastY = 0;
	    		for(var i = 0; i < verticalAxesValues.length; i++){
	    			lastY += verticalAxesValues[i].value;
					thatCE.addAttachLineValue(attachLines.y, lastY);
	    		}
	    	}
		}
		else{
			//如果没有定义轴网，那么按照固定间隔吸附
			var tempX = 0;
			while(tempX <= thatCE.componentInfo.size.x * 5 / 4 ){
				thatCE.addAttachLineValue(attachLines.x, tempX);
				tempX += gridSpace;
			}
			tempX = 0;
			while(tempX >= -thatCE.componentInfo.size.x / 4){
				thatCE.addAttachLineValue(attachLines.x, tempX);
				tempX -= gridSpace;
			}
			thatCE.addAttachLineValue(attachLines.x, thatCE.componentInfo.size.x);

			var tempY = 0;
			while(tempY <= thatCE.componentInfo.size.y * 5 / 4 ){
				thatCE.addAttachLineValue(attachLines.y, tempY);
				tempY += gridSpace;
			}
			tempY = 0;
			while(tempY >= -thatCE.componentInfo.size.y / 4){
				thatCE.addAttachLineValue(attachLines.y, tempY);
				tempY -= gridSpace;
			}
			thatCE.addAttachLineValue(attachLines.y, thatCE.componentInfo.size.y);

			var tempZ = 0;
			while(tempZ <= thatCE.componentInfo.size.z * 5 / 4 ){
				thatCE.addAttachLineValue(attachLines.z, tempZ);
				tempZ += gridSpace;
			}
			tempZ = 0;
			while(tempZ >= -thatCE.componentInfo.size.z / 4){
				thatCE.addAttachLineValue(attachLines.z, tempZ);
				tempZ -= gridSpace;
			}
			thatCE.addAttachLineValue(attachLines.z, thatCE.componentInfo.size.z);
		}

		return attachLines;
    }

    this.addAttachLineValue = function(valueArray, value){
    	//更改精度位0.1毫米 modified by ls 20221026
    	var newValue = thatCE.roundAttachValue(value);
    	if(!valueArray.contains(newValue)){
    		valueArray.push(newValue);
    	}
    }

	//精度位0.1毫米 added by ls 20221031
    this.roundAttachValue = function(value){
    	var newValue = Math.round(value * 10000) / 10000;
    	return newValue;
    }

    /* 场景 */
    this.initScene = function() {
    	thatCE.scene = new THREE.Scene();
		let sphereTexture = new THREE.CubeTextureLoader().setPath(basePath + '/web/design/common/img/sky/gray/');
		thatCE.scene.environment = sphereTexture.load([
			"right.jpg",
			"left.jpg",
			"up.jpg",
			"down.jpg",
			"front.jpg",
			"back.jpg"
		]);
    };

	this.render = function() {
		thatCE.renderer.render( thatCE.scene, thatCE.camera );
	}

    this.initCamera = function() {
        var width = $("#" + thatCE.containerId).find(".coreInnerContainer").width();
        var height = $("#" + thatCE.containerId).find(".coreInnerContainer").height();
        //thatCE.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
		var aspect = width / height;
        thatCE.camera = new THREE.OrthographicCamera( thatCE.frustumSize * aspect / - 2, thatCE.frustumSize * aspect / 2, thatCE.frustumSize / 2, thatCE.frustumSize / - 2, 0.01, 5000);
        //thatCE.camera = new THREE.OrthographicCamera(width / -40, width / 40, height / 40, height / -40 , 0.01, 1000);
        thatCE.camera.position.set(20, 20, 20);
        thatCE.camera.zoom = 100;

        //var axes = new THREE.AxisHelper(30);
        //thatCE.scene.add(axes);
    };

    this.setViewport = function(position, size, zoom){
		thatCE.setCenter([size.x / 2, size.y / 2, size.z / 2], position, zoom);
    }

    this.setViewportByPoint = function(position, target, zoom){
		thatCE.setCenter(target, position, zoom);
    }

    this.setObjectAsCenter = function(object){

    }

    this.setCenter = function(target, position, zoom){
    	thatCE.orbitControl.target0 = new THREE.Vector3(target[0], target[1], target[2]);
    	thatCE.orbitControl.position0 = new THREE.Vector3(position[0], position[1], position[2]);
    	thatCE.orbitControl.zoom0 = zoom;
    	thatCE.orbitControl.reset();
    }

    this.hasSameNameUnit = function(allUnitNameDic, name){
    	return allUnitNameDic[name] ? true : false;
    }

    this.checkHasSameNameUnit = function(unitInfo){
    	var mainScene = thatCE.getMainScene();
    	for(var i = 0; i < mainScene.children.length; i++){
    		var childObj = mainScene.children[i];
    		if(childObj.isUnitObject){
    			if(childObj.unitData.name == unitInfo.name && childObj.unitData.id != unitInfo.id){
    				return true;
    			}
    		}
    	}
    	return false;
    }

    //构造一个不存在的前缀，做分解操作时调用 added by ls 20220606
    this.getNewNamePrefix = function(defaultPrefix){
    	var allUnitNameDic = thatCE.getAllUnitNameDic();
    	var allGroupInfos = thatCE.getAllGroupInfos();
    	var newNamePrefix = defaultPrefix;
    	var noneSamePrefix = false;
    	var i = 0;
    	while(!noneSamePrefix){
    		noneSamePrefix = true;
    		for(var i = 0; i < allGroupInfos.length; i++){
    			var groupInfo = allGroupInfos[i];
    			if(groupInfo.name != newNamePrefix && groupInfo.name.startWith(newNamePrefix)){
    				noneSamePrefix = false;
    				break;
    			}
    		}
    		for(var unitName in allUnitNameDic){
    			if(unitName != newNamePrefix && unitName.startWith(newNamePrefix)){
    				noneSamePrefix = false;
    				break;
    			}
    		}
    		if(!noneSamePrefix){
    			i++;
    			newNamePrefix = defaultPrefix + "_" + i;
    		}
    	}
    	return newNamePrefix;
    }

    this.getNewUnitIdAndName = function(defaultName, namePrefix, excludedNameHash){
    	var time0 = new Date();
    	var newId = thatCE.getGuid();
    	var allUnitNameDic = thatCE.getAllUnitNameDic();
    	var time1 = new Date();
    	var i = 0;
    	var newName = defaultName;
    	while(thatCE.hasSameNameUnit(allUnitNameDic, newName) || (excludedNameHash != null && excludedNameHash[newName])){
    		i++;
    		newName = namePrefix + "_" + i;
    	}
    	var time2 = new Date();
    	return {
    		id: newId,
    		name: newName
    	};
    }

    this.getNewComponentInfo = function(componentInfo, defaultName, mouse3DPosition, rotation){
    	var idAndName = thatCE.getNewUnitIdAndName(defaultName, componentInfo.name);
        var componentSetting = {
        	id: idAndName.id,
        	type: js3ComponentType.model,
        	name: idAndName.name,
        	code: componentInfo.code,
        	versionNum: componentInfo.versionNum,
        	position: [mouse3DPosition.x, mouse3DPosition.y, mouse3DPosition.z],
        	rotation: rotation,
        	materials: []
        };
        return componentSetting;
    }

    //基准面 added ls 20230608
    this.initWorkPlanes = function(componentInfo){
    	//删除原有的基准面
    	thatCE.workPlaneObjects.xy = null;
    	thatCE.workPlaneObjects.yz = null;
    	thatCE.workPlaneObjects.xz = null;
    	var workPlanes = new Array();
    	for(var i = 0; i < thatCE.scene.children.length; i++){
    		var obj = thatCE.scene.children[i];
    		if(obj.isWorkPlane){
    			workPlanes.push(obj);
    		}
    	}
    	for(let i = 0; i < workPlanes.length; i++){
    		var workPlane = workPlanes[i];
    		thatCE.scene.remove(workPlane);
		}

    	//比原有尺寸扩大倍数
    	let planeScale = 1.5;

        var planeMaterial = thatCE.workPlaneMaterial;

    	//xz
    	if(componentInfo.workPlanes.xz.visible){
	    	var xCenter = thatCE.componentInfo.size.x / 2;
	    	var yCenter = thatCE.componentInfo.size.y / 2;
	    	var zCenter = thatCE.componentInfo.size.z / 2;
	    	var sizeX = thatCE.componentInfo.size.x;
	    	var sizeY = thatCE.componentInfo.size.y;
	    	var sizeZ = thatCE.componentInfo.size.z;
	        var planeGeometry = new THREE.PlaneGeometry(sizeX * planeScale, sizeZ * planeScale);
	        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
	        plane.rotation.x = -0.5 * Math.PI;
	        plane.position.set(xCenter, -thatCE.gridZero + componentInfo.workPlanes.xz.position, zCenter);
	        plane.isWorkPlane = true;
	        plane.receiveShadow = thatCE.hasShadow;
	        plane.castShadow = false;
	        plane.name = "xz";
	        thatCE.scene.add(plane);
	        thatCE.workPlaneObjects.xz = plane;
    	}

    	//xy
    	if(componentInfo.workPlanes.xy.visible){
	    	var xCenter = thatCE.componentInfo.size.x / 2;
	    	var yCenter = thatCE.componentInfo.size.y / 2;
	    	var zCenter = thatCE.componentInfo.size.z / 2;
	    	var sizeX = thatCE.componentInfo.size.x;
	    	var sizeY = thatCE.componentInfo.size.y;
	    	var sizeZ = thatCE.componentInfo.size.z;
	        var planeGeometry = new THREE.PlaneGeometry(sizeX * planeScale, sizeY * planeScale);
	        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
	        plane.position.set(xCenter, yCenter, -thatCE.gridZero + componentInfo.workPlanes.xy.position);
	        plane.isWorkPlane = true;
	        plane.receiveShadow = false;
	        plane.castShadow = false;
	        plane.name = "xy";
	        thatCE.scene.add(plane);
	        thatCE.workPlaneObjects.xy = plane;
    	}

    	//yz
    	if(componentInfo.workPlanes.yz.visible){
	    	var xCenter = thatCE.componentInfo.size.x / 2;
	    	var yCenter = thatCE.componentInfo.size.y / 2;
	    	var zCenter = thatCE.componentInfo.size.z / 2;
	    	var sizeX = thatCE.componentInfo.size.x;
	    	var sizeY = thatCE.componentInfo.size.y;
	    	var sizeZ = thatCE.componentInfo.size.z;
	        var planeGeometry = new THREE.PlaneGeometry(sizeZ * planeScale, sizeY * planeScale);
	        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
	        plane.rotation.y = -0.5 * Math.PI;
	        plane.position.set(-thatCE.gridZero + componentInfo.workPlanes.yz.position, yCenter, zCenter);
	        plane.isWorkPlane = true;
	        plane.receiveShadow = false;
	        plane.castShadow = false;
	        plane.name = "yz";
	        thatCE.scene.add(plane);
	        thatCE.workPlaneObjects.yz = plane;
    	}
    }

    this.getGridMaxValue = function(){
		return {
			x: thatCE.componentInfo.size.x,
			y: thatCE.componentInfo.size.y,
			z: thatCE.componentInfo.size.z
		};
    }

    this.initRuler = function(){
    	thatCE.addRuler();
    }

    this.addRuler = function() {
		var rulerDiv = document.createElement("div");
		rulerDiv.className = "rulerContainer";
		thatCE.renderer2d.domElement.appendChild( rulerDiv );
		thatCE.initRuler2dHtml(rulerDiv);

		//默认不显示ruler的容器 added by ls 20210901
    	$("#" + thatCE.containerId).find(".rulerContainer").css({display: "none"});
    };

    //自动更新吸附距离，动态的，根据界面宽度计算 added by ls 20221026
    this.autoRefreshAttachDistance = function(){
    	var leftPosition = new THREE.Vector2(-0.99, 0);
    	var rightPosition = new THREE.Vector2(0.99, 0);

    	//计算显示出来groundPlane宽度
    	var leftIntersectPoint = thatCE.getGroundPlaneRaycasterPoint(leftPosition);
    	var rightIntersectPoint = thatCE.getGroundPlaneRaycasterPoint(rightPosition);
    	if(leftIntersectPoint != null && rightIntersectPoint != null){
    		var viewWidth = Math.sqrt((rightIntersectPoint.x - leftIntersectPoint.x) * (rightIntersectPoint.x - leftIntersectPoint.x)
    				+ (rightIntersectPoint.y - leftIntersectPoint.y) * (rightIntersectPoint.y - leftIntersectPoint.y)
    				+ (rightIntersectPoint.z - leftIntersectPoint.z) * (rightIntersectPoint.z - leftIntersectPoint.z));
    		//更改吸附距离
    		thatCE.componentInfo.attachDistance = viewWidth / 100;

    		//更改点击感应的范围 added by ls 20231204
    		thatCE.raycaster.params.Line.threshold = thatCE.componentInfo.attachDistance / 2;
    	}
    }

    //计算射线与groundPlane的交点 added by ls 20221026
    this.getGroundPlaneRaycasterPoint = function(position){
    	var distanceRaycaster = new THREE.Raycaster();
    	distanceRaycaster.setFromCamera(position, thatCE.camera);
        var intersects = distanceRaycaster.intersectObjects(thatCE.scene.children, true);
        for(var i = 0; i < intersects.length; i++){
        	var intersect = intersects[i];
        	if(intersect.object.isWorkPlane){
        		var intersectPoint = intersect.point;
        		return intersectPoint;
        	}
        }
        return null;
    }

    this.initAttachHelpLines = function(){
    	thatCE.componentInfo.placePointRadius = thatCE.componentInfo.placePointRadius == null ? 0.02 : thatCE.componentInfo.placePointRadius;
    	thatCE.componentInfo.attachDistance = thatCE.componentInfo.attachDistance == null ? 0.5 : thatCE.componentInfo.attachDistance;
    	thatCE.componentInfo.gridSpace = thatCE.componentInfo.gridSpace == null ? 1 : thatCE.componentInfo.gridSpace;
    	if(thatCE.attachLine2dVisible){
    		thatCE.addDrawHelpLine();
	    	thatCE.addAttachHelpLine();
	    	var gridMaxValue = thatCE.getGridMaxValue();
	    	var attachLineMaterial = thatCE.attachHelpLineMaterial;

	    	//xz-x
			var xzGeometryX = new THREE.BufferGeometry();
			xzGeometryX.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, gridMaxValue.z * 1.5], 3));
	        var xzLineX = new THREE.Line(xzGeometryX, attachLineMaterial);
	        xzLineX.isAttachHelpLine = true;
	        xzLineX.visible = false;
	        thatCE.attachHelpLines.xzLineX = xzLineX;
	        thatCE.scene.add(xzLineX);

	    	//xz-z
	        var xzGeometryZ = new THREE.BufferGeometry();
	        xzGeometryZ.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, gridMaxValue.x * 1.5, 0, 0], 3));
	        var xzLineZ = new THREE.Line(xzGeometryZ, attachLineMaterial);
	        xzLineZ.isAttachHelpLine = true;
	        xzLineZ.visible = false;
	        thatCE.attachHelpLines.xzLineZ = xzLineZ;
	        thatCE.scene.add(xzLineZ );

	    	//xy-x
			var xyGeometryX = new THREE.BufferGeometry();
			xyGeometryX.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, gridMaxValue.y * 1.5, 0], 3));
	        var xyLineX = new THREE.Line(xyGeometryX, attachLineMaterial);
	        xyLineX.isAttachHelpLine = true;
	        xyLineX.visible = false;
	        thatCE.attachHelpLines.xyLineX = xyLineX;
	        thatCE.scene.add(xyLineX);

	    	//xy-y
	        var xyGeometryY = new THREE.BufferGeometry();
	        xyGeometryY.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, gridMaxValue.x * 1.5, 0, 0], 3));
	        var xyLineY = new THREE.Line(xyGeometryY, attachLineMaterial);
	        xyLineY.isAttachHelpLine = true;
	        xyLineY.visible = false;
	        thatCE.attachHelpLines.xyLineY = xyLineY;
	        thatCE.scene.add(xyLineY);

	    	//yz-y
			var yzGeometryY = new THREE.BufferGeometry();
			yzGeometryY.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, gridMaxValue.z * 1.5], 3));
	        var yzLineY = new THREE.Line(yzGeometryY, attachLineMaterial);
	        yzLineY.isAttachHelpLine = true;
	        yzLineY.visible = false;
	        thatCE.attachHelpLines.yzLineY = yzLineY;
	        thatCE.scene.add(yzLineY);

	    	//yz-z
	        var yzGeometryZ = new THREE.BufferGeometry();
	        yzGeometryZ.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, gridMaxValue.y * 1.5, 0], 3));
	        var yzLineZ = new THREE.Line(yzGeometryZ, attachLineMaterial);
	        yzLineZ.isAttachHelpLine = true;
	        yzLineZ.visible = false;
	        thatCE.attachHelpLines.yzLineZ = yzLineZ;
	        thatCE.scene.add(yzLineZ );

	        /*
	    	//y
	        var planeGeometryY = new THREE.PlaneGeometry(sizeX, sizeZ);
	        var planeY = new THREE.Mesh(planeGeometryY, planeMaterial);
	        planeY.rotation.x = -0.5 * Math.PI;
	        planeY.position.y = 0;
	        planeY.position.x = xCenter;
	        planeY.position.z = zCenter;
	        planeY.isAttachHelpPlane = true;
	        planeY.visible = false;
	        thatCE.scene.add(planeY);
	        thatCE.attachHelpLines.yPlane = planeY;
	        */
    	}
    }

    this.refreshAttachHelpLine = function(axis, newValue, workPlaneNames){
    	if(thatCE.attachLine2dVisible){
	    	if(axis == null && newValue == null){
				thatCE.attachHelpLines.xyLineX.visible = false;
				thatCE.attachHelpLines.xyLineY.visible = false;
				thatCE.attachHelpLines.xzLineX.visible = false;
				thatCE.attachHelpLines.xzLineZ.visible = false;
				thatCE.attachHelpLines.yzLineY.visible = false;
				thatCE.attachHelpLines.yzLineZ.visible = false;
	    	}
	    	else if(newValue == null){
		    	switch(axis){
					case "X":{
						thatCE.attachHelpLines.xyLineY.visible = false;
						thatCE.attachHelpLines.xzLineZ.visible = false;
						break;
					}
					case "Z":{
						thatCE.attachHelpLines.yzLineY.visible = false;
						thatCE.attachHelpLines.xzLineX.visible = false;
						break;
					}
					case "Y":{
						thatCE.attachHelpLines.yzLineZ.visible = false;
						thatCE.attachHelpLines.xyLineX.visible = false;
						break;
					}
		    	}
	    	}
	    	else{
	        	var gridMaxValue = thatCE.getGridMaxValue();
		    	var xCenter = gridMaxValue.x / 2;
		    	var yCenter = gridMaxValue.y / 2;
		    	var zCenter = gridMaxValue.z / 2;
		    	var sizeX = gridMaxValue.x;
		    	var sizeY = gridMaxValue.y;
		    	var sizeZ = gridMaxValue.z;
		    	var yPosition = thatCE.componentInfo.workPlanes.xz.visible ? thatCE.componentInfo.workPlanes.xz.position : 0;
		    	var zPosition = thatCE.componentInfo.workPlanes.xy.visible ? thatCE.componentInfo.workPlanes.xy.position : 0;
		    	var xPosition = thatCE.componentInfo.workPlanes.yz.visible ? thatCE.componentInfo.workPlanes.yz.position : 0;
		    	switch(axis){
		    		/*
					case "X":{
						const vertices = new Float32Array([
   							0, 0, -gridMaxValue.z * 0.25,
   							0, 0, gridMaxValue.z * 1.25
   						])
   						thatCE.attachHelpLines.xLine.geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
   						thatCE.attachHelpLines.xLine.position.set(newValue, 0, 0);
   						thatCE.attachHelpLines.xLine.visible = true;
						break;
					}
					case "Z":{
						const vertices = new Float32Array([
   							-gridMaxValue.x * 0.25, 0, 0,
   							gridMaxValue.x * 1.25, 0, 0
   						])
   						thatCE.attachHelpLines.zLine.geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
   						thatCE.attachHelpLines.zLine.position.set(0, 0, newValue);
   						thatCE.attachHelpLines.zLine.visible = true;
						break;
					}
					*/
					case "X":{
						var xzLineZVisible = false;
						var xyLineYVisible = false;
						for(var i = 0; i < workPlaneNames.length; i++){
							var workPlaneName = workPlaneNames[i];
							switch(workPlaneName){
								case "xz": {
									xzLineZVisible = true;
									break;
								}
								case "xy": {
									xyLineYVisible = true;
									break;
								}
								default: {
									break;
								}
							}
						}
						thatCE.attachHelpLines.xyLineY.geometry.setAttribute("position", new THREE.Float32BufferAttribute([newValue, 0, zPosition, newValue, gridMaxValue.y, zPosition], 3));
						thatCE.attachHelpLines.xzLineZ.geometry.setAttribute("position", new THREE.Float32BufferAttribute([newValue, yPosition, 0, newValue, yPosition, gridMaxValue.z], 3));
						thatCE.attachHelpLines.xzLineZ.visible = xzLineZVisible;
						thatCE.attachHelpLines.xyLineY.visible = xyLineYVisible;
						break;
					}
					case "Z":{
						var yzLineYVisible = false;
						var xzLineXVisible = false;
						for(var i = 0; i < workPlaneNames.length; i++){
							var workPlaneName = workPlaneNames[i];
							switch(workPlaneName){
								case "xz": {
									xzLineXVisible = true;
									break;
								}
								case "yz": {
									yzLineYVisible = true;
									break;
								}
								default: {
									break;
								}
							}
						}
						thatCE.attachHelpLines.xzLineX.geometry.setAttribute("position", new THREE.Float32BufferAttribute([0, yPosition, newValue, gridMaxValue.x, yPosition, newValue], 3));
						thatCE.attachHelpLines.yzLineY.geometry.setAttribute("position", new THREE.Float32BufferAttribute([xPosition, 0, newValue, xPosition, gridMaxValue.y, newValue], 3));
						thatCE.attachHelpLines.yzLineY.visible = yzLineYVisible;
						thatCE.attachHelpLines.xzLineX.visible = xzLineXVisible;
						break;
					}
					case "Y":{
						var xyLineXVisible = false;
						var yzLineZVisible = false;
						for(var i = 0; i < workPlaneNames.length; i++){
							var workPlaneName = workPlaneNames[i];
							switch(workPlaneName){
								case "xy": {
									xyLineXVisible = true;
									break;
								}
								case "yz": {
									yzLineZVisible = true;
									break;
								}
								default: {
									break;
								}
							}
						}
						thatCE.attachHelpLines.xyLineX.geometry.setAttribute("position", new THREE.Float32BufferAttribute([0, newValue, zPosition, gridMaxValue.x, newValue, zPosition], 3));
						thatCE.attachHelpLines.yzLineZ.geometry.setAttribute("position", new THREE.Float32BufferAttribute([xPosition, newValue, 0, xPosition, newValue, gridMaxValue.z], 3));
						thatCE.attachHelpLines.xyLineX.visible = xyLineXVisible;
						thatCE.attachHelpLines.yzLineZ.visible = yzLineZVisible;
						break;
					}
		    	}
	    	}
    	}
    }

    //如果按钮关联的componentInfo尚未被下载，那么下载之，类似于revit加载族
    this.loadRefComponentBeforeDoBtnClick = function(toStatus, btnName, commandJson){
		var requestParam = {
			componentCode: commandJson.componentCode,
			versionNum: commandJson.componentVersionNum
		};
		serverAccess.request({
			serviceName:"mdlComponentNcpService",
			funcName:"getComponentFileByCode",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)},
			successFunc: function(obj) {
				thatCE.addRefComponentToEditor(obj.result.componentInfo);
		    	var componentKey = commandJson.componentCode + "_" + commandJson.componentVersionNum;
		    	var refComponentInfo = thatCE.componentInfo.refComponents[componentKey];
	    		thatCE.setInitLocationParameterBeforeNewUnit(commandJson, refComponentInfo);
	    		thatCE.setStatus(toStatus, btnName, commandJson);
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});
    }

    this.addRefComponentToEditor = function(componentJson){
		var componentInfo = new MdlComponent();
		componentInfo.parse(componentJson.id, componentJson.categoryId, decodeURIComponent(componentJson.content));

		var componentKey = componentInfo.code + "_" + componentInfo.versionNum;
		thatCE.componentInfo.refComponents[componentKey] = componentInfo;

		for(var key in componentInfo.refComponents){
			var refComponentInfo = componentInfo.refComponents[key];
			thatCE.componentInfo.refComponents[key] = refComponentInfo;
		}
		componentInfo.refComponents = null;
		return componentInfo;
    }

    this.runAddUnitCommondWithoutPosition = function(p){
		if(js3CommandProcessors[p.code] == null){
			js3CommandProcessors[p.code] = {
				componentCode: p.code,
				componentVersionNum: p.versionNum,

				//增加组件图例  added by liyh 20230607
				imgId: p.imgId,

				pointCount: 1,
				toStatus: "placeLimit3DPoints"
			};
		}
		thatCE.doBtnClick(p.code);

		//记录下最后一次手工添加的构件 added by ls 20230628
		thatCE.lastAddComponentInfo = {
			code: p.code,
			versionNum: p.versionNum,
			imgId: p.imgId
		};
    }

    //选择新构件位置前，设置初始化位置为参数 added by ls 20230613
    this.setInitLocationParameterBeforeNewUnit = function(commandJson, componentInfo){
    	var initLocationType = componentInfo.init.locationType;

		//如果是使用世界坐标，那么新添加子构件时，不需要用户选点 modified by ls 20231117
		if(initLocationType.worldPosition){
			commandJson.pointCount = 0;
		}
		else{
	    	var initLocationTypeParameter = initLocationType.parameter;
	    	if(initLocationTypeParameter != null && initLocationTypeParameter.length > 0){
	    		var parameter = componentInfo.parameters[initLocationTypeParameter];
	    		if(parameter == null){
	    			throw new Error("None parameter named " + initLocationTypeParameter);
	    		}
	    		else{
	    			var pointCount = 1;
	    			switch(parameter.paramType){
		    			case js3ParameterType.point3D:{
		    				pointCount = 1;
		    				break;
		    			}
		    			case js3ParameterType.polyline3D:{
		    				pointCount = 0;
		    				break;
		    			}
		    			//增加decimal长度类型的参数 added by ls 20230810
		    			case js3ParameterType.decimal:
		    			case js3ParameterType.line3D: {
		    				pointCount = 2;
		    				break;
		    			}
	    			}
	    			commandJson.pointCount = pointCount;
	    		}
	    	}
	    }
    }

    //判断是否使用decimal长度作为位置参数置 added by ls 20230810
    this.checkIsDecimalLengthLocationParameter = function(commandJson, componentInfo){
    	var initLocationTypeParameter = componentInfo.init.locationType.parameter;
    	if(initLocationTypeParameter != null && initLocationTypeParameter.length > 0){
    		var parameter = componentInfo.parameters[initLocationTypeParameter];
    		if(parameter == null){
    			return false;
    		}
    		else{
    			switch(parameter.paramType){
    				case js3ParameterType.decimal:{
    					return true;
	    			}
    				default:{
    					return false;
    				}
    			}
    		}
    	}
    	else{
    		return false;
    	}
    }

    //所有toolbar按钮点击操作
    this.doBtnClick = function(btnName){
		var commandJson = js3CommandProcessors[btnName];
		if(commandJson == null){
			thatCE.setStatus(js3CoreEditorStatus.normal, btnName, commandJson);
		}
		else{
	    	var toStatus = commandJson.toStatus == null? js3CoreEditorStatus.normal : commandJson.toStatus;
	    	if(commandJson.componentCode == null){
	    		thatCE.setStatus(toStatus, btnName, commandJson);
	    	}
	    	else{
		    	var componentKey = commandJson.componentCode + "_" + commandJson.componentVersionNum;
		    	var refComponentInfo = thatCE.componentInfo.refComponents[componentKey];
		    	if(refComponentInfo == null){
		    		thatCE.loadRefComponentBeforeDoBtnClick(toStatus, btnName, commandJson);
		    	}
		    	else{
		    		thatCE.setInitLocationParameterBeforeNewUnit(commandJson, refComponentInfo);
		    		thatCE.setStatus(toStatus, btnName, commandJson);
		    	}
	    	}
		}
    }

    this.initToolbar = function(){
    	var toolbarSettings = [];
    	for(var i = 0; i < js3SystemToolbarSettings.length; i++){
    		toolbarSettings.push(js3SystemToolbarSettings[i]);
    	}
    	for(var i = 0; i < js3CommonToolbarSettings.length; i++){
    		toolbarSettings.push(js3CommonToolbarSettings[i]);
    	}
    	$("#" + thatCE.containerId).find(".core3dHeaderToolbarContainer").empty();
    	$("#" + thatCE.containerId).find(".core3dHeaderSubToolbarContainer").empty();
    	var allToolbarHtml = "";
    	var allSubToolbarHtml = "";
    	for(var i = 0; i < toolbarSettings.length; i++){
    		var toolbarSetting = toolbarSettings[i];
    		allToolbarHtml += ("<div class=\"core3dHeaderToolbarTab" + (i == 0 ? " core3dHeaderToolbarTabActive" : "") + "\" name=\"" + toolbarSetting.id + "\">" + cmnPcr.html_encode(toolbarSetting.name) + "</div>");
    		allSubToolbarHtml += ("<div class=\"core3dHeaderSubToolbar" + (i == 0 ? " core3dHeaderSubToolbarActive" : "") + "\" name=\"" + toolbarSetting.id + "\">");
    		for(var j = 0; j < toolbarSetting.buttons.length; j++){
    			var btnSetting = toolbarSetting.buttons[j];
    			switch(btnSetting.type){
	    			case "component":{
	    				var btnDescription = cmnPcr.replace(btnSetting.description == null ?  btnSetting.name : btnSetting.description, "\\\\\"", "'");
	    	   			allSubToolbarHtml += ("<div class=\"core3dHeaderButton\" name=\"" + btnSetting.id + "\" code=\"" + btnSetting.code + "\" type=\"component\" title=\"" + btnDescription + "\">");
	    	   			if(btnSetting.imgId != null){
		    				var imgUrl = btnSetting.imgId == null ? "" : (basePath + "/cms/getCMSImage?id=" + btnSetting.imgId);
		    	   			allSubToolbarHtml += ("<img class=\"core3dHeaderButtonImg\" src=\"" + imgUrl + "\">");
	    	   			}
	    	   			allSubToolbarHtml += ("<span class=\"core3dHeaderButtonText\">" + cmnPcr.html_encode(btnSetting.name) + "</span>");
	    	   			allSubToolbarHtml += "</div>";
	    	   			break;
	    			}
	    			case "spliter":{
	    	   			allSubToolbarHtml += ("<div class=\"core3dHeaderButtonSpliter\">&nbsp;</div>");
	    	   			break;
	    			}
	    			case "plugin":{
	    				var btnDescription = cmnPcr.replace(btnSetting.description == null ?  btnSetting.name : btnSetting.description, "\\\\\"", "'");
	    				var pluginProcessor = js3CommandProcessors[btnSetting.code];
	    				if(pluginProcessor == null){
	    					//msgBox.alert({info: "不存在的插件: " + btnSetting.code + " " + btnSetting.name});
	    					allSubToolbarHtml += ("<div class=\"core3dHeaderButton\" name=\"" + btnSetting.id + "\" code=\"" + btnSetting.code + "\" title=\"" + btnDescription + "\"><span class=\"core3dHeaderButtonText\">Error</span></div>");
	    				}
	    				else{
	    					var imgUrl = "../common/plugins/" + btnSetting.code + pluginProcessor.icon;
	    					allSubToolbarHtml += ("<div class=\"core3dHeaderButton\" name=\"" + btnSetting.id + "\" code=\"" + btnSetting.code + "\" type=\"plugin\" title=\"" + btnDescription + "\"><img class=\"core3dHeaderButtonImg\" src=\"" + imgUrl + "\"><span class=\"core3dHeaderButtonText\">" + cmnPcr.html_encode(btnSetting.name) + "</span></div>");
	    				}
	    	   			break;
	    			}
	    			default:
	    				break;
    			}
    		}
    		allSubToolbarHtml += "</div>";
    	}
    	$("#" + thatCE.containerId).find(".core3dHeaderToolbarContainer").html(allToolbarHtml);
    	$("#" + thatCE.containerId).find(".core3dHeaderSubToolbarContainer").html(allSubToolbarHtml);

    	//快捷按钮
    	var shortcutHtml = "";
    	for(var i = 0; i < thatCE.shortcutList.length; i++){
    		var shortCut = thatCE.shortcutList[i];
    		var pluginProcessor = js3CommandProcessors[shortCut.code];
    		if(pluginProcessor != null){
    			var imgUrl = "../common/plugins/" + shortCut.code + pluginProcessor.icon;
    			shortcutHtml += ("<div class=\"core3dShortCutButton\" code=\"" + shortCut.code + "\" title=\"" + shortCut.name + "\"><img class=\"core3dShortCutButtonImg\" src=\"" + imgUrl + "\"></div>");
    		}
    	}
    	$("#" + thatCE.containerId).find(".core3dShortcutContainer").html(shortcutHtml);
    }

    this.initContextMenu = function(){
    	$("#" + thatCE.containerId).find(".coreInnerContainer").mouseup(function(ev){
    		var checkMenuElement = $(ev.target);
    		var doHiddenMenu = true;
    		while(checkMenuElement.length != 0){
    			if($(checkMenuElement).hasClass("contextMenuContainer")){
    				doHiddenMenu = false;
    				break;
    			}
    			else{
    				checkMenuElement = $(checkMenuElement).parent();
    			}
    		}
    		if(doHiddenMenu){
    			thatCE.hideContextMenu();
    		}
	    	return true;
    	});
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnComponent").mouseup(function (ev) {
    		thatCE.hideContextMenu();
    		thatCE.doBtnClick("insert");
			return false;
	    });
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnCut").mouseup(function (ev) {
    		thatCE.doCutMenu();
    		thatCE.hideContextMenu();
			return false;
	    });
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnCopy").mouseup(function (ev) {
    		thatCE.doCopyMenu();
    		thatCE.hideContextMenu();
			return false;
	    });
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnRotate").mouseup(function (ev) {
    		thatCE.doRotateMenu();
    		thatCE.hideContextMenu();
			return false;
	    });
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnMove").mouseup(function (ev) {
    		thatCE.doMoveMenu();
    		thatCE.hideContextMenu();
			return false;
	    });
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnPaste").mouseup(function (ev) {
    		thatCE.doPasteMenu();
    		thatCE.hideContextMenu();
			return false;
	    });
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnWorkPlaneViewport").mouseup(function (ev) {
    		var workPlaneName = $(this).parent().parent().parent().attr("workPlaneName");
    		switch(workPlaneName){
	    		case "xy":{
	        		thatCE.doBtnClick("frontView");
	    			break;
	    		}
	    		case "xz":{
	        		thatCE.doBtnClick("topView");
	    			break;
	    		}
	    		case "yz":{
	        		thatCE.doBtnClick("rightView");
	    			break;
	    		}
    		}
    		thatCE.hideContextMenu();
			return false;
	    });
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnDelete").mouseup(function (ev) {
    		thatCE.doRemoveMenu();
    		thatCE.hideContextMenu();
			return false;
	    });
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnSetCenter").mouseup(function (ev) {
    		thatCE.doSetCenterObject();
    		thatCE.hideContextMenu();
			return false;
	    });
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnEditUnitParameters").mouseup(function (ev) {
        	var object3D = thatCE.selectedUnitObject3D;
        	thatCE.editUnitComponentParameters(object3D);
    		thatCE.hideContextMenu();
			return false;
	    });
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnEditUnitComponent").mouseup(function (ev) {
    		thatCE.doEditUnitComponentMenu();
    		thatCE.hideContextMenu();
			return false;
	    });
    	$("#" + thatCE.containerId).find(".contextMenuContainer").find(".contextMenuBtnMultiPaste").mouseup(function (ev) {
    		thatCE.doMultiPasteMenu();
    		thatCE.hideContextMenu();
			return false;
	    });
    }

	//编辑子组件 added by ls 20210820
    this.doEditUnitComponentMenu = function(){
    	var object3D = thatCE.selectedUnitObject3D;
		var unitSetting = thatCE.getUnitSettingFromObject3D(object3D);
    	thatCE.editUnitComponent(unitSetting);
    }

    this.editUnitComponent = function(unitSetting){
    	var code = unitSetting.code;
    	var versionNum = unitSetting.versionNum;
		var pageUrl = "../../design/common/editor.jsp?code=" + encodeURIComponent(code) + "&versionnum=" + encodeURIComponent(versionNum);
		var winName = "Edit_" + code + "_" + versionNum;
		window.open(pageUrl, winName);
    }

    this.doSetCenterObject = function(){
    	var object3D = thatCE.selectedUnitObject3D;
    	thatCE.setCenterObject(object3D);
    }

    //更改复制方法 modified by ls 20210820
    this.doCopyMenu = function(){
    	var object3D = thatCE.selectedUnitObject3D;
    	thatCE.copyObject3D(object3D);
    }
    this.copyObject3D = function(object3D){
    	var unitSetting = null;
		if(object3D.isUnitObject){
			unitSetting = thatCE.getUnitSettingFromObject3D(object3D);
			unitSetting = thatCE.cloneUnitSetting(unitSetting);
		}
    	thatCE.clipBoard.type = js3ClipBoardType.copy;
    	thatCE.clipBoard.unitSetting = unitSetting;
    }

    //批量复制
    this.doMultiCopyMenu = function(){
    	var object3Ds = thatCE.multiSelectedUnitObject3Ds;
    	thatCE.copyObject3Ds(object3Ds);
    }
    this.copyObject3Ds = function(object3Ds){
    	var unitSettings = new Array();
    	for(var i = 0; i < object3Ds.length; i++){
    		var object3D = object3Ds[i];
	    	var unitSetting = null;
			if(object3D.isUnitObject){
				unitSetting = thatCE.getUnitSettingFromObject3D(object3D);
				unitSetting = thatCE.cloneUnitSetting(unitSetting);
				unitSettings.push(unitSetting);
			}
    	}
    	thatCE.clipBoard.type = js3ClipBoardType.copy;
    	thatCE.clipBoard.unitSettings = unitSettings;
    }

    this.doRotateMenu = function(){
    	thatCE.transformControl.setMode("rotate");
    }

    this.doMoveMenu = function(){
    	thatCE.transformControl.setMode("translate");
    }

    this.doCutMenu = function(){
    	var object3D = thatCE.selectedUnitObject3D;

    	var componentSetting = null;
		if(object3D.isModelObject){
			componentSetting = thatCE.getUnitSettingFromObject3D(object3D);
			componentSetting = thatCE.cloneUnitSetting(componentSetting);
		}
    	thatCE.clipBoard.type = js3ClipBoardType.cut;
    	thatCE.clipBoard.componentSetting = componentSetting;
    	thatCE.removeUnitObject3D(object3D, true);
    }

    //更改粘贴方法 modified by ls 20210820
    this.doPasteMenu = function(){
    	thatCE.pasteObject3D();
    }

    this.pasteObject3D = function(){
    	var unitSetting = thatCE.clipBoard.unitSetting;
    	if(unitSetting == null){
    		msgBox.alert({info: "请先复制"});
    	}
    	else{
    		unitSetting = thatCE.cloneUnitSetting(unitSetting);
			var refComponentInfo = thatCE.getRefComponentInfo(unitSetting.code, unitSetting.versionNum);

			//粘贴的默认高度和被复制组件一样 modified by ls 20210820
			unitSetting.position = [thatCE.mouse3DPosition.x, unitSetting.position[1], thatCE.mouse3DPosition.z];

			var unitComProcessor = thatCE.object3DCreator.createJs3UnitComponentProcessor(unitSetting.code, unitSetting.versionNum);
			var parentParameters = thatCE.getComponentParametersForEditExp();
	    	var idAndName = thatCE.getNewUnitIdAndName(refComponentInfo.name + "_1", refComponentInfo.name);
	    	unitSetting.id = idAndName.id;
	    	unitSetting.name = idAndName.name;
	    	unitSetting.positionExps = {};
	    	unitSetting.rotationExps = {};

			unitComProcessor.init({
				editor: thatCE,
				unitId: unitSetting.id,
				unitName: unitSetting.name,
				mixType: unitSetting.mixType,

				//显示级别 added by ls 20230403
				viewLevel: unitSetting.viewLevel,

				useWorldPosition: unitSetting.useWorldPosition,
				useParameterPosition: unitSetting.useParameterPosition,
				position: unitSetting.position,
				rotation: unitSetting.rotation,
				componentInfo: refComponentInfo,
				valueParameters: unitSetting.parameters,
				positionExps: unitSetting.positionExps,
				rotationExps: unitSetting.rotationExps,
				parentParameters: parentParameters
			});

			unitComProcessor.buildComponent3DObject(unitSetting, parentParameters, thatCE.afterPasteBuildObject3D);
	    }
    }

    this.doMultiPasteMenu = function(){
    	thatCE.pasteObject3Ds();
    }

    this.pasteObject3Ds = function(){
    	var unitSettings = thatCE.clipBoard.unitSettings;
    	if(unitSettings == null){
    		msgBox.alert({info: "请先多选复制"});
    	}
    	else{
    		thatCE.cancelAllMultiSelectUnitObjects();
    		thatCE.setStatus(js3CoreEditorStatus.multiSelect);
    		var newUnitIds = new Array();
    		var minMaxPos = {
				minX: Infinity,
				minY: Infinity,
				minZ: Infinity,
				maxX: -Infinity,
				maxY: -Infinity,
				maxZ: -Infinity
    		};
    		var newUnitSettings = new Array();
    		for(var i = 0; i < unitSettings.length; i++){
    			var unitSetting = unitSettings[i];
    			unitSetting = thatCE.cloneUnitSetting(unitSetting);
    			newUnitSettings.push(unitSetting);
    			if(unitSetting.position[0] > minMaxPos.maxX){
    				minMaxPos.maxX = unitSetting.position[0];
    			}
    			if(unitSetting.position[1] > minMaxPos.maxY){
    				minMaxPos.maxY = unitSetting.position[1];
    			}
    			if(unitSetting.position[2] > minMaxPos.maxZ){
    				minMaxPos.maxZ = unitSetting.position[2];
    			}
    			if(unitSetting.position[0] < minMaxPos.minX){
    				minMaxPos.minX = unitSetting.position[0];
    			}
    			if(unitSetting.position[1] < minMaxPos.minY){
    				minMaxPos.minY = unitSetting.position[1];
    			}
    			if(unitSetting.position[2] < minMaxPos.minZ){
    				minMaxPos.minZ = unitSetting.position[2];
    			}
    		}

    		var centerPos = {
				x: (minMaxPos.maxX + minMaxPos.minX) / 2,
				y: (minMaxPos.maxY + minMaxPos.minY) / 2,
				z: (minMaxPos.maxZ + minMaxPos.minZ) / 2
    		}

    		for(var i = 0; i < newUnitSettings.length; i++){
    			var unitSetting = newUnitSettings[i];
				var refComponentInfo = thatCE.getRefComponentInfo(unitSetting.code, unitSetting.versionNum);

				//粘贴的默认高度和被复制组件一样 modified by ls 20210820
				unitSetting.position = [thatCE.mouse3DPosition.x + unitSetting.position[0] - centerPos.x, unitSetting.position[1], thatCE.mouse3DPosition.z + unitSetting.position[2] - centerPos.z];

				var unitComProcessor = thatCE.object3DCreator.createJs3UnitComponentProcessor(unitSetting.code, unitSetting.versionNum);
				var parentParameters = thatCE.getComponentParametersForEditExp();
		    	var idAndName = thatCE.getNewUnitIdAndName(refComponentInfo.name + "_1", refComponentInfo.name);
		    	unitSetting.id = idAndName.id;
		    	unitSetting.name = idAndName.name;
		    	unitSetting.positionExps = {};

				unitComProcessor.init({
					editor: thatCE,
					unitId: unitSetting.id,
					unitName: unitSetting.name,
					mixType: unitSetting.mixType,

					//显示级别 added by ls 20230403
					viewLevel: unitSetting.viewLevel,

					useWorldPosition: unitSetting.useWorldPosition,
					useParameterPosition: unitSetting.useParameterPosition,
					position: unitSetting.position,
					rotation: unitSetting.rotation,
					componentInfo: refComponentInfo,
					valueParameters: unitSetting.parameters,
					positionExps: unitSetting.positionExps,
					parentParameters: parentParameters
				});

				unitComProcessor.buildComponent3DObject(unitSetting, parentParameters, thatCE.afterPasteBuildObject3D);
				newUnitIds.push(unitSetting.id);
    		}
    		thatCE.multiSelectUnitObjects(newUnitIds);
	    }
    }

    this.doRemoveMenu = function(object3D){
    	var object3D = thatCE.selectedUnitObject3D;
    	thatCE.removeUnitObject3D(object3D);
    }

    this.removeUnitObject3D = function(object3D, notConfirm){
    	if(notConfirm || msgBox.confirm({info: "确定删除吗?"})){
        	if(object3D == thatCE.selectedUnitObject3D){
            	thatCE.showUnitInfo(null);

            	//删除标注 added by ls 20221209
            	thatCE.showUnitTags(null);
        	}
        	thatCE.scene.remove(object3D);
        	var unitData = object3D.unitData;
        	thatCE.removeUnitFromList(object3D);
        	thatCE.refreshListItemCount();

        	//刷新初始位置辅助点下拉 added by ls 20230612
        	if(thatCE.checkIsAssistPoint(unitData.code)){
        		var componentInfo = thatCE.getLastComponentInfo();
        		thatCE.initLocationTypePointSelectValues(componentInfo);
        	}
    	}
    }

    this.removeUnitObject3Ds = function(object3Ds, notConfirm){
    	if(notConfirm || msgBox.confirm({info: "确定删除吗?"})){
    		thatCE.cancelAllMultiSelectUnitObjects();
    		var hasAssistPoint = false;
    		for(var i = 0; i < object3Ds.length; i++){
    			var object3D = object3Ds[i];
            	thatCE.scene.remove(object3D);
            	var unitData = object3D.unitData;
            	thatCE.removeUnitFromList(object3D);

            	//判断是否有删除辅助点 added by ls 20230612
            	if(thatCE.checkIsAssistPoint(unitData.code)){
            		hasAssistPoint = true;
            	}
    		}
        	thatCE.refreshListItemCount();

        	//刷新初始位置辅助点下拉 added by ls 20230612
        	if(hasAssistPoint){
        		var componentInfo = thatCE.getLastComponentInfo();
        		thatCE.initLocationTypePointSelectValues(componentInfo);
        	}
    	}
    }

    this.removeAllUnits = function(notConfirm){
    	if(notConfirm || msgBox.confirm({info: "确定全部删除吗?"})){
    		var mainScene = thatCE.getMainScene();
    		var allUnitIds = [];
    		for(var i = 0; i < mainScene.children.length; i++){
    			var childObj = mainScene.children[i];
    			if(childObj.isUnitObject){
    				var unitSetting = thatCE.getUnitSettingFromObject3D(childObj);
    				allUnitIds.push(unitSetting.id);
    			}
    		}
    		thatCE.removeUnitObjectsByIds(allUnitIds);
    	}
    }

    this.removeUnitObjectsByIds = function(unitIds){
    	if(object3D == thatCE.selectedUnitObject3D){
        	thatCE.showUnitInfo(null);

        	//删除标注 added by ls 20221209
        	thatCE.showUnitTags(null);
    	}
    	var hasAssistPoint = false;
    	for(var i = 0; i < unitIds.length; i++){
    		var unitId = unitIds[i];
    		var object3D = thatCE.getObject3DByUnitId(unitId);
        	thatCE.scene.remove(object3D);
        	var unitData = object3D.unitData;
        	thatCE.removeUnitFromList(object3D);

        	//判断是否有删除辅助点拉 added by ls 20230612
        	if(thatCE.checkIsAssistPoint(unitData.code)){
        		hasAssistPoint = true;
        	}
    	}
    	thatCE.refreshListItemCount();
    	if(hasAssistPoint){
    		var componentInfo = thatCE.getLastComponentInfo();
    		thatCE.initLocationTypePointSelectValues(componentInfo);
    	}
    }

    this.hideContextMenu = function(){
		$("#" + thatCE.containerId).find(".contextMenuContainer").removeClass("contextMenuContainerPopup");
    }

    this.runAddUnitCommond = function(p){
		var commandJson = {
			toStatus: "placeLimit3DPoints",
			pointCount: 1,
			componentCode: p.code,
			componentVersionNum: p.versionNum,

			//增加组件图例  added by liyh 20210825
			imgId: p.imgId
		};
    	var points = [{
    		x: thatCE.mouse3DPosition.x,
    		y: thatCE.mouse3DPosition.y,
    		z: thatCE.mouse3DPosition.z
    	}];
    	var componentKey = commandJson.componentCode + "_" + commandJson.componentVersionNum;
    	var refComponentInfo = thatCE.componentInfo.refComponents[componentKey];
    	if(refComponentInfo == null){
    		thatCE.loadRefComponentBeforeCreateNewUnit(commandJson, points);
    	}
    	else{
    		thatCE.runCommandByPoints(points, commandJson);
    	}
    }

    //使用unitSetting添加新的object3d
    this.createNewObject3DByUser = function(unitSetting){
		var componentKey = unitSetting.code + "_" + unitSetting.versionNum;
		var refComponentInfo = thatCE.componentInfo.refComponents[componentKey];
		if(refComponentInfo == null){
			var requestParam = {
				componentCode: unitSetting.code,
				versionNum: unitSetting.versionNum
			};
			serverAccess.request({

				//是否同步请求 added by liyh 20221206
				aysnc: unitSetting.postAysnc == null? false:unitSetting.postAysnc,

				serviceName:"mdlComponentNcpService",
				funcName:"getComponentFileByCode",
			    args:{requestParam:cmnPcr.jsonToStr(requestParam)},
				successFunc: function(obj) {
					var refComponentInfo = thatCE.addRefComponentToEditor(obj.result.componentInfo);
				    thatCE.addUnitObject3DToSceneByUser(refComponentInfo, unitSetting);
				},
				failFunc: function(obj) {
					msgBox.error({title:"提示", info: obj.message});
				}
			});
		}
		else{
		    thatCE.addUnitObject3DToSceneByUser(refComponentInfo, unitSetting);
	    }
    }

    //使用unitSettings批量添加新的object3d added by ls 20220606
    //增加回调函数 added by ls 20220810
    this.createNewObject3DsByUser = function(unitSettings, afterAddNewObject3DFunc){
    	var componentKeys = new Array();
    	var componentHash = {};
    	for(var i = 0; i < unitSettings.length; i++){
    		var unitSetting = unitSettings[i];
    		var componentKey = unitSetting.code + "_" + unitSetting.versionNum;
    		var refComponentInfo = thatCE.componentInfo.refComponents[componentKey];
    		if(refComponentInfo == null){
    			if(componentHash[componentKey] == null){
	    			componentHash[componentKey] = true;
	    			componentKeys.push({
	    				//修改参数名 modified by ls 20220705
	    				componentCode: encodeURIComponent(unitSetting.code),
	    				versionNum: encodeURIComponent(unitSetting.versionNum)
	    			});
        		}
    		}
    	}
		if(componentKeys.length > 0){
			var requestParam = {
				//修改参数名 modified by ls 20220705
				componentCodeAndVersionNumArray: componentKeys
			};
			serverAccess.request({
				serviceName:"mdlComponentNcpService",
				//少些了个s字符，修改bug modified by ls 20220705
				funcName:"getComponentFilesByCodes",
			    args:{requestParam:cmnPcr.jsonToStr(requestParam)},
				successFunc: function(obj) {
					var componentInfos = obj.result.componentInfos;
					for(var i = 0; i < componentInfos.length; i++){
						var componentInfo = componentInfos[i];
						thatCE.addRefComponentToEditor(componentInfo);
					}
				    thatCE.addUnitObject3DsToSceneByUser(unitSettings, afterAddNewObject3DFunc);
				},
				failFunc: function(obj) {
					msgBox.error({title:"提示", info: obj.message});
				}
			});
		}
		else{
		    thatCE.addUnitObject3DsToSceneByUser(unitSettings, afterAddNewObject3DFunc);
	    }
    }

    //使用unitSettings批量添加新的object3d added by ls 20220606
    //增加回调函数 added by ls 20220810
    this.addUnitObject3DsToSceneByUser = function(unitSettings, afterAddNewObject3DFunc){
    	for(var i = 0; i < unitSettings.length; i++){
    		var unitSetting = unitSettings[i];
    		var componentKey = unitSetting.code + "_" + unitSetting.versionNum;
    		var refComponentInfo = thatCE.componentInfo.refComponents[componentKey];
    		var unitComProcessor = thatCE.object3DCreator.createJs3UnitComponentProcessor(unitSetting.code, unitSetting.versionNum);
    		var parentParameters = thatCE.getComponentParametersForEditExp();
    		unitComProcessor.init({
    			editor: thatCE,
    			unitId: unitSetting.id,
    			mixType: unitSetting.mixType,

    			//显示级别 added by ls 20230403
    			viewLevel: unitSetting.viewLevel,

    			useWorldPosition: unitSetting.useWorldPosition,
				useParameterPosition: unitSetting.useParameterPosition,
    			position: unitSetting.position,
    			rotation: unitSetting.rotation,
    			componentInfo: refComponentInfo,
    			valueParameters: unitSetting.parameters,
    			positionExps: unitSetting.positionExps,
    			rotationExps: unitSetting.rotationExps,
    			parentParameters: parentParameters
    		});

    		unitComProcessor.buildComponent3DObject(unitSetting, parentParameters, function(unit3DInfo){
    			thatCE.afterBuildObject3DByUser(unit3DInfo);
    			if(afterAddNewObject3DFunc != null){
    				afterAddNewObject3DFunc(unit3DInfo);
    			}
    		});
    	}
    }

    this.loadRefComponentBeforeCreateNewUnit = function(commandJson, points){
		var requestParam = {
			componentCode: commandJson.componentCode,
			versionNum: commandJson.componentVersionNum
		};
		serverAccess.request({
			serviceName:"mdlComponentNcpService",
			funcName:"getComponentFileByCode",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)},
			successFunc: function(obj) {
				var componentInfo = new MdlComponent();
				componentInfo.parse(obj.result.componentInfo.id, obj.result.componentInfo.categoryId, decodeURIComponent(obj.result.componentInfo.content));

				var componentKey = componentInfo.code + "_" + componentInfo.versionNum;
				thatCE.componentInfo.refComponents[componentKey] = componentInfo;

				for(var key in componentInfo.refComponents){
					var refComponentInfo = componentInfo.refComponents[key];
					thatCE.componentInfo.refComponents[key] = refComponentInfo;
				}
				componentInfo.refComponents = null;
	    		thatCE.runCommandByPoints(points, commandJson);
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});
    }

    this.loadRefComponentBeforeCreateNewUnits = function(commandJson, points){
		var requestParam = {
			componentCode: commandJson.componentCode,
			versionNum: commandJson.componentVersionNum
		};
		serverAccess.request({
			serviceName:"mdlComponentNcpService",
			funcName:"getComponentFileByCode",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)},
			successFunc: function(obj) {
				var componentInfo = new MdlComponent();
				componentInfo.parse(obj.result.componentInfo.id, obj.result.componentInfo.categoryId, decodeURIComponent(obj.result.componentInfo.content));

				var componentKey = componentInfo.code + "_" + componentInfo.versionNum;
				thatCE.componentInfo.refComponents[componentKey] = componentInfo;

				for(var key in componentInfo.refComponents){
					var refComponentInfo = componentInfo.refComponents[key];
					thatCE.componentInfo.refComponents[key] = refComponentInfo;
				}
				componentInfo.refComponents = null;
				thatCE.runCommandByPointsMulti(points, commandJson);
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});
    }

    this.getInsertComponentFileByKey = function(p){
    	var componentInfo = thatCE.getComponentInfoByKey(p.keyName);
    	if(componentInfo != null){
    		p.afterFunc(componentInfo);
    	}
    	else{
    		var requestParam = {
    			keyName: p.keyName
    		};
    		serverAccess.request({
    			serviceName:"mdlNcpService",
    			funcName:"getComponentFileByKey",
    		    args:{requestParam:cmnPcr.jsonToStr(requestParam)},
    			successFunc: function(obj) {
    				var componentInfoJson = obj.result.componentInfo;
					var componentInfo = {
						id: componentInfoJson.component3DId,
						code: decodeURIComponent(componentInfoJson.component3DCode),
						name: decodeURIComponent(componentInfoJson.component3DName),
						versionNum: decodeURIComponent(componentInfoJson.component3DVersionNum),
						keyName: componentInfoJson.keyName,
						content: decodeURIComponent(componentInfoJson.content).trim(),
						componentId: componentInfoJson.componentId,
						componentCode: decodeURIComponent(componentInfoJson.componentCode),
						componentName: decodeURIComponent(componentInfoJson.componentName),
						componentVersionNum: decodeURIComponent(componentInfoJson.componentVersionNum),
						categoryId: componentInfoJson.categoryId,
						categoryCode: decodeURIComponent(componentInfoJson.categoryCode),
						categoryName: decodeURIComponent(componentInfoJson.categoryName)
					}
			    	thatCE.addComponentInfoToCache(componentInfo.code, componentInfo.versionNum, componentInfo);
			    	p.afterFunc(componentInfo);
    			},
    			failFunc: function(obj) {
    				msgBox.error({title:"提示", info: obj.message});
			    	p.afterFunc(null, obj.message);
    			}
    		});
    	}
    }

    this.setNormalViewport = function (viewport){
    	var cameraPosition = thatCE.camera.position;

    	var xLength = thatCE.componentInfo.size.x;
    	var xCenter = xLength / 2;
    	var yLength = thatCE.componentInfo.size.y;
    	var yCenter = yLength / 2;
    	var zLength = thatCE.componentInfo.size.z;
    	var zCenter = zLength / 2;

    	//取外框盒子，用于计算外框的camera
    	var sceneBox = thatCE.getSceneBoxValues();
    	var xSize = sceneBox.max.x - sceneBox.min.x;
    	var ySize = sceneBox.max.y - sceneBox.min.y;
    	var zSize = sceneBox.max.z - sceneBox.min.z;
    	xSize = xSize > xLength ? xSize : xLength;
    	ySize = ySize > yLength ? ySize : yLength;
    	zSize = zSize > zLength ? zSize : zLength;
    	var cameraDistance = Math.sqrt(xSize * xSize + ySize * ySize + zSize * zSize);

    	var position = new Array();
    	switch(viewport){
	    	case js3NormalViewport.init:{
	    		position[0] = Math.sqrt(cameraDistance * cameraDistance / 3);// xLength * 10;
	    		position[1] = Math.sqrt(cameraDistance * cameraDistance / 3);// yLength * 10;
	    		position[2] = Math.sqrt(cameraDistance * cameraDistance / 3);// Math.sqrt(xLength * xLength + yLength * yLength) * 20;
	    		break;
	    	}
	    	case js3NormalViewport.front:{
	    		position[0] = xCenter;
	    		position[1] = yCenter;
	    		position[2] = cameraDistance; //Math.sqrt(xLength * xLength + yLength * yLength) * 20;
	    		break;
	    	}
	    	case js3NormalViewport.back:{
	    		position[0] = xCenter;
	    		position[1] = yCenter;
	    		position[2] = -cameraDistance; //-zLength * 20;
	    		break;
	    	}
	    	case js3NormalViewport.top:{
	    		position[0] = xCenter;
	    		position[1] = cameraDistance; //Math.sqrt(xLength * xLength + zLength * zLength) * 20;
	    		position[2] = zCenter;
	    		break;
	    	}
	    	case js3NormalViewport.bottom:{
	    		position[0] = xCenter;
	    		position[1] = -cameraDistance; //-Math.sqrt(xLength * xLength + zLength * zLength) * 20;
	    		position[2] = zCenter;
	    		break;
	    	}
	    	case js3NormalViewport.left:{
	    		position[0] = -cameraDistance; //-Math.sqrt(xLength * xLength + zLength * zLength) * 20;
	    		position[1] = yCenter;
	    		position[2] = zCenter;
	    		break;
	    	}
	    	case js3NormalViewport.right:{
	    		position[0] = cameraDistance; //Math.sqrt(xLength * xLength + zLength * zLength) * 20;
	    		position[1] = yCenter;
	    		position[2] = zCenter;
	    		break;
	    	}
	    	default:{
	    		alert("Unknown viewport = " + viewport);
	    	}
    	}
    	thatCE.setViewport(position, thatCE.componentInfo.size, thatCE.camera.zoom);
    }

	//更新渲染器3D的背景色 added by liyh 20230110
	this.rebuildRenderBackGroudColor = function () {
		thatCE.renderer.setClearColor(thatCE.backgroundColor, thatCE.backgroundAlpha);
	}

	//是否显示工作面 added by ls 20230609
	this.rebuildWorkPlaneVisible = function (componentInfo) {
		thatCE.initWorkPlanes(componentInfo);
	}

	//是否显示阴影  added by liyh 20230110
	this.rebuildShadow = function (){
		thatCE.initLight();

		thatCE.renderer.shadowMap.enabled = thatCE.hasShadow;
		thatCE.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		var width = $("#" + thatCE.containerId).find(".coreInnerContainer").width();
		var height = $("#" + thatCE.containerId).find(".coreInnerContainer").height();
		thatCE.renderer.setSize(width, height);
		thatCE.renderer.setClearColor(thatCE.backgroundColor, thatCE.backgroundAlpha);
		$("#" + thatCE.containerId).find(".coreInnerContainer").append(thatCE.renderer.domElement);

	}

	//更新轴线是否显示 added by liyh 20230110
	this.rebuildGridVisible = function(componentInfo){
		if(thatCE.gridVisible){
			thatCE.initGrid(componentInfo);
			thatCE.initAxes(componentInfo);//added by liyh 20230302
			thatCE.initWorkPlaneSelectValues(componentInfo);
		}else{
			//删除原有的
			var allGridObjects = [];
			for(var i = 0; i < thatCE.scene.children.length; i++){
				var obj = thatCE.scene.children[i];
				if(obj.isGrid){
					allGridObjects.push(obj);
				}
			}
			for(var i = 0; i < allGridObjects.length; i++){
				var obj = allGridObjects[i];
				thatCE.scene.remove(obj);
			}

			//删除轴网 added by liyh 20230302
			var allAxesObjects = [];
			for(var i = 0; i < thatCE.scene.children.length; i++){
				var obj = thatCE.scene.children[i];
				if(obj.isAxes){
					allAxesObjects.push(obj);
				}
			}
			for(var i = 0; i < allAxesObjects.length; i++){
				var obj = allAxesObjects[i];
				thatCE.scene.remove(obj);
			}
			//删除轴网 added by liyh 20230302 -- END
		}
	}

    this.initRender = function() {
    	thatCE.renderer = new THREE.WebGLRenderer({
    		antialias: true,
			alpha: true
		});
    	if(thatCE.hasShadow){
	    	thatCE.renderer.shadowMap.enabled = thatCE.hasShadow;
    	}
		thatCE.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        var width = $("#" + thatCE.containerId).find(".coreInnerContainer").width();
        var height = $("#" + thatCE.containerId).find(".coreInnerContainer").height();
        thatCE.renderer.setSize(width, height);
		thatCE.renderer.setPixelRatio(window.devicePixelRatio);
        thatCE.renderer.setClearColor(thatCE.backgroundColor, thatCE.backgroundAlpha);
        $("#" + thatCE.containerId).find(".coreInnerContainer").append(thatCE.renderer.domElement);
    };

    this.initRender2D = function() {
    	thatCE.renderer2d = new CSS2DRenderer();
        var width = $("#" + thatCE.containerId).find(".coreInnerContainer").width();
        var height = $("#" + thatCE.containerId).find(".coreInnerContainer").height();
        thatCE.renderer2d.setSize( width, height );
        thatCE.renderer2d.domElement.style.position = 'absolute';
        thatCE.renderer2d.domElement.style.top = '0px';
        thatCE.renderer2d.domElement.tabIndex =	 0;
        thatCE.renderer2d.domElement.className = "coreInnerRenderer2d";
        $("#" + thatCE.containerId).find(".coreInnerContainer").append(thatCE.renderer2d.domElement);
    };

    this.hasAxes = function(componentInfo){
    	if(componentInfo.axes == null){
    		return false;
    	}
    	else if((componentInfo.axes.left != null && componentInfo.axes.left.length != 0)
		|| (componentInfo.axes.right != null && componentInfo.axes.right.length != 0)
		|| (componentInfo.axes.top != null && componentInfo.axes.top.length != 0)
		|| (componentInfo.axes.bottom != null && componentInfo.axes.bottom.length != 0)
		//增加竖直方向轴网 modified by ls 20230208
		|| (componentInfo.axes.vertical != null && componentInfo.axes.vertical.length != 0)){
    		return true;
		}
		else{
			 return false;
		}
    }

	//更新基准面可选下拉值 added ls 202030609
    this.initWorkPlaneSelectValues = function(componentInfo){
		var zAxesParamters = thatCE.getAxesParamters([componentInfo.axes.left, componentInfo.axes.right]);
		var xAxesParamters = thatCE.getAxesParamters([componentInfo.axes.top, componentInfo.axes.bottom]);
		var yAxesParamters = thatCE.getAxesParamters([componentInfo.axes.vertical]);
		var xzPosSelect = $("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneXZPositionSelect']");
		var xyPosSelect = $("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneXYPositionSelect']");
		var yzPosSelect = $("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneYZPositionSelect']");
		$(xzPosSelect).empty();
		$(xyPosSelect).empty();
		$(yzPosSelect).empty();

		if(zAxesParamters.length == 0){
			$(xyPosSelect).append("<option value=\"0\">原点</option>");
			$(xyPosSelect).append("<option value=\"" + (thatCE.componentInfo.size.z * thatCE.valueMultiply) + "\">最大值</option>");
		}
		else{
			for(var i = 0; i < zAxesParamters.length; i++){
				var axesParamter = zAxesParamters[i];
				$(xyPosSelect).append("<option value=\"" + axesParamter.value + "\">" + axesParamter.name + "</option>");
			}
		}
		$(xyPosSelect).append("<option value=\"\"></option>");
		$(xyPosSelect).val("");

		if(xAxesParamters.length == 0){
			$(yzPosSelect).append("<option value=\"0\">原点</option>");
			$(yzPosSelect).append("<option value=\"" + (thatCE.componentInfo.size.x * thatCE.valueMultiply) + "\">最大值</option>");
		}
		else{
			for(var i = 0; i < xAxesParamters.length; i++){
				var axesParamter = xAxesParamters[i];
				$(yzPosSelect).append("<option value=\"" + axesParamter.value + "\">" + axesParamter.name + "</option>");
			}
		}
		$(yzPosSelect).append("<option value=\"\"></option>");
		$(yzPosSelect).val("");

		if(yAxesParamters.length == 0){
			$(xzPosSelect).append("<option value=\"0\">原点</option>");
			$(xzPosSelect).append("<option value=\"" + (thatCE.componentInfo.size.y * thatCE.valueMultiply) + "\">最大值</option>");
		}
		else{
			for(var i = 0; i < yAxesParamters.length; i++){
				var axesParamter = yAxesParamters[i];
				$(xzPosSelect).append("<option value=\"" + axesParamter.value + "\">" + axesParamter.name + "</option>");
			}
		}
		$(xzPosSelect).append("<option value=\"\"></option>");
		$(xzPosSelect).val("");

    }

	//更新初始位置方式的下拉值 added ls 202030612
    this.initLocationTypeSelectValues = function(componentInfo){
    	thatCE.initLocationTypeParameterSelectValues(componentInfo);
    	thatCE.initLocationTypePointSelectValues(componentInfo);
    }

    this.initLocationTypeParameterSelectValues = function(componentInfo){
		var componentInitLocationTypeParameterSelect = $("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitLocationTypeParameter']");
		$(componentInitLocationTypeParameterSelect).empty();

		var allLocationParamters = thatCE.getAllLocationParamters(componentInfo);
		for(var i = 0 ; i < allLocationParamters.length; i++){
			var locationParamter = allLocationParamters[i];
			$(componentInitLocationTypeParameterSelect).append("<option value=\"" + locationParamter.name + "\">" + locationParamter.name + "</option>");
		}
		$(componentInitLocationTypeParameterSelect).append("<option value=\"\"></option>");
		$(componentInitLocationTypeParameterSelect).val("");
    }

    //辅助点选择，用于确定位置 added by ls 20230615
    this.initLocationTypePointSelectValues = function(componentInfo){
		var allAssistPointInfos = thatCE.getAllAssistPointUnitInfos(componentInfo);
		var componentInitLocationTypePointSelects = $("#" + thatCE.containerId).find(".propertyItem").find(".componentInitLocationTypePointSelect");

		for(var i = 0; i < componentInitLocationTypePointSelects.length ;i++){
			var componentInitLocationTypePointSelect = componentInitLocationTypePointSelects[i];
			$(componentInitLocationTypePointSelect).empty();
			for(var j = 0 ; j < allAssistPointInfos.length; j++){
				var assistPointInfo = allAssistPointInfos[j];
				$(componentInitLocationTypePointSelect).append("<option value=\"" + assistPointInfo.name + "\">" + assistPointInfo.name + "</option>");
			}
			$(componentInitLocationTypePointSelect).append("<option value=\"\"></option>");
			$(componentInitLocationTypePointSelect).val("");
		}
    }

    //获取本模型定义的所有辅助点信息 added ls 20230612
    this.getAllAssistPointUnitInfos = function(componentInfo){
    	var allAssistPointUnitMap = {};
    	for(var unitId in componentInfo.units){
	   		var unitInfo = componentInfo.units[unitId];
   			if(thatCE.checkIsAssistPoint(unitInfo.code)){
   				allAssistPointUnitMap[unitInfo.id] = unitInfo;
   			}
	   	}
	   	var allAssistPointUnitInfos = new Array();
	   	for(var unitId in allAssistPointUnitMap){
	   		var tempAssistPointUnitInfos = new Array();
	   		var unitSetting = allAssistPointUnitMap[unitId];
   			var added = false;
	   		for(var i = 0; i < allAssistPointUnitInfos.length; i++){
	   			var assistPointUnitInfo = allAssistPointUnitInfos[i];
	   			if(!added && assistPointUnitInfo.name > unitSetting.name){
	   				tempAssistPointUnitInfos.push(unitSetting);
	   				added = true;
	   			}
   				tempAssistPointUnitInfos.push(assistPointUnitInfo);
	   		}
	   		if(!added){
   				tempAssistPointUnitInfos.push(unitSetting);
	   		}
	   		allAssistPointUnitInfos = tempAssistPointUnitInfos;
	   	}
	   	return allAssistPointUnitInfos;
    }


    //获取所有和位置相关的参数 added by ls 20230612
    this.getAllLocationParamters = function(componentInfo){
    	var parameters = new Array();
    	for(var paramName in componentInfo.parameters){
    		var parameter = componentInfo.parameters[paramName];
    		switch(parameter.paramType){
    			/*
	    		case js3ParameterType.point3D:
	    		case js3ParameterType.polyline3D:
	    		*/
    			//目前仅支持line3D、point3D modified by 20230726
    			//增加decimal长度类型的参数 added by ls 20230810
				case js3ParameterType.decimal:
				case js3ParameterType.point3D:
	    		case js3ParameterType.line3D:{
	    			parameters.push(parameter);
	    			break;
	    		}
	    		default:{
	    			break;
	    		}
    		}
    	}
    	return parameters;
    }

    this.initAxes = function(componentInfo){
    	if(thatCE.gridVisible){
    		thatCE.initXYAxes(componentInfo);
    		thatCE.initYZAxes(componentInfo);
    		thatCE.initXZAxes(componentInfo);
    	}
    }

    this.initXYAxes = function(componentInfo){
		//删除原有轴网
		var axesName = "xy";
		var allAxesObjects = [];
    	for(var i = 0; i < thatCE.scene.children.length; i++){
    		var obj = thatCE.scene.children[i];
    		if(obj.isAxes && obj.axesName == axesName){
    			allAxesObjects.push(obj);
    		}
    	}
    	for(var i = 0; i < allAxesObjects.length; i++){
    		var obj = allAxesObjects[i];
    		thatCE.scene.remove(obj);
    	}
    	if(thatCE.componentInfo.workPlanes.xy.visible){
    		//轴网z方向位置
    		let axesZPos = thatCE.gridZero + thatCE.componentInfo.workPlanes.xy.position;

	    	if(thatCE.hasAxes(componentInfo)){
		    	var maxX = componentInfo.size.x;
		    	var maxY = componentInfo.size.y;
		    	var maxZ = componentInfo.size.z;

		    	var axisFontSize = componentInfo.axisFontSize;
		    	var lineLength = axisFontSize * 8;
		    	var splitLength = axisFontSize * 4;
		    	var textPos = axisFontSize * 3;
		    	var namePos = axisFontSize * 5;
		    	var totalTextPos = axisFontSize * 7;
	    		var textParameter = {
	    			font: thatCE.defaultFont,
	    			size: axisFontSize,
	    			height: axisFontSize / 10
	    		};

		    	//重绘
		    	var verticalAxesValues = thatCE.getAxesPartValues(componentInfo.axes.vertical);
		    	if(verticalAxesValues != null){
		    		var rotation = [0, 0, 0.5 * Math.PI];
		    		var linePointList = [];
		    		var namePointList = [];
		    		var lastY = 0;
		    		var firstLinePoint = {
		    			fromPoint: {x: maxX + lineLength, y: lastY, z: axesZPos},
		    			toPoint: {x: 0, y: lastY, z: axesZPos},
		    			splitPoint: {x: maxX + splitLength, y: lastY, z: axesZPos}
		    		};
		    		linePointList.push(firstLinePoint);
		    		for(var i = 0; i < verticalAxesValues.length; i++){
		    			var splitValueObj = verticalAxesValues[i];
		    			var splitValue = splitValueObj.value;
		    			var splitName = splitValueObj.name;
		    			var lastY = splitValue + lastY;

		    			//轴号 added by ls 20221028
		    			if(splitName.length != 0){
		    				namePointList.push({
		    					name: splitName,
				    			textPoint: {x: maxX + namePos, y: lastY, z: axesZPos},
		    				});
		    			}

		    			//如果间隔大于0 ，就增加线段 modified by ls 20221028
		    			if(splitValue > 0){
			    			if(i == verticalAxesValues.length - 1){
					    		linePointList.push({
					    			fromPoint: {x: maxX + lineLength, y: lastY, z: axesZPos},
					    			toPoint: {x: 0, y: lastY, z: axesZPos},
					    			splitPoint: {x: maxX + splitLength, y: lastY, z: axesZPos},
					    			textPoint: {x: maxX + textPos, y: lastY - splitValue / 2, z: axesZPos},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
			    			else{
					    		linePointList.push({
					    			fromPoint: {x:maxX + splitLength + axisFontSize * 1 / 4, y: lastY, z: axesZPos},
					    			toPoint: {x: 0, y: lastY, z: axesZPos},
					    			splitPoint: {x: maxX + splitLength, y: lastY, z: axesZPos},
					    			textPoint: {x: maxX + textPos, y: lastY - splitValue / 2, z: axesZPos},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
		    			}
		    		}
		    		firstLinePoint.textPoint = {x: maxX + totalTextPos, y: lastY / 2, z: axesZPos};
		    		firstLinePoint.value = lastY * thatCE.valueMultiply;
		    		thatCE.addAxesLines(linePointList, rotation, textParameter, axesName);
		    		thatCE.addAxesNames(namePointList, rotation, textParameter, axesName);
		    	}

		    	//上方轴网，如果没有定义，那么用下方的
		    	var topAxesValues = componentInfo.axes.top.length == 0 ? thatCE.getAxesPartValues(componentInfo.axes.bottom) : thatCE.getAxesPartValues(componentInfo.axes.top);
		    	if(topAxesValues != null){
		    		var rotation = [0, 0, 0];
		    		var linePointList = [];
		    		var namePointList = [];
		    		var lastX = 0;
		    		var firstLinePoint = {
		    			fromPoint: {x: lastX, y: maxY + lineLength, z: axesZPos},

		    			//横跨整个平面 modified by ls 20221103
		    			//toPoint: {x: lastX, z: maxZ + placePointRadius},
		    			toPoint: {x: lastX, y: 0, z: axesZPos},

		    			splitPoint: {x: lastX, y: maxY + splitLength, z: axesZPos}
		    		};
		    		linePointList.push(firstLinePoint);
		    		for(var i = 0; i < topAxesValues.length; i++){
		    			var splitValueObj = topAxesValues[i];
		    			var splitValue = splitValueObj.value;
		    			var splitName = splitValueObj.name;
		    			var lastX = splitValue + lastX;

		    			//轴号 added by ls 20221028
		    			if(splitName.length != 0){
		    				namePointList.push({
		    					name: splitName,
				    			textPoint: {x: lastX, y: maxY + namePos, z: axesZPos},
		    				});
		    			}

		    			//如果间隔大于0 ，就增加线段 modified by ls 20221028
		    			if(splitValue > 0){
			    			if(i == topAxesValues.length - 1){
					    		linePointList.push({
					    			fromPoint: {x: lastX, y: maxY + lineLength, z: axesZPos},
					    			toPoint: {x: lastX, y: 0, z: axesZPos},
					    			splitPoint: {x: lastX, y: maxY + splitLength, z: axesZPos},
					    			textPoint: {x: lastX - splitValue / 2, y: maxY + textPos, z: axesZPos},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
			    			else{
					    		linePointList.push({
					    			fromPoint: {x: lastX, y: maxY + splitLength + axisFontSize * 1 / 4, z: axesZPos},
					    			toPoint: {x: lastX, y: 0, z: axesZPos},
					    			splitPoint: {x: lastX, y: maxY + splitLength, z: axesZPos},
					    			textPoint: {x: lastX - splitValue / 2, y: maxY + textPos, z: axesZPos},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
		    			}
		    		}
		    		firstLinePoint.textPoint = {x: lastX / 2, y: maxY + totalTextPos, z: axesZPos};
		    		firstLinePoint.value = lastX * thatCE.valueMultiply;
		    		thatCE.addAxesLines(linePointList, rotation, textParameter, axesName);
		    		thatCE.addAxesNames(namePointList, rotation, textParameter, axesName);
		    	}
	    	}
    	}
    }

    this.initYZAxes = function(componentInfo){
		//删除原有轴网
		var axesName = "yz";
		var allAxesObjects = [];
    	for(var i = 0; i < thatCE.scene.children.length; i++){
    		var obj = thatCE.scene.children[i];
    		if(obj.isAxes && obj.axesName == axesName){
    			allAxesObjects.push(obj);
    		}
    	}
    	for(var i = 0; i < allAxesObjects.length; i++){
    		var obj = allAxesObjects[i];
    		thatCE.scene.remove(obj);
    	}
    	if(thatCE.componentInfo.workPlanes.yz.visible){
    		//轴网x方向位置
    		let axesXPos = thatCE.gridZero + thatCE.componentInfo.workPlanes.yz.position;

	    	if(thatCE.hasAxes(componentInfo)){
		    	var maxX = componentInfo.size.x;
		    	var maxY = componentInfo.size.y;
		    	var maxZ = componentInfo.size.z;

		    	var axisFontSize = componentInfo.axisFontSize;
		    	var lineLength = axisFontSize * 8;
		    	var splitLength = axisFontSize * 4;
		    	var textPos = axisFontSize * 3;
		    	var namePos = axisFontSize * 5;
		    	var totalTextPos = axisFontSize * 7;
	    		var textParameter = {
	    			font: thatCE.defaultFont,
	    			size: axisFontSize,
	    			height: axisFontSize / 10
	    		};

		    	//重绘
		    	var verticalAxesValues = thatCE.getAxesPartValues(componentInfo.axes.vertical);
		    	if(verticalAxesValues != null){
		    		var rotation = [0.5 * Math.PI, 0.5 * Math.PI, 0];
		    		var linePointList = [];
		    		var namePointList = [];
		    		var lastY = 0;
		    		var firstLinePoint = {
		    			fromPoint: {x: axesXPos, y: lastY, z: maxZ + lineLength},
		    			toPoint: {x: axesXPos, y: lastY, z: 0},
		    			splitPoint: {x: axesXPos, y: lastY, z: maxZ + splitLength}
		    		};
		    		linePointList.push(firstLinePoint);
		    		for(var i = 0; i < verticalAxesValues.length; i++){
		    			var splitValueObj = verticalAxesValues[i];
		    			var splitValue = splitValueObj.value;
		    			var splitName = splitValueObj.name;
		    			var lastY = splitValue + lastY;

		    			//轴号 added by ls 20221028
		    			if(splitName.length != 0){
		    				namePointList.push({
		    					name: splitName,
				    			textPoint: {x: axesXPos, y: lastY, z: maxZ + namePos},
		    				});
		    			}

		    			//如果间隔大于0 ，就增加线段 modified by ls 20221028
		    			if(splitValue > 0){
			    			if(i == verticalAxesValues.length - 1){
					    		linePointList.push({
					    			fromPoint: {x: axesXPos, y: lastY, z: maxZ + lineLength},
					    			toPoint: {x: axesXPos, y: lastY, z: 0},
					    			splitPoint: {x: axesXPos, y: lastY, z: maxZ + splitLength},
					    			textPoint: {x: axesXPos, y: lastY - splitValue / 2, z: maxZ + textPos},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
			    			else{
					    		linePointList.push({
					    			fromPoint: {x: axesXPos, y: lastY, z: maxZ + splitLength + axisFontSize * 1 / 4},
					    			toPoint: {x: axesXPos, y: lastY, z: 0},
					    			splitPoint: {x: axesXPos, y: lastY, z: maxZ + splitLength},
					    			textPoint: {x: axesXPos, y: lastY - splitValue / 2, z: maxZ + textPos},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
		    			}
		    		}
		    		firstLinePoint.textPoint = {x: axesXPos, y: lastY / 2, z: maxZ + totalTextPos};
		    		firstLinePoint.value = lastY * thatCE.valueMultiply;
		    		thatCE.addAxesLines(linePointList, rotation, textParameter, axesName);
		    		thatCE.addAxesNames(namePointList, rotation, textParameter, axesName);
		    	}

		    	//上方轴网，如果没有定义，那么用下方的
		    	var topAxesValues = componentInfo.axes.left.length == 0 ? thatCE.getAxesPartValues(componentInfo.axes.right) : thatCE.getAxesPartValues(componentInfo.axes.left);
		    	if(topAxesValues != null){
		    		var rotation = [0, 0.5 * Math.PI, 0];
		    		var linePointList = [];
		    		var namePointList = [];
		    		var lastZ = 0;
		    		var firstLinePoint = {
		    			fromPoint: {x: axesXPos, y: maxY + lineLength, z: lastZ},

		    			//横跨整个平面 modified by ls 20221103
		    			//toPoint: {x: lastX, z: maxZ + placePointRadius},
		    			toPoint: {x: axesXPos, y: 0, z: lastZ},

		    			splitPoint: {x: axesXPos, y: maxY + splitLength, z: lastZ}
		    		};
		    		linePointList.push(firstLinePoint);
		    		for(var i = 0; i < topAxesValues.length; i++){
		    			var splitValueObj = topAxesValues[i];
		    			var splitValue = splitValueObj.value;
		    			var splitName = splitValueObj.name;
		    			var lastZ = splitValue + lastZ;

		    			//轴号 added by ls 20221028
		    			if(splitName.length != 0){
		    				namePointList.push({
		    					name: splitName,
				    			textPoint: {x: axesXPos, y: maxY + namePos, z: lastZ},
		    				});
		    			}

		    			//如果间隔大于0 ，就增加线段 modified by ls 20221028
		    			if(splitValue > 0){
			    			if(i == topAxesValues.length - 1){
					    		linePointList.push({
					    			fromPoint: {x: axesXPos, y: maxY + lineLength, z: lastZ},
					    			toPoint: {x: axesXPos, y: 0, z: lastZ},
					    			splitPoint: {x: axesXPos, y: maxY + splitLength, z: lastZ},
					    			textPoint: {x: axesXPos, y: maxY + textPos, z: lastZ - splitValue / 2},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
			    			else{
					    		linePointList.push({
					    			fromPoint: {x: axesXPos, y: maxY + splitLength + axisFontSize * 1 / 4, z: lastZ},
					    			toPoint: {x: axesXPos, y: 0, z: lastZ},
					    			splitPoint: {x: axesXPos, y: maxY + splitLength, z: lastZ},
					    			textPoint: {x: axesXPos, y: maxY + textPos, z: lastZ - splitValue / 2},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
		    			}
		    		}
		    		firstLinePoint.textPoint = {x: axesXPos, y: maxY + totalTextPos, z: lastZ / 2};
		    		firstLinePoint.value = lastZ * thatCE.valueMultiply;
		    		thatCE.addAxesLines(linePointList, rotation, textParameter, axesName);
		    		thatCE.addAxesNames(namePointList, rotation, textParameter, axesName);
		    	}
	    	}
    	}
    }

    this.initXZAxes = function(componentInfo){
		//删除原有轴网
		var axesName = "xz";
		var allAxesObjects = [];
    	for(var i = 0; i < thatCE.scene.children.length; i++){
    		var obj = thatCE.scene.children[i];
    		if(obj.isAxes && obj.axesName == axesName){
    			allAxesObjects.push(obj);
    		}
    	}
    	for(var i = 0; i < allAxesObjects.length; i++){
    		var obj = allAxesObjects[i];
    		thatCE.scene.remove(obj);
    	}
    	if(thatCE.componentInfo.workPlanes.xz.visible){
    		//轴网y方向高度
    		let axesYPos = thatCE.gridZero + thatCE.componentInfo.workPlanes.xz.position;

	    	if(thatCE.hasAxes(componentInfo)){
		    	var maxX = componentInfo.size.x;
		    	var maxY = componentInfo.size.y;
		    	var maxZ = componentInfo.size.z;

		    	//轴号字体大小 modified by ls 20230313
		    	//var placePointRadius = componentInfo.placePointRadius;
		    	var axisFontSize = componentInfo.axisFontSize;
		    	var lineLength = axisFontSize * 8;
		    	var splitLength = axisFontSize * 4;
		    	var textPos = axisFontSize * 3;
		    	var namePos = axisFontSize * 5;
		    	var totalTextPos = axisFontSize * 7;
	    		var textParameter = {
	    			font: thatCE.defaultFont,
	    			size: axisFontSize,
	    			height: axisFontSize / 10
	    		};

		    	//重绘
		    	var leftAxesValues = thatCE.getAxesPartValues(componentInfo.axes.left);
		    	if(leftAxesValues != null){
		    		var rotation = [-0.5 * Math.PI, 0, 0.5 * Math.PI];;
		    		var linePointList = [];
		    		var namePointList = [];
		    		var lastZ = 0;
		    		var firstLinePoint = {
		    			fromPoint: {x: -lineLength, y: axesYPos, z: lastZ},
		    			//横跨整个平面 modified by ls 20221103
		    			//toPoint: {x: -placePointRadius, z: lastZ},
		    			toPoint: {x: maxX, y: axesYPos, z: lastZ},

		    			splitPoint: {x: -splitLength, y: axesYPos, z: lastZ}
		    		};
		    		linePointList.push(firstLinePoint);
		    		for(var i = 0; i < leftAxesValues.length; i++){
		    			var splitValueObj = leftAxesValues[i];
		    			var splitValue = splitValueObj.value;
		    			var splitName = splitValueObj.name;
		    			var lastZ = splitValue + lastZ;

		    			//轴号 added by ls 20221028
		    			if(splitName.length != 0){
		    				namePointList.push({
		    					name: splitName,
				    			textPoint: {x: -namePos, y: axesYPos, z: lastZ},
		    				});
		    			}

		    			//如果间隔大于0 ，就增加线段 modified by ls 20221028
		    			if(splitValue > 0){
			    			if(i == leftAxesValues.length - 1){
					    		linePointList.push({
					    			fromPoint: {x: -lineLength, y: axesYPos, z: lastZ},

					    			//横跨整个平面 modified by ls 20221103
					    			//toPoint: {x: -placePointRadius, z: lastZ},
					    			toPoint: {x: maxX, y: axesYPos, z: lastZ},

					    			splitPoint: {x: -splitLength, y: axesYPos, z: lastZ},
					    			textPoint: {x: -textPos, y: axesYPos, z: lastZ - splitValue / 2},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
			    			else{
					    		linePointList.push({
					    			fromPoint: {x: -splitLength - axisFontSize * 1 / 4, y: axesYPos, z: lastZ},

					    			//横跨整个平面 modified by ls 20221103
					    			//toPoint: {x: -placePointRadius, z: lastZ},
					    			toPoint: {x: maxX, y: axesYPos, z: lastZ},

					    			splitPoint: {x: -splitLength, y: axesYPos, z: lastZ},
					    			textPoint: {x: -textPos, y: axesYPos, z: lastZ - splitValue / 2},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
		    			}
		    		}
		    		firstLinePoint.textPoint = {x: -totalTextPos, y: axesYPos, z: lastZ / 2};
		    		firstLinePoint.value = lastZ * thatCE.valueMultiply;
		    		thatCE.addAxesLines(linePointList, rotation, textParameter, axesName);
		    		thatCE.addAxesNames(namePointList, rotation, textParameter, axesName);
		    	}

		    	//右侧轴网，如果没有定义，那么用左侧的 added by ls 20221028
		    	var rightAxesValues = componentInfo.axes.right.length == 0 ? leftAxesValues : thatCE.getAxesPartValues(componentInfo.axes.right);
		    	if(rightAxesValues != null){
		    		var rotation = [-0.5 * Math.PI, 0, 0.5 * Math.PI];;
		    		var linePointList = [];
		    		var namePointList = [];
		    		var lastZ = 0;
		    		var firstLinePoint = {
		    			fromPoint: {x: maxX + lineLength, y: axesYPos, z: lastZ},

		    			//横跨整个平面 modified by ls 20221103
		    			//toPoint: {x: maxX + placePointRadius, z: lastZ},
		    			toPoint: {x: 0, y: axesYPos, z: lastZ},

		    			splitPoint: {x: maxX + splitLength, y: axesYPos, z: lastZ}
		    		};
		    		linePointList.push(firstLinePoint);
		    		for(var i = 0; i < rightAxesValues.length; i++){
		    			var splitValueObj = rightAxesValues[i];
		    			var splitValue = splitValueObj.value;
		    			var splitName = splitValueObj.name;
		    			var lastZ = splitValue + lastZ;

		    			//轴号 added by ls 20221028
		    			if(splitName.length != 0){
		    				namePointList.push({
		    					name: splitName,
				    			textPoint: {x: maxX + namePos, y: axesYPos, z: lastZ},
		    				});
		    			}

		    			//如果间隔大于0 ，就增加线段 modified by ls 20221028
		    			if(splitValue > 0){
			    			if(i == rightAxesValues.length - 1){
					    		linePointList.push({
					    			fromPoint: {x: maxX + lineLength, y: axesYPos, z: lastZ},

					    			//横跨整个平面 modified by ls 20221103
					    			//toPoint: {x: maxX + placePointRadius, z: lastZ},
					    			toPoint: {x: 0, y: axesYPos, z: lastZ},

					    			splitPoint: {x: maxX + splitLength, y: axesYPos, z: lastZ},
					    			textPoint: {x: maxX + textPos, y: axesYPos, z: lastZ - splitValue / 2},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
			    			else{
					    		linePointList.push({
					    			fromPoint: {x:maxX + splitLength + axisFontSize * 1 / 4, y: axesYPos, z: lastZ},

					    			//横跨整个平面 modified by ls 20221103
					    			//toPoint: {x: maxX + placePointRadius, z: lastZ},
					    			toPoint: {x: 0, y: axesYPos, z: lastZ},

					    			splitPoint: {x: maxX + splitLength, y: axesYPos, z: lastZ},
					    			textPoint: {x: maxX + textPos, y: axesYPos, z: lastZ - splitValue / 2},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
		    			}
		    		}
		    		firstLinePoint.textPoint = {x: maxX + totalTextPos, y: axesYPos, z: lastZ / 2};
		    		firstLinePoint.value = lastZ * thatCE.valueMultiply;
		    		thatCE.addAxesLines(linePointList, rotation, textParameter, axesName);
		    		thatCE.addAxesNames(namePointList, rotation, textParameter, axesName);
		    	}

		    	var topAxesValues = thatCE.getAxesPartValues(componentInfo.axes.top);
		    	if(topAxesValues != null){
		    		var rotation = [-0.5 * Math.PI, 0, 0];
		    		var linePointList = [];
		    		var namePointList = [];
		    		var lastX = 0;
		    		var firstLinePoint = {
		    			fromPoint: {x: lastX, y: axesYPos, z: -lineLength},

		    			//横跨整个平面 modified by ls 20221103
		    			//toPoint: {x: lastX, z: -placePointRadius},
		    			toPoint: {x: lastX, y: axesYPos, z: maxZ},

		    			splitPoint: {x: lastX, y: axesYPos, z: -splitLength}
		    		};
		    		linePointList.push(firstLinePoint);
		    		for(var i = 0; i < topAxesValues.length; i++){
		    			var splitValueObj = topAxesValues[i];
		    			var splitValue = splitValueObj.value;
		    			var splitName = splitValueObj.name;
		    			var lastX = splitValue + lastX;

		    			//轴号 added by ls 20221028
		    			if(splitName.length != 0){
		    				namePointList.push({
		    					name: splitName,
				    			textPoint: {x: lastX, y: axesYPos, z: -namePos},
		    				});
		    			}

		    			//如果间隔大于0 ，就增加线段 modified by ls 20221028
		    			if(splitValue > 0){
			    			if(i == topAxesValues.length - 1){
					    		linePointList.push({
					    			fromPoint: {x: lastX, y: axesYPos, z: -lineLength},

					    			//横跨整个平面 modified by ls 20221103
					    			//toPoint: {x: lastX, z: -placePointRadius},
					    			toPoint: {x: lastX, y: axesYPos, z: maxZ},

					    			splitPoint: {x: lastX, y: axesYPos, z: -splitLength},
					    			textPoint: {x: lastX - splitValue / 2, y: axesYPos, z: -textPos},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
			    			else{
					    		linePointList.push({
					    			fromPoint: {x: lastX, y: axesYPos, z: -splitLength - axisFontSize * 1 / 4},

					    			//横跨整个平面 modified by ls 20221103
					    			//toPoint: {x: lastX, z: -placePointRadius},
					    			toPoint: {x: lastX, y: axesYPos, z: maxZ},

					    			splitPoint: {x: lastX, y: axesYPos, z: -splitLength},
					    			textPoint: {x: lastX - splitValue / 2, y: axesYPos, z: -textPos},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
		    			}
		    		}
		    		firstLinePoint.textPoint = {x: lastX / 2, y: axesYPos, z:-totalTextPos};
		    		firstLinePoint.value = lastX * thatCE.valueMultiply;
		    		thatCE.addAxesLines(linePointList, rotation, textParameter, axesName);
		    		thatCE.addAxesNames(namePointList, rotation, textParameter, axesName);
		    	}

		    	//下方轴网，如果没有定义，那么用上侧的 added by ls 20221028
		    	var bottomAxesValues = componentInfo.axes.bottom.length == 0 ? topAxesValues : thatCE.getAxesPartValues(componentInfo.axes.bottom);
		    	if(bottomAxesValues != null){
		    		var rotation = [-0.5 * Math.PI, 0, 0];
		    		var linePointList = [];
		    		var namePointList = [];
		    		var lastX = 0;
		    		var firstLinePoint = {
		    			fromPoint: {x: lastX, y: axesYPos, z: maxZ + lineLength},

		    			//横跨整个平面 modified by ls 20221103
		    			//toPoint: {x: lastX, z: maxZ + placePointRadius},
		    			toPoint: {x: lastX, y: axesYPos, z: 0},

		    			splitPoint: {x: lastX, y: axesYPos, z: maxZ + splitLength}
		    		};
		    		linePointList.push(firstLinePoint);
		    		for(var i = 0; i < bottomAxesValues.length; i++){
		    			var splitValueObj = bottomAxesValues[i];
		    			var splitValue = splitValueObj.value;
		    			var splitName = splitValueObj.name;
		    			var lastX = splitValue + lastX;

		    			//轴号 added by ls 20221028
		    			if(splitName.length != 0){
		    				namePointList.push({
		    					name: splitName,
				    			textPoint: {x: lastX, y: axesYPos, z: maxZ + namePos},
		    				});
		    			}

		    			//如果间隔大于0 ，就增加线段 modified by ls 20221028
		    			if(splitValue > 0){
			    			if(i == bottomAxesValues.length - 1){
					    		linePointList.push({
					    			fromPoint: {x: lastX, y: axesYPos, z: maxZ + lineLength},

					    			//横跨整个平面 modified by ls 20221103
					    			//toPoint: {x: lastX, z: maxZ + placePointRadius},
					    			toPoint: {x: lastX, y: axesYPos, z: 0},

					    			splitPoint: {x: lastX, y: axesYPos, z: maxZ + splitLength},
					    			textPoint: {x: lastX - splitValue / 2, y: axesYPos, z: maxZ + textPos},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
			    			else{
					    		linePointList.push({
					    			fromPoint: {x: lastX, y: axesYPos, z: maxZ + splitLength + axisFontSize * 1 / 4},

					    			//横跨整个平面 modified by ls 20221103
					    			//toPoint: {x: lastX, z: maxZ + placePointRadius},
					    			toPoint: {x: lastX, y: axesYPos, z: 0},

					    			splitPoint: {x: lastX, y: axesYPos, z: maxZ + splitLength},
					    			textPoint: {x: lastX - splitValue / 2, y: axesYPos, z: maxZ + textPos},
					    			value: splitValue * thatCE.valueMultiply
					    		});
			    			}
		    			}
		    		}
		    		firstLinePoint.textPoint = {x: lastX / 2, y: axesYPos, z: maxZ + totalTextPos};
		    		firstLinePoint.value = lastX * thatCE.valueMultiply;
		    		thatCE.addAxesLines(linePointList, rotation, textParameter, axesName);
		    		thatCE.addAxesNames(namePointList, rotation, textParameter, axesName);
		    	}
	    	}
    	}
    }

    this.addAxesLines = function(linePointList, rotation, textParameter, axesName){
        var lineColor = thatCE.gridColor;
        /*
        var rotation = [0, 0, 0];
        switch(direction){
	        case "left":
	        case "right":{
	        	rotation = [-0.5 * Math.PI, 0, 0.5 * Math.PI];
	        	break;
	        }
	        case "bottom":
	        case "top":{
	        	rotation = [-0.5 * Math.PI, 0, 0];
	        	break;
	        }
        }
        */
    	//每个刻度
    	for(var i = 0; i < linePointList.length; i++){
    		var linePoint = linePointList[i];
            var geometry = new THREE.BufferGeometry();
			const vertices = new Float32Array([
				linePoint.fromPoint.x, linePoint.fromPoint.y, linePoint.fromPoint.z,
				linePoint.toPoint.x, linePoint.toPoint.y, linePoint.toPoint.z
			]);
			geometry.setAttribute("position", new THREE.BufferAttribute( vertices, 3 ) );

            var line = new THREE.Line(geometry, thatCE.axesLineMaterial);
            line.isAxes = true;
            line.axesName = axesName;
        	thatCE.scene.add(line);
    	}

    	//每个间隔
    	for(var i = 1; i < linePointList.length; i++){
    		var lastLinePoint = linePointList[i - 1];
    		var linePoint = linePointList[i];
            var geometry = new THREE.BufferGeometry();
			const vertices = new Float32Array([
				lastLinePoint.splitPoint.x, lastLinePoint.splitPoint.y, lastLinePoint.splitPoint.z,
				linePoint.splitPoint.x, linePoint.splitPoint.y, linePoint.splitPoint.z
			]);
			geometry.setAttribute("position", new THREE.BufferAttribute( vertices, 3 ) );

            var line = new THREE.Line(geometry, thatCE.axesLineMaterial);
            line.isAxes = true;
            line.axesName = axesName;
        	thatCE.scene.add(line);

        	//显示值
        	var textGeo = new TextGeometry(cmnPcr.decimalToStr(linePoint.value, false, 0), textParameter);
        	var textMesh = new THREE.Mesh(textGeo, thatCE.axesTextMaterial);
			var textBox = new THREE.Box3().setFromObject(textMesh, true);
			textMesh.position.set(-(textBox.max.x + textBox.min.x) / 2, -(textBox.max.y + textBox.min.y) / 2, -(textBox.max.z + textBox.min.z) / 2);
        	var textObject3D = new THREE.Object3D();
        	textObject3D.add(textMesh);
        	thatCE.scene.add(textObject3D);
        	textObject3D.position.set(linePoint.textPoint.x, linePoint.textPoint.y, linePoint.textPoint.z);
        	textObject3D.rotation.set(rotation[0], rotation[1], rotation[2]);
        	textObject3D.isAxes = true;
        	textObject3D.axesName = axesName;
    	}

    	//总长度
		var firstLinePoint = linePointList[0];
		var lastLinePoint = linePointList[linePointList.length - 1];
		var totalGeometry = new THREE.BufferGeometry();
		const vertices = new Float32Array([
			firstLinePoint.fromPoint.x, firstLinePoint.fromPoint.y, firstLinePoint.fromPoint.z,
			lastLinePoint.fromPoint.x, lastLinePoint.fromPoint.y, lastLinePoint.fromPoint.z
		]);
		totalGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        var totalLine = new THREE.Line(totalGeometry, thatCE.axesLineMaterial);
        totalLine.isAxes = true;
        totalLine.axesName = axesName;
    	thatCE.scene.add(totalLine);

    	//显示总值
    	var totalTextGeo = new TextGeometry(cmnPcr.decimalToStr(firstLinePoint.value, false, 0), textParameter);
    	var totalTextMesh = new THREE.Mesh(totalTextGeo, thatCE.axesTextMaterial);
		var totalTextBox = new THREE.Box3().setFromObject(totalTextMesh, true);
		totalTextMesh.position.set(-(totalTextBox.max.x + totalTextBox.min.x) / 2, -(totalTextBox.max.y + totalTextBox.min.y) / 2, -(totalTextBox.max.z + totalTextBox.min.z) / 2);
    	var totalTextObject3D = new THREE.Object3D();
    	totalTextObject3D.add(totalTextMesh);
    	thatCE.scene.add(totalTextObject3D);
    	totalTextObject3D.position.set(firstLinePoint.textPoint.x, firstLinePoint.textPoint.y, firstLinePoint.textPoint.z);
    	totalTextObject3D.rotation.set(rotation[0], rotation[1], rotation[2]);
    	totalTextObject3D.isAxes = true;
    	totalTextObject3D.axesName = axesName;
    }

    //添加轴号到界面 added by ls 20221028
    this.addAxesNames = function(namePointList, rotation, textParameter, axesName){
        var lineColor = thatCE.gridColor;
        /*
        var rotation = [0, 0, 0];
        switch(direction){
	        case "left":
	        case "right":{
	        	rotation = [-0.5 * Math.PI, 0, 0.5 * Math.PI];
	        	break;
	        }
	        case "bottom":
	        case "top":{
	        	rotation = [-0.5 * Math.PI, 0, 0];
	        	break;
	        }
        }
        */

    	//每个间隔
    	for(var i = 0; i < namePointList.length; i++){
    		var namePoint = namePointList[i];

        	//显示值
        	var textGeo = new TextGeometry(namePoint.name, {
    			font: textParameter.font,
    			size: textParameter.size / namePoint.name.length,
    			height: textParameter.height
    		});
        	var textMesh = new THREE.Mesh(textGeo, thatCE.axesTextMaterial);
			var textBox = new THREE.Box3().setFromObject(textMesh, true);
			textMesh.position.set(-(textBox.max.x + textBox.min.x) / 2, -(textBox.max.y + textBox.min.y) / 2, -(textBox.max.z + textBox.min.z) / 2);
        	var textObject3D = new THREE.Object3D();
        	textObject3D.add(textMesh);
        	thatCE.scene.add(textObject3D);
        	textObject3D.position.set(namePoint.textPoint.x, namePoint.textPoint.y, namePoint.textPoint.z);
        	textObject3D.rotation.set(rotation[0], rotation[1], rotation[2]);
        	textObject3D.isAxes = true;
        	textObject3D.axesName = axesName;

        	//文字的外圈
        	let circlePoints = [];
        	let circleLineCount = 36;
        	let circleRadius = textParameter.size * 3 / 4;
        	for (let i = 0; i <= circleLineCount; i++) {
        		circlePoints.push(circleRadius * Math.cos(Math.PI * 2 * i / circleLineCount));
	        	circlePoints.push(circleRadius * Math.sin(Math.PI * 2 * i / circleLineCount));
	        	circlePoints.push(0);
        	}
            var circleGeometry = new THREE.BufferGeometry();
            circleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(circlePoints, 3));
            circleGeometry.attributes.position.needsUpdate = true;
            var circleObject3D = new THREE.Line(circleGeometry, thatCE.axesLineMaterial);
        	circleObject3D.position.set(namePoint.textPoint.x, namePoint.textPoint.y, namePoint.textPoint.z);
        	circleObject3D.rotation.set(rotation[0], rotation[1], rotation[2]);
			circleObject3D.isAxes = true;
			circleObject3D.axesName = axesName;
			thatCE.scene.add(circleObject3D);
    	}
    }

    this.getAxesPartValues = function(axesValue){
    	if(axesValue.length == 0){
    		return null;
    	}
    	else{
    		var axesPartValues = [];
	    	var partValues = axesValue.split(",");
	    	for(var i = 0; i < partValues.length; i++){
				var mark = "";
				var distance = null;
				var partValue = partValues[i].trim();
				var pvs = partValue.split(":");
				if(pvs.length == 1){
					distance = cmnPcr.strToDecimal(pvs[0].trim()) / thatCE.valueMultiply;
				}
				else if(pvs.length == 2){
					mark = pvs[0].trim();
					distance = cmnPcr.strToDecimal(pvs[1].trim()) / thatCE.valueMultiply;
				}
				if(distance != null){
					axesPartValues.push({
						name: mark,
						value: distance
					});
				}
	    	}
	    	return axesPartValues;
    	}
    }

    this.initGrid = function(componentInfo){
    	if(thatCE.gridVisible){
    		let axesXPos = thatCE.componentInfo.workPlanes.yz.visible ? (thatCE.gridZero + thatCE.componentInfo.workPlanes.yz.position) : 0;
    		let axesYPos = thatCE.componentInfo.workPlanes.xz.visible ? (thatCE.gridZero + thatCE.componentInfo.workPlanes.xz.position) : 0;
    		let axesZPos = thatCE.componentInfo.workPlanes.xy.visible ? (thatCE.gridZero + thatCE.componentInfo.workPlanes.xy.position) : 0;

	    	//删除原有的
	    	var allGridObjects = [];
	    	for(var i = 0; i < thatCE.scene.children.length; i++){
	    		var obj = thatCE.scene.children[i];
	    		if(obj.isGrid){
	    			allGridObjects.push(obj);
	    		}
	    	}
	    	for(var i = 0; i < allGridObjects.length; i++){
	    		var obj = allGridObjects[i];
	    		thatCE.scene.remove(obj);
	    	}

	    	//重绘
	    	var maxX = componentInfo.size.x;
	    	var maxY = componentInfo.size.y;
	    	var maxZ = componentInfo.size.z;

	    	var points = [];
	    	//xz面
	    	points.push([0, axesYPos, 0, 0, axesYPos, maxZ]);
	    	points.push([0, axesYPos, maxZ, maxX, axesYPos, maxZ]);
	    	points.push([maxX, axesYPos, maxZ, maxX, axesYPos, 0]);
	    	points.push([maxX, axesYPos, 0, 0, axesYPos, 0]);

	    	//yz面
	    	points.push([axesXPos, 0, 0, axesXPos, maxY, 0]);
	    	points.push([axesXPos, maxY, 0, axesXPos, maxY, maxZ]);
	    	points.push([axesXPos, maxY, maxZ, axesXPos, 0, maxZ]);
	    	points.push([axesXPos, 0, maxZ, axesXPos, 0, 0]);

	    	//xy面
	    	points.push([0, 0, axesZPos, maxX, 0, axesZPos]);
	    	points.push([maxX, 0, axesZPos, maxX, maxY, axesZPos]);
	    	points.push([maxX, maxY, axesZPos, 0, maxY, axesZPos]);
	    	points.push([0, maxY, axesZPos, 0, 0, axesZPos]);

	    	for(var i = 0; i < points.length; i++){
	    		var point = points[i];

	    		//替换为BufferGeometry modified by ls 20230322
	            var geometry = new THREE.BufferGeometry();
				let positions = [point[0], point[1], point[2], point[3], point[4], point[5]];
				geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
				geometry.attributes.position.needsUpdate = true;
	            var line = new THREE.Line(geometry, thatCE.gridLineMatertial);
	            line.isGrid = true;
	        	thatCE.scene.add(line);
	    	}

	    	thatCE.initOriginMesh();
    	}
    }

    this.initOriginMesh = function(){
    	var orginMesh = null;
    	for(var i = 0; i < thatCE.scene.children.length; i++){
    		var object3D = thatCE.scene.children[i];
    		if(object3D.isOrgin){
    			orginMesh = object3D;
    		}
    	}
    	if(orginMesh != null){
    		thatCE.scene.remove(orginMesh);
    	}

    	var edgeSize = thatCE.componentInfo.placePointRadius == null ? 0.01 : thatCE.componentInfo.placePointRadius * 2;
		var orginMesh= new THREE.Mesh(
	        new THREE.BoxGeometry(edgeSize, edgeSize, edgeSize),
	        new THREE.MeshLambertMaterial({
	        	color:0x0000FF
			})
	    );
		orginMesh.position.set(0,0,0);
		orginMesh.isOrgin = true;
		thatCE.scene.add(orginMesh);
    }

    this.initLight = function() {
		/*
		let ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
		thatCE.scene.add(ambientLight);

		let hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
		thatCE.scene.add(hemisphereLight);
		 */

		let lightSize = 1000;

		let lights = [
			{
				x: lightSize * 1.0,
				y: lightSize * 2.0,
				z: lightSize * 1.5,
				h: 0.0,
				s: 1.0,
				l: 1.0,
				color: 0xFFFFFF,
				size: 0.6,
				castShadow: true
			},
			{
				x: -lightSize * 3.0,
				y: -lightSize * 1.0,
				z: -lightSize * 2.0,
				h:0.1,
				s:1.0,
				l:0.95,
				color: 0xFFFFFF,
				size: 0.2,
				castShadow: false
			}
    	];
    	for(let i = 0; i < lights.length; i++) {
			let light = lights[i];
			let dirLight = new THREE.DirectionalLight(light.color, light.size);
	    	dirLight.position.set(light.x, light.y, light.z);//.normalize();
			dirLight.color.setHSL(light.h, light.s, light.l);
	    	dirLight.shadow.camera.near = 1; //产生阴影的最近距离
	    	dirLight.shadow.camera.far = lightSize * 3; //产生阴影的最远距离
	    	dirLight.shadow.camera.top = lightSize * 1.5; //最上边
	    	dirLight.shadow.camera.bottom = -lightSize * 1.5; //最下面
	    	dirLight.shadow.camera.left = -lightSize * 1.5; //产生阴影距离位置的最左边位置
	    	dirLight.shadow.camera.right = lightSize * 1.5; //最右边
	    	dirLight.shadow.mapSize.height = 1024 * 8;
	    	dirLight.shadow.mapSize.width = 1024 * 8;
	    	dirLight.castShadow = light.castShadow;
	    	thatCE.scene.add(dirLight);

	    	if(light.isMainLight){
	    		thatCE.mainLight = dirLight;
	    	}

	    	/*
	    	if(light.castShadow){

		        var lightHelper = new THREE.DirectionalLightHelper(dirLight)
		        thatCE.scene.add(lightHelper)

		        var debug = new THREE.CameraHelper(dirLight.shadow.camera);
		        debug.name = "debug" + i;
		        thatCE.scene.add(debug);
	    	}
	    	*/
    	}
    };

    this.initControls = function(){
    	var orbitControl = new OrbitControls(thatCE.camera, thatCE.renderer2d.domElement);
    	orbitControl.target = new THREE.Vector3(0, 0, 0);
    	orbitControl.update();
    	orbitControl.addEventListener("zoom", thatCE.onZoom);
    	orbitControl.addEventListener("end", thatCE.onOrbitChange);
    	orbitControl.addEventListener("pointerDown", thatCE.onPointerDown );

    	var orbitControlGizmo = new OrbitControlsGizmo(orbitControl, { size: 100, padding: 8 });
    	$("#" + thatCE.containerId).find(".gizmoContainer").append(orbitControlGizmo.domElement);

		thatCE.orbitControl = orbitControl;
		thatCE.orbitControlGizmo = orbitControlGizmo;

    };

    this.onPointerDown = function(){

    }

    this.onZoom = function(ev){
    	if(ev.type == "zoom"){
    		thatCE.autoRefreshAttachDistance();
    		thatCE.refreshAttachHelpLine2d();
    		thatCE.refreshTransformControlSize();
    		thatCE.pointCtrlProcessor.refreshAttachHelpLine2d();
    		thatCE.pointCtrlProcessor.refreshPointTransformControlSize();
    		$("#" + thatCE.containerId).find(".propertyInput[name='componentCameraZoom']").val(cmnPcr.decimalToStr(thatCE.camera.zoom, false, 2, true));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentCameraZoom']").attr("sourceValue", thatCE.camera.zoom);
    	}
    }

    this.refreshTransformControlSize = function(){
    	if(thatCE.transformControlVisible){
    		thatCE.transformControl.setSize( thatCE.componentInfo.controlSize * 15 / 100 );
    	}
    }

    this.refreshMultiTransformControlSize = function(){
    	if(thatCE.transformControlVisible){
    		var containerHeight = $("#" + thatCE.containerId).find(".coreContainer").height();
    		var containerWidth = $("#" + thatCE.containerId).find(".coreContainer").width();
    		var maxSize = Math.sqrt(containerHeight * containerHeight + containerWidth * containerWidth) / 5000;
    		var cameraPosition = thatCE.camera.position;
    		var cameraDistance = Math.sqrt(cameraPosition.x * cameraPosition.x + cameraPosition.y * cameraPosition.y + cameraPosition.z * cameraPosition.z);
    		var ctrlSize =  thatCE.componentInfo.controlSize * maxSize * cameraDistance / thatCE.camera.zoom;
    		thatCE.transformControl.setSize( ctrlSize );
    	}
    }

    this.initRaycaster = function() {
    	thatCE.raycaster = new THREE.Raycaster(); //光线投射器

    	//点击感应的范围 added by ls 20221124
    	thatCE.raycaster.params.Line.threshold = (thatCE.componentInfo.attachDistance == null ? 0.5 : thatCE.componentInfo.attachDistance) / 2;
    };

    this.afterBuildObject3D = function(unit3DInfo){
        var mainScene = thatCE.getMainScene();
        unit3DInfo.object3D.unitData = unit3DInfo.unitSetting;
        mainScene.add(unit3DInfo.object3D);
        unit3DInfo.object3D.isUnitObject = true;
      	thatCE.setObject3DRotation(unit3DInfo.object3D, unit3DInfo.unitSetting, false);
      	thatCE.setObject3DPosition(unit3DInfo.object3D, unit3DInfo.unitSetting, false);

      	//重新计算一下位置
        thatCE.runUnitObject3DRotationExpJs(unit3DInfo.object3D);
        thatCE.runUnitObject3DPositionExpJs(unit3DInfo.object3D);

    	thatCE.refreshObject3DUvMaterial(unit3DInfo.object3D, unit3DInfo.object3D.unitData.uvs);

    	//触发afterAddUnitObject3DToScene added by ls 20230830
    	thatCE.doEvent("afterAddUnitObject3DToScene", {
    		object3D: unit3DInfo.object3D
    	});

		thatCE.refreshLoadingProgress(unit3DInfo);
    }

    this.afterBuildObject3DByUser = function(unit3DInfo){
        var mainScene = thatCE.getMainScene();
        unit3DInfo.object3D.unitData = unit3DInfo.unitSetting;
        mainScene.add(unit3DInfo.object3D);
        unit3DInfo.object3D.isUnitObject = true;

      	//重新计算一下位置
        thatCE.runUnitObject3DRotationExpJs(unit3DInfo.object3D);
        thatCE.runUnitObject3DPositionExpJs(unit3DInfo.object3D);

    	thatCE.refreshObject3DUvMaterial(unit3DInfo.object3D, unit3DInfo.object3D.unitData.uvs);
		thatCE.refreshLoadingProgress(unit3DInfo);

      	thatCE.addUnitToList(unit3DInfo.unitSetting);
    	//触发afterAddUnitObject3DToScene added by ls 20230830
    	thatCE.doEvent("afterAddUnitObject3DToScene", {
    		object3D: unit3DInfo.object3D
    	});

    	thatCE.refreshListItemCount();

    	//刷新初始位置辅助点下拉 added by ls 20230612
    	if(thatCE.checkIsAssistPoint(unit3DInfo.unitSetting.code)){
    		var componentInfo = thatCE.getLastComponentInfo();
    		thatCE.initLocationTypePointSelectValues(componentInfo);
    	}

    	//可由参数指定添加后是否选中（默认选中） modified by ls 20220606
    	if(unit3DInfo.unitSetting.otherInfo == null || unit3DInfo.unitSetting.otherInfo.needSelect){
    		thatCE.selectUnitObject(unit3DInfo.object3D);
    	}

    	//调用command的添加后事件 added by ls 20230803
    	if(unit3DInfo.unitSetting.otherInfo == null || unit3DInfo.unitSetting.otherInfo.commandName){
    		var commandJson = js3CommandProcessors[unit3DInfo.unitSetting.otherInfo.commandName];
    		if(commandJson == null){
    			msgBox.alert({info: "不存在的命令: " + unit3DInfo.unitSetting.otherInfo.commandName});
    		}
    		else{
    			if(commandJson.afterAddObject3D != null){
    				commandJson.afterAddObject3D(unit3DInfo.object3D);
    			}
    		}
    	}
    }

    this.afterPasteBuildObject3D = function(unit3DInfo){
        var mainScene = thatCE.getMainScene();
        unit3DInfo.object3D.unitData = unit3DInfo.unitSetting;
        mainScene.add(unit3DInfo.object3D);
        unit3DInfo.object3D.isUnitObject = true;

      	//无论是否worldPosition 都需要计算 modifed by ls 202201
        thatCE.runUnitObject3DRotationExpJs(unit3DInfo.object3D);
        thatCE.runUnitObject3DPositionExpJs(unit3DInfo.object3D);

      	thatCE.addUnitToList(unit3DInfo.unitSetting);
    	//触发afterAddUnitObject3DToScene added by ls 20230830
    	thatCE.doEvent("afterAddUnitObject3DToScene", {
    		object3D: unit3DInfo.object3D
    	});

    	thatCE.selectUnitObject(unit3DInfo.object3D);
    	thatCE.refreshListItemCount();

    	//刷新初始位置辅助点下拉 added by ls 20230612
    	if(thatCE.checkIsAssistPoint(unit3DInfo.unitSetting.code)){
    		var componentInfo = thatCE.getLastComponentInfo();
    		thatCE.initLocationTypePointSelectValues(componentInfo);
    	}
    }

    this.addUnitObject3DToScene = function(refComponentInfo, unitSetting){
		var unitComProcessor = thatCE.object3DCreator.createJs3UnitComponentProcessor(unitSetting.code, unitSetting.versionNum);
		var parentParameters = thatCE.getComponentParametersForEditExp();
		unitComProcessor.init({
			editor: thatCE,
			unitId: unitSetting.id,
			mixType: unitSetting.mixType,

			//显示级别 added by ls 20230403
			viewLevel: unitSetting.viewLevel,

			useWorldPosition: unitSetting.useWorldPosition,
			useParameterPosition: unitSetting.useParameterPosition,
			position: unitSetting.position,
			rotation: unitSetting.rotation,
			componentInfo: refComponentInfo,
			valueParameters: unitSetting.parameters,
			positionExps: unitSetting.positionExps,
			rotationExps: unitSetting.rotationExps,
			parentParameters: parentParameters
		});

		unitComProcessor.buildComponent3DObject(unitSetting, parentParameters, thatCE.afterBuildObject3D);
    }

    this.addUnitObject3DToSceneByUser = function(refComponentInfo, unitSetting){
		var unitComProcessor = thatCE.object3DCreator.createJs3UnitComponentProcessor(unitSetting.code, unitSetting.versionNum);
		var parentParameters = thatCE.getComponentParametersForEditExp();
		unitComProcessor.init({
			editor: thatCE,
			unitId: unitSetting.id,
			mixType: unitSetting.mixType,

			//显示级别 added by ls 20230403
			viewLevel: unitSetting.viewLevel,

			useWorldPosition: unitSetting.useWorldPosition,
			useParameterPosition: unitSetting.useParameterPosition,
			position: unitSetting.position,
			rotation: unitSetting.rotation,
			componentInfo: refComponentInfo,
			valueParameters: unitSetting.parameters,
			positionExps: unitSetting.positionExps,
			rotationExps: unitSetting.rotationExps,
			parentParameters: parentParameters
		});

		unitComProcessor.buildComponent3DObject(unitSetting, parentParameters, thatCE.afterBuildObject3DByUser);
    }

    this.removeUnitFromList = function(object3D){
		thatCE.removeUnitFromUnitList(object3D.unitData.id);
    };

    this.removeUnitFromUnitList = function(unitId){
    	$("#" + thatCE.containerId).find(".unitItem[unitId='" + unitId + "']").remove();
    };

    this.addUnitToList = function(unitSetting){
    	if(thatCE.unitListVisible){
    		//unitSetting里增加所属分组id，如果没有指定，那么添加到当前分组 modified by ls 20220606
    		var groupId = unitSetting.otherInfo == null || unitSetting.otherInfo.groupId == null ? thatCE.getActiveGroupId() : unitSetting.otherInfo.groupId;
    		if(groupId != null){
    			thatCE.addUnitToGroupContainer(unitSetting, groupId);
    		}
    	}
    }

    this.getActiveGroupId = function(){
    	 var activeGroupItems =  $("#" + thatCE.containerId).find(".groupContainer .groupItemActive");
    	 if(activeGroupItems.length == 0){
    		 msgBox.alert({info: "没有选定组"});
    		 return null;
    	 }
    	 else{
    		 var groupId = $(activeGroupItems[0]).parent().attr("groupId");
    		 return groupId;
    	 }
    }

    this.initUnitItemBtnEvent = function(unitId){
    	var btnContainer = $("#" + thatCE.containerId).find(".unitItem[unitId='" + unitId + "']")[0];
    	$(btnContainer).find(".unitItemDeleteBtn").click(function(){
    		if(thatCE.checkIsNormalStatus()){
	    		var unitId = $(this).parent().attr("unitId");
	    		var object3D = thatCE.getObject3DByUnitId(unitId);
	    		thatCE.removeUnitObject3D(object3D);
    		}
    	}); ;
    	$(btnContainer).find(".unitItemChangeGroupBtn").click(function(){
    		if(thatCE.checkIsNormalStatus()){
	    		var unitId = $(this).parent().attr("unitId");
	    		var object3D = thatCE.getObject3DByUnitId(unitId);
	    		thatCE.showUnitChangeGroupWindow(object3D.unitData);
    		}
    	});
    	$(btnContainer).find(".unitItemMultiSelectBtn").click(function(){
    		var unitId = $(this).parent().attr("unitId");
    		var object3D = thatCE.getObject3DByUnitId(unitId);
        	thatCE.selectUnitObject(null);
    		thatCE.multiSelectUnitObject(object3D);
    	});
    	$(btnContainer).find(".unitItemName").click(function(){
    		if(thatCE.checkIsNormalStatus()){
	    		var unitId = $(this).parent().parent().attr("unitId");
	    		var object3D = thatCE.getObject3DByUnitId(unitId);
	        	thatCE.selectUnitObject(object3D);
    		}
    	});
    	$(btnContainer).find(".unitItemCheck").change(function(){
    		var unitItem = $(this).parent();
    		var noneCheck = $(this).hasClass("unitItemNoneCheck");
    		$(this).removeClass("unitItemPartCheck");
    		if(noneCheck){
        		$(this).removeClass("unitItemNoneCheck");
    		}
    		else{
        		$(this).addClass("unitItemNoneCheck");
    		}
    		var checked = noneCheck;
    		var groupId = $(unitItem).parent().parent().attr("groupId");
    		var unitId = $(unitItem).attr("unitId");
    		thatCE.refreshGroupItemCheck(groupId);
        	thatCE.setUnitObjectVisible(unitId, checked);
        	return true;
    	});
    }

    this.setUnitItemCheck = function(unitId, checked){
    	var unitItems = $("#" + thatCE.containerId).find(".unitItem[unitId='" +  unitId+ "']");
    	if(unitItems.length != 0){
    		var unitItem = unitItems[0];
    		var unitItemCheck = $(unitItem).find(".unitItemCheck")[0];
    		$(unitItemCheck).removeClass("unitItemPartCheck");
    		if(checked){
        		$(unitItemCheck).removeClass("unitItemNoneCheck");
    		}
    		else{
        		$(unitItemCheck).addClass("unitItemNoneCheck");
    		}
        	thatCE.setUnitObjectVisible(unitId, checked);
    	}
    }

    this.refreshGroupItemCheck = function(groupId){
    	var unitItemInGroupChecks = $("#" + thatCE.containerId).find(".groupContainer[groupId='" + groupId + "'] .unitItemCheck");
    	var unitCountInGroup = unitItemInGroupChecks.length;
    	var checkedUnitCountInGroup = 0;
    	for(var i = 0; i < unitCountInGroup; i++){
    		var checked = !$(unitItemInGroupChecks[i]).hasClass("unitItemNoneCheck");
    		if(checked){
    			checkedUnitCountInGroup++;
    		}
    	}
    	var groupItemCheck = $("#" + thatCE.containerId).find(".groupContainer[groupId='" + groupId + "'] .groupItemCheck");
    	if(checkedUnitCountInGroup == unitCountInGroup){
    		$(groupItemCheck).removeClass("groupItemNoneCheck");
    		$(groupItemCheck).removeClass("groupItemPartCheck");
    	}
    	else if(checkedUnitCountInGroup == 0){
    		$(groupItemCheck).removeClass("groupItemPartCheck");
    		$(groupItemCheck).addClass("groupItemNoneCheck");
    	}
    	else{
    		$(groupItemCheck).removeClass("groupItemNoneCheck");
    		$(groupItemCheck).addClass("groupItemPartCheck");
    	}
    }

    //展开组 added by ls 20220906
    this.expandGroupItem = function(groupId, collapse){
		var unitConainer = $(".groupContainer[groupId='" + groupId + "']").find(".unitContainer")[0];
		if($(unitConainer).css("display") == "none"){
			if(collapse == null || !collapse){
				//展开
				$(unitConainer).parent().find(".groupItemExpand").removeClass("groupItemExpandClose");
				$(unitConainer).css({display: "block"});
			}
		}
		else{
			if(collapse == null || collapse){
				//折叠
				$(unitConainer).parent().find(".groupItemExpand").addClass("groupItemExpandClose");
				$(unitConainer).css({display: "none"});
			}
		}
    }

    this.initGroupItemBtnEvent = function(groupId){
    	var btnContainer = $("#" + thatCE.containerId).find(".groupContainer[groupId='" + groupId + "']")[0];

    	//增加折叠组的功能 added by ls 20210902
    	$(btnContainer).find(".groupItem .groupItemExpand").click(function(){
    		//更换折叠/展开的方法 modified by ls 20220906
    		var groupConainer = $(this).parent().parent().find(".unitContainer").parent()[0];
    		var groupId = $(groupConainer).attr("groupId");
    		thatCE.expandGroupItem(groupId);
    	})

    	$(btnContainer).find(".groupItemDeleteBtn").click(function(){
    		if(thatCE.checkIsNormalStatus()){
	    		var groupId = $(this).parent().parent().attr("groupId");
	    		thatCE.removeGroupFromList(groupId);
    		}
    	});

    	$(btnContainer).find(".groupItemName").click(function(){
    		if(thatCE.checkIsNormalStatus()){
	    		var groupId = $(this).parent().parent().parent().attr("groupId");
	    		thatCE.selectGroupItem(groupId);
    		}
    	});

    	$(btnContainer).find(".groupItemRenameBtn").click(function(){
    		if(thatCE.checkIsNormalStatus()) {
				var groupContainer = $(this).parent().parent();
				var groupId = $(groupContainer).attr("groupId");
				var groupName = $(groupContainer).attr("groupName");

				//辅助点组和标注组不可修改名称 added by liyh 20230802
				if (groupName == "辅助点组" || groupName == "标注组") {
					var message = "辅助点组和标注组不可修改名称";
					msgBox.alert({info: message});
				}else{
					thatCE.showGroupInfoWindow({
						isNew: false,
						id: groupId,
						name: groupName
					});
				}
			}
    	});

    	$(btnContainer).find(".groupItemMultiSelectBtn").click(function(){
    		var groupContainer = $(this).parent().parent();
    		var groupId = $(groupContainer).attr("groupId");
    		var unitInfos = thatCE.getUnitInfosInGroup(groupId);
    		if(unitInfos.length > 0){
    			var unitIds = new Array();
    			for(var i = 0; i < unitInfos.length; i++){
    				var unitId = unitInfos[i].id;
    				unitIds.push(unitId);
    			}
            	thatCE.selectUnitObject(null);
    			thatCE.multiSelectUnitObjects(unitIds);
    		}
    	});

    	$(btnContainer).find(".groupItemUnitSortBtn").click(function(){
    		if(thatCE.checkIsNormalStatus()){
	    		var groupContainer = $(this).parent().parent();
	    		var groupId = $(groupContainer).attr("groupId");
	    		var groupName = $(groupContainer).attr("groupName");
	    		thatCE.showGroupUnitSortWindow({
	    			id: groupId,
	    			name: groupName
	    		});
    		}
    	});

    	$(btnContainer).find(".groupItemCheck").change(function(){
    		var noneCheck = $(this).hasClass("groupItemNoneCheck");
    		$(this).removeClass("groupItemPartCheck");
    		if(noneCheck){
        		$(this).removeClass("groupItemNoneCheck");
    		}
    		else{
        		$(this).addClass("groupItemNoneCheck");
    		}
    		var checked = noneCheck;
        	var allUnitItems = $("#" + thatCE.containerId).find(".groupContainer[groupId='" + groupId + "'] .unitItem");
        	var unitIds = new Array();
        	for(var i = 0; i < allUnitItems.length; i++){
        		var unitItem = allUnitItems[i];
        		var unitId = $(unitItem).attr("unitId");
            	var unitItemCheck = $(unitItem).find(".unitItemCheck")[0];
            	$(unitItemCheck).attr("checked", checked);
        		if(checked){
            		$(unitItemCheck).removeClass("unitItemNoneCheck")
        		}
        		else{
            		$(unitItemCheck).addClass("unitItemNoneCheck")
        		}
            	thatCE.setUnitObjectVisible(unitId, checked);
            	unitIds.push(unitId);
        	}
    	});
    }

    this.getAllUnitInfos = function(){
    	 var mainScene = thatCE.getMainScene();
    	 var allUnitInfos = {};
    	 for(var i = 0; i < mainScene.children.length; i++){
    		 var childObj = mainScene.children[i];
    		 if(childObj.isUnitObject){
    			 var unitSetting = thatCE.getUnitSettingFromObject3D(childObj);
    			 allUnitInfos[unitSetting.id] = unitSetting;
    		 }
    	 }
    	 return allUnitInfos;
    }

    this.getAllUnitObject3Ds = function(){
    	 var mainScene = thatCE.getMainScene();
    	 var allUnitObject3Ds = [];
    	 for(var i = 0; i < mainScene.children.length; i++){
    		 var childObj = mainScene.children[i];
    		 if(childObj.isUnitObject){
    			 allUnitObject3Ds.push(childObj);
    		 }
    	 }
    	 return allUnitObject3Ds;
    }

    this.getAllPointCtrlInfoArray = function(){
    	return thatCE.pointCtrlProcessor.getAllPointCtrlInfoArray();
    }

    this.getAllGroupInfos = function(){
    	var allGroupContainers = $("#" + thatCE.containerId).find(".groupContainer");
    	 var allGroupInfos = [];
    	 for(var i = 0; i < allGroupContainers.length; i++){
    		 var groupContainer = allGroupContainers[i];
    		 var groupInfo = {
    			id: $(groupContainer).attr("groupId"),
    			name: $(groupContainer).attr("groupName"),
    			isDefault: $(groupContainer).attr("isDefault") == "true",
    			units: []
    		 };
    		 var unitItems = $(groupContainer).find(".unitItem");
    		 for(var j = 0; j < unitItems.length; j++){
    			 var unitItem = unitItems[j];
    			 var unitId = $(unitItem).attr("unitId");
    			 groupInfo.units.push(unitId);
    		 }
    		 allGroupInfos.push(groupInfo);
    	 }
    	 return allGroupInfos;
    }

    //根据group名称获取group信息 added by ls 20231207
    this.getGroupInfoByName = function(groupName){
    	var allGroupContainers = $("#" + thatCE.containerId).find(".groupContainer");
    	for(var i = 0; i < allGroupContainers.length; i++){
    		var groupContainer = allGroupContainers[i];
    		var name = $(groupContainer).attr("groupName");
    		if(name == groupName){
    			var groupInfo = {
					id: $(groupContainer).attr("groupId"),
					name: name,
					isDefault: $(groupContainer).attr("isDefault") == "true",
					units: []
	    		};
    			var unitItems = $(groupContainer).find(".unitItem");
    			for(var j = 0; j < unitItems.length; j++){
    				var unitItem = unitItems[j];
    				var unitId = $(unitItem).attr("unitId");
    				groupInfo.units.push(unitId);
    			}
    			return groupInfo;
    		}
    	}
    	return null;
    }

    this.getUnitInfosInGroup = function(groupId){
    	var groupContainer = $("#" + thatCE.containerId).find(".groupContainer[groupId='" + groupId + "']");
    	var allUnitInfos = [];
	 	var unitItems = $(groupContainer).find(".unitItem");
	 	for(var j = 0; j < unitItems.length; j++){
		 	var unitItem = unitItems[j];
		 	var unitId = $(unitItem).attr("unitId");
    		var object3D = thatCE.getObject3DByUnitId(unitId);
    		var unitSetting = thatCE.getUnitSettingFromObject3D(object3D);
    		allUnitInfos.push(unitSetting);
	 	}
   	 	return allUnitInfos;
	}

    this.getAllUnitNameDic = function(){
    	var time0 = new Date();
   	 	var allUnitNameDics = {};
    	var mainScene = thatCE.getMainScene();
    	for(var i = 0; i < mainScene.children.length; i++){
    		var childObj = mainScene.children[i];
    		if(childObj.isUnitObject){
    			allUnitNameDics[childObj.unitData.name] = true;
    		}
    	}
     	var time1 = new Date();
    	return allUnitNameDics;
    }

    this.getCameraViewport = function(){
    	return {
    		zoom: thatCE.orbitControl.zoom0,
			position: [thatCE.orbitControl.position0.x, thatCE.orbitControl.position0.y, thatCE.orbitControl.position0.z],
			target: [thatCE.orbitControl.target0.x, thatCE.orbitControl.target0.y, thatCE.orbitControl.target0.z],
			box: thatCE.getSceneBoxValues()
    	};
    }

    this.getLastComponentInfo = function(){
    	thatCE.orbitControl.saveState();
    	thatCE.componentInfo.camera = thatCE.getCameraViewport();
    	thatCE.componentInfo.units = thatCE.getAllUnitInfos();
    	thatCE.componentInfo.groups = thatCE.getAllGroupInfos();
    	thatCE.componentInfo.points = thatCE.getAllPointCtrlInfoArray();

    	//获取截图 added by ls 20230522
    	thatCE.componentInfo.snapshot = thatCE.getComponentImage(true, 256, 0x000000, 0);

    	return thatCE.componentInfo;
    }

    this.getComponentImage = function(hideWorkPlane, imageWidth, backColor, backAlpha){
    	var gridVisible = thatCE.gridVisible;
		var backgroundColor = thatCE.backgroundColor;
		var backgroundAlpha = thatCE.backgroundAlpha;
    	var workPlanesVisible = {
    		xy: thatCE.componentInfo.workPlanes.xy.visible,
    		yz: thatCE.componentInfo.workPlanes.yz.visible,
    		xz: thatCE.componentInfo.workPlanes.xz.visible
    	};
    	if(hideWorkPlane){
	    	thatCE.gridVisible = false;
			thatCE.backgroundColor = backColor;
			thatCE.backgroundAlpha = backAlpha;

	    	thatCE.componentInfo.workPlanes.xy.visible = false;
	    	thatCE.componentInfo.workPlanes.yz.visible = false;
	    	thatCE.componentInfo.workPlanes.xz.visible = false;

	    	thatCE.rebuildGridVisible(thatCE.componentInfo);
	    	thatCE.rebuildWorkPlaneVisible(thatCE.componentInfo);
	    	thatCE.rebuildRenderBackGroudColor();
    	}
        let canvas = thatCE.renderer.domElement;
    	var imageHeight = imageWidth * (canvas.height / canvas.width);
    	var tempCanvas = document.createElement('canvas');
    	var tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = imageWidth;
        tempCanvas.height = imageHeight;

    	thatCE.render();
        tempContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, imageWidth, imageHeight);
        var data = tempCanvas.toDataURL("image/png");
        var prefix = "data:image/png;base64,";
        var image = data.substr(prefix.length);
        $(tempCanvas).remove();
        if(hideWorkPlane){
	        thatCE.gridVisible = gridVisible;
			thatCE.backgroundColor = backgroundColor;
			thatCE.backgroundAlpha = backgroundAlpha;

	    	thatCE.componentInfo.workPlanes.xy.visible = workPlanesVisible.xy;
	    	thatCE.componentInfo.workPlanes.yz.visible = workPlanesVisible.yz;
	    	thatCE.componentInfo.workPlanes.xz.visible = workPlanesVisible.xz;

	    	thatCE.rebuildGridVisible(thatCE.componentInfo);
	    	thatCE.rebuildWorkPlaneVisible(thatCE.componentInfo);
	    	thatCE.rebuildRenderBackGroudColor();
        }
    	return image;
    }

    this.getSceneBoxValues = function(){
    	var boxValues = {
    		min: {x: Infinity, y: Infinity, z: Infinity},
    		max: {x: -Infinity, y: -Infinity, z: -Infinity}
    	};
    	for(var i = 0; i < thatCE.scene.children.length; i++){
    		var object3D = thatCE.scene.children[i];
    		if(object3D.unitData != null){
    			var box = new THREE.Box3().setFromObject(object3D, true);
    			if(box.min.x < boxValues.min.x){
    				boxValues.min.x = box.min.x;
    			}
    			if(box.min.y < boxValues.min.y){
    				boxValues.min.y = box.min.y;
    			}
    			if(box.min.z < boxValues.min.z){
    				boxValues.min.z = box.min.z;
    			}
    			if(box.max.x > boxValues.max.x){
    				boxValues.max.x = box.max.x;
    			}
    			if(box.max.y > boxValues.max.y){
    				boxValues.max.y = box.max.y;
    			}
    			if(box.max.z > boxValues.max.z){
    				boxValues.max.z = box.max.z;
    			}
    		}
    	}
    	return boxValues;
    }

    this.getUnitSettingFromObject3D = function(object3D){
    	var position = object3D.position;
		var rotation = object3D.rotation;
		var unitSetting = {
			id: object3D.unitData.id,
			name: object3D.unitData.name,
			code: object3D.unitData.code,
			versionNum: object3D.unitData.versionNum,
			mixType: object3D.unitData.mixType,

			//显示级别 added by ls 20230403
			viewLevel: object3D.unitData.viewLevel,

			useWorldPosition: object3D.unitData.useWorldPosition,
			useParameterPosition: object3D.unitData.useParameterPosition,
			position: [position.x, position.y, position.z],
			rotation: [rotation.x, rotation.y, rotation.z],
			count: object3D.unitData.count,
			countExp: object3D.unitData.countExp,
			materials: object3D.unitData.materials,
			parameters: object3D.unitData.parameters,
			positionExps: object3D.unitData.positionExps,
			rotationExps: object3D.unitData.rotationExps,
			uvs: object3D.unitData.uvs,

			//支持展开BOM added by ls 20230726
			hasBOM: object3D.unitData.hasBOM,
		 };
    	return unitSetting;
    }

    //通过函数，改变UseWorldPosition，这样好记录position和rotation added by ls 20220606
    this.changeUseWorldPosition = function(object3D, useWorldPosition){
    	if(object3D.unitData.useWorldPosition != useWorldPosition){
    		if(useWorldPosition){
    			object3D.unitData.position = [object3D.position.x, object3D.position.y, object3D.position.z];
    			object3D.unitData.rotation = [object3D.rotation.x, object3D.rotation.y, object3D.rotation.z];
    		}
    		else{
    			object3D.position.set(object3D.unitData.position[0], object3D.unitData.position[1], object3D.unitData.position[2]);
    			object3D.rotation.set(object3D.unitData.rotation[0], object3D.unitData.rotation[1], object3D.unitData.rotation[2]);
    		}
    		object3D.unitData.useWorldPosition = useWorldPosition;
    	}
    }

    this.cloneUnitSetting = function(unitSetting){
		var newUnitSetting = {
			id: unitSetting.id,
			name: unitSetting.name,
			code: unitSetting.code,
			versionNum: unitSetting.versionNum,
			mixType: unitSetting.mixType,

			//显示级别 added by ls 20230403
			viewLevel: unitSetting.viewLevel,

			useWorldPosition: unitSetting.useWorldPosition,
			useParameterPosition: unitSetting.useParameterPosition,
			position: [unitSetting.position[0], unitSetting.position[1], unitSetting.position[2]],
			rotation: [unitSetting.rotation[0], unitSetting.rotation[1], unitSetting.rotation[2]],
			count: unitSetting.count,
			countExp: null,
			parameters: {} ,

			//支持展开BOM added by ls 20220726
			hasBOM: unitSetting.hasBOM,
		 };
		if(unitSetting.countExp != null){
			newUnitSetting.countExp = {
				pim: unitSetting.countExp.pim,
				js: unitSetting.countExp.js
			};
		}
		if(unitSetting.parameters != null){
			for(var paramName in unitSetting.parameters){
				var param = unitSetting.parameters[paramName];
				var newParam = {value: param.value};
				if(param.exp != null){
					newParam.exp = {
						pim: param.exp.pim,
						js: param.exp.js
					};
				}
				newUnitSetting.parameters[paramName] = newParam;
			}
		}
		if(unitSetting.positionExps != null){
			newUnitSetting.positionExps = {};
			for(var posName in unitSetting.positionExps){
				var exp = unitSetting.positionExps[posName];
				newUnitSetting.positionExps[posName] = {
					pim: exp.pim,
					js: exp.js
				};
			}
		}
		if(unitSetting.rotationExps != null){
			newUnitSetting.rotationExps = {};
			for(var rotName in unitSetting.rotationExps){
				var exp = unitSetting.rotationExps[rotName];
				newUnitSetting.rotationExps[rotName] = {
					pim: exp.pim,
					js: exp.js
				};
			}
		}
		if(unitSetting.uvs != null){
			newUnitSetting.uvs = {};
			for(var meshKey in unitSetting.uvs){
				var meshFaceUvs = unitSetting.uvs[meshKey];
				var newMeshFaceUvs = {};
				for(var faceKey in meshFaceUvs){
					var faceUv = meshFaceUvs[faceKey];
					var newFaceUv = {
						faceIndex:faceUv.faceIndex,
						imageName: faceUv.imageName,
						a: {x: faceUv.a.x, y: faceUv.a.y},
						b: {x: faceUv.b.x, y: faceUv.b.y},
						c: {x: faceUv.c.x, y: faceUv.c.y}
					};
					newMeshFaceUvs[faceKey] = newFaceUv;
				}
				newUnitSetting.uvs[meshKey] = newMeshFaceUvs;
			}
		}
		return newUnitSetting;
    }

    this.setObject3DRotation = function(object3D, componentSetting, isNewComponent){
    	if(!isNewComponent || componentSetting.rotation != null){
    		object3D.rotation.set(componentSetting.rotation[0], componentSetting.rotation[1], componentSetting.rotation[2]);
    	}
    }

    this.setObject3DPosition = function(object3D, componentSetting, isNewComponent){
       	object3D.position.set(componentSetting.position[0], componentSetting.position[1], componentSetting.position[2]);
    }

    //当object3D的位置、旋转角度改变时 added by ls 20221208
    this.afterObject3DPositionRotationChanged = function(object3D){
    	if(object3D == thatCE.selectedUnitObject3D){
    		thatCE.setTagPositionAndRotation(object3D);
    	}
    }

    this.getMainScene = function(){
		return thatCE.scene;
    };

    this.getObject3DInScene = function(scene){
    	var meshes = new Array();
		for(var i = 0; i < scene.children.length; i++){
			var scene2Child = scene.children[i];
			if(scene2Child.type == "Object3D" || scene2Child.type == "Group"){
				return scene2Child;
			}
			else if(scene2Child.type == "Mesh"){
				var group = new THREE.Group();
		        var box = new THREE.Box3().setFromObject(scene2Child, true);
		        var xCenter = (box.min.x + box.max.x) / 2;
		        var yCenter = (box.min.y + box.max.y) / 2;
		        var zCenter = (box.min.z + box.max.z) / 2;
				scene2Child.rotation.set(-0.5 * Math.PI, 0, 0);
				scene2Child.position.set(-xCenter, -yCenter, -zCenter);
				group.add(scene2Child);
				group.position.set(0, 0, 0);
				return group;
			}
		}
    	throw "None object3D or group in the scene.";
    }

    this.getObject3DByUnitId = function(unitId){
	   	 var mainScene = thatCE.getMainScene();
	   	 for(var i = 0; i < mainScene.children.length; i++){
	   		 var childObj = mainScene.children[i];
	   		 if( childObj.isUnitObject){
	   			if(childObj.unitData.id == unitId){
	   				return childObj;
	   			}
	   		 }
	   	 }
	   	 return null;
    }

    //根据构件名称获取构件 added by ls 20220906
    this.getObject3DByUnitName = function(unitName){
	   	 var mainScene = thatCE.getMainScene();
	   	 for(var i = 0; i < mainScene.children.length; i++){
	   		 var childObj = mainScene.children[i];
	   		 if( childObj.isUnitObject){
	   			if(childObj.unitData.name == unitName){
	   				return childObj;
	   			}
	   		 }
	   	 }
	   	 return null;
    }

    this.initContent = function(componentInfo){
    	thatCE.loadAllGroups(componentInfo);
    	thatCE.loadAllUnitObject3D(componentInfo);
    	var totalUnitCount = thatCE.getUnitCount(componentInfo);
    }

    this.addObject3DToSceneByUnit = function(unit){

    }

    this.loadAllGroups = function(componentInfo){
    	var allGroups = componentInfo.groups;
    	var allGroupContainer = $("#" + thatCE.containerId).find(".core3dTabContent[name='groupUnitList'] .core3dListContainer");
    	for(var i = 0; i < allGroups.length; i++){
    		var group = allGroups[i];
    		thatCE.addGroupToList(group, allGroupContainer);
    	}
    }

    this.addGroupToList = function(group, allGroupContainer){
		var groupHtml = thatCE.getGroupHtml(group);
		$(allGroupContainer).append(groupHtml);
		var unitContainer = $(allGroupContainer).find(".groupContainer[groupId='" + group.id + "'] .unitContainer");
		var unitIds = group.units;
		var allUnitHtml = "";
		for(var j = 0; j < unitIds.length; j++){
			var unitId = unitIds[j];
			var unit = thatCE.componentInfo.units[unitId];
	    	if(unit == null){
	    		var a = 1;
	    	}
			var unitHtml = thatCE.getUnitHtml(unit);
			allUnitHtml += unitHtml;
		}
		$(unitContainer).html(allUnitHtml);

		thatCE.initGroupItemBtnEvent(group.id);
		for(var j = 0; j < unitIds.length; j++){
			var unitId = unitIds[j];
    		thatCE.initUnitItemBtnEvent(unitId);
		}
		if(group.isDefault){
			thatCE.selectGroupItem(group.id);
		}
    }

    this.addNewGroup = function(group){
    	var allGroupContainer = $("#" + thatCE.containerId).find(".core3dTabContent[name='groupUnitList'] .core3dListContainer");
		var groupHtml = thatCE.getGroupHtml(group);
		$(allGroupContainer).append(groupHtml);
		thatCE.initGroupItemBtnEvent(group.id);
    }

    this.showGroupInfoWindow = function(groupInfoParameters){
		var popContainer = new PopupContainer( {
			width : 250 ,
			height : 160,
			top : 50,
			title: "分组"
		});

		popContainer.show();
		var inputId = cmnPcr.getRandomValue();
		var titleId = inputId + "_title";
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
			+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"
			+ "</iframe>"
			+ "</div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		var parameterStr = cmnPcr.jsonToStr(groupInfoParameters);
		$("#" + editorFrameId).attr("src", "../../design/common/nameEditor.jsp?parameters=" + cmnPcr.encodeURI(parameterStr));
		$("#" + okBtnId).click(function(){
			var newParameters = $("#" + editorFrameId)[0].contentWindow.getParameters();
			if(newParameters.name.length == 0){
				msgBox.alert({info: "名称不能为空."});
			}
			else if(thatCE.checkHasSameNameGroup(newParameters)) {
				msgBox.alert({info: "已存在名为'" + newParameters.name + "'的分组."});
			}
			else {
				if(newParameters.isNew){
					thatCE.addNewGroup(newParameters);
					thatCE.selectGroupItem(newParameters.id);
				}
				else{
					thatCE.renameGroup(newParameters);
				}
				popContainer.close();
			}
		});
		$("#" + cancelBtnId).click(function(){
			thatCE.setStatus(js3CoreEditorStatus.normal);
			popContainer.close();
		});
	}

    this.renameGroup = function(groupInfo){
		var groupItem = $("#" +thatCE.containerId).find(".groupContainer[groupId='" + groupInfo.id + "']");
		$(groupItem).attr("groupName", groupInfo.name);
		$(groupItem).find(".groupItemName").text(groupInfo.name);
    }

    this.selectGroupItem = function(groupId){
		$("#" +thatCE.containerId).find(".groupItem").removeClass("groupItemActive");
		var groupItem = $("#" +thatCE.containerId).find(".groupContainer[groupId='" + groupId + "'] .groupItem");
		$(groupItem).addClass("groupItemActive");
    }

    this.removeGroupFromList = function(groupId, notConfirm){
    	var groupContainer = $("#" + thatCE.containerId).find(".groupContainer[groupId='" + groupId + "']");
    	var isDefault = $(groupContainer).attr("isDefault") == "true";
    	var unitItems = $(groupContainer).find(".unitItem");
		var groupName = $(groupContainer).attr("groupName");

    	if(unitItems.length > 0){
        	var message = "该分组内图元会被全部删除, 确定要删除吗?";
        	if(msgBox.confirm({info: message})){
	        	var unitIds = new Array();
	        	for(var i = 0; i < unitItems.length; i++){
	        		var unitId = $(unitItems[i]).attr("unitId");
	        		unitIds.push(unitId);
	        	}
	        	thatCE.removeUnitObjectsByIds(unitIds);
        	}
    	}
    	else{
    		if(isDefault){
	        	var message = "不可以删除默认分组";
    			msgBox.alert({info: message});
    		}
			//辅助点组和标注组不可修改名称 added by liyh 20230802
			else if (groupName == "辅助点组" || groupName == "标注组") {
				var message = "辅助点组和标注组不可删除";
				msgBox.alert({info: message});
			}
    		else{
	        	var message = "确定要删除该分组吗?";
	        	if(msgBox.confirm({info: message})){
		        	var groupContainer = $("#" + thatCE.containerId).find(".groupContainer[groupId='" + groupId + "']");
		        	$(groupContainer).remove();
	        	}
    		}
    	}
    }

    this.addUnitToGroupContainer = function(unitInfo, groupId){
    	var unitContainer = $("#" + thatCE.containerId).find(".groupContainer[groupId='" + groupId + "'] .unitContainer");
		var unitHtml = thatCE.getUnitHtml(unitInfo);
		$(unitContainer).append(unitHtml);
		thatCE.initUnitItemBtnEvent(unitInfo.id);
    	thatCE.refreshListItemCount();

    	//刷新初始位置辅助点下拉 added by ls 20230612
    	if(thatCE.checkIsAssistPoint(unitInfo.code)){
    		var componentInfo = thatCE.getLastComponentInfo();
    		thatCE.initLocationTypePointSelectValues(componentInfo);
    	}
    }

    this.addUnitToDefaultGroupContainer = function(unitInfo){
    	var unitContainer = $("#" + thatCE.containerId).find(".groupContainer[isDefault='true'] .unitContainer");
		var unitHtml = thatCE.getUnitHtml(unitInfo);
		$(unitContainer).append(unitHtml);
		thatCE.initUnitItemBtnEvent(unitInfo.id);
    	thatCE.refreshListItemCount();

    	//刷新初始位置辅助点下拉 added by ls 20230612
    	if(thatCE.checkIsAssistPoint(unitInfo.code)){
    		var componentInfo = thatCE.getLastComponentInfo();
    		thatCE.initLocationTypePointSelectValues(componentInfo);
    	}
    }

    this.getGroupHtml = function(group){
    	var nameHtml = cmnPcr.html_encode(group.name);
    	var html = "<div class=\"groupContainer\" groupId=\"" + group.id + "\" groupName=\"" + group.name + "\" isDefault=\"" + (group.isDefault ? "true" : "false") + "\">"
    		+ "<div class=\"groupItem\">"

    		//增加折叠按钮 added by ls 20210902
			+ "<div  class=\"groupItemExpand groupItemExpandClose\"></div>"

			+ "<input type=\"checkbox\" class=\"groupItemCheck\"></input>"
    		+ "<div class=\"groupItemText\"><span class=\"groupItemName\">" + nameHtml + "</span>&nbsp;&nbsp;<span class=\"groupItemCount\">(" + (group.units == null ? 0 : group.units.length) + ")</span></div>"
    		+ "<div class=\"groupItemBtn groupItemMultiSelectBtn\" title=\"将组内图元添加到多选\"></div>"
    		+ "<div class=\"groupItemBtn groupItemUnitSortBtn\" title=\"组内图元排序\"></div>"
    		+ "<div class=\"groupItemBtn groupItemRenameBtn\" title=\"重命名\"></div>"
    		+ "<div class=\"groupItemBtn groupItemDeleteBtn\" title=\"删除组（当组内有图元时，删除组内所有图元）\"></div>"
    		+ "</div>"
    		+ "<div class=\"unitContainer\" style=\"display:none;\"></div>"
    		+ "</div>";
    	return html;
    }

    this.getUnitHtml = function(unitSetting){
    	var subText = thatCE.getUnitSubText(unitSetting);
    	var html = "<div class=\"unitItem\" unitId=\"" + unitSetting.id + "\">"
			+ "<input type=\"checkbox\" class=\"unitItemCheck\"></input>"
			+ "<div class=\"unitItemText\"><span class=\"unitItemName\">" + cmnPcr.html_encode(unitSetting.name) + "</span>&nbsp;&nbsp;"
			+ "<span class=\"unitItemSubText\">" + subText + "</span></div>"
			+ "<div class=\"unitItemBtn unitItemMultiSelectBtn\" title=\"添加到多选\"></div>"
			+ "<div class=\"unitItemBtn unitItemChangeGroupBtn\" title=\"更换分组\"></div>"
			+ "<div class=\"unitItemBtn unitItemDeleteBtn\" title=\"删除图元\"></div>"
			+ "</div>";
		return html;
    }

    this.getUnitSubText = function(unitSetting){
    	var mixTypeText = js3UnitMixType.getMixTypeText(unitSetting.mixType);
    	var viewLevelText = js3ViewLevelType.getViewLevelText(unitSetting.viewLevel);
    	var subText = mixTypeText + (mixTypeText.length != 0 && viewLevelText.length != 0 ? ", " : "") + viewLevelText;
    	return (subText.length == 0 ? "" : ("(" + subText + ")"));
    }

    this.loadAllUnitObject3D = function(componentInfo){
    	var allUnits = componentInfo.units;
    	var totalUnitCount = 0;
    	for(var unitId in allUnits){
    		totalUnitCount++;
    	}

        //增加operateType added by ls 20220705
    	thatCE.initLoadingProgress(totalUnitCount, "loadAll");

    	//改为一次提交 added by ls 20230403
    	let unitComInfoHash = {};
    	for(var unitId in allUnits){
    		var unitSetting = allUnits[unitId];
    		var refComponentKey = unitSetting.code + "_" + unitSetting.versionNum;
    		var refComponentInfo = thatCE.componentInfo.refComponents[refComponentKey];
    		//thatCE.addUnitObject3DToScene(refComponentInfo, unitSetting);
    		if(unitComInfoHash[refComponentKey] == null){
    			unitComInfoHash[refComponentKey] = {
    				code: unitSetting.code,
    				versionNum: unitSetting.versionNum,
					unitSettings: []
    			};
    		}
    		var unitSettings = unitComInfoHash[refComponentKey].unitSettings;
    		unitSettings.push(unitSetting);
    	}
		var parentParameters = thatCE.getComponentParametersForEditExp();
    	thatCE.createObject3Ds(unitComInfoHash, parentParameters, thatCE.afterBuildObject3D);
    }

    this.getUnitCount = function(componentInfo){
    	var count = 0;
    	for(var i = 0; i < componentInfo.groups.length; i++){
    		var group = componentInfo.groups[i];
    		count += group.units.length;
    	}
    	return count;
    }

    this.loadingProgress = {
    	isLoading: false,
    	totalCount: 0,
    	curentIndex: 0
    };

    //初始化loading
    //增加operateType added by ls 20220705
    this.initLoadingProgress = function(totalCount, operateType){
    	$("#" + thatCE.containerId).find(".loadingContainer").attr("operateType", operateType);

    	if(totalCount == 0){
	    	thatCE.loadingProgress.totalCount = 0;
        	$("#" + thatCE.containerId).find(".loadingContainer").css({display: "none"});

        	//因为unit个数为0，直接调用加载完成所有Unit的方法 added by ls 20220705
        	thatCE.afterLoadAllUnits(operateType);
    	}
    	else{
	    	thatCE.loadingProgress = {
				isLoading: true,
				totalCount: totalCount,
		    	curentIndex: 0
	    	};
	    	$("#" + thatCE.containerId).find(".loadingText").text("正在加载...");
        	$("#" + thatCE.containerId).find(".loadingContainer").css({display: "block"});
    	}
    }

    this.refreshLoadingProgress = function(unit3DInfo){
    	if(thatCE.loadingProgress.isLoading){
	    	thatCE.loadingProgress.curentIndex = thatCE.loadingProgress.curentIndex + 1;
	    	if(thatCE.loadingProgress.curentIndex < thatCE.loadingProgress.totalCount){
		    	var text = "正在加载  " + cmnPcr.decimalToStr( 100 * thatCE.loadingProgress.curentIndex / thatCE.loadingProgress.totalCount, false, 2) + "%";
		    	$("#" + thatCE.containerId).find(".loadingText").text(text);
	    	}
	    	else{
	    		thatCE.loadingProgress.isLoading = false;
		    	$("#" + thatCE.containerId).find(".loadingText").text("加载完成");
	        	$("#" + thatCE.containerId).find(".loadingContainer").css({display: "none"});

	            //增加operateType added by ls 20220705
	        	var operateType = $("#" + thatCE.containerId).find(".loadingContainer").attr("operateType");
	        	thatCE.afterLoadAllUnits(operateType);
	    	}
    	}
    }

    //加载完所有unit后执行
    //增加operateType added by ls 20220705
    this.afterLoadAllUnits = function(operateType){
		thatCE.doEvent("afterLoadAllUnits", {
       		editor: thatCE,
       		operateType: operateType
       	});
    }

    this.refreshListItemCount = function(){
    	var allGroupContainers = $("#" + thatCE.containerId).find(".groupContainer");
    	for(var i = 0; i < allGroupContainers.length; i++){
    		var groupContainer = allGroupContainers[i];
    		var unitCount = $(groupContainer).find(".unitItem").length;
			$(groupContainer).find(".groupItemCount").text("(" + unitCount + ")");
    	}
    }

    this.setUnitObjectVisible = function(unitId, visible){
		var object3D = thatCE.getObject3DByUnitId(unitId);
		object3D.visible = visible;
		var children = object3D.children;
		if(children != null){
			for(var i = 0; i < children.length; i++){
				var child = children[i];
				child.visible = visible;
			}
		}
    }

    // 窗口变动触发
    this.onWindowResize = function() {
        let width = $("#" + thatCE.containerId).find(".coreContainer").width();
        let height = $("#" + thatCE.containerId).find(".coreContainer").height();
        let aspect = width / height;
		thatCE.camera.left = - thatCE.frustumSize * aspect / 2;
		thatCE.camera.right = thatCE.frustumSize * aspect / 2;
		thatCE.camera.top = thatCE.frustumSize / 2;
		thatCE.camera.bottom = - thatCE.frustumSize / 2;
		thatCE.camera.updateProjectionMatrix();
        thatCE.renderer.setSize(width, height);
        thatCE.renderer2d.setSize(width, height);
    	thatCE.refreshAttachHelpLine2d();
    	thatCE.pointCtrlProcessor.refreshAttachHelpLine2d();

    	//修正this为thatCE by liyh 20230713 //划线用的材质，使用了line2，需要加这一句 added ls 20230614
		//this.waitingPlaceLineMaterial.resolution.set(window.innerWidth, window.innerHeight);
    };

    this.multiSelectUnitObject = function(object3D){
    	if(thatCE.canSelectObject3D){
	    	var itemContainer = $("#" + thatCE.containerId).find(".core3dTabContent[name=\"multiUnitSelectedList\"] .multiUnitList");
	    	var isInMultiList = thatCE.checkInMultiUnitObjects(object3D);
	    	if(isInMultiList){
	        	thatCE.removeUnitFromMultiList(object3D, itemContainer);
	    		thatCE.removeMultSelectBox(object3D);
	        	thatCE.refreshMultiUnitCount();
	        	if(thatCE.multiSelectedUnitObject3Ds.length > 0){
	    			thatCE.setStatus(js3CoreEditorStatus.multiSelect);
	        	}
	        	else{
	    			thatCE.setStatus(js3CoreEditorStatus.normal);
	        	}
	    	}
	    	else{
	    		thatCE.addUnitToMultiList(object3D, itemContainer);
	        	thatCE.createMultSelectBox(object3D);
	        	thatCE.refreshMultiUnitCount();
				thatCE.setStatus(js3CoreEditorStatus.multiSelect);
	    	}

	    	thatCE.showUnitInfo();

        	//删除标注 added by ls 20221209
        	thatCE.showUnitTags(null);
    	}
    }

    this.cancelAllMultiSelectUnitObjects = function(){
    	if(thatCE.canSelectObject3D){
	    	if(thatCE.multiSelectedUnitObject3Ds.length > 0){
		    	var itemContainer = $("#" + thatCE.containerId).find(".core3dTabContent[name=\"multiUnitSelectedList\"] .propertyList");
		    	var items = $(itemContainer).find(".multiUnitItem");
		    	var allUnitIds = new Array();
		    	for(var i = 0; i < items.length; i++){
		    		var unitId = $(items[i]).attr("unitId");
		    		allUnitIds.push(unitId);
		    	}
		    	for(var i = 0; i < allUnitIds.length; i++){
		    		var unitId = allUnitIds[i]
					var object3D = thatCE.getObject3DByUnitId(unitId);
		        	thatCE.removeUnitFromMultiList(object3D, itemContainer);
		    		thatCE.removeMultSelectBox(object3D);
		    	}
		    	thatCE.refreshMultiUnitCount();
		    	thatCE.showUnitInfo();

            	//删除标注 added by ls 20221209
            	thatCE.showUnitTags(null);

				thatCE.setStatus(js3CoreEditorStatus.normal);
	    	}
    	}
    }

    this.multiSelectUnitObjects = function(unitIds){
    	if(thatCE.canSelectObject3D){
	    	var itemContainer = $("#" + thatCE.containerId).find(".core3dTabContent[name=\"multiUnitSelectedList\"] .multiUnitList");
	    	for(var i = 0; i < unitIds.length; i++){
	    		var unitId = unitIds[i]
				var object3D = thatCE.getObject3DByUnitId(unitId);
	        	var isInMultiList = thatCE.checkInMultiUnitObjects(object3D);
	        	if(!isInMultiList){
	        		thatCE.addUnitToMultiList(object3D, itemContainer);
	            	thatCE.createMultSelectBox(object3D);
	        	}
	    	}
	    	thatCE.refreshMultiUnitCount();
	    	thatCE.showUnitInfo();

        	//删除标注 added by ls 20221209
        	thatCE.showUnitTags(null);

	    	if(thatCE.multiSelectedUnitObject3Ds.length > 0){
				thatCE.setStatus(js3CoreEditorStatus.multiSelect);
	    	}
	    	else{
				thatCE.setStatus(js3CoreEditorStatus.normal);
	    	}
    	}
    }

    this.refreshMultiUnitCount = function(){
    	var multiContainer = $("#" + thatCE.containerId).find(".core3dTabContent[name=\"multiUnitSelectedList\"]");
    	$(multiContainer).find(".multiUnitCount").text(thatCE.multiSelectedUnitObject3Ds.length);
    }

    this.checkInMultiUnitObjects = function(object3D){
    	var isInMultiList = false;
    	for(var i = 0; i < thatCE.multiSelectedUnitObject3Ds.length; i++){
    		var tempObject3D = thatCE.multiSelectedUnitObject3Ds[i];
    		if(tempObject3D == object3D){
    			isInMultiList = true;
    		}
    	}
    	return isInMultiList;
    }


    this.removeUnitFromMultiList = function(object3D, itemContainer){
    	var unitSetting = object3D.unitData;
    	var multiSelectedUnitObject3Ds = thatCE.multiSelectedUnitObject3Ds;
    	var newObject3DList = new Array();
    	for(var i = 0; i < thatCE.multiSelectedUnitObject3Ds.length; i++){
    		var tempObject3D = thatCE.multiSelectedUnitObject3Ds[i];
    		if(tempObject3D != object3D){
    			newObject3DList.push(tempObject3D);
    		}
    	}
    	thatCE.multiSelectedUnitObject3Ds = newObject3DList;

		//从选中列表中删除
    	$(itemContainer).find(".multiUnitItem[unitId=\"" + unitSetting.id + "\"]").remove();
    }

    this.addUnitToMultiList = function(object3D, itemContainer){
    	var unitSetting = object3D.unitData;
		thatCE.multiSelectedUnitObject3Ds.push(object3D);

		//添加到选中列表
		var itemHtml = thatCE.getMultiSelectUnitItemHtml(unitSetting);
		$(itemContainer).append(itemHtml);
		$(itemContainer).find(".multiUnitItem[unitId=\"" + unitSetting.id + "\"] .multiUnitDeleteBtn").click(function(){
			var unitId = $(this).parent().attr("unitId");
			var object3D = thatCE.getObject3DByUnitId(unitId);
        	thatCE.removeUnitFromMultiList(object3D, itemContainer);
    		thatCE.removeMultSelectBox(object3D);
        	thatCE.showUnitInfo();

        	//删除标注 added by ls 20221209
        	thatCE.showUnitTags(null);
		});
    }

    this.getMultiSelectUnitItemHtml = function(unitSetting){
    	var html = "<div class=\"multiUnitItem\" unitId=\"" + unitSetting.id + "\">"
    		+ "<div class=\"multiUnitName\" title=\"" + unitSetting.name + "\">" + unitSetting.name + "</div>"
    		+ "<div class=\"multiUnitDeleteBtn\" title=\"取消选中\"></div>"
    		+ "</div>";
    	return html;
    }


    this.createMultSelectBox = function(object3D){
        var box = new THREE.Box3().setFromObject(object3D, true);
		var boxMesh= new THREE.Mesh(
	        new THREE.BoxGeometry(box.max.x - box.min.x + 0.01, box.max.y - box.min.y + 0.01, box.max.z - box.min.z + 0.01),
	        thatCE.multiSelectBoxMaterial
        );
		boxMesh.position.set((box.max.x + box.min.x) / 2, (box.max.y + box.min.y) / 2, (box.max.z + box.min.z) / 2);
		boxMesh.isMultiBox = true;

        var boxEdges= new THREE.EdgesGeometry(boxMesh.geometry, 25);
        var boxLine = new THREE.LineSegments(boxEdges, thatCE.multiSelectBoxEdgeMaterial);
        boxLine.isEdgeLine = true;
        boxMesh.add(boxLine);

        boxMesh.relativeUnitData = {
        	id: object3D.unitData.id
        };

		thatCE.scene.add(boxMesh);
    }
    this.removeMultSelectBox = function(object3D){
    	var boxMesh = null;
    	for(var i = 0; i < thatCE.scene.children.length; i++){
    		var tempObject3D = thatCE.scene.children[i];
    		if(tempObject3D.isMultiBox){
    			if(tempObject3D.relativeUnitData.id == object3D.unitData.id){
    				boxMesh = tempObject3D;
    				break;
    			}
    		}
    	}
    	thatCE.scene.remove(boxMesh);
    }

    this.selectUnitObject = function(object3D){
    	if((thatCE.status == js3CoreEditorStatus.normal) && (thatCE.selectedUnitObject3D != null || object3D != null)){
    		var selectedUnitObject3D = thatCE.selectedUnitObject3D;
	        if (selectedUnitObject3D != null) {
        		thatCE.selectObjectUnlight(selectedUnitObject3D);
        		thatCE.detachTransformControl();
	        }
	        thatCE.selectedUnitObject3D = object3D;
	        if(object3D != null){

	        	//如果当前显示的是造型结果，那么切换成编辑状态
	        	if($("#" + thatCE.containerId).find("input[name='componentResult']").prop("checked")){
	        		$("#" + thatCE.containerId).find("input[name='componentResult']").attr("checked", false)
	        		thatCE.showComponentResult(false);
	        	}

        		thatCE.selectObjectLight(object3D);
    			thatCE.attachTransformControl(object3D);
	        	thatCE.showUnitInfo(object3D);
	        }
	        else{
	        	thatCE.showUnitInfo(null);
	        }

	        //显示标注 added by ls 20221208
	        thatCE.showUnitTags(object3D);
    	}
    	else{
    		//删除标注 added by ls 20221208
    		thatCE.showUnitTags(null);
    	}
    	thatCE.refreshAttachHelpLine2d();
    }

    //显示构件的标注 added by ls 20221208
    this.showUnitTags = function(object3D){
        var mainScene = thatCE.getMainScene();
        //删除原有的标注
        var oldTagRootObject3D = null;
    	for(var i = 0; i < mainScene.children.length; i++){
    		var childObj = mainScene.children[i];
    		if(childObj.isTagRootObject){
    			oldTagRootObject3D = childObj;
    			break;
    		}
    	}
		mainScene.remove(oldTagRootObject3D);

		if(object3D != null){
			//添加新的标注
			var cacheKey = object3D.cacheKey;
			var tagRootObject3D = thatCE.object3DCreator.createTagRootObject3D(cacheKey);
			mainScene.add(tagRootObject3D);
			object3D.tagRootObject3D = tagRootObject3D;

			//根据object3D获取center造成的偏移量，并设置tagRootObject3D的偏移量
	        var centerShift = object3D.centerShift;

	        for(var i = 0; i < tagRootObject3D.children.length; i++){
	        	var tagObj = tagRootObject3D.children[i];
	            var x = tagObj.position.x + centerShift.x;
	            var y = tagObj.position.y + centerShift.y;
	            var z = tagObj.position.z + centerShift.z;
	            tagObj.position.set(x, y, z);
	        }

			//按照object3D设置tagRootObject3D的位置和旋转角度
	        thatCE.setTagPositionAndRotation(object3D);
		}
    }

    //根据object3D设置tagRootObject3D的位置 added by ls 20221208
    this.setTagPositionAndRotation = function(object3D){
    	var tagRootObject3D = object3D.tagRootObject3D;
    	tagRootObject3D.position.set(object3D.position.x, object3D.position.y, object3D.position.z);
    	tagRootObject3D.rotation.set(object3D.rotation.x, object3D.rotation.y, object3D.rotation.z);
    }

    this.afterSelectUnitFunc = function(componentId){

    }

	//获取需要显示的tab，如果当前tab也在新的side里面，那就继续选择此tab，否则选择新的side里最后选择的哪个tab
	this.getNeedShowTabName = function(sideName, groupName){
		let currentTabName = "";
		let container = $("#" + thatCE.containerId);
		switch(sideName){
			case "left":{
				currentTabName = $(container).find(".core3dLeftContainer").find(".titleSelected").attr("name");
				break;
			}
			case "right":{
				currentTabName = $(container).find(".core3dRightContainer").find(".titleSelected").attr("name");
				break;
			}
		}

		let tabNames = sideTabGroups[groupName];
		let needShowTabName = tabNames[0];
		for(let i = 0; i < tabNames.length; i++){
			let tabName = tabNames[i];
			if(tabName === currentTabName){
				needShowTabName = tabName;
				break;
			}
		}
		return needShowTabName;
	}

    this.showUnitInfo = function(object3D){
		thatCE.selectedUnitObject3D = object3D;
		thatCE.attachLines = null;
		var unitId = null;
		if(thatCE.multiSelectedUnitObject3Ds.length > 0){
			thatCE.setLeftSide("leftMultiSelect", thatCE.getNeedShowTabName("left", "leftMultiSelect"));
			thatCE.setRightSide("rightMultiSelect", thatCE.getNeedShowTabName("right", "rightMultiSelect"));
		}
		else if(object3D == null){
    		thatCE.detachTransformControl();
        	if(thatCE.unitInfoVisible){
    			thatCE.setLeftSide("leftSingleSelect", thatCE.getNeedShowTabName("left", "leftSingleSelect"));
    			thatCE.setRightSide("rightComponentSelect", thatCE.getNeedShowTabName("right", "rightComponentSelect"));
        	}
		}
		else{
        	if(thatCE.unitInfoVisible){
    			thatCE.setLeftSide("leftSingleSelect", thatCE.getNeedShowTabName("left", "leftSingleSelect"));
    			thatCE.setRightSide("rightUnitSelect", thatCE.getNeedShowTabName("right", "rightUnitSelect"));
		    	thatCE.refreshUnitPropertyValues(object3D);
        	}
			unitId = object3D.unitData.id;
		}
		if(thatCE.unitListVisible){
	    	var unitItems = $("#" + thatCE.containerId).find(".unitItem");
	    	for(var i = 0; i < unitItems.length; i++){
	    		var unitItem = unitItems[i];
	    		if($(unitItem).attr("unitId") == unitId){
	    			$(unitItem).addClass("unitItemSelected");
	    		}
	    		else{
	    			$(unitItem).removeClass("unitItemSelected");
	    		}
	    	}

	    	//判断如果unitItem的父节点没有展开，那么展开；如果没有显示到可见区域，那么显示出来 added by ls 20220906
	    	if(object3D != null){
	    		//判断如果unitItem的父节点没有展开，那么展开
		    	var unitItem =  $("#" + thatCE.containerId).find(".unitItem[unitId='" + unitId + "']")[0];
		    	var groupId = $(unitItem).parent().parent().attr("groupId");
	    		thatCE.expandGroupItem(groupId, false);

	    		//获取各相关元素位置信息
	    		var unitItemTop = $(unitItem)[0].offsetTop;
	    		var unitItemParentTop = $(unitItem).parent()[0].offsetTop;
	    		var unitItemParentParentTop = $(unitItem).parent().parent()[0].offsetTop;
	    		var unitItemTopToLeftContainer = unitItemTop + unitItemParentTop + unitItemParentParentTop;
	    		var unitItemHeight = $(unitItem)[0].offsetHeight;
	    		var unitItemOffset = $(unitItem).offset();
	    		var groupContent = $("#" + thatCE.containerId).find(".core3dTabContent[name='groupUnitList']")[0];
	    		var groupContentTop = $(groupContent)[0].offsetTop;
	    		var groupContentHeight = $(groupContent)[0].offsetHeight;
	    		var leftTabContainer = $("#" + thatCE.containerId).find(".core3dLeftContainer .core3dTabContentContainer")[0];
	    		var leftContainerTop = $(leftTabContainer)[0].offsetTop;
	    		var leftContainerHeight = $(leftTabContainer)[0].offsetHeight;

	    		//如果没有显示到可视区域内，那么自动调整滚动条
	    		var topVisible = unitItemTopToLeftContainer - $(leftTabContainer)[0].scrollTop >= -5 ? true : false;
	    		var bottomVisible = (unitItemTopToLeftContainer - $(leftTabContainer)[0].scrollTop + unitItemHeight) - leftContainerHeight <= -5 ? true : false;
	    		if(!topVisible || !bottomVisible){
	    			$(leftTabContainer)[0].scrollTop = unitItemTopToLeftContainer - 30;
	    		}
	    	}
		}

		if(thatCE.afterSelectUnitFunc != null){
			thatCE.afterSelectUnitFunc({
				unitId: unitId
			});
		}
    }

    this.getComponentExpEditParameters = function(hasUnitNum, hasPointCtrl, hasDetailLevel){
    	var parameters = [];
    	for(var paramName in thatCE.componentInfo.parameters){
    		var parameter = thatCE.componentInfo.parameters[paramName];
    		var paramValueType = getValueTypeByParameterType(parameter.paramType);
    		var value = cmnPcr.strToObject(parameter.defaultValue, paramValueType);
    		parameters.push({
    			name: paramName,
    			valueType: getValueTypeByParameterType(parameter.paramType),
    			value: value
    		});
    	}

    	if(hasUnitNum && thatCE.componentInfo.parameters["unitNum"] == null){
	    	//增加unitNum参数
	    	parameters.push({
	    		name: "unitNum",
	    		valueType: valueType.decimal,
	    		value: 0
	    	});
    	}

    	if(hasDetailLevel && thatCE.componentInfo.parameters["detailLevel"] == null){
	    	//增加detailLevel参数
	    	parameters.push({
	    		name: "detailLevel",
	    		valueType: valueType.decimal,
	    		value: thatCE.object3DCreator.detailLevel
	    	});
    	}

    	//增加轴网的轴号作为参数 modified by ls 20230609
		var allAxesParamters = thatCE.getAxesParamters([thatCE.componentInfo.axes.left,
		                                              thatCE.componentInfo.axes.right,
		                                              thatCE.componentInfo.axes.top,
		                                              thatCE.componentInfo.axes.bottom,
		                                              thatCE.componentInfo.axes.vertical]);
		var axesNameKeys = {};
		for(var i = 0; i < allAxesParamters.length; i++){
			var axesParamter = allAxesParamters[i];
			if(axesNameKeys[axesParamter.name] == null){
		    	parameters.push(axesParamter);
		    	axesNameKeys[axesParamter.name] = true;
			}
		}
    	return parameters;
    }

    //获取轴号与值的参数 added by ls 20230609
    this.getAxesParamters = function(axesValueArray){
		var axesNameToZeros = {};
    	var ps = new Array();
		for(var i = 0; i < axesValueArray.length; i++){
			var axesValue = axesValueArray[i];
			if(axesValue != null && axesValue.length > 0){
				var partValues = axesValue.split(",");
				var distanceToZero = 0;
				for(var j = 0; j < partValues.length; j++){
					var partValue = partValues[j].trim();
					var pvs = partValue.split(":");
					var distance = 0;
					var mark = "";
					if(pvs.length == 1){
						distance = cmnPcr.strToDecimal(pvs[0].trim());
					}
					else if(pvs.length == 2){
						mark = pvs[0].trim();
						distance = cmnPcr.strToDecimal(pvs[1].trim());
					}
					distanceToZero += distance;
					if(mark.length > 0){
						if(axesNameToZeros[mark] == null){
							ps.push({
				    			name: "轴号" + mark,
					    		valueType: valueType.decimal,
					    		value: distanceToZero,
					    		group: "轴网"
					    	});
					    	axesNameToZeros[mark] = distanceToZero;
						}
					}
				}
			}
		}
		return ps;
    }

    this.editComponentSizeExp = function(propertyName){
    	var expInputElement = $("#" + thatCE.containerId).find(".core3dTabContent[name='axisInfoList'] .propertyItem").find(".propertyValueExpPim input[propertyName='" + propertyName + "']")[0];
    	var exp = $(expInputElement).val();
		var inputExpParams = {
			expText: exp,
			needResultType: valueType.decimal,
			userParameters: thatCE.getComponentExpEditParameters(),
			returnFunc:function(p){
				if(p.succeed){
					 thatCE.changeComponentPropertyInputValue(p.expText, expInputElement)
				}
			},
			runAt:expRunAt.js
		};
		var expEditor =new ExpressionEditor();
		expEditor.show(inputExpParams);
    }

    this.editUnitPositionExp = function(propertyName){
    	var object3D = thatCE.selectedUnitObject3D;
    	if(object3D != null){
	    	var expInputElement = $("#" + thatCE.containerId).find(".core3dTabContent[name='ruleDrivenPropertyList'] .propertyItem").find(".propertyValueExpPim input[propertyName='" + propertyName + "']")[0];
	    	var exp = $(expInputElement).val();
			var inputExpParams = {
				expText: exp,
				needResultType: valueType.decimal,
				userParameters: thatCE.getComponentExpEditParameters(true, true, true),
				returnFunc:function(p){
					if(p.succeed){
						 thatCE.changeUnitPropertyInputValue(p.expText, expInputElement, object3D, true)
					}
				},
				runAt:expRunAt.js
			};
			var expEditor =new ExpressionEditor();
			expEditor.show(inputExpParams);
    	}
    }

    this.runExpPim = function(p){
    	var exp = p.exp;
    	var needResultType = p.needResultType;
    	var afterGetRunResultFunc = p.afterGetRunResultFunc;
    	var userParameters = thatCE.getComponentExpEditParameters(p.hasUnitNum, p.hasPointCtrl, true);
    	if(exp == null || exp.trim().length == 0){
    		afterGetRunResultFunc({
    			name: p.name,
    			exp: null,
    			jsCode: null,
    			ps: null,
    			value: null
    		});
    	}
    	var requestParam = {
    		name: p.name,
			expression: encodeURIComponent(exp),
			userParameters: userParameters,
			runAt: expRunAt.js,
			needResultType: needResultType
		};
 		serverAccess.request({
 			serviceName:"expressionNcpService",
 			funcName:"validateJsExp",
 			args:{
 				requestParam:cmnPcr.jsonToStr(requestParam)
			},
 			successFunc: function(obj){
 				var expName = obj.result.name;
 				if(obj.result.validateErrors.length > 0){
 					afterGetRunResultFunc({
 						exp: exp,
 						jsCode: null,
 						ps: null,
	 					value: null,
	 					errors: obj.result.validateErrors
	 				});
 				}
 				else{
 					var runner = new ExpressionRunner();
	 				var params = {};
	 				for(var i = 0; i < userParameters.length; i++){
	 					var userParameter = userParameters[i];
	 					params[userParameter.name] = userParameter.value;
	 				}
	 				var jsCode = decodeURIComponent(obj.result.jsCode);
	 				var ps = "|" + cmnPcr.arrayToString(obj.result.usedParameters, "|") + "|";
	 				var resultValue = runner.run(params, jsCode);
	 				afterGetRunResultFunc({
	 					name: expName,
	 					exp: exp,
	 					jsCode: jsCode,
	 					ps: ps,
	 					value: resultValue
	 				});
 				}
			}
 		});
    }

    this.changeComponentPropertyInputValue = function(newValue, inputElement){
		if(newValue.length == 0 && $(inputElement).attr("nullable") != "true"){
			var oldValue = $(inputElement).attr("sourceValue");
			$(inputElement).val(oldValue);
		}
		else{
    		var propertyName = $(inputElement).attr("name");
    		switch(propertyName){
	    		case "componentName":{
	    			thatCE.componentInfo.name = newValue;
	    			break;
	    		}
	    		case "componentCode":{
	    			thatCE.componentInfo.code = newValue;
	    			break;
	    		}
	    		case "componentVersionNum":{
	    			thatCE.componentInfo.versionNum = newValue;
	    			break;
	    		}
	    		case "componentControlSize":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue);
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.componentInfo.controlSize = newDecimalValue;
		    	    	thatCE.refreshTransformControlSize();
	    			}
	    			break;
	    		}
	    		case "componentCameraZoom":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue);
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.setZoom(newDecimalValue);
	    			}
	    			break;
	    		}
	    		case "componentPlacePointRadius":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.componentInfo.placePointRadius = newDecimalValue;

		    			thatCE.initOriginMesh();

		    			thatCE.pointCtrlProcessor.refreshAllPointObject3Ds();

		    			//不会影响轴网了，改为使用axisFontSize控制轴网 deleted by ls 20230313
		    			//thatCE.initAxes(thatCE.componentInfo);
	    			}
	    			break;
	    		}

    			//axisFontSize控制轴网 deleted by ls 20230313
	    		case "componentAxisFontSize":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.componentInfo.axisFontSize = newDecimalValue;
		    			thatCE.pointCtrlProcessor.refreshAllPointObject3Ds();
		    			thatCE.initAxes(thatCE.componentInfo);
	    			}
	    			break;
	    		}

	    		case "componentAttachDistance":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.componentInfo.attachDistance = newDecimalValue;
	    			}
	    			break;
	    		}
	    		case "componentGridSpace":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.componentInfo.gridSpace = newDecimalValue;
	    			}
	    			break;
	    		}
	    		case "componentSizeX":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.componentInfo.size.x = newDecimalValue;
		    	    	thatCE.initGrid(thatCE.componentInfo);
		    	    	thatCE.initAxes(thatCE.componentInfo);
		    	    	thatCE.initWorkPlaneSelectValues(thatCE.componentInfo);
		    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
	    			}
	    			break;
	    		}
	    		case "componentSizeY":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.componentInfo.size.y = newDecimalValue;
		    	    	thatCE.initGrid(thatCE.componentInfo);
		    	    	thatCE.initAxes(thatCE.componentInfo);
		    	    	thatCE.initWorkPlaneSelectValues(thatCE.componentInfo);
		    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
	    			}
	    			break;
	    		}
	    		case "componentSizeZ":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.componentInfo.size.z = newDecimalValue;
		    	    	thatCE.initGrid(thatCE.componentInfo);
		    	    	thatCE.initAxes(thatCE.componentInfo);
		    	    	thatCE.initWorkPlaneSelectValues(thatCE.componentInfo);
		    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
	    			}
	    			break;
	    		};

	    		//基准面 added by ls 20230609
	    		case "workPlaneXZPosition":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.componentInfo.workPlanes.xz.position = newDecimalValue;
		    	    	thatCE.initGrid(thatCE.componentInfo);
		    	    	thatCE.initAxes(thatCE.componentInfo);
		    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
	    			}
	    			break;
	    		};
	    		case "workPlaneYZPosition":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.componentInfo.workPlanes.yz.position = newDecimalValue;
		    	    	thatCE.initGrid(thatCE.componentInfo);
		    	    	thatCE.initAxes(thatCE.componentInfo);
		    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
	    			}
	    			break;
	    		};
	    		case "workPlaneXYPosition":{
	    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
	    			if(isNaN(newDecimalValue)){
	        			var oldValue = $(inputElement).attr("sourceValue");
	        			$(inputElement).val(oldValue);
	    			}
	    			else{
		    			thatCE.componentInfo.workPlanes.xy.position = newDecimalValue;
		    	    	thatCE.initGrid(thatCE.componentInfo);
		    	    	thatCE.initAxes(thatCE.componentInfo);
		    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
	    			}
	    			break;
	    		};
	    		case "workPlaneXZVisible":{
	    			thatCE.componentInfo.workPlanes.xz.visible = newValue == "true" ? true : false;
	    	    	thatCE.initGrid(thatCE.componentInfo);
	    	    	thatCE.initAxes(thatCE.componentInfo);
	    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
	    			break;
	    		}
	    		case "workPlaneXYVisible":{
	    			thatCE.componentInfo.workPlanes.xy.visible = newValue == "true" ? true : false;
	    	    	thatCE.initGrid(thatCE.componentInfo);
	    	    	thatCE.initAxes(thatCE.componentInfo);
	    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
	    			break;
	    		}
	    		case "workPlaneYZVisible":{
	    			thatCE.componentInfo.workPlanes.yz.visible = newValue == "true" ? true : false;
	    	    	thatCE.initGrid(thatCE.componentInfo);
	    	    	thatCE.initAxes(thatCE.componentInfo);
	    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
	    			break;
	    		}

	    		//初始位置方式 modified by ls 20230615
	    		case "componentInitLocationTypeAssistPoint":{
	    			thatCE.componentInfo.init.locationType.assistPoint = newValue;
	    			break;
	    		};
	    		case "componentInitLocationTypeParameter":{
	    			thatCE.componentInfo.init.locationType.parameter = newValue;
	    			break;
	    		};
	    		case "componentInitLocationTypeFromPoint":{
	    			thatCE.componentInfo.init.locationType.fromPoint = newValue;
	    			break;
	    		};
	    		case "componentInitLocationTypeToPoint":{
	    			thatCE.componentInfo.init.locationType.toPoint = newValue;
	    			break;
	    		};

	    		//使用世界坐标 added by ls 20231117
	    		case "componentInitLocationTypeWorldPosition":{
	    			thatCE.componentInfo.init.locationType.worldPosition = newValue == "true" ? true : false;
	    			break;
	    		}

	    		case "componentInitPopWindow":{
	    			thatCE.componentInfo.init.popWindow = newValue == "true" ? true : false;
	    			break;
	    		}
    		}
		}

		//如果是表达式
		switch(propertyName){
			case "componentSizeXExpPim":{

				//增加辅助线表达式可删除功能 added by liyh 20230725
				if(newValue.trim().length == 0 ) {
					thatCE.componentInfo.sizeExp.x = null;
				}
				else{
				    thatCE.runExpPim({
				    	exp: newValue,
				    	needResultType: valueType.decimal,
				    	afterGetRunResultFunc: function(p){
				    		if(p.errors != null){
				    			msgBox.alert(function(){
				    				info: cmnPcr.arrayToString(p.errors)
				    			});
				    		}
				    		else{
				    			thatCE.componentInfo.sizeExp.x = {
				    				pim: p.exp,
				    				js: p.jsCode
				    			};
		     	    			thatCE.componentInfo.size.x =  p.value / thatCE.valueMultiply;
		     	    			thatCE.initComponentPropertyValues(thatCE.componentInfo);
				    	    	thatCE.initGrid(thatCE.componentInfo);
				    	    	thatCE.initAxes(thatCE.componentInfo);
				    	    	thatCE.initWorkPlaneSelectValues(thatCE.componentInfo);
				    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
				    		}
				    	}
				    });
				}
				break;
			}
			case "componentSizeYExpPim":{

				//增加辅助线表达式可删除功能 added by liyh 20230725
				if(newValue.trim().length == 0 ) {
					thatCE.componentInfo.sizeExp.y = null;
				}
				else{
				    thatCE.runExpPim({
				    	exp: newValue,
				    	needResultType: valueType.decimal,
				    	afterGetRunResultFunc: function(p){
				    		if(p.errors != null){
				    			msgBox.alert(function(){
				    				info: cmnPcr.arrayToString(p.errors)
				    			});
				    		}
				    		else{
				    			thatCE.componentInfo.sizeExp.y = {
				    				pim: p.exp,
				    				js: p.jsCode
				    			};
		     	    			thatCE.componentInfo.size.y =  p.value / thatCE.valueMultiply;
		     	    			thatCE.initComponentPropertyValues(thatCE.componentInfo);
				    	    	thatCE.initGrid(thatCE.componentInfo);
				    	    	thatCE.initAxes(thatCE.componentInfo);
				    	    	thatCE.initWorkPlaneSelectValues(thatCE.componentInfo);
				    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
				    		}
				    	}
				    });
				}
				break;
			}
			case "componentSizeZExpPim":{

				//增加辅助线表达式可删除功能 added by liyh 20230725
				if(newValue.trim().length == 0 ) {
					thatCE.componentInfo.sizeExp.z = null;
				}
				else{
				    thatCE.runExpPim({
				    	exp: newValue,
				    	needResultType: valueType.decimal,
				    	afterGetRunResultFunc: function(p){
				    		if(p.errors != null){
				    			msgBox.alert({
				    				info: cmnPcr.arrayToString(p.errors)
				    			});
				    		}
				    		else{
				    			thatCE.componentInfo.sizeExp.z = {
				    				pim: p.exp,
				    				js: p.jsCode
				    			};
		     	    			thatCE.componentInfo.size.z =  p.value / thatCE.valueMultiply;
		     	    			thatCE.initComponentPropertyValues(thatCE.componentInfo);
				    	    	thatCE.initGrid(thatCE.componentInfo);
				    	    	thatCE.initAxes(thatCE.componentInfo);
				    	    	thatCE.initWorkPlaneSelectValues(thatCE.componentInfo);
				    	    	thatCE.initWorkPlanes(thatCE.componentInfo);
				    		}
				    	}
				    });
				}
				break;
			}
		}
    }

    this.runComponentAllSizePimExpJs = function(){
    	var userParameters = thatCE.getComponentExpEditParameters();
    	var ps = {};
    	for(var i = 0; i < userParameters.length; i++){
    		var userParameter = userParameters[i];
    		ps[userParameter.name] = userParameter.value;
    	}
    	thatCE.runComponentSizePimExpJs("x", ps);
    	thatCE.runComponentSizePimExpJs("y", ps);
    	thatCE.runComponentSizePimExpJs("z", ps);
		thatCE.initComponentPropertyValues(thatCE.componentInfo);
    	thatCE.initGrid(thatCE.componentInfo);
    	thatCE.initAxes(thatCE.componentInfo);
    	thatCE.initWorkPlaneSelectValues(thatCE.componentInfo);
    	thatCE.initWorkPlanes(thatCE.componentInfo);
    }

    this.runUnitObject3DPositionExpJs = function(object3D){
        //先用目前的位置信息放置  modified by ls 20220606
    	if(object3D.unitData.useWorldPosition){
        	object3D.position.set(0, 0, 0);
        }
    	else{
        	object3D.position.set(object3D.unitData.position[0], object3D.unitData.position[1], object3D.unitData.position[2]);
    	}

    	//再计算位置表达式
    	if(object3D.unitData.positionExps != null){
	    	var userParameters = thatCE.getComponentExpEditParameters(true, true, true);
	    	var ps = {};
	    	for(var i = 0; i < userParameters.length; i++){
	    		var userParameter = userParameters[i];
	    		ps[userParameter.name] = userParameter.value;
	    	}
	    	object3D.unitData.position = thatCE.object3DCreator.calcUnitPositionByExpJs(object3D, object3D.unitData.positionExps, ps);
    	}
    	if(!object3D.unitData.useWorldPosition){
          	thatCE.setObject3DPosition(object3D, object3D.unitData, false);
    	}
    }


    this.runUnitObject3DRotationExpJs = function(object3D){
        //先用目前的旋转角度信息放置  modified by ls 20220606
    	if(object3D.unitData.useWorldPosition){
        	object3D.rotation.set(0, 0, 0);
        }
    	else{
        	object3D.rotation.set(object3D.unitData.rotation[0], object3D.unitData.rotation[1], object3D.unitData.rotation[2]);
    	}

    	//再计算旋转角度表达式
    	if(object3D.unitData.rotationExps != null){
	    	var userParameters = thatCE.getComponentExpEditParameters(true, true, true);
	    	var ps = {};
	    	for(var i = 0; i < userParameters.length; i++){
	    		var userParameter = userParameters[i];
	    		ps[userParameter.name] = userParameter.value;
	    	}

	    	//修改bug，使用rotationExps modified by ls 20221108
	    	object3D.unitData.rotation = thatCE.object3DCreator.calcUnitRotationByExpJs(object3D, object3D.unitData.rotationExps, ps);
    	}
    	if(!object3D.unitData.useWorldPosition){
          	thatCE.setObject3DRotation(object3D, object3D.unitData, false);
    	}
    }

    this.runComponentSizePimExpJs = function(sizeName, ps){
    	if(thatCE.componentInfo.sizeExp[sizeName] != null){
	    	var runner = new ExpressionRunner();
	    	var jsCode = thatCE.componentInfo.sizeExp[sizeName].js;
	    	var resultValue = runner.run(ps, jsCode);
			thatCE.componentInfo.size[sizeName] = resultValue / thatCE.valueMultiply;
    	}
    }

    this.rebuildAllUnitObject3Ds = function(){
    	var parentParameters = thatCE.getComponentExpEditParameters(true, true, false);
		var ps = {};
		for(var i = 0; i < parentParameters.length; i++){
			var parentParameter = parentParameters[i];
			ps[parentParameter.name] = parentParameter.value;
		}
        var mainScene = thatCE.getMainScene();
        var allObject3Ds = [];
    	for(var i = 0; i < mainScene.children.length; i++){
    		var childObj = mainScene.children[i];
    		if(childObj.isUnitObject){
    			allObject3Ds.push(childObj);
    		}
    	}

        //增加operateType added by ls 20220705
    	thatCE.initLoadingProgress(allObject3Ds.length, "rebuildAll");

    	for(var i = 0; i < allObject3Ds.length; i++){
    		var oldObject3D = allObject3Ds[i];
	    	var unitSetting = thatCE.getUnitSettingFromObject3D(oldObject3D);
			thatCE.runUnitAllParameterPimExpJs(unitSetting, ps);
			thatCE.rebuildUnitObject3D(unitSetting, parentParameters);
	        mainScene.remove(oldObject3D);
    	}
    }

    this.rebuildUnitObject3Ds = function(object3Ds){
    	var parentParameters = thatCE.getComponentExpEditParameters(true, true, false);
		var ps = {};
		for(var i = 0; i < parentParameters.length; i++){
			var parentParameter = parentParameters[i];
			ps[parentParameter.name] = parentParameter.value;
		}
        var mainScene = thatCE.getMainScene();

        //增加operateType added by ls 20220705
    	thatCE.initLoadingProgress(object3Ds.length, "rebuild");

    	for(var i = 0; i < object3Ds.length; i++){
    		var oldObject3D = object3Ds[i];
	    	var unitSetting = thatCE.getUnitSettingFromObject3D(oldObject3D);
			thatCE.runUnitAllParameterPimExpJs(unitSetting, ps);
			thatCE.rebuildUnitObject3D(unitSetting, parentParameters);
	        mainScene.remove(oldObject3D);
    	}
    }

    this.rebuildOneUnitObject3D = function(object3D, otherInfo){
    	var parentParameters = thatCE.getComponentExpEditParameters(true, true, false);
		var ps = {};
		for(var i = 0; i < parentParameters.length; i++){
			var parentParameter = parentParameters[i];
			ps[parentParameter.name] = parentParameter.value;
		}
		var oldObject3D = object3D;
    	var unitSetting = thatCE.getUnitSettingFromObject3D(oldObject3D);
		thatCE.runUnitAllParameterPimExpJs(unitSetting, ps);
		unitSetting.otherInfo = otherInfo;
		thatCE.rebuildUnitObject3D(unitSetting, parentParameters, thatCE.afterRebuildObject3DWithSelect);
        var mainScene = thatCE.getMainScene();
        mainScene.remove(oldObject3D);
    }

    this.runUnitAllParameterPimExpJs = function(unitSetting, ps){
    	var unitParameters = unitSetting.parameters;
    	for(let paramName in unitParameters){
    		var unitParameter = unitParameters[paramName];
    		if(unitParameter.exp != null){
    			var jsCode = unitParameter.exp.js;
    			var runner = new ExpressionRunner();
 				var resultValue = runner.run(ps, jsCode);
 				unitParameter.value = resultValue;
    		}
    	}
    }

    this.afterRebuildObject3D = function(unit3DInfo, afterAddFunc){
        var mainScene = thatCE.getMainScene();
        unit3DInfo.object3D.unitData = unit3DInfo.unitSetting;
        unit3DInfo.object3D.isUnitObject = true;
        if(unit3DInfo.unitSetting.useWorldPosition){
        	unit3DInfo.object3D.position.set(0, 0, 0);
        	unit3DInfo.object3D.rotation.set(0, 0, 0);
            mainScene.add(unit3DInfo.object3D);
        }
        else{
          	thatCE.setObject3DRotation(unit3DInfo.object3D, unit3DInfo.unitSetting, false);
          	thatCE.setObject3DPosition(unit3DInfo.object3D, unit3DInfo.unitSetting, false);
            mainScene.add(unit3DInfo.object3D);
            thatCE.runUnitObject3DRotationExpJs(unit3DInfo.object3D);
            thatCE.runUnitObject3DPositionExpJs(unit3DInfo.object3D);
        }

    	//触发afterAddUnitObject3DToScene added by ls 20230830
    	thatCE.doEvent("afterAddUnitObject3DToScene", {
    		object3D: unit3DInfo.object3D
    	});

    	if(afterAddFunc != null){
          	afterAddFunc(unit3DInfo.unitSetting.id);
    	}
    	thatCE.refreshObject3DUvMaterial(unit3DInfo.object3D, unit3DInfo.object3D.unitData.uvs);
		thatCE.refreshLoadingProgress(unit3DInfo);
    }

    this.afterRebuildObject3DWithSelect = function(unit3DInfo, afterAddFunc){
        var mainScene = thatCE.getMainScene();
        unit3DInfo.object3D.unitData = unit3DInfo.unitSetting;
        unit3DInfo.object3D.isUnitObject = true;
        if(unit3DInfo.unitSetting.useWorldPosition){
        	unit3DInfo.object3D.position.set(0, 0, 0);
        	unit3DInfo.object3D.rotation.set(0, 0, 0);
            mainScene.add(unit3DInfo.object3D);
        }
        else{
          	thatCE.setObject3DRotation(unit3DInfo.object3D, unit3DInfo.unitSetting, false);
          	thatCE.setObject3DPosition(unit3DInfo.object3D, unit3DInfo.unitSetting, false);
            mainScene.add(unit3DInfo.object3D);
            thatCE.runUnitObject3DRotationExpJs(unit3DInfo.object3D);
            thatCE.runUnitObject3DPositionExpJs(unit3DInfo.object3D);
        }

    	//触发afterAddUnitObject3DToScene added by ls 20230830
    	thatCE.doEvent("afterAddUnitObject3DToScene", {
    		object3D: unit3DInfo.object3D
    	});

    	if(afterAddFunc != null){
          	afterAddFunc(unit3DInfo.unitSetting.id);
    	}
    	thatCE.refreshObject3DUvMaterial(unit3DInfo.object3D, unit3DInfo.object3D.unitData.uvs);
    	thatCE.selectUnitObject(unit3DInfo.object3D);
    }

    this.rebuildUnitObject3D = function(unitSetting, parentParameters, afterBuildObject3DFunc){
		var refComponentInfo = thatCE.getRefComponentInfo(unitSetting.code, unitSetting.versionNum);
		var unitComProcessor = thatCE.object3DCreator.createJs3UnitComponentProcessor(unitSetting.code, unitSetting.versionNum);
		unitComProcessor.init({
			editor: thatCE,
			unitId: unitSetting.id,
			mixType: unitSetting.mixType,

			//显示级别 added by ls 20230403
			viewLevel: unitSetting.viewLevel,

			useWorldPosition: unitSetting.useWorldPosition,
			useParameterPosition: unitSetting.useParameterPosition,
			position: unitSetting.position,
			rotation: unitSetting.rotation,
			componentInfo: refComponentInfo,
			valueParameters: unitSetting.parameters,
			positionExps: unitSetting.positionExps,
			rotationExps: unitSetting.rotationExps,
			parentParameters: parentParameters
		});
		unitComProcessor.buildComponent3DObject(unitSetting, parentParameters, afterBuildObject3DFunc == null ? thatCE.afterRebuildObject3D : afterBuildObject3DFunc);
    }

    this.initMultiSelectPropertyInputEvent = function(){
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitCancelBtn']").click(function(ev){
        	thatCE.cancelAllMultiSelectUnitObjects();
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitCopyBtn']").click(function(ev){
        	thatCE.doMultiCopyMenu();
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitChangeGroupBtn']").click(function(ev){
    		var object3Ds = thatCE.multiSelectedUnitObject3Ds;
    		var unitInfos = new Array();
    		for(var i = 0; i < object3Ds.length; i++){
    			unitInfos.push(object3Ds[i].unitData);
    		}
    		thatCE.showUnitsChangeGroupWindow(unitInfos);
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitDeleteBtn']").click(function(ev){
    		thatCE.removeUnitObject3Ds(thatCE.multiSelectedUnitObject3Ds, false);
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitMinXAlignBtn']").click(function(ev){
    		thatCE.alignMultiObject3Ds(thatCE.multiSelectedUnitObject3Ds, "unitMinX");
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitMinYAlignBtn']").click(function(ev){
    		thatCE.alignMultiObject3Ds(thatCE.multiSelectedUnitObject3Ds, "unitMinY");
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitMinZAlignBtn']").click(function(ev){
    		thatCE.alignMultiObject3Ds(thatCE.multiSelectedUnitObject3Ds, "unitMinZ");
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitMaxXAlignBtn']").click(function(ev){
    		thatCE.alignMultiObject3Ds(thatCE.multiSelectedUnitObject3Ds, "unitMaxX");
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitMaxYAlignBtn']").click(function(ev){
    		thatCE.alignMultiObject3Ds(thatCE.multiSelectedUnitObject3Ds, "unitMaxY");
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitMaxZAlignBtn']").click(function(ev){
    		thatCE.alignMultiObject3Ds(thatCE.multiSelectedUnitObject3Ds, "unitMaxZ");
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitEquipartitionXBtn']").click(function(ev){
    		thatCE.equipartitionMultiObject3Ds(thatCE.multiSelectedUnitObject3Ds, "x");
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitEquipartitionYBtn']").click(function(ev){
    		thatCE.equipartitionMultiObject3Ds(thatCE.multiSelectedUnitObject3Ds, "y");
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='multiUnitSelectedList'] .propertyItem").find(".propertyBtn[name='multiUnitEquipartitionZBtn']").click(function(ev){
    		thatCE.equipartitionMultiObject3Ds(thatCE.multiSelectedUnitObject3Ds, "z");
    		ev.stopPropagation();
            return true;
    	});
    }

    this.initComponentPropertyInputEvent = function(){
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='globalPropertyList'] .propertyItem").find(".propertyBtn[name='componentParameters']").click(function(ev){
        	thatCE.editComponentParameters();
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='globalPropertyList'] .propertyItem").find(".propertyBtn[name='componentExportLZW']").click(function(ev){
        	thatCE.showExportLZWWindow();
    		ev.stopPropagation();
            return true;
    	});
    	//新增导出gltf文件 added by liyh 20220706
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='globalPropertyList'] .propertyItem").find(".propertyBtn[name='componentExportGLTF']").click(function(ev){
    		thatCE.OnExportGLTF();
    		ev.stopPropagation();
    		return true;
    	});
		//新增导出DAE文件 added by ls 20230313
		$("#" + thatCE.containerId).find(".core3dTabContent[name='globalPropertyList'] .propertyItem").find(".propertyBtn[name='componentExportDAE']").click(function(ev){
			thatCE.OnExportDAE();
			ev.stopPropagation();
			return true;
		});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='axisInfoList'] .propertyItem").find(".propertyBtn[name='componentAxes']").click(function(ev){
        	thatCE.showEditAxesWindow();
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='axisInfoList'] .propertyItem").find(".propertyExpBtn").click(function(ev){
    		var propertyName = $(this).attr("propertyName");
        	thatCE.editComponentSizeExp(propertyName);
    		ev.stopPropagation();
            return true;
    	});

    	var componentTabNames = sideTabGroups.rightComponentSelect;
    	for(var i = 0; i < componentTabNames.length; i++){
    		var componentTabName = componentTabNames[i];
	    	$("#" + thatCE.containerId).find(".core3dTabContent[name='" + componentTabName + "'] .propertyItem").find(".propertyInput").keydown(function(ev){
	    		ev.stopPropagation();
	            return true;
	    	});
	    	$("#" + thatCE.containerId).find(".core3dTabContent[name='" + componentTabName + "'] .propertyItem").find(".propertyInput").change(function(){
        		var newValue = null;
        		switch($(this).attr("type")){
        			case "checkbox":{
        				newValue = $(this).prop("checked") ? "true" : "false";
        				break;
        			}
        			default:{
        				newValue = $(this).val().trim();
        				break;
        			}
        		}
	    		var inputElement = this;
	    		thatCE.changeComponentPropertyInputValue(newValue, inputElement);
	    	});
    	}

    	//基准面位置下拉值选择 added by ls 20230609
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='workPlanePropertyList'] .propertyItem").find(".propertyInputWorkPlanePositionSelect").change(function(){
    		let propertyName = $(this).attr("propertyName");
    		let planeName = $(this).attr("planeName");
    		let propertyValue = $(this).val();
    		if(propertyValue.length == 0){
    			propertyValue = "0";
    		}
    		$("#" + thatCE.containerId).find(".propertyInput[name='" + propertyName + "']").val(propertyValue);
			thatCE.componentInfo.workPlanes[planeName].position = cmnPcr.strToDecimal(propertyValue) / thatCE.valueMultiply;
	    	thatCE.initGrid(thatCE.componentInfo);
	    	thatCE.initAxes(thatCE.componentInfo);
	    	thatCE.initWorkPlanes(thatCE.componentInfo);
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='workPlanePropertyList'] .propertyItem").find(".propertyBtn[name='workPlaneXZViewport']").click(function(ev){
        	thatCE.doBtnClick("topView");
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='workPlanePropertyList'] .propertyItem").find(".propertyBtn[name='workPlaneXYViewport']").click(function(ev){
        	thatCE.doBtnClick("frontView");
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='workPlanePropertyList'] .propertyItem").find(".propertyBtn[name='workPlaneYZViewport']").click(function(ev){
        	thatCE.doBtnClick("rightView");
    		ev.stopPropagation();
            return true;
    	});

    	//初始位置方式，辅助点下拉值选择 modified by ls 20230615
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='componentSeniorPropertyList'] .propertyItem").find(".componentInitLocationTypePointSelect").change(function(){
    		let objectPropertyName = $(this).attr("objectPropertyName");
    		let propertyName = $(this).parent().attr("propertyName");
    		let propertyValue = $(this).val();
    		$("#" + thatCE.containerId).find(".propertyInput[name='" + propertyName + "']").val(propertyValue);
			thatCE.componentInfo.init.locationType[objectPropertyName] = propertyValue;
    	});
    }

    //移动构件 added by ls 20221206
    this.moveObject3Ds = function(object3Ds, moveType, moveDistance){
    	var canMove = true;
    	var errors = new Array();
    	for(var i = 0; i < object3Ds.length; i++){
    		var object3D = object3Ds[i];
    		var positionExps = object3D.unitData.positionExps;
    		switch(moveType){
	    		case "x":{
	    			if(positionExps.posX != null || positionExps.minX != null || positionExps.maxX != null){
	    				canMove = false;
	    				errors.push( object3D.unitData.name + "已定义了位置表达式.");
	    			}
	    			break;
	    		}
	    		case "y":{
	    			if(positionExps.posY != null || positionExps.minY != null || positionExps.maxY != null){
	    				canMove = false;
	    				errors.push( object3D.unitData.name + "已定义了位置表达式.");
	    			}
	    			break;
	    		}
	    		case "z":{
	    			if(positionExps.posZ != null || positionExps.minZ != null || positionExps.maxZ != null){
	    				canMove = false;
	    				errors.push( object3D.unitData.name + "已定义了位置表达式.");
	    			}
	    			break;
	    		}
    		}
    	}

    	if(canMove){
	    	var unitIds = new Array();
	    	for(var i = 0; i < object3Ds.length; i++){
	    		var object3D = object3Ds[i];
	    		unitIds.push(object3D.unitData.id);
				var newPos = [object3D.position.x, object3D.position.y, object3D.position.z];
				switch(moveType){
					case "x":{
						newPos[0] = newPos[0] + moveDistance;
						break;
					}
					case "y":{
						newPos[1] = newPos[1] + moveDistance;
						break;
					}
					case "z":{ //移动z，修改bug modified by ls 20221227
						newPos[2] = newPos[2] + moveDistance;
						break;
					}
				}
		       	object3D.position.set(newPos[0], newPos[1], newPos[2]);
	    	}
    	}
    	else{
    		var message = "无法移动. " + cmnPcr.arrayToString(errors, "");
            throw new Error(message);
    	}
    }

    //修改按键调用的对齐方法，对齐后重新多选选中构件 modified by ls 20221206
    this.alignMultiObject3Ds = function(object3Ds, alignType){
    	try{
	    	var unitIds = new Array();
	    	for(var i = 0; i < object3Ds.length; i++){
	    		var object3D = object3Ds[i];
	    		unitIds.push(object3D.unitData.id);
	    	}
	    	thatCE.alignObject3Ds(object3Ds, alignType);
	    	thatCE.cancelAllMultiSelectUnitObjects();
	    	thatCE.multiSelectUnitObjects(unitIds);
    	}
    	catch(ex){
    		msgBox.alert({info: ex});
    	}
    }

    //封装通用的对齐函数，抛出异常 added by ls 20221206
    this.alignObject3Ds = function(object3Ds, alignType){
    	var canAlign = true;
    	var errors = new Array();
    	for(var i = 0; i < object3Ds.length; i++){
    		var object3D = object3Ds[i];
    		var positionExps = object3D.unitData.positionExps;
    		switch(alignType){
	    		case "unitMinX":
	    		case "unitMaxX":{
	    			if(positionExps.posX != null || positionExps.minX != null || positionExps.maxX != null){
	    				canAlign = false;
	    				errors.push( object3D.unitData.name + "已定义了位置表达式.");
	    			}
	    			break;
	    		}
	    		case "unitMinY":
	    		case "unitMaxY":{
	    			if(positionExps.posY != null || positionExps.minY != null || positionExps.maxY != null){
	    				canAlign = false;
	    				errors.push( object3D.unitData.name + "已定义了位置表达式.");
	    			}
	    			break;
	    		}
	    		case "unitMinZ":
	    		case "unitMaxZ":{
	    			if(positionExps.posZ != null || positionExps.minZ != null || positionExps.maxZ != null){
	    				canAlign = false;
	    				errors.push( object3D.unitData.name + "已定义了位置表达式.");
	    			}
	    			break;
	    		}
    		}
    	}

    	if(canAlign){
	    	var mmType = (alignType == "unitMinX" || alignType == "unitMinY" || alignType == "unitMinZ") ? "min" : "max";
	    	var indexType = (alignType == "unitMinX" || alignType == "unitMaxX") ? "x" : ((alignType == "unitMinY" || alignType == "unitMaxY") ? "y" : "z");

	    	var newDecimalValue =  mmType == "min" ? Infinity : -Infinity;
	    	for(var i = 0; i < object3Ds.length; i++){
	    		var object3D = object3Ds[i];
	            var box = new THREE.Box3().setFromObject(object3D, true);
	            var checkValue = box[mmType][indexType];
	            switch(mmType){
		            case "min":{
		            	if(newDecimalValue > checkValue){
		            		newDecimalValue = checkValue;
		            	}
		            	break;
		            }
		            case "max":{
		            	if(newDecimalValue < checkValue){
		            		newDecimalValue = checkValue;
		            	}
		            	break;
		            }
	            }
	    	}

	    	var unitIds = new Array();
	    	for(var i = 0; i < object3Ds.length; i++){
	    		var object3D = object3Ds[i];
	    		unitIds.push(object3D.unitData.id);
				var newPos = [object3D.position.x, object3D.position.y, object3D.position.z];
				thatCE.object3DCreator.getPositionValuesByPosParam(alignType, newDecimalValue, newPos, object3D);
		       	object3D.position.set(newPos[0], newPos[1], newPos[2]);
	    	}
    	}
    	else{
    		var message = "无法设置对齐. " + cmnPcr.arrayToString(errors, "");
            throw new Error(message);
    	}
    }

    //均分 modified by ls 20221209
    this.equipartitionMultiObject3Ds = function(object3Ds, directionType){
    	try{
	    	var unitIds = new Array();
	    	for(var i = 0; i < object3Ds.length; i++){
	    		var object3D = object3Ds[i];
	    		unitIds.push(object3D.unitData.id);
	    	}
	    	thatCE.equipartitionObject3Ds(object3Ds, directionType);
	    	thatCE.cancelAllMultiSelectUnitObjects();
	    	thatCE.multiSelectUnitObjects(unitIds);
    	}
    	catch(ex){
    		msgBox.alert({info: ex});
    	}
    }

    //均分，抛出异常 modified by ls 20221209
    this.equipartitionObject3Ds = function(object3Ds, directionType){
    	var canAlign = true;
    	var errors = new Array();
    	for(var i = 0; i < object3Ds.length; i++){
    		var object3D = object3Ds[i];
    		var positionExps = object3D.unitData.positionExps;
    		switch(directionType){
	    		case "x": {
	    			if(positionExps.posX != null || positionExps.minX != null || positionExps.maxX != null){
	    				canAlign = false;
	    				errors.push( object3D.unitData.name + "已定义了位置表达式.");
	    			}
	    			break;
	    		}
	    		case "y": {
	    			if(positionExps.posY != null || positionExps.minY != null || positionExps.maxY != null){
	    				canAlign = false;
	    				errors.push( object3D.unitData.name + "已定义了位置表达式.");
	    			}
	    			break;
	    		}
	    		case "z": {
	    			if(positionExps.posZ != null || positionExps.minZ != null || positionExps.maxZ != null){
	    				canAlign = false;
	    				errors.push( object3D.unitData.name + "已定义了位置表达式.");
	    			}
	    			break;
	    		}
    		}
    	}

    	if(canAlign){
    		var sortedObject3Ds = new Array();
	    	for(var i = 0; i < object3Ds.length; i++){
	    		var object3D = object3Ds[i];
	    		var posValue = object3D.position[directionType];
	    		var tempSortedObject3Ds = new Array();
	    		var added = false;
	    		for(var j = 0; j < sortedObject3Ds.length; j++){
	    			var sortedObject3D = sortedObject3Ds[j];
	    			if(!added && posValue <= sortedObject3D.position[directionType]){
	    				tempSortedObject3Ds.push(object3D);
	    				added = true;
	    			}
    				tempSortedObject3Ds.push(sortedObject3D);
	    		}
	    		if(!added){
	    			tempSortedObject3Ds.push(object3D);
	    		}
	    		sortedObject3Ds = tempSortedObject3Ds;
	    	}
	    	var minValue = sortedObject3Ds[0].position[directionType];
	    	var maxValue = sortedObject3Ds[sortedObject3Ds.length - 1].position[directionType];
	    	var spaceValue = sortedObject3Ds.length == 1 ? 0 : (maxValue - minValue) / (sortedObject3Ds.length - 1);

	    	var unitIds = new Array();
	    	for(var i = 0; i < sortedObject3Ds.length; i++){
	    		var object3D = sortedObject3Ds[i];
	    		unitIds.push(object3D.unitData.id);
	    		var newPosJson = {
	    			x: object3D.position.x,
	    			y: object3D.position.y,
	    			z: object3D.position.z
	    		};
	    		newPosJson[directionType] = minValue + spaceValue * i;
		       	object3D.position.set(newPosJson.x, newPosJson.y, newPosJson.z);
	    	}
    	}
    	else{
    		var message = "无法设置均分. " + cmnPcr.arrayToString(errors, "");
            throw new Error(message);
    	}
    }

    this.getUnitGroupId = function(unitId){
    	var groupId = $("#" + thatCE.containerId).find(".unitItem[unitId='" + unitId + "']").parent().parent().attr("groupId");
    	return groupId;
    }

    this.changeUnitPropertyInputValue = function(newValue, inputElement, object3D, forceChange){
    	var unitId = object3D.unitData.id;
		var propertyName = $(inputElement).attr("name");
		var message = null;
		newValue = newValue.trim();
		var canReValue = true;
		if(!forceChange){
			//如果不是强制修改值，那么如果位置有表达式，那么直接修改位置值无效
			switch(propertyName){
				case "unitName":{
					canReValue = !thatCE.checkHasSameNameUnit({id: unitId, name: newValue});
					if(!canReValue){
						message = "存在重名的图元";
	    			}
					break;
				}
				case "unitCount":{
					canReValue = object3D.unitData.countExp == null;
					if(!canReValue){
						message = "已定义了表达式，不可手工修改值";
					}
					break;
				}
				case "unitRotX":{
					canReValue = object3D.unitData.rotationExps.rotX == null;
					if(!canReValue){
						message = "已定义了X轴旋转表达式，不可手工修改值";
					}
					break;
				}
				case "unitRotY":{
					canReValue = object3D.unitData.rotationExps.rotY == null;
					if(!canReValue){
						message = "已定义了Y轴旋转表达式，不可手工修改值";
					}
					break;
				}
				case "unitRotZ":{
					canReValue = object3D.unitData.rotationExps.rotZ == null;
					if(!canReValue){
						message = "已定义了Z轴旋转表达式，不可手工修改值";
					}
					break;
				}
				case "unitPosX":
				case "unitMinX":
				case "unitMaxX":{
					canReValue = object3D.unitData.positionExps.posX == null && object3D.unitData.positionExps.minX == null && object3D.unitData.positionExps.maxX == null;
					if(!canReValue){
						message = "已定义了X方向的表达式，不可手工修改值";
					}
					break;
				}
				case "unitPosY":
				case "unitMinY":
				case "unitMaxY":{
					canReValue = object3D.unitData.positionExps.posY == null && object3D.unitData.positionExps.minY == null && object3D.unitData.positionExps.maxY == null;
					if(!canReValue){
						message = "已定义了Y方向的表达式，不可手工修改值";
					}
					break;
				}
				case "unitPosZ":
				case "unitMinZ":
				case "unitMaxZ":{
					canReValue = object3D.unitData.positionExps.posZ == null && object3D.unitData.positionExps.minZ == null && object3D.unitData.positionExps.maxZ == null;
					if(!canReValue){
						message = "已定义了Z方向的表达式，不可手工修改值";
					}
					break;
				}
				case "unitMinXExpPim":{
					canReValue = object3D.unitData.positionExps.posX == null || newValue.length == 0;
					if(!canReValue){
						message = "已定义了 '位置X' 的表达式";
					}
					break;
				}
				case "unitMaxXExpPim":{
					canReValue = object3D.unitData.positionExps.posX == null &&  object3D.unitData.positionExps.minX == null || newValue.length == 0;
					if(!canReValue){
						message = "已定义了 '位置X' 或 '最小X' 的表达式";
					}
					break;
				}
				case "unitMinYExpPim":{
					canReValue = object3D.unitData.positionExps.posY == null;
					if(!canReValue){
						message = "已定义了 '位置Y' 的表达式";
					}
					break;
				}
				case "unitMaxYExpPim":{
					canReValue = object3D.unitData.positionExps.posY == null &&  object3D.unitData.positionExps.minY == null || newValue.length == 0;
					if(!canReValue){
						message = "已定义了 '位置Y' 或 '最小Y' 的表达式";
					}
					break;
				}
				case "unitMinZExpPim":{
					canReValue = object3D.unitData.positionExps.posZ == null || newValue.length == 0;
					if(!canReValue){
						message = "已定义了 '位置Z' 的表达式";
					}
					break;
				}
				case "unitMaxZExpPim":{
					canReValue = object3D.unitData.positionExps.posZ == null &&  object3D.unitData.positionExps.minZ == null || newValue.length == 0;
					if(!canReValue){
						message = "已定义了 '位置Z' 或 '最小Z' 的表达式";
					}
					break;
				}
			}
		}

		if(canReValue){
			if(newValue.length == 0 && $(inputElement).attr("nullable") != "true"){
				var oldValue = $(inputElement).attr("sourceValue");
				$(inputElement).val(oldValue);
			}
			else{
	    		switch(propertyName){
		    		case "unitName":{
		    			object3D.unitData.name = newValue;
		            	$("#" + thatCE.containerId).find(".unitItem[unitId='" + unitId + "'] .unitItemName").text(newValue);
		    	       	thatCE.refreshUnitPropertyValues(object3D);
		    			break;
		    		}
		    		case "unitMixType":{
		    			object3D.unitData.mixType = newValue;
		    	    	var subText = thatCE.getUnitSubText(object3D.unitData);
		            	$("#" + thatCE.containerId).find(".unitItem[unitId='" + unitId + "'] .unitItemSubText").text(subText);
		    			break;
		    		}
		    		case "unitViewLevel":{
		    			object3D.unitData.viewLevel = newValue;
		    	    	var subText = thatCE.getUnitSubText(object3D.unitData);
		            	$("#" + thatCE.containerId).find(".unitItem[unitId='" + unitId + "'] .unitItemSubText").text(subText);
		    			break;
		    		}
		    		case "unitUseWorldPosition":{
		    			//通过函数修改useWorldPosition modified by ls 20220606
		    			//object3D.unitData.useWorldPosition = newValue == "true" ? true : false;
		    			thatCE.changeUseWorldPosition(object3D,  newValue == "true" ? true : false);

		            	$("#" + thatCE.containerId).find(".unitItem[unitId='" + unitId + "'] .unitUseWorldPosition").prop("checked", object3D.unitData.useWorldPosition);
		        		thatCE.selectUnitObject(null);
		            	thatCE.rebuildOneUnitObject3D(object3D);
		    			break;
		    		}
		    		case "unitCount":{
		    			var newDecimalValue = Math.floor(cmnPcr.strToDecimal(newValue));
		    			if(isNaN(newDecimalValue)){
		        			var oldValue = $(inputElement).attr("sourceValue");
		        			$(inputElement).val(oldValue);
		    			}
		    			else{
			            	$("#" + thatCE.containerId).find(".unitItem[unitId='" + unitId + "'] .unitCount").text(newDecimalValue);
			    	       	object3D.unitData.count = newDecimalValue;
		    			}
		    			break;
		    		};
		    		case "unitPosX":
		    		case "unitPosY":
		    		case "unitPosZ":{
		    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
		    			if(isNaN(newDecimalValue)){
		        			var oldValue = $(inputElement).attr("sourceValue");
		        			$(inputElement).val(oldValue);
		    			}
		    			else{
			    			var newPos = [object3D.position.x, object3D.position.y, object3D.position.z];
			    			if(propertyName == "unitPosX"){
			    				newPos[0] = newDecimalValue;
			    			}
			    			if(propertyName == "unitPosY"){
			    				newPos[1] = newDecimalValue;
			    			}
			    			if(propertyName == "unitPosZ"){
			    				newPos[2] = newDecimalValue;
			    			}
			    	       	object3D.position.set(newPos[0], newPos[1], newPos[2]);

			    	       	//增加设置位置方法，这里以前存在bug，调整rotation后，还会回到原来的position added by ls 20230526
			    	       	object3D.unitData.position = [newPos[0], newPos[1], newPos[2]];

			    			thatCE.attachTransformControl(object3D);
			    	       	thatCE.refreshUnitPropertyValues(object3D);

			    	        //当object3D的位置旋转角度改变时 added by ls 20221208
			    	        thatCE.afterObject3DPositionRotationChanged(object3D);

			    	       	thatCE.refreshAttachHelpLine2d();
		    			}
		    			break;
		    		};
		    		case "unitMinX":
		    		case "unitMinY":
		    		case "unitMinZ":
		    		case "unitMaxX":
		    		case "unitMaxY":
		    		case "unitMaxZ":{
		    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatCE.valueMultiply;
		    			if(isNaN(newDecimalValue)){
		        			var oldValue = $(inputElement).attr("sourceValue");
		        			$(inputElement).val(oldValue);
		    			}
		    			else{
			    			var newPos = [object3D.position.x, object3D.position.y, object3D.position.z];
		    				thatCE.object3DCreator.getPositionValuesByPosParam(propertyName, newDecimalValue, newPos, object3D);
			    	       	object3D.position.set(newPos[0], newPos[1], newPos[2]);
			    			thatCE.attachTransformControl(object3D);
			    	       	thatCE.refreshUnitPropertyValues(object3D);

			    	        //当object3D的位置旋转角度改变时 added by ls 20221208
			    	        thatCE.afterObject3DPositionRotationChanged(object3D);

			    	       	thatCE.refreshAttachHelpLine2d();
		    			}
		    			break;
		    		}
		    		case "unitRotX":
		    		case "unitRotY":
		    		case "unitRotZ":{
		    			var newDecimalValue = cmnPcr.strToDecimal(newValue);
		    			if(isNaN(newDecimalValue)){
		        			var oldValue = $(inputElement).attr("sourceValue");
		        			$(inputElement).val(oldValue);
		    			}
		    			else{
			    	    	var anglePiValue = Math.PI * newDecimalValue / 180;
			    			var newRot = [object3D.rotation.x, object3D.rotation.y, object3D.rotation.z];
			    			if(propertyName == "unitRotX"){
			    				newRot[0] = anglePiValue;
			    			}
			    			if(propertyName == "unitRotY"){
			    				newRot[1] = anglePiValue;
			    			}
			    			if(propertyName == "unitRotZ"){
			    				newRot[2] = anglePiValue;
			    			}
			    	       	object3D.rotation.set(newRot[0], newRot[1], newRot[2]);

			    	       	//角度变化后，会影响到位置变化，需要重新计算一下positionExps
			    	       	thatCE.runUnitObject3DPositionExpJs(object3D);

			    			thatCE.attachTransformControl(object3D);
			    	       	thatCE.refreshUnitPropertyValues(object3D);

			    	        //当object3D的位置旋转角度改变时 added by ls 20221208
			    	        thatCE.afterObject3DPositionRotationChanged(object3D);

			    	       	thatCE.refreshAttachHelpLine2d();
		    			}
		    			break;
		    		}

		    		//是否支持展开BOM added by ls 20230726
		    		case "unitHasBOM":{
		    			object3D.unitData.hasBOM = newValue == "true" ? true : false;
		    			break;
		    		}
	    		}
			}

			//如果是表达式
			switch(propertyName){
				case "unitCountExpPim":{
					thatCE.setUnitCountAfterInputExp(newValue, inputElement, object3D);
					break;
				}
				case "unitPosXExpPim":{
					thatCE.setUnitPosAfterInputExp(newValue, "posX", object3D);
					break;
				}
				case "unitPosYExpPim":{
					thatCE.setUnitPosAfterInputExp(newValue, "posY", object3D);
					break;
				}
				case "unitPosZExpPim":{
					thatCE.setUnitPosAfterInputExp(newValue, "posZ", object3D);
					break;
				}
				case "unitMinXExpPim":{
					thatCE.setUnitPosAfterInputExp(newValue, "minX", object3D);
					break;
				}
				case "unitMinYExpPim":{
					thatCE.setUnitPosAfterInputExp(newValue, "minY", object3D);
					break;
				}
				case "unitMinZExpPim":{
					thatCE.setUnitPosAfterInputExp(newValue, "minZ", object3D);
					break;
				}
				case "unitMaxXExpPim":{
					thatCE.setUnitPosAfterInputExp(newValue, "maxX", object3D);
					break;
				}
				case "unitMaxYExpPim":{
					thatCE.setUnitPosAfterInputExp(newValue, "maxY", object3D);
					break;
				}
				case "unitMaxZExpPim":{
					thatCE.setUnitPosAfterInputExp(newValue, "maxZ", object3D);
					break;
				}
				case "unitRotXExpPim":{
					thatCE.setUnitRotAfterInputExp(newValue, "rotX", object3D);
					break;
				}
				case "unitRotYExpPim":{
					thatCE.setUnitRotAfterInputExp(newValue, "rotY", object3D);
					break;
				}
				case "unitRotZExpPim":{
					thatCE.setUnitRotAfterInputExp(newValue, "rotZ", object3D);
					break;
				}
			}
		}
		else{
			var oldValue = $(inputElement).attr("sourceValue");
			$(inputElement).val(oldValue);
			msgBox.alert({info: message});
		}
	}

	this.setUnitRotation = function(object3D, rotation){
		object3D.rotation.set(rotation[0], rotation[1], rotation[2]);
		thatCE.runUnitObject3DPositionExpJs(object3D);
		thatCE.refreshUnitPropertyValues(object3D);
		thatCE.afterObject3DPositionRotationChanged(object3D);
		thatCE.refreshAttachHelpLine2d();
	}

	this.setUnitPosition = function(object3D, position){
		object3D.position.set(position[0], position[1], position[2]);
		object3D.unitData.position = [position[0], position[1], position[2]];
		thatCE.refreshUnitPropertyValues(object3D);
		thatCE.afterObject3DPositionRotationChanged(object3D);
		thatCE.refreshAttachHelpLine2d();
	}

    this.refreshUnitInfoByUseParameterPosition = function(useParameterPosition){
    	var unitTabNames = sideTabGroups.rightUnitSelect;
    	for(var i = 0; i < unitTabNames.length; i++){
    		var unitTabName = unitTabNames[i];
    		$("#" + thatCE.containerId).find(".core3dTabContent[name='" + unitTabName + "'] .propertyItem[hideIfParameterPosition=\"true\"]").css({display: useParameterPosition ? "none" : "block"});
    		$("#" + thatCE.containerId).find(".core3dTabContent[name='" + unitTabName + "'] .propertyItem[hideIfParameterPosition!=\"true\"]").css({display: "block"});
    	}
    }

    this.refreshUnitInfoByUseWorldPosition = function(useWorldPosition){
    	var unitTabNames = sideTabGroups.rightUnitSelect;
    	for(var i = 0; i < unitTabNames.length; i++){
    		var unitTabName = unitTabNames[i];
    		$("#" + thatCE.containerId).find(".core3dTabContent[name='" + unitTabName + "'] .propertyItem[hideIfWorldPosition=\"true\"]").css({display: useWorldPosition ? "none" : "block"});
    		$("#" + thatCE.containerId).find(".core3dTabContent[name='" + unitTabName + "'] .propertyItem[hideIfWorldPosition!=\"true\"]").css({display: "block"});
    	}
    }

    this.setUnitCountAfterInputExp = function(exp, expInputElement, object3D){
    	exp = exp.trim();
    	if(exp.length > 0){
		    thatCE.runExpPim({
		    	exp: exp,
		    	needResultType: valueType.decimal,
		    	hasPointCtrl: true,
		    	afterGetRunResultFunc: function(p){
		    		if(p.errors != null){
		    			msgBox.alert({
		    				info: cmnPcr.arrayToString(p.errors)
		    			});
		    			delete object3D.unitData["countExp"];
		    		}
		    		else{
		    			object3D.unitData.countExp = {
		    				pim: p.exp,
		    				js: p.jsCode,
		    				ps: p.ps
		    			};
		    			var value = Math.floor(p.value);
		    			object3D.unitData.count = value;
		    			$(expInputElement).val(exp);
		    			var relateElement = $("#" + thatCE.containerId).find(".core3dTabContent[name='ruleDrivenPropertyList'] .propertyInput[name='unitCount']")[0];
		    			$(relateElement).val(value);
		    			$(relateElement).attr("sourceValue", value);
		    		}
		    	}
		    });
    	}
    	else{
			delete object3D.unitData["countExp"];
    	}
    }

    this.setUnitPosAfterInputExp = function(exp, expName, object3D){
    	exp = exp.trim();
    	if(exp.length > 0){
		    thatCE.runExpPim({
		    	exp: exp,
		    	name: expName,
		    	hasUnitNum: true,
		    	hasPointCtrl: true,
		    	needResultType: valueType.decimal,
		    	afterGetRunResultFunc: function(p){
		    		var expName = p.name;
		    		if(p.errors != null){
		    			msgBox.alert({
		    				info: cmnPcr.arrayToString(p.errors)
		    			});
		    			delete object3D.unitData.positionExps[expName];
		    		}
		    		else{
		    			object3D.unitData.positionExps[expName] = {
		    				pim: p.exp,
		    				js: p.jsCode,
		    				ps: p.ps
		    			};
		    			var relatePropertyName = "unit" + expName.substr(0,1).toUpperCase() + expName.substr(1);
		    			$("#" + thatCE.containerId).find(".propertyValueExpPim .propertyInput[propertyName='" + relatePropertyName + "']").val(exp);
		    			var relateElement = $("#" + thatCE.containerId).find(".core3dTabContent[name='ruleDrivenPropertyList'] .propertyInput[name='" + relatePropertyName + "']")[0];
		    			thatCE.changeUnitPropertyInputValue(cmnPcr.objectToStr(p.value, valueType.decimal), relateElement, object3D, true);
		    		}
		    	}
		    });
    	}
    	else{
			delete object3D.unitData.positionExps[expName];
    	}
    }

    this.setUnitRotAfterInputExp = function(exp, expName, object3D){
    	exp = exp.trim();
    	if(exp.length > 0){
		    thatCE.runExpPim({
		    	exp: exp,
		    	name: expName,
		    	hasUnitNum: true,
		    	hasPointCtrl: true,
		    	needResultType: valueType.decimal,
		    	afterGetRunResultFunc: function(p){
		    		var expName = p.name;
		    		if(p.errors != null){
		    			msgBox.alert({
		    				info: cmnPcr.arrayToString(p.errors)
		    			});
		    			delete object3D.unitData.rotationExps[expName];
		    		}
		    		else{
		    			object3D.unitData.rotationExps[expName] = {
		    				pim: p.exp,
		    				js: p.jsCode,
		    				ps: p.ps
		    			};
		    			var relatePropertyName = "unit" + expName.substr(0,1).toUpperCase() + expName.substr(1);
		    			$("#" + thatCE.containerId).find(".propertyValueExpPim .propertyInput[propertyName='" + relatePropertyName + "']").val(exp);
		    			var relateElement = $("#" + thatCE.containerId).find(".core3dTabContent[name='ruleDrivenPropertyList'] .propertyInput[name='" + relatePropertyName + "']")[0];
		    			thatCE.changeUnitPropertyInputValue(cmnPcr.objectToStr(p.value, valueType.decimal), relateElement, object3D, true);
		    		}
		    	}
		    });
    	}
    	else{
			delete object3D.unitData.rotationExps[expName];
    	}
    }

    this.initUnitPropertyInputEvent = function(){
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='propertyDrivenPropertyList'] .propertyItem").find(".propertyBtn[name='unitParameters']").click(function(ev){
        	var object3D = thatCE.selectedUnitObject3D;
        	thatCE.editUnitComponentParameters(object3D);
    		ev.stopPropagation();
            return true;
    	});
    	$("#" + thatCE.containerId).find(".core3dTabContent[name='otherPropertyList'] .propertyItem").find(".propertyBtn[name='unitFaceMaterial']").click(function(ev){
        	var object3D = thatCE.selectedUnitObject3D;
        	thatCE.editObject3DFaceMaterial(object3D);
    		ev.stopPropagation();
            return true;
    	});
    	var unitTabNames = sideTabGroups.rightUnitSelect;
    	for(var i = 0; i < unitTabNames.length; i++){
    		var unitTabName = unitTabNames[i];
	    	$("#" + thatCE.containerId).find(".core3dTabContent[name='" + unitTabName + "'] .propertyItem").find(".propertyInput").keydown(function(ev){
	    		ev.stopPropagation();
	            return true;
	    	});
	    	$("#" + thatCE.containerId).find(".core3dTabContent[name='" + unitTabName + "'] .propertyItem").find(".propertyExpBtn").click(function(ev){
	    		var propertyName = $(this).attr("propertyName");
	        	thatCE.editUnitPositionExp(propertyName);
	    		ev.stopPropagation();
	            return true;
	    	});
	    	$("#" + thatCE.containerId).find(".core3dTabContent[name='" + unitTabName + "'] .propertyItem").find(".propertyInput").change(function(){
	        	var object3D = thatCE.selectedUnitObject3D;
	        	if(object3D != null){
	        		var newValue = null;
	        		switch($(this).attr("type")){
	        			case "checkbox":{
	        				newValue = $(this).prop("checked") ? "true" : "false";
	        				break;
	        			}
	        			default:{
	        				newValue = $(this).val().trim();
	        				break;
	        			}
	        		}
	        		thatCE.changeUnitPropertyInputValue(newValue, this, object3D)
	        	}
	    	});
    	}
    }

    this.initComponentPropertyValues = function(componentInfo){
    	if(thatCE.unitInfoVisible){
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentName']").val(componentInfo.name);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentCode']").val(componentInfo.code);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentVersionNum']").val(componentInfo.versionNum);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentControlSize']").val(componentInfo.controlSize);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentCameraZoom']").val(cmnPcr.decimalToStr(thatCE.camera.zoom, false, 2, true));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentGridSpace']").val(thatCE.getDisplayValueStr(componentInfo.gridSpace));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentAttachDistance']").val(thatCE.getDisplayValueStr(componentInfo.attachDistance));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentPlacePointRadius']").val(thatCE.getDisplayValueStr(componentInfo.placePointRadius));

	    	//轴网字体大小 added by ls 20230313
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentAxisFontSize']").val(thatCE.getDisplayValueStr(componentInfo.axisFontSize));

	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeX']").val(thatCE.getDisplayValueStr(componentInfo.size.x));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeY']").val(thatCE.getDisplayValueStr(componentInfo.size.y));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeZ']").val(thatCE.getDisplayValueStr(componentInfo.size.z));

	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeXExpPim']").val(componentInfo.sizeExp.x == null? "" : componentInfo.sizeExp.x.pim);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeYExpPim']").val(componentInfo.sizeExp.y == null ? "" : componentInfo.sizeExp.y.pim);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeZExpPim']").val(componentInfo.sizeExp.z == null ? "" : componentInfo.sizeExp.z.pim);

	    	//基准面 added by ls 20230609
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneXYPosition']").val(thatCE.getDisplayValueStr(componentInfo.workPlanes.xy.position));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneXYVisible']").prop("checked", componentInfo.workPlanes.xy.visible);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneXZPosition']").val(thatCE.getDisplayValueStr(componentInfo.workPlanes.xz.position));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneXZVisible']").prop("checked", componentInfo.workPlanes.xz.visible);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneYZPosition']").val(thatCE.getDisplayValueStr(componentInfo.workPlanes.yz.position));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneYZVisible']").prop("checked", componentInfo.workPlanes.yz.visible);

	    	//初始化位置方式 modified by ls 20230615
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitLocationTypeAssistPoint']").val(componentInfo.init.locationType.assistPoint);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitLocationTypeFromPoint']").val(componentInfo.init.locationType.fromPoint);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitLocationTypeToPoint']").val(componentInfo.init.locationType.toPoint);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitLocationTypeParameter']").val(componentInfo.init.locationType.parameter);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitLocationTypeWorldPosition']").prop("checked", componentInfo.init.locationType.worldPosition);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitPopWindow']").prop("checked", componentInfo.init.popWindow);


	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentName']").attr("sourceValue", componentInfo.name);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentCode']").attr("sourceValue", componentInfo.code);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentVersionNum']").attr("sourceValue", componentInfo.versionNum);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentControlSize']").attr("sourceValue", componentInfo.controlSize);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentCameraZoom']").attr("sourceValue", thatCE.camera.zoom);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentGridSpace']").attr("sourceValue", thatCE.getDisplayValueStr(componentInfo.gridSpace));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentAttachDistance']").attr("sourceValue", thatCE.getDisplayValueStr(componentInfo.attachDistance));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentPlacePointRadius']").attr("sourceValue", thatCE.getDisplayValueStr(componentInfo.placePointRadius));

	    	//轴网字号大小 added by ls 20230313
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentAxisFontSize']").attr("sourceValue", thatCE.getDisplayValueStr(componentInfo.axisFontSize));

	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeX']").attr("sourceValue", thatCE.getDisplayValueStr(componentInfo.size.x));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeY']").attr("sourceValue", thatCE.getDisplayValueStr(componentInfo.size.y));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeZ']").attr("sourceValue", thatCE.getDisplayValueStr(componentInfo.size.z));

	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeXExpPim']").attr("title", componentInfo.sizeExp.x == null ? "" : componentInfo.sizeExp.x.pim);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeYExpPim']").attr("title", componentInfo.sizeExp.y == null ? "" : componentInfo.sizeExp.y.pim);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentSizeZExpPim']").attr("title", componentInfo.sizeExp.z == null ? "" : componentInfo.sizeExp.z.pim);

	    	//基准面 added by ls 20230609
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneXYPosition']").attr("sourceValue", thatCE.getDisplayValueStr(componentInfo.workPlanes.xy.position));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneXZPosition']").attr("sourceValue", thatCE.getDisplayValueStr(componentInfo.workPlanes.xz.position));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneYZPosition']").attr("sourceValue", thatCE.getDisplayValueStr(componentInfo.workPlanes.yz.position));
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneXYVisible']").attr("sourceValue", componentInfo.workPlanes.xy.visible ? "true" : "false");
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneXZVisible']").attr("sourceValue", componentInfo.workPlanes.xz.visible ? "true" : "false");
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='workPlaneYZVisible']").attr("sourceValue", componentInfo.workPlanes.yz.visible ? "true" : "false");

	    	//初始化位置方式 modified by ls 20230615
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitLocationTypeAssistPoint']").attr("sourceValue", componentInfo.init.locationType.assistPoint);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitLocationTypeFromPoint']").attr("sourceValue", componentInfo.init.locationType.fromPoint);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitLocationTypeToPoint']").attr("sourceValue", componentInfo.init.locationType.toPoint);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitLocationTypeParameter']").attr("sourceValue", componentInfo.init.locationType.parameter);
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitLocationTypeWorldPosition']").attr("sourceValue", componentInfo.init.locationType.position ? "true" : "false");
	    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='componentInitPopWindow']").attr("sourceValue", componentInfo.init.popWindow ? "true" : "false");

    	}
    }

    this.refreshUnitPropertyValues = function(object3D){
    	var unitSetting = thatCE.getUnitSettingFromObject3D(object3D);
    	var refComponentInfo = thatCE.getRefComponentInfoFromCache(unitSetting.code, unitSetting.versionNum);
    	var otherPropertyValues = thatCE.getOtherPropertyValues(object3D);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitName']").val(unitSetting.name);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMixType']").val(unitSetting.mixType);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitViewLevel']").val(unitSetting.viewLevel);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitUseWorldPosition']").prop("checked", unitSetting.useWorldPosition);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitCount']").val(unitSetting.count);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotX']").val(thatCE.getRotationValueStr(unitSetting.rotation[0], 3));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotY']").val(thatCE.getRotationValueStr(unitSetting.rotation[1], 3));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotZ']").val(thatCE.getRotationValueStr(unitSetting.rotation[2], 3));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosX']").val(thatCE.getDisplayValueStr(unitSetting.position[0]));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosY']").val(thatCE.getDisplayValueStr(unitSetting.position[1]));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosZ']").val(thatCE.getDisplayValueStr(unitSetting.position[2]));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinX']").val(thatCE.getDisplayValueStr(otherPropertyValues.minX));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinY']").val(thatCE.getDisplayValueStr(otherPropertyValues.minY));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinZ']").val(thatCE.getDisplayValueStr(otherPropertyValues.minZ));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxX']").val(thatCE.getDisplayValueStr(otherPropertyValues.maxX));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxY']").val(thatCE.getDisplayValueStr(otherPropertyValues.maxY));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxZ']").val(thatCE.getDisplayValueStr(otherPropertyValues.maxZ));

    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitCountExpPim']").val(unitSetting.countExp == null ? "" : unitSetting.countExp.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosXExpPim']").val(unitSetting.positionExps == null || unitSetting.positionExps.posX == null ? "" : unitSetting.positionExps.posX.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosYExpPim']").val(unitSetting.positionExps == null || unitSetting.positionExps.posY == null ? "" : unitSetting.positionExps.posY.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosZExpPim']").val(unitSetting.positionExps == null || unitSetting.positionExps.posZ == null ? "" : unitSetting.positionExps.posZ.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinXExpPim']").val(unitSetting.positionExps == null || unitSetting.positionExps.minX == null ? "" : unitSetting.positionExps.minX.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinYExpPim']").val(unitSetting.positionExps == null || unitSetting.positionExps.minY == null ? "" : unitSetting.positionExps.minY.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinZExpPim']").val(unitSetting.positionExps == null || unitSetting.positionExps.minZ == null ? "" : unitSetting.positionExps.minZ.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxXExpPim']").val(unitSetting.positionExps == null || unitSetting.positionExps.maxX == null ? "" : unitSetting.positionExps.maxX.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxYExpPim']").val(unitSetting.positionExps == null || unitSetting.positionExps.maxY == null ? "" : unitSetting.positionExps.maxY.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxZExpPim']").val(unitSetting.positionExps == null || unitSetting.positionExps.maxZ == null ? "" : unitSetting.positionExps.maxZ.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotXExpPim']").val(unitSetting.rotationExps == null || unitSetting.rotationExps.rotX == null ? "" : unitSetting.rotationExps.rotX.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotYExpPim']").val(unitSetting.rotationExps == null || unitSetting.rotationExps.rotY == null ? "" : unitSetting.rotationExps.rotY.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotZExpPim']").val(unitSetting.rotationExps == null || unitSetting.rotationExps.rotZ == null ? "" : unitSetting.rotationExps.rotZ.pim);

    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitName']").attr("sourceValue", unitSetting.name);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMixType']").attr("sourceValue", unitSetting.mixType);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitViewLevel']").attr("sourceValue", unitSetting.viewLevel);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitUseWorldPosition']").attr("sourceValue", unitSetting.useWorldPosition ? "true" : "false");
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitCount']").attr("sourceValue", unitSetting.count);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosX']").attr("sourceValue", thatCE.getDisplayValueStr(unitSetting.position[0]));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosY']").attr("sourceValue", thatCE.getDisplayValueStr(unitSetting.position[1]));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosZ']").attr("sourceValue", thatCE.getDisplayValueStr(unitSetting.position[2]));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotX']").attr("sourceValue", thatCE.getRotationValueStr(unitSetting.rotation[0], 3));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotY']").attr("sourceValue", thatCE.getRotationValueStr(unitSetting.rotation[1], 3));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotZ']").attr("sourceValue", thatCE.getRotationValueStr(unitSetting.rotation[2], 3));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinX']").attr("sourceValue", thatCE.getDisplayValueStr(otherPropertyValues.minX));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinY']").attr("sourceValue", thatCE.getDisplayValueStr(otherPropertyValues.minY));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinZ']").attr("sourceValue", thatCE.getDisplayValueStr(otherPropertyValues.minZ));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxX']").attr("sourceValue", thatCE.getDisplayValueStr(otherPropertyValues.maxX));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxY']").attr("sourceValue", thatCE.getDisplayValueStr(otherPropertyValues.maxY));
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxZ']").attr("sourceValue", thatCE.getDisplayValueStr(otherPropertyValues.maxZ));

    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitCountExpPim']").attr("title", unitSetting.countExp == null ? "" : unitSetting.countExp.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosXExpPim']").attr("title", unitSetting.positionExps == null || unitSetting.positionExps.posX == null ? "" : unitSetting.positionExps.posX.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosYExpPim']").attr("title", unitSetting.positionExps == null || unitSetting.positionExps.posY == null ? "" : unitSetting.positionExps.posY.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitPosZExpPim']").attr("title", unitSetting.positionExps == null || unitSetting.positionExps.posZ == null ? "" : unitSetting.positionExps.posZ.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinXExpPim']").attr("title", unitSetting.positionExps == null || unitSetting.positionExps.minX == null ? "" : unitSetting.positionExps.minX.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinYExpPim']").attr("title", unitSetting.positionExps == null || unitSetting.positionExps.minY == null ? "" : unitSetting.positionExps.minY.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMinZExpPim']").attr("title", unitSetting.positionExps == null || unitSetting.positionExps.minZ == null ? "" : unitSetting.positionExps.minZ.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxXExpPim']").attr("title", unitSetting.positionExps == null || unitSetting.positionExps.maxX == null ? "" : unitSetting.positionExps.maxX.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxYExpPim']").attr("title", unitSetting.positionExps == null || unitSetting.positionExps.maxY == null ? "" : unitSetting.positionExps.maxY.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitMaxZExpPim']").attr("title", unitSetting.positionExps == null || unitSetting.positionExps.maxZ == null ? "" : unitSetting.positionExps.maxZ.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotXExpPim']").attr("title", unitSetting.rotationExps == null || unitSetting.rotationExps.rotX == null ? "" : unitSetting.rotationExps.rotX.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotYExpPim']").attr("title", unitSetting.rotationExps == null || unitSetting.rotationExps.rotY == null ? "" : unitSetting.rotationExps.rotY.pim);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitRotZExpPim']").attr("title", unitSetting.rotationExps == null || unitSetting.rotationExps.rotZ == null ? "" : unitSetting.rotationExps.rotZ.pim);

    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyValue[name='refComponentCode']").text(refComponentInfo.code);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyValue[name='refComponentName']").text(refComponentInfo.name);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyValue[name='refComponentVersionNum']").text(refComponentInfo.versionNum);
    	//是否支持展开BOM added by ls 20230726
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitHasBOM']").prop("checked", unitSetting.hasBOM);
    	$("#" + thatCE.containerId).find(".propertyItem").find(".propertyInput[name='unitHasBOM']").attr("sourceValue", unitSetting.hasBOM ? "true" : "false");

    	//如果是辅助点，那么隐藏部分属性 added by ls 20221025
    	var isAssistPoint = thatCE.checkIsAssistPoint(unitSetting.code);
    	if(isAssistPoint){
        	thatCE.refreshUnitInfoByAssistPoint(isAssistPoint);
    	}
    	else if(unitSetting.useParameterPosition){
    		thatCE.refreshUnitInfoByUseParameterPosition(unitSetting.useParameterPosition);
    	}
    	else{
    		thatCE.refreshUnitInfoByUseWorldPosition(unitSetting.useWorldPosition);
    	}


		//新增基本信息展示  added by liyh 20231101
		var allParamHtml = "<div id=\"basicPropertyInfo\">";
		for(let paramName in unitSetting.parameters){
			if(refComponentInfo.parameters[paramName] && refComponentInfo.parameters[paramName].designVisible && refComponentInfo.parameters[paramName].categoryName=="尺寸特征"){ // uinitNum 需排除
				var paramValueHtml="<div class=\"propertyItem\">"
					+ "<div class=\"propertyName\" style='white-space:nowrap; overflow:hidden; text-overflow:ellipsis'  title='"+paramName+"'>" + paramName + "</div>"
					+ "<div class=\"propertyValue\" style='white-space:nowrap; overflow:hidden; text-overflow:ellipsis' title='"+unitSetting.parameters[paramName].value+"'>"+ unitSetting.parameters[paramName].value + "</div></div>";
				allParamHtml+=paramValueHtml;
			}
		}
		allParamHtml+="</div>";
		$("#basicPropertyInfo").replaceWith(allParamHtml);

    }

    //判断是否为辅助点组件 added by ls 20230612
    this.checkIsAssistPoint = function(code){
    	var isAssistPoint = code.startWith(js3SysCatAndCom.assistPointCategoryPre);
    	return isAssistPoint;
    }

	//如果是辅助点，那么隐藏部分属性 added by ls 20221025
    this.refreshUnitInfoByAssistPoint = function(isAssistPoint){
    	var unitTabNames = sideTabGroups.rightUnitSelect;
    	for(var i = 0; i < unitTabNames.length; i++){
    		var unitTabName = unitTabNames[i];
    		$("#" + thatCE.containerId).find(".core3dTabContent[name='" + unitTabName + "'] .propertyItem[hideIfAssistPoint=\"true\"]").css({display: isAssistPoint ? "none" : "block"});
    		$("#" + thatCE.containerId).find(".core3dTabContent[name='" + unitTabName + "'] .propertyItem[hideIfAssistPoint!=\"true\"]").css({display: "block"});
    	}
    }

    this.getDisplayValueStr = function(sourceValue, fixNum){
    	fixNum = fixNum == null ? 1 : fixNum;
    	var tempValue = parseFloat(sourceValue);
    	return cmnPcr.decimalToStr(sourceValue * thatCE.valueMultiply, false, fixNum, true);
    }

    this.getRotationValueStr = function(sourceValue, roundNum){
    	var tempValue = parseFloat(sourceValue);
    	var angleValue = tempValue * 180 / Math.PI;
    	return cmnPcr.decimalToStr(angleValue, true, roundNum);
    }

    this.getOtherPropertyValues = function(object3D){
        var box = new THREE.Box3().setFromObject(object3D, true);
        var lenX = Math.abs(box.min.x - box.max.x);
        var lenY = Math.abs(box.min.y - box.max.y);
        var lenZ = Math.abs(box.min.z - box.max.z);

        var centerX = (box.min.x + box.max.x) / 2;
        var centerY = (box.min.y + box.max.y) / 2;
        var centerZ = (box.min.z + box.max.z) / 2;

    	var otherPropertyValues = {
			lenX: lenX,
			lenY: lenY,
			lenZ: lenZ,
			minX: box.min.x,
			maxX: box.max.x,
			minY: box.min.y,
			maxY: box.max.y,
			minZ: box.min.z,
			maxZ: box.max.z,
			centerX: centerX,
			centerY: centerY,
			centerZ: centerZ
    	};
    	return otherPropertyValues;
    }

    this.selectObjectLight = function(object3D){
    	if(thatCE.canSelectObject3D){
			if(!object3D.isEdgeLine && object3D.material != null){
	    		if(object3D.material.length != null){
	    			var oldMaterials = object3D.oldMaterial == null ? object3D.material : object3D.oldMaterial;
	    			object3D.oldMaterial = oldMaterials;
	    			var newMaterials = [];
	    			for(var i = 0; i < oldMaterials.length; i++){
	    				var newMaterial = oldMaterials[i].clone();
	    				newMaterial.color = new THREE.Color(thatCE.selectedColor);
	    	    		newMaterial.opacity = thatCE.selectedOpacity;

			    		//选中时 depthTest为false，好突出显示 modified by ls 202201
	    		    	newMaterial.depthTest = false;

	    		    	newMaterial.transparent = true;
	    		    	newMaterials.push(newMaterial);
	    			}
	    			object3D.material = newMaterials;
	    		}
	    		else{
	    			var oldMaterial = object3D.oldMaterial == null ? object3D.material : object3D.oldMaterial;
			    	object3D.oldMaterial = oldMaterial;
			    	var newMaterial = oldMaterial.clone();
			    	newMaterial.color = new THREE.Color(thatCE.selectedColor);
		    		newMaterial.opacity = thatCE.selectedOpacity;

		    		//选中时 depthTest为false，好突出显示 modified by ls 202201
			    	newMaterial.depthTest = false;

			    	newMaterial.transparent = true;
			    	object3D.material = newMaterial;
	    		}
			}
	    	if(object3D.children != null){
		    	for(var i = 0; i < object3D.children.length; i++){
		    		var child = object3D.children[i];
		    		if(!child.isEdgeLine){
			    		thatCE.selectObjectLight(child);
		    		}
		    	}
	    	}
    	}
    }

    this.selectObjectUnlight = function(object3D){
    	if(thatCE.canSelectObject3D){
			if(!object3D.isEdgeLine && object3D.material != null){
				object3D.material = object3D.oldMaterial;
			}
	    	if(object3D.children != null){
		    	for(var i = 0; i < object3D.children.length; i++){
		    		var child = object3D.children[i];
		    		if(!child.isEdgeLine){
		    			thatCE.selectObjectUnlight(child);
		    		}
		    	}
	    	}
    	}
    }

    this.initModelElementInfo = function(elementInfo){
    	var html = "<div style=\"height:10px;width:100%;\">&nbsp;</div>";
    	if(elementInfo != null){
    		var paramStrings = new Array();
    		for(var i = 0; i < elementInfo.parameters.length; i++){
    			var param = elementInfo.parameters[i];
    			paramStrings.push(param.name + ": " + (param.value == null ? "无" : param.value));
    		}
    		paramStrings = paramStrings.sort();
    		for(var i = 0; i < paramStrings.length; i++){
    			var paramStr = paramStrings[i];
    			var paramHtml = "<div style=\"width:100%;height:30px;position:relative;font-size:14px;\">"
    				+ "<div style=\"position:absolute;left:5px;right:0px;top:0px;height:30px;line-height:16px;text-align:left;\">"
    				+ cmnPcr.html_encode(paramStr) + "</div>"
    				+ "</div>"
				html += paramHtml;
    		}
    	}
    	else{
    		html += "<div style=\"height:10px;width:100%;\">（尚未选中构件）</div>";
    	}
		$("#" + thatCE.options.propertySettingContainerId).find(".propertyValueContainer").html(html);
    }

    //找到它属于哪个构件的Object3D
    this.getRootObject3D = function(checkObj){
    	if(!checkObj.isEdgeLine){
	    	while(checkObj.type != "Scene"){
	    		if(checkObj.unitData == null && checkObj.parent.type != "Scene"){
	    			checkObj = checkObj.parent;
	    		}
	    		else{
	    			//如果为隐藏状态 那么返回空 modified by ls 20230526
	    			if(!checkObj.visible){
	    				return null;
	    			}
	    			else{
	    				return checkObj;
	    			}
	    		}
	    	}
    	}
    	return null;
    }

    // 突出显示选中的构件
    this.selectUnit = function(intersects, ctrlKey) {
        if (intersects.length > 0) {
        	var index = 0;
        	while(index < intersects.length){
            	//var tempObj = intersects[index].object;
        		var tempObj = thatCE.getRootObject3D(intersects[index].object);
        		if(tempObj != null){
	        		if(tempObj.isUnitObject){
	        			//多选 modified by ls 20210924
	        			var isMultiSelect = false;
	        			if(thatCE.multiSelectedUnitObject3Ds.length > 0 || ctrlKey){
	        				isMultiSelect = true;
	        			}
	        			if(isMultiSelect){
	        				var selectedUnitObject3D = thatCE.selectedUnitObject3D;
	        				if(selectedUnitObject3D != null){
	        					thatCE.selectUnitObject(null);
		        				thatCE.pointCtrlProcessor.selectPointCtrlObject(null);
	        					thatCE.multiSelectUnitObject(selectedUnitObject3D);
	        				}
	        				thatCE.multiSelectUnitObject(tempObj);
	        			}
	        			else{
	        				thatCE.pointCtrlProcessor.selectPointCtrlObject(null);
	        				thatCE.selectUnitObject(tempObj);
	        			}
	                	return tempObj;
	        		}
	        		else if(tempObj.isPointCtrl){
	        			if(thatCE.multiSelectedUnitObject3Ds.length == 0 && !ctrlKey){
	        				thatCE.selectUnitObject(null);
	        				thatCE.pointCtrlProcessor.selectPointCtrlObject(tempObj);
	        				return tempObj;
	        			}
	        			else{
	        				index++;
	        			}
	        		}
	        		else{
	        			index++;
	        		}
        		}
        		else{
        			index++;
        		}
        	}
        	thatCE.selectUnitObject(null);
			thatCE.pointCtrlProcessor.selectPointCtrlObject(null);
            return null;
        }
        else{
        	thatCE.selectUnitObject(null);
			thatCE.pointCtrlProcessor.selectPointCtrlObject(null);
        }
        return null;
    };

    //获取选中弄的wpTasnsCtrl added by ls 20230614
    this.selectWpTransCtrl = function(intersects) {
        if (intersects.length > 0) {
        	var index = 0;
        	while(index < intersects.length){
        		var tempObj = intersects[index].object;
        		if(tempObj.isWpTransCtrlPoint){
                	return tempObj;
        		}
        		else{
        			index++;
        		}
        	}
        }
        return null;
    };

    //鼠标按下
    this.onMouseDown = function(ev) {
    	var targetElement = ev.target;
    	var isPopContainer = thatCE.checkIsPopContainer(targetElement);
    	if(!isPopContainer){
	    	var is2DElement = targetElement.getAttribute("is2D") == "true";
	    	var isEditingPos = thatCE.checkIsPopEditingPos();
	    	if(isEditingPos){
	        	thatCE.mouseDownPosition = null;
	    		//正在在弹出框编辑位置
	    	}
	    	else if(!is2DElement){
	        	thatCE.mouseDownPosition = {
	        		x: ev.clientX - thatCE.containerPos.x,
	        		y: ev.clientY - thatCE.containerPos.y
	        	};

	        	//让容器获取焦点，方便复制粘贴 modified by ls 20210901
	            $("#" + thatCE.containerId).find(".coreContainer").focus();
	    	}
	    	else{
	    		thatCE.refreshAttachHelpLine();
	    		thatCE.showPopPosEditor(targetElement);
	    	}
    	}
    }

    this.checkIsPopEditingPos = function(){
    	return $("#" + thatCE.containerId).find(".popPosSettingContainer").css("display") == "block";
    }

    this.checkIsPopContainer = function(targetElement){
    	var tempElement = $(targetElement);
    	while(tempElement.length != 0 && !$(tempElement).hasClass("coreInnerContainer")){
    		if($(tempElement).hasClass("zlpPopBox") || $(tempElement).hasClass("zlpOpacityBox")){
    			return true;
    		}
    		else{
        		tempElement = $(tempElement[0]).parent();
    		}
    	}
    	return !$(tempElement).hasClass("coreInnerContainer");
    }

    this.getAllWorkPlanes = function(){
    	var workPlanes = new Array();
    	if(thatCE.workPlaneObjects.xy != null){
    		workPlanes.push(thatCE.workPlaneObjects.xy);
    	}
    	if(thatCE.workPlaneObjects.yz != null){
    		workPlanes.push(thatCE.workPlaneObjects.yz);
    	}
    	if(thatCE.workPlaneObjects.xz != null){
    		workPlanes.push(thatCE.workPlaneObjects.xz);
    	}
    	return workPlanes;
    }

    this.onMouseMove = function(ev) {
    	var targetElement = ev.target;
    	var isPopContainer = thatCE.checkIsPopContainer(targetElement);
    	if(!isPopContainer){
	        switch(thatCE.status){
		        case js3CoreEditorStatus.placeLimit3DPoints:{
		        	if(thatCE.placeSettings.drawingPlacePoint){
			        	var mouseUpPosition = {
			        		x: ev.clientX - thatCE.containerPos.x,
			        		y: ev.clientY - thatCE.containerPos.y
			        	};
		                ev.preventDefault();
		            	var mouse = thatCE.GetMouseInfo(ev);
		                thatCE.raycaster.setFromCamera(mouse, thatCE.camera);
		                //var intersects = thatCE.raycaster.intersectObjects(thatCE.scene.children, true);
		                var workPlanes = thatCE.getAllWorkPlanes();
		                var intersects = thatCE.raycaster.intersectObjects(workPlanes, true);
		                thatCE.movePlace3DPoint({intersects: intersects, shiftKey: ev.shiftKey, mousePosition: mouse});
		        	}
		        	break;
		        };
		        case js3CoreEditorStatus.placeLimit2DPoints:{
		        	if(thatCE.placeSettings.drawingPlacePoint){
			        	var mouseUpPosition = {
			        		x: ev.clientX - thatCE.containerPos.x,
			        		y: ev.clientY - thatCE.containerPos.y
			        	};
		                ev.preventDefault();
		            	var mouse = thatCE.GetMouseInfo(ev);
		                thatCE.raycaster.setFromCamera(mouse, thatCE.camera);
		                //var intersects = thatCE.raycaster.intersectObjects(thatCE.scene.children, true);
		                var workPlanes = thatCE.workPlaneObjects.xz != null ? [thatCE.workPlaneObjects.xz] : [];
		                var intersects = thatCE.raycaster.intersectObjects(workPlanes, true);
		                thatCE.movePlace2DPoints({intersects: intersects, shiftKey: ev.shiftKey, mousePosition: mouse});
		        	}
		        	break;
		        };
		        case js3CoreEditorStatus.ruler:{
		        	if(thatCE.placeSettings.drawingPlacePoint){
			        	var mouseUpPosition = {
			        		x: ev.clientX - thatCE.containerPos.x,
			        		y: ev.clientY - thatCE.containerPos.y
			        	};
		                ev.preventDefault();
		            	var mouse = thatCE.GetMouseInfo(ev);
		                thatCE.raycaster.setFromCamera(mouse, thatCE.camera);
		                var workPlanes = thatCE.getAllWorkPlanes();
		                var intersects = thatCE.raycaster.intersectObjects(workPlanes, true);
		                thatCE.moveRulerPoints({intersects: intersects, shiftKey: ev.shiftKey, mousePosition: mouse});
		        	}
		        	break;
		        };
		        case js3CoreEditorStatus.pointCtrl:{
		        	if(thatCE.placeSettings.drawingPlacePoint){
			        	var mouseUpPosition = {
			        		x: ev.clientX - thatCE.containerPos.x,
			        		y: ev.clientY - thatCE.containerPos.y
			        	};
		                ev.preventDefault();
		            	var mouse = thatCE.GetMouseInfo(ev);
		                thatCE.raycaster.setFromCamera(mouse, thatCE.camera);
		                var workPlanes = thatCE.getAllWorkPlanes();
		                var intersects = thatCE.raycaster.intersectObjects(workPlanes, true);
		                thatCE.movePointCtrlPoints({intersects: intersects, shiftKey: ev.shiftKey, mousePosition: mouse});
		        	}
		        	break;
		        };
		        case js3CoreEditorStatus.normal:{
	            	var mouse = thatCE.GetMouseInfo(ev);
	                thatCE.raycaster.setFromCamera(mouse, thatCE.camera);
		        	if(thatCE.placeModifySettings.drawingPlacePoint){
		        		//正在移动wp的控制点 added by ls 20230614
		                ev.preventDefault();
		                var workPlanes = thatCE.getAllWorkPlanes();
		                var intersects = thatCE.raycaster.intersectObjects(workPlanes, true);
		        		thatCE.moveWpTransCtrlPoint({intersects: intersects, shiftKey: ev.shiftKey, mousePosition: mouse});
		        	}
		        	else{
		                var intersects = thatCE.raycaster.intersectObjects(thatCE.scene.children, true);
		        		var wpTransCtrlPoint = thatCE.selectWpTransCtrl(intersects);
		        		if(wpTransCtrlPoint != null){
		        			thatCE.showWaitingPlacePointMessge(wpTransCtrlPoint, mouse);
		        		}
		        		else{
		        			thatCE.showWaitingPlacePointMessge(null);
		        		}

			        	var isEditingPos = thatCE.checkIsPopEditingPos();
			        	if(!isEditingPos){
				        	thatCE.refreshAttachHelpLine2d();
				        	thatCE.pointCtrlProcessor.refreshAttachHelpLine2d();
			        	}
		        	}
		        	break;
		        }
	        }
    	}
    };

    this.getWorkPlaneIntersectPoint = function(intersects){
    	var groundPlaneIntersect = null;
        if (intersects.length > 0) {
        	var index = 0;
        	while(index < intersects.length){
            	var intersect = intersects[index];
        		if(intersect.object.isWorkPlane){
        			groundPlaneIntersect = intersect;
                	break;
        		}
        		else{
        			index++;
        		}
        	}
        }
        if(groundPlaneIntersect != null){
	    	var mouse3DPosition = {
	    		x: groundPlaneIntersect.point.x,
	    		y: groundPlaneIntersect.point.y,
	    		z: groundPlaneIntersect.point.z
	    	};
	    	return {
	    		point: mouse3DPosition,
	    		workPlaneName: intersect.object.name
	    	};
        }
        else{
        	return null;
        }
    }

    this.getIntersect3DPoint = function(intersects){
    	var intersect = null;
        if (intersects.length > 0) {
        	var index = 0;
        	while(index < intersects.length){
            	var intersect = intersects[index];
            	if(intersect.object.isWorkPlane){
        			var mouse3DPosition = {
    		    		x: intersect.point.x,
    		    		y: intersect.point.y,
    		    		z: intersect.point.z
    		    	};
    		    	return {
    		    		point: mouse3DPosition,
    		    		workPlaneName: intersect.object.name
    		    	};
        		}
        		else{
        			index++;
        		}
        	}
        }
    	return null;
    }

    this.getIntersect2DPoint = function(intersects){
    	var intersect = null;
        if (intersects.length > 0) {
        	var index = 0;
        	while(index < intersects.length){
            	var intersect = intersects[index];
            	if(intersect.object.isWorkPlane){
        			var mouse3DPosition = {
    		    		x: intersect.point.x,
    		    		y: intersect.point.y,
    		    		z: intersect.point.z
    		    	};
    		    	return {
    		    		point: mouse3DPosition,
    		    		workPlaneName: intersect.object.name
    		    	};
        		}
        		else{
        			index++;
        		}
        	}
        }
    	return null;
    }

    this.checkIsModelObject = function(object){
    	var tempObject = object;
    	while(tempObject.type != "Scene"){
    		if(tempObject.unitData != null){
    			return true;
    		}
    		else{
    			tempObject = tempObject.parent;
    		}
    	}
    	return false;
    }

    this.movePlace3DPoint = function(p){
    	var intersectObj = thatCE.getIntersect3DPoint(p.intersects);
    	if(intersectObj != null){
    		var intersectPoint = intersectObj.point;
    		var workPlaneName = intersectObj.workPlaneName;
    		var waitingPlacePoint = thatCE.placeSettings.waitingPlacePoint;
    		if(!p.shiftKey){

    			//更改获取最近吸附点的方法 modified by ls 20221026
    			var attachValueObjX = thatCE.calcNearestCenterValue(thatCE.attachLines.x, [intersectPoint.x], intersectPoint.x);
    			var attachValueObjY = thatCE.calcNearestCenterValue(thatCE.attachLines.y, [intersectPoint.y], intersectPoint.y);
    			var attachValueObjZ = thatCE.calcNearestCenterValue(thatCE.attachLines.z, [intersectPoint.z], intersectPoint.z);

    			if(attachValueObjZ.newValue == null || workPlaneName == "xy"){
        			thatCE.refreshAttachHelpLine("Z");
    			}
    			else{
    				intersectPoint.z = attachValueObjZ.newValue;
        			thatCE.refreshAttachHelpLine("Z", attachValueObjZ.newValue, [workPlaneName]);
    			}
    			if(attachValueObjY.newValue == null || workPlaneName == "xz"){
        			thatCE.refreshAttachHelpLine("Y");
    			}
    			else{
    				intersectPoint.y = attachValueObjY.newValue;
        			thatCE.refreshAttachHelpLine("Y", attachValueObjY.newValue, [workPlaneName]);
    			}
    			if(attachValueObjX.newValue == null || workPlaneName == "yz"){
        			thatCE.refreshAttachHelpLine("X");
    			}
    			else{
    				intersectPoint.x = attachValueObjX.newValue;
        			thatCE.refreshAttachHelpLine("X", attachValueObjX.newValue, [workPlaneName]);
    			}
    		}
    		else{
    			thatCE.refreshAttachHelpLine();
    		}
    		waitingPlacePoint.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z);
    		var waitingPlaceLine = thatCE.placeSettings.waitingPlaceLine;
    		if(waitingPlaceLine != null){
                var beginPoint = thatCE.placeSettings.placedPoints[thatCE.placeSettings.placedPoints.length - 1];
                var endPoint = waitingPlacePoint;
	            var pointArr = [beginPoint.position.x, beginPoint.position.y, beginPoint.position.z,
	        					endPoint.position.x, endPoint.position.y, endPoint.position.z];
	            waitingPlaceLine.geometry.setPositions(pointArr);
                waitingPlaceLine.geometry.verticesNeedUpdate = true;
    		}
    	}
		thatCE.showWaitingPlacePointMessge(waitingPlacePoint, p.mousePosition);
    }

    this.moveRulerPoints = function(p){
    	var intersectObj = thatCE.getIntersect3DPoint(p.intersects);
    	if(intersectObj != null){
    		thatCE.moveRulerPoint(intersectObj, p.shiftKey);
    	}
    }

    this.moveRulerPoint = function(intersectObj, shiftKey){
    	var intersectPoint = intersectObj.point;
		var waitingPlacePoint = thatCE.placeSettings.waitingPlacePoint;
		if(!shiftKey){
			//更改获取最近吸附点的方法 modified by ls 20221026
			var attachValueObjX = thatCE.calcNearestCenterValue(thatCE.attachLines.x, [intersectPoint.x], intersectPoint.x);
			var attachValueObjY = thatCE.calcNearestCenterValue(thatCE.attachLines.y, [intersectPoint.y], intersectPoint.y);
			var attachValueObjZ = thatCE.calcNearestCenterValue(thatCE.attachLines.z, [intersectPoint.z], intersectPoint.z);
			if(attachValueObjX.newValue == null && attachValueObjY.newValue == null && attachValueObjZ.newValue == null){
    			thatCE.refreshAttachHelpLine();
			}
			else{
    			if(attachValueObjX.newValue != null){
    				intersectPoint.x = attachValueObjX.newValue;
        			thatCE.refreshAttachHelpLine("X", attachValueObjX.newValue, [intersectObj.workPlaneName]);
    			}
    			if(attachValueObjY.newValue != null){
    				intersectPoint.y = attachValueObjY.newValue;
        			thatCE.refreshAttachHelpLine("Y", attachValueObjY.newValue, [intersectObj.workPlaneName]);
    			}
    			if(attachValueObjZ.newValue != null){
    				intersectPoint.z = attachValueObjZ.newValue;
        			thatCE.refreshAttachHelpLine("Z", attachValueObjZ.newValue, [intersectObj.workPlaneName]);
    			}
			}
		}
		else{
			thatCE.refreshAttachHelpLine();
		}

		waitingPlacePoint.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z);
		var waitingPlaceLine = thatCE.placeSettings.waitingPlaceLine;
		if(waitingPlaceLine != null){
            var beginPoint = thatCE.placeSettings.placedPoints[thatCE.placeSettings.placedPoints.length - 1];
            var endPoint = waitingPlacePoint;
            var pointArr = [beginPoint.position.x, beginPoint.position.y, beginPoint.position.z,
        					endPoint.position.x, endPoint.position.y, endPoint.position.z];
            waitingPlaceLine.geometry.setPositions(pointArr);
            waitingPlaceLine.geometry.verticesNeedUpdate = true;
    		thatCE.refreshRuler3D(beginPoint.position, endPoint.position);
		}
		thatCE.showWaitingPlacePointMessge(waitingPlacePoint, p.mousePosition);
    }

    this.movePointCtrlPoints = function(p){
    	var intersectObj = thatCE.getIntersect3DPoint(p.intersects);
    	if(intersectObj != null){
    		thatCE.movePointCtrlPoint({
    			point: intersectObj.point,
    			shiftKey: p.shiftKey,
    			mousePosition: p.mousePosition
    		});
    	}
    }

    this.movePointCtrlPoint = function(p){
		var waitingPlacePoint = thatCE.placeSettings.waitingPlacePoint;
		if(!p.shiftKey){
			//更改获取最近吸附点的方法 modified by ls 20221026
			var attachValueObjX = thatCE.calcNearestCenterValue(thatCE.attachLines.x, [p.point.x], p.point.x);
			var attachValueObjY = thatCE.calcNearestCenterValue(thatCE.attachLines.y, [p.point.y], p.point.y);
			var attachValueObjZ = thatCE.calcNearestCenterValue(thatCE.attachLines.z, [p.point.z], p.point.z);

			if(attachValueObjX.newValue == null && attachValueObjY.newValue == null && attachValueObjZ.newValue == null){
    			thatCE.refreshAttachHelpLine();
			}
			else{
    			if(attachValueObjX.newValue != null){
    				intersectPoint.x = attachValueObjX.newValue;
        			thatCE.refreshAttachHelpLine("X", attachValueObjX.newValue);
    			}
    			if(attachValueObjY.newValue != null){
    				intersectPoint.y = attachValueObjY.newValue;
        			thatCE.refreshAttachHelpLine("Y", attachValueObjY.newValue);
    			}
    			if(attachValueObjZ.newValue != null){
    				intersectPoint.z = attachValueObjZ.newValue;
        			thatCE.refreshAttachHelpLine("Z", attachValueObjZ.newValue);
    			}
			}
		}
		else{
			thatCE.refreshAttachHelpLine();
		}

		waitingPlacePoint.position.set(p.point.x, p.point.y, p.point.z);
		thatCE.showWaitingPlacePointMessge(waitingPlacePoint, p.mousePosition);
    }



    this.movePlace2DPoints = function(p){
    	var intersectObj = thatCE.getIntersect2DPoint(p.intersects);
    	if(intersectObj != null){
    		thatCE.movePlace2DPoint({
    			point: intersectObj.point,
    			shiftKey: p.shiftKey,
    			mousePosition: p.mousePosition
    		});
    	}
    }

	//修正2d选点方法  modified by ls 20230628
    this.movePlace2DPoint = function(p){
		var intersectPoint = p.point;
		var waitingPlacePoint = thatCE.placeSettings.waitingPlacePoint;
		if(!p.shiftKey){
			var attachValueObjX = thatCE.calcNearestCenterValue(thatCE.attachLines.x, [p.point.x], p.point.x);
			var attachValueObjZ = thatCE.calcNearestCenterValue(thatCE.attachLines.z, [p.point.z], p.point.z);

			if(attachValueObjX.newValue == null && attachValueObjZ.newValue){
    			thatCE.refreshAttachHelpLine();
			}
			else{
    			if(attachValueObjX.newValue != null){
    				intersectPoint.x = attachValueObjX.newValue;
        			thatCE.refreshAttachHelpLine("X", attachValueObjX.newValue, ["xz"]);
    			}
    			if(attachValueObjZ.newValue != null){
    				intersectPoint.z = attachValueObjZ.newValue;
        			thatCE.refreshAttachHelpLine("Z", attachValueObjZ.newValue, ["xz"]);
    			}
			}
		}
		else{
			thatCE.refreshAttachHelpLine();
		}

		waitingPlacePoint.position.set(p.point.x, p.point.y, p.point.z);
		var waitingPlaceLine = thatCE.placeSettings.waitingPlaceLine;
		if(waitingPlaceLine != null){
            var beginPoint = thatCE.placeSettings.placedPoints[thatCE.placeSettings.placedPoints.length - 1];
            var endPoint = waitingPlacePoint;
            var pointArr = [beginPoint.position.x, beginPoint.position.y, beginPoint.position.z,
        					endPoint.position.x, endPoint.position.y, endPoint.position.z];
            waitingPlaceLine.geometry.setPositions(pointArr);
            waitingPlaceLine.geometry.verticesNeedUpdate = true;
    		thatCE.refreshDrawHelpLine2D(beginPoint.position, endPoint.position);

    		if(thatCE.placeSettings.placedPoints.length >= 2){
                var arcBeginPoint = thatCE.placeSettings.placedPoints[thatCE.placeSettings.placedPoints.length - 2];
                thatCE.refreshDrawHelpArc2D(arcBeginPoint.position, beginPoint.position, endPoint.position);
    		}
		}
		thatCE.showWaitingPlacePointMessge(waitingPlacePoint, p.mousePosition);
    }

    this.showWaitingPlacePointMessge = function(waitingPlacePoint, mousePosition){
    	if(waitingPlacePoint == null){
    		thatCE.showStatusInfoText(null);
    	}
    	else{
    		thatCE.showStatusInfoText(
    				"(" + thatCE.getDisplayValueStr(waitingPlacePoint.position.x, 0) + ", " + thatCE.getDisplayValueStr(waitingPlacePoint.position.y, 0) + ", " + thatCE.getDisplayValueStr(waitingPlacePoint.position.z, 0) + ")",
    				mousePosition);
    	}
    }

    this.showStatusInfoText = function(statusText, position){
    	if(statusText == null){
    		$("#" + thatCE.containerId).find(".statusInfoContainer").css({display: "none"});
    		$("#" + thatCE.containerId).find(".statusInfoInnerContainer").text("");
    	}
    	else{
    		$("#" + thatCE.containerId).find(".statusInfoContainer").css({display: "block"});
    		if(position == null){
        		$("#" + thatCE.containerId).find(".statusInfoContainer").css({
        			right: "5px",
        			bottom: "5px",
        			left: "auto",
        			top: "auto"
        		});
    		}
    		else{
    			var coreContainer = $("#" + thatCE.containerId).find(".coreContainer")[0];
    			var containerWidth = $(coreContainer).width();
    			var containerHeight = $(coreContainer).height();
    			var left = containerWidth * (1 + position.x) / 2 + 20;
    			var top = containerHeight * (1 - position.y) / 2 + 20;

        		$("#" + thatCE.containerId).find(".statusInfoContainer").css({
        			left: left + "px",
        			top: top + "px",
        			right: "auto",
        			bottom: "auto"
        		});
    		}
    		$("#" + thatCE.containerId).find(".statusInfoInnerContainer").text(statusText);
    	}
    }

    //获取鼠标信息 added by ls 20230322
    this.GetMouseInfo = function(event){
    	var mouse = new THREE.Vector2(); //二维向量
        mouse.x = ((event.clientX - thatCE.containerPos.x) / $("#" + thatCE.containerId).find(".coreInnerContainer").width()) * 2 - 1;
        mouse.y = -((event.clientY - thatCE.containerPos.y) / $("#" + thatCE.containerId).find(".coreInnerContainer").height()) * 2 + 1;
        return mouse;
    }

    //放置wp组件控制点 added by ls 20230614
    this.endModifyWpTransCtrlPoint = function(){
		thatCE.placeModifySettings.drawingPlacePoint = false;

		//重新构造当前组件
		var points = [];
		for(var i = 0; i < thatCE.placeModifySettings.placedPoints.length; i++){
			var placePoint = thatCE.placeModifySettings.placedPoints[i];
			points.push({
				x: placePoint.position.x,
				y: placePoint.position.y,
				z: placePoint.position.z
			});
		}
    	var object3D = thatCE.selectedUnitObject3D;
    	var unitData = object3D.unitData
		var refComponentInfo = thatCE.getRefComponentInfo(unitData.code, unitData.versionNum);
		var paramValue = thatCE.convertLocationTypeParamValue(refComponentInfo, points, points.length);
		unitData.parameters[refComponentInfo.init.locationType.parameter].value = paramValue;
    	thatCE.rebuildOneUnitObject3D(object3D);

		thatCE.refreshAttachHelpLine();
		thatCE.showWaitingPlacePointMessge(null);
    }

    //开始移动wp组件控制点 added by ls 20230614
    this.beginModifyWpTransCtrlPoint = function(wpTransCtrlPoint, mousePosition){
		thatCE.placeModifySettings.drawingPlacePoint = true;
		var pointIndex = -1;
		for(var i = 0; i < thatCE.placeModifySettings.placedPoints.length; i++){
			if(thatCE.placeModifySettings.placedPoints[i] == wpTransCtrlPoint){
				pointIndex = i;
				break;
			}
		}
		thatCE.placeModifySettings.waitingPlacePointIndex = pointIndex;
		if(pointIndex == 0){
			thatCE.placeModifySettings.waitingPlaceToLineIndex  = 0
		}
		else if(pointIndex == thatCE.placeModifySettings.placedPoints.length - 1){
			thatCE.placeModifySettings.waitingPlaceFromLineIndex = thatCE.placeModifySettings.placedLines.length - 1;
		}
		else{
			thatCE.placeModifySettings.waitingPlaceFromLineIndex = pointIndex - 1;
			thatCE.placeModifySettings.waitingPlaceToLineIndex = pointIndex;
		}

		thatCE.attachLines = thatCE.getAttachLines();

		thatCE.showWaitingPlacePointMessge(wpTransCtrlPoint, mousePosition);
    }

    //开始移动wp组件控制点 added by ls 20230614
    this.moveWpTransCtrlPoint = function(p){
    	var intersectObj = thatCE.getIntersect3DPoint(p.intersects);
    	if(intersectObj != null){
    		var intersectPoint = intersectObj.point;
    		var workPlaneName = intersectObj.workPlaneName;
    		if(!p.shiftKey){

    			//更改获取最近吸附点的方法 modified by ls 20221026
    			var attachValueObjX = thatCE.calcNearestCenterValue(thatCE.attachLines.x, [intersectPoint.x], intersectPoint.x);
    			var attachValueObjY = thatCE.calcNearestCenterValue(thatCE.attachLines.y, [intersectPoint.y], intersectPoint.y);
    			var attachValueObjZ = thatCE.calcNearestCenterValue(thatCE.attachLines.z, [intersectPoint.z], intersectPoint.z);

    			if(attachValueObjZ.newValue == null || workPlaneName == "xy"){
        			thatCE.refreshAttachHelpLine("Z");
    			}
    			else{
    				intersectPoint.z = attachValueObjZ.newValue;
        			thatCE.refreshAttachHelpLine("Z", attachValueObjZ.newValue, [workPlaneName]);
    			}
    			if(attachValueObjY.newValue == null || workPlaneName == "xz"){
        			thatCE.refreshAttachHelpLine("Y");
    			}
    			else{
    				intersectPoint.y = attachValueObjY.newValue;
        			thatCE.refreshAttachHelpLine("Y", attachValueObjY.newValue, [workPlaneName]);
    			}
    			if(attachValueObjX.newValue == null || workPlaneName == "yz"){
        			thatCE.refreshAttachHelpLine("X");
    			}
    			else{
    				intersectPoint.x = attachValueObjX.newValue;
        			thatCE.refreshAttachHelpLine("X", attachValueObjX.newValue, [workPlaneName]);
    			}
    		}
    		else{
    			thatCE.refreshAttachHelpLine();
    		}
    		var waitingPlacePoint = thatCE.placeModifySettings.placedPoints[thatCE.placeModifySettings.waitingPlacePointIndex];
    		waitingPlacePoint.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z);
    		if(thatCE.placeModifySettings.waitingPlaceFromLineIndex != null){
    			var waitingPlaceLine = thatCE.placeModifySettings.placedLines[thatCE.placeModifySettings.waitingPlaceFromLineIndex];
                var beginPoint = thatCE.placeModifySettings.placedPoints[thatCE.placeModifySettings.waitingPlacePointIndex - 1];
                var endPoint = waitingPlacePoint;
	            var pointArr = [beginPoint.position.x, beginPoint.position.y, beginPoint.position.z,
	        					endPoint.position.x, endPoint.position.y, endPoint.position.z];
	            waitingPlaceLine.geometry.setPositions(pointArr);
                waitingPlaceLine.geometry.verticesNeedUpdate = true;
    		}
    		if(thatCE.placeModifySettings.waitingPlaceToLineIndex != null){
    			var waitingPlaceLine = thatCE.placeModifySettings.placedLines[thatCE.placeModifySettings.waitingPlaceToLineIndex];
                var beginPoint = waitingPlacePoint;
                var endPoint = thatCE.placeModifySettings.placedPoints[thatCE.placeModifySettings.waitingPlacePointIndex + 1];
	            var pointArr = [beginPoint.position.x, beginPoint.position.y, beginPoint.position.z,
	        					endPoint.position.x, endPoint.position.y, endPoint.position.z];
	            waitingPlaceLine.geometry.setPositions(pointArr);
                waitingPlaceLine.geometry.verticesNeedUpdate = true;
    		}
    	}
		thatCE.showWaitingPlacePointMessge(waitingPlacePoint, p.mousePosition);
    }

    //鼠标抬起
    this.onMouseUp = function(ev) {
        if (thatCE.mouseDownPosition != null) {
        	var mouseUpPosition = {
        		x: ev.clientX - thatCE.containerPos.x,
        		y: ev.clientY - thatCE.containerPos.y
        	};
        	if(ev.button == 0 || ev.button == 2){
	        	if(Math.abs(mouseUpPosition.x - thatCE.mouseDownPosition.x) < 2 && Math.abs(mouseUpPosition.y - thatCE.mouseDownPosition.y) < 2 ){
	                event.preventDefault();
	            	var mouse = thatCE.GetMouseInfo(event);
	                thatCE.raycaster.setFromCamera(mouse, thatCE.camera);
	                var intersects = thatCE.raycaster.intersectObjects(thatCE.scene.children, true); //将遍历数组内的所有模型的子类，也就是深度遍历
	                switch(thatCE.status){
		                case js3CoreEditorStatus.normal: {
		                	//判断是否选择了worldPosition组件的控制点，即编辑worldPosition的组件的位置 added by ls 20230614
		    	    		var wpTransCtrlPoint = thatCE.selectWpTransCtrl(intersects);
		    	    		if(thatCE.placeModifySettings.drawingPlacePoint){
		    	        		thatCE.endModifyWpTransCtrlPoint();
		    	    		}
		    	    		else if(wpTransCtrlPoint != null){
		                		thatCE.beginModifyWpTransCtrlPoint(wpTransCtrlPoint, mouse);
		    	    		}
		                	else {
				                var componentObject3D = thatCE.selectUnit(intersects, ev.ctrlKey);
				                if(!ev.ctrlKey){
					        		if(ev.button == 2){
					        			if(componentObject3D == null){
						        			thatCE.showGroundPlaneContextMenu({
						        				x: ev.clientX - thatCE.containerPos.x,
						        				y: ev.clientY - thatCE.containerPos.y,
						        				intersects: intersects,
						        				componentObject3D: componentObject3D
						        			});
					        			}
					        			else if(componentObject3D.isUnitObject){
						        			thatCE.showComponentContextMenu({
						        				x: ev.clientX - thatCE.containerPos.x,
						        				y: ev.clientY - thatCE.containerPos.y,
						        				intersects: intersects,
						        				componentObject3D: componentObject3D
						        			});
					        			}
					        		}
				                }
			                }
			        		break;
		                }
		                case js3CoreEditorStatus.multiSelect:{
			                var componentObject3D = thatCE.selectUnit(intersects, ev.ctrlKey);
			        		if(ev.button == 2){
			        			thatCE.showGroundPlaneMultiContextMenu({
			        				x: ev.clientX - thatCE.containerPos.x,
			        				y: ev.clientY - thatCE.containerPos.y,
			        				intersects: intersects
			        			});
			        		}
			        		break;
		                }
		                case js3CoreEditorStatus.placeLimit3DPoints:{
		                	switch(ev.button){
		            	    	case 0:{
				                	thatCE.drawLimit3DPoints({intersects: intersects});
		            	        	break;
		            	    	}
		                	}
		                	break;
		                }
		                case js3CoreEditorStatus.placeLimit2DPoints:{
		                	switch(ev.button){
		            	    	case 0:{
				                	thatCE.drawLimit2DPoints({intersects: intersects});
		            	        	break;
		            	    	}
		                	}
		                	break;
		                }
		                case js3CoreEditorStatus.ruler:{
		                	switch(ev.button){
		            	    	case 0:{
				                	thatCE.drawRulerPoints({intersects: intersects});
		            	        	break;
		            	    	}
		                	}
		                	break;
		                }
		                case js3CoreEditorStatus.pointCtrl:{
		                	switch(ev.button){
		            	    	case 0:{
				                	thatCE.drawPointCtrlPoints({intersects: intersects});
		            	        	break;
		            	    	}
		                	}
		                	break;
		                }
	                }

    				thatCE.doEvent("onMouseUp", {
	    	       		editor: thatCE,
        				x: ev.clientX - thatCE.containerPos.x,
        				y: ev.clientY - thatCE.containerPos.y,
	    	       		intersects: intersects
	    	       	});
	        	}
	        	else{
	        		//移动后，松开鼠标左键
	        		if(ev.button == 0){
	        			var object3D = thatCE.pointCtrlProcessor.selectedPointCtrlObject3D
	        			if(object3D != null){
	        				thatCE.pointCtrlProcessor.rebuildRelatedUnitObject3D(object3D);
	        				thatCE.doEvent("afterPointCtrlChangePosition", {
			    	       		editor: thatCE,
			    	       		pointCtrlData: object3D.pointCtrlData
			    	       	});
	        			}
	        		}
	        	}
        	}
        }
    };

    this.showGroundPlaneContextMenu = function(p){
    	if(thatCE.groundContextMenuVisible){
	    	var groundPlaneIntersectObj = thatCE.getWorkPlaneIntersectPoint(p.intersects);
	        if(groundPlaneIntersectObj != null){
		    	thatCE.mouse3DPosition = groundPlaneIntersectObj.point;
		    	var contentMenuContainer = $("#" + thatCE.containerId).find(".contextMenuGroundPlaneContainer")[0];
		    	$(contentMenuContainer).attr("workPlaneName", groundPlaneIntersectObj.workPlaneName);
		    	var menuWidth = $(contentMenuContainer).width();
		    	var menuHeight = $(contentMenuContainer).height();
		    	var winWidth =  $("#" + thatCE.containerId).find(".coreInnerContainer").width();
		    	var winHeight =  $("#" + thatCE.containerId).find(".coreInnerContainer").height();
		    	var showMenuPos = {x: p.x, y: p.y};
		    	if(menuWidth + p.x > winWidth){
		    		showMenuPos.x = winWidth = p.x - menuWidth;
		    	}
		    	if(menuHeight + p.y > winHeight){
		    		showMenuPos.y = winHeight = p.y - menuHeight;
		    	}
		    	$(contentMenuContainer).css({
		    		top: showMenuPos.y,
		    		left: showMenuPos.x
				});
		    	$(contentMenuContainer).addClass("contextMenuContainerPopup");
	        }
    	}
    }

    this.showGroundPlaneMultiContextMenu = function(p){
    	if(thatCE.groundContextMenuVisible){
	    	var workPlaneIntersectObj = thatCE.getWorkPlaneIntersectPoint(p.intersects);
	        if(workPlaneIntersectObj != null){
		    	thatCE.mouse3DPosition = workPlaneIntersectObj.point;
		    	var contentMenuMultiContainer = $("#" + thatCE.containerId).find(".contextMenuMultiGroundPlaneContainer")[0];
		    	var menuWidth = $(contentMenuMultiContainer).width();
		    	var menuHeight = $(contentMenuMultiContainer).height();
		    	var winWidth =  $("#" + thatCE.containerId).find(".coreInnerContainer").width();
		    	var winHeight =  $("#" + thatCE.containerId).find(".coreInnerContainer").height();
		    	var showMenuPos = {x: p.x, y: p.y};
		    	if(menuWidth + p.x > winWidth){
		    		showMenuPos.x = winWidth = p.x - menuWidth;
		    	}
		    	if(menuHeight + p.y > winHeight){
		    		showMenuPos.y = winHeight = p.y - menuHeight;
		    	}
		    	$(contentMenuMultiContainer).css({
		    		top: showMenuPos.y,
		    		left: showMenuPos.x
				});
		    	$(contentMenuMultiContainer).addClass("contextMenuContainerPopup");
	        }
    	}
    }

    this.showComponentContextMenu = function(p){
    	if(thatCE.componentContextMenuVisible){
	    	var contentMenuContainer = $("#" + thatCE.containerId).find(".contextMenuComponentContainer")[0];
	    	var menuWidth = $(contentMenuContainer).width();
	    	var menuHeight = $(contentMenuContainer).height();
	    	var winWidth =  $("#" + thatCE.containerId).find(".coreInnerContainer").width();
	    	var winHeight =  $("#" + thatCE.containerId).find(".coreInnerContainer").height();
	    	var showMenuPos = {x: p.x, y: p.y};
	    	if(menuWidth + p.x > winWidth){
	    		showMenuPos.x = winWidth = p.x - menuWidth;
	    	}
	    	if(menuHeight + p.y > winHeight){
	    		showMenuPos.y = winHeight = p.y - menuHeight;
	    	}
	    	$(contentMenuContainer).css({
	    		top: showMenuPos.y,
	    		left: showMenuPos.x
			});
	    	$(contentMenuContainer).addClass("contextMenuContainerPopup");
    	}
    }

    this.initSide = function(){
    	thatCE.setLeftSide(thatCE.leftSideStatus.groupName, thatCE.leftSideStatus.lastTabNames[thatCE.leftSideStatus.groupName], false);
    	thatCE.setRightSide(thatCE.rightSideStatus.groupName, thatCE.rightSideStatus.lastTabNames[thatCE.rightSideStatus.groupName], false);
    }

    this.setSideVisible = function(sideContainer, groupName){
    	var groupTabNames = sideTabGroups[groupName];
    	var tabs = $(sideContainer).find(".core3dTabTitle");
    	var activeTab = null;
    	for(var i = 0; i < tabs.length; i++){
    		var tab = tabs[i];
    		var tempTabName = $(tab).attr("name");
    		var visible = groupTabNames.contains(tempTabName);
			$(tab).css({display: (visible ? "block" : "none")});
    	}
    }

    //切换左侧边栏第index个tab是否显示 added by ls 20230615
    this.switchLeftSideVisibleByIndex = function(index){
    	var tabNames = sideTabGroups[thatCE.leftSideStatus.groupName];
    	var tabs = $("#" + thatCE.containerId).find(".core3dTabTitleContainerLeft .core3dTabTitle").filter(function() {
    		  return $(this).css("display") === "block";
    	});
    	if(tabs.length > index){
        	var containerHidden = $("#" + thatCE.containerId).find(".core3dLeftContainer").hasClass("tabContainerClosed");
	    	var titleSelected = $(tabs[index]).hasClass("titleSelected");
    		var visible = containerHidden ? true : (titleSelected ? false : true);
    		var tabName = $(tabs[index]).attr("name");
        	thatCE.setLeftSide(thatCE.leftSideStatus.groupName, tabName, visible);
    	}
    }

    //切换右侧边栏第index个tab是否显示 added by ls 20230615
    this.switchRightSideVisibleByIndex = function(index){
    	var tabNames = sideTabGroups[thatCE.rightSideStatus.groupName];
    	var tabs = $("#" + thatCE.containerId).find(".core3dTabTitleContainerRight .core3dTabTitle").filter(function() {
  		  return $(this).css("display") === "block";
	  	});
	  	if(tabs.length > index){
	    	var containerHidden = $("#" + thatCE.containerId).find(".core3dRightContainer").hasClass("tabContainerClosed");
	    	var titleSelected = $(tabs[index]).hasClass("titleSelected");
    		var visible = containerHidden ? true : (titleSelected ? false : true);
    		var tabName = $(tabs[index]).attr("name");
        	thatCE.setRightSide(thatCE.rightSideStatus.groupName, tabName, visible);
    	}
    }

    this.setLeftSide = function(groupName, tabName, doesShowContainer){
    	var leftContainer = $("#" + thatCE.containerId).find(".core3dTabTitleContainerLeft")[0];
    	var doesShowContainer = doesShowContainer == null ? !$(leftContainer).parent().hasClass("tabContainerClosed") : doesShowContainer;
    	thatCE.setSideVisible(leftContainer, groupName, tabName);
		thatCE.leftSideStatus.groupName = groupName;
    	var tab = $(leftContainer).find(".core3dTabTitle[name='" + tabName + "']")[0];
		thatCE.setTabVisible(tab, doesShowContainer);
		thatCE.leftSideStatus.lastTabNames[thatCE.leftSideStatus.groupName] = tabName;
    }

    this.setRightSide = function(groupName, tabName, doesShowContainer){
    	var rightContainer = $("#" + thatCE.containerId).find(".core3dTabTitleContainerRight")[0];
    	var doesShowContainer = doesShowContainer == null ? !$(rightContainer).parent().hasClass("tabContainerClosed") : doesShowContainer;
    	thatCE.setSideVisible(rightContainer, groupName, tabName);
		thatCE.rightSideStatus.groupName = groupName;
    	var tab = $(rightContainer).find(".core3dTabTitle[name='" + tabName + "']")[0];
		thatCE.setTabVisible(tab, doesShowContainer);
		thatCE.rightSideStatus.lastTabNames[thatCE.rightSideStatus.groupName] = tabName;
    }

    this.setTabContainerVisible = function(tabItem, visible){
    	var sideContainer = $(tabItem).parent().parent();
		if(visible == $(sideContainer).hasClass("tabContainerClosed")){
	    	var isLeftContainer = $(sideContainer).hasClass("core3dLeftContainer");
	    	var tabTopText = visible ? (isLeftContainer ? "<<" : ">>") : (!isLeftContainer ? "<<" : ">>");
	    	if(visible){
	    		$(sideContainer).removeClass("tabContainerClosed");
	    		$(sideContainer).find(".core3dTabTitleTop").text(tabTopText);
	    		thatCE.setTabVisible(tabItem, true);
	    	}
	    	else{
	    		$(sideContainer).find(".core3dTabTitle").removeClass("titleSelected");
				$(sideContainer).find(".core3dTabContentContainer .core3dTabContent").removeClass("contentSelected");
	    		$(sideContainer).addClass("tabContainerClosed");
	    		$(sideContainer).find(".core3dTabTitleTop").text(tabTopText);
	    	}
		}

		//设置coreContainer的位置
		thatCE.refreshCoreContainerPosition();
    }

	//设置coreContainer的位置 added by ls 20230509
    this.refreshCoreContainerPosition = function(){
		var leftSideWidth = $("#" + thatCE.containerId).find(".core3dLeftContainer").width();
		var leftRightWidth = $("#" + thatCE.containerId).find(".core3dRightContainer").width();
		$("#" + thatCE.containerId).find(".coreContainer").css({
			"left": leftSideWidth + "px",
			"right": leftRightWidth + "px"
		});

		thatCE.containerPos = {
			x: $("#" + thatCE.containerId).find(".coreContainer").offset().left,
			y: $("#" + thatCE.containerId).find(".coreContainer").offset().top
		};

		thatCE.onWindowResize();
    }

    this.setTabVisible = function(tabItem, doesShowContainer){
		var thisTabName = $(tabItem).attr("name");
		var tabTitles = $(tabItem).parent().find(".core3dTabTitle");
		for(var i = 0; i < tabTitles.length; i++){
			var tabTitle = tabTitles[i];
			var tabName = $(tabTitle).attr("name");
			if(tabName == thisTabName){
				$(tabTitle).addClass("titleSelected");
			}
			else{
				$(tabTitle).removeClass("titleSelected");
			}
		}
		var tabContents = $(tabItem).parent().parent().find(".core3dTabContent");
		for(var i = 0; i < tabContents.length; i++){
			var tabContent = tabContents[i];
			var tabName = $(tabContent).attr("name");
			if(tabName == thisTabName){
				$(tabContent).addClass("contentSelected");
			}
			else{
				$(tabContent).removeClass("contentSelected");
			}
		}

		var isLeftGroup = $(tabItem).parent().hasClass("core3dTabTitleContainerLeft");
		if(isLeftGroup){
			thatCE.leftSideStatus.lastTabNames[thatCE.leftSideStatus.groupName] = thisTabName;
		}
		else {
			thatCE.rightSideStatus.lastTabNames[thatCE.rightSideStatus.groupName] = thisTabName;
		}

		thatCE.setTabContainerVisible(tabItem, doesShowContainer);
    }

    this.initTabEvent = function(){
    	$("#" + thatCE.containerId).find(".core3dTabTitleTop[name='leftTabContainer']").click(function(){
    		var visible = !$(this).parent().parent().hasClass("tabContainerClosed");
    		if(visible){
    			thatCE.setTabContainerVisible(this, false);
    		}
    		else{
    	    	var leftContainer = $("#" + thatCE.containerId).find(".core3dTabTitleContainerLeft")[0];
    	    	var tabName =  thatCE.leftSideStatus.lastTabNames[thatCE.leftSideStatus.groupName];
    	    	var tab = $(leftContainer).find(".core3dTabTitle[name='" + tabName + "']")[0];
    			thatCE.setTabContainerVisible(tab, true);
    		}
    	});
    	$("#" + thatCE.containerId).find(".core3dTabTitleTop[name='rightTabContainer']").click(function(){
    		var visible = !$(this).parent().parent().hasClass("tabContainerClosed");
    		if(visible){
    			thatCE.setTabContainerVisible(this, false);
    		}
    		else{
    	    	var rightContainer = $("#" + thatCE.containerId).find(".core3dTabTitleContainerRight")[0];
    	    	var tabName =  thatCE.rightSideStatus.lastTabNames[thatCE.rightSideStatus.groupName];
    	    	var tab = $(rightContainer).find(".core3dTabTitle[name='" + tabName + "']")[0];
    			thatCE.setTabContainerVisible(tab, true);
    		}
    	});

    	$("#" + thatCE.containerId).find(".core3dTabTitle").click(function(){
    		thatCE.setTabVisible(this, true);
    	});

    	$("#" + thatCE.containerId).find(".core3dHeaderToolbarContainer .core3dHeaderToolbarTab").click(function(){
    		var toolbarName = $(this).attr("name");
    		thatCE.setSubToolbarVisible(toolbarName);
    	});

    	$("#" + thatCE.containerId).find(".core3dHeaderSubToolbarContainer .core3dHeaderButton").click(function(){
    		var btnType = $(this).attr("type");
    		var btnCode = $(this).attr("code");
    		switch(btnType){
	    		case "component":{
	    			if(js3CommandProcessors[btnCode] == null){
	    				js3CommandProcessors[btnCode] = {
    						componentCode: btnCode,
    						componentVersionNum: "1.0",
    						pointCount: 1,
    						toStatus: "placeLimit3DPoints"
	    				};
	    			}
	        		thatCE.doBtnClick(btnCode);

	        		//记录下最后一次手工添加的构件 added by ls 20230628
	        		thatCE.lastAddComponentInfo = {
	        			code: btnCode,
	        			versionNum: "1.0",
	        			imgId: null
	        		};
	    			break;
	    		}
	    		case "plugin":{
	        		thatCE.doBtnClick(btnCode);
	    			break;
	    		}
	    		default:{
	    			msgBox.alert({info: "配置异常: code=" + btnCode});
	    			break;
	    		}
    		}
    	});

    	$("#" + thatCE.containerId).find(".core3dShortcutContainer .core3dShortCutButton").click(function(){
    		var btnCode = $(this).attr("code");
			if(js3CommandProcessors[btnCode] == null){
				js3CommandProcessors[btnCode] = {
					componentCode: btnCode,
					componentVersionNum: "1.0",
					pointCount: 1,
					toStatus: "placeLimit3DPoints"
				};
			}
    		thatCE.doBtnClick(btnCode);

    	});
    }

    this.setSubToolbarVisible = function(toolbarName){
    	var toolbarBtns = $("#" + thatCE.containerId).find(".core3dHeaderToolbarContainer .core3dHeaderToolbarTab");
    	for(var i = 0; i < toolbarBtns.length; i++){
    		var toolbarBtn = toolbarBtns[i];
    		if($(toolbarBtn).attr("name") == toolbarName){
    			$(toolbarBtn).addClass("core3dHeaderToolbarTabActive");
    		}
    		else{
    			$(toolbarBtn).removeClass("core3dHeaderToolbarTabActive");
    		}
    	}
    	var subToolbars = $("#" + thatCE.containerId).find(".core3dHeaderSubToolbarContainer .core3dHeaderSubToolbar");
    	for(var i = 0; i < subToolbars.length; i++){
    		var subToolbar = subToolbars[i];
    		if($(subToolbar).attr("name") == toolbarName){
    			$(subToolbar).addClass("core3dHeaderSubToolbarActive");
    		}
    		else{
    			$(subToolbar).removeClass("core3dHeaderSubToolbarActive");
    		}
    	}
    }

    this.initToolbarEvent = function(){
    	$("#" + thatCE.containerId).find(".addGroupBtn").click(function(){
    		var newGroupInfo = thatCE.getNewGroupInfo();
    		thatCE.showGroupInfoWindow(newGroupInfo);
    	});
    	$("#" + thatCE.containerId).find(".sortGroupBtn").click(function(){
    		thatCE.showGroupContainerSortWindow();
    	});
    }

    this.getNewGroupInfo = function(){
    	var newGroupId = thatCE.getGuid();
    	var namePre = "分组";
    	var hasName = false;
    	var newGroupInfo = null;
    	var nameIndex = 1;
    	while(!hasName){
    		let newName = namePre + "_" + nameIndex;
    		newGroupInfo = {
    			isNew: true,
    			id: newGroupId,
    			name: newName
    		};
    		if(!thatCE.checkHasSameNameGroup(newGroupInfo)){
    			hasName = true;
    		}
    		else{
    			nameIndex++;
    		}
    	}
    	return newGroupInfo;
    }

    this.checkHasSameNameGroup = function(groupInfo){
    	var allGroupContainers = $("#" +thatCE.containerId).find(".groupContainer");
    	for(var i = 0; i < allGroupContainers.length; i++){
    		var groupContainer = allGroupContainers[i];
    		var groupId = $(groupContainer).attr("groupId");
    		var groupName = $(groupContainer).attr("groupName");
    		if(groupInfo.id != groupId && groupInfo.name == groupName){
    			return true;
    		}
    	}
    	return false;
    }


    this.saveComponent = function(params){
    	var lastComponentInfo = thatCE.getLastComponentInfo();
		var requestParam = {
			componentId: lastComponentInfo.id,
			componentName: encodeURIComponent(lastComponentInfo.name),
			componentCode: encodeURIComponent(lastComponentInfo.code),
			versionNum: encodeURIComponent(lastComponentInfo.versionNum),
			content: encodeURIComponent(lastComponentInfo.toString()),
			snapshot: encodeURIComponent(lastComponentInfo.snapshot)
		};
		serverAccess.request({
			serviceName:"mdlComponentNcpService",
			funcName:"saveComponent",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)},
			successFunc: function(obj) {
    			thatCE.showStatusInfo({statusText: "保存组件模型成功."});
    			msgBox.alert({info: "保存成功."});
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});
    }

    this.showGroupContainerSortWindow = function(){
    	var allGroupContainers = $("#" +thatCE.containerId).find(".groupContainer");
    	var parameters = [];
    	for(var i = 0; i < allGroupContainers.length; i++){
    		var groupContainer = allGroupContainers[i];
    		var groupId = $(groupContainer).attr("groupId");
    		var groupName = $(groupContainer).attr("groupName");
    		parameters.push({
    			id: groupId,
    			name: groupName
    		});
    	}

		var popContainer = new PopupContainer( {
			width : 350,
			height : 550,
			top : 50,
			title: "排序"
		});

		popContainer.show();
		var inputId = cmnPcr.getRandomValue();
		var titleId = inputId + "_title";
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
			+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"
			+ "</iframe>"
			+ "</div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		var parameterStr = cmnPcr.jsonToStr(parameters);
		$("#" + editorFrameId).attr("src", "../../design/common/sortEditor.jsp?parameters=" + cmnPcr.encodeURI(parameterStr));
		$("#" + okBtnId).click(function(){
			var sortedGroupIds = $("#" + editorFrameId)[0].contentWindow.getParameters().sortedItemIds;
	    	var allGroupInfos = thatCE.getAllGroupInfos();
	    	var idToGroups = {};
	    	for(var i = 0; i < allGroupInfos.length; i++){
	    		var group = allGroupInfos[i];
	    		idToGroups[group.id] = group;
	    	}
	    	$("#" +thatCE.containerId).find(".groupContainer").remove();
	    	var allGroupContainer = $("#" + thatCE.containerId).find(".core3dTabContent[name='groupUnitList'] .core3dListContainer");
	    	for(var i = 0; i < sortedGroupIds.length; i++){
	    		var groupId = sortedGroupIds[i];
	    		var group = idToGroups[groupId];
	    		thatCE.addGroupToList(group, allGroupContainer);
	    	}

			popContainer.close();
		});
		$("#" + cancelBtnId).click(function(){
			popContainer.close();
		});
	}

    this.showGroupUnitSortWindow = function(groupInfo){
    	var allUnitItems = $("#" +thatCE.containerId).find(".groupContainer[groupId=\"" + groupInfo.id + "\"] .unitContainer .unitItem");
    	var allUnits = thatCE.getAllUnitInfos();
    	var parameters = [];
    	for(var i = 0; i < allUnitItems.length; i++){
    		var unitItem = allUnitItems[i];
    		var unitId = $(unitItem).attr("unitId");
    		var unitInfo = allUnits[unitId];
    		parameters.push({
    			id: unitId,
    			name: unitInfo.name
    		});
    	}

		var popContainer = new PopupContainer( {
			width : 350,
			height : 550,
			top : 50,
			title: "排序"
		});

		popContainer.show();
		var inputId = cmnPcr.getRandomValue();
		var titleId = inputId + "_title";
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
			+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"
			+ "</iframe>"
			+ "</div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		var parameterStr = cmnPcr.jsonToStr(parameters);
		$("#" + editorFrameId).attr("src", "../../design/common/sortEditor.jsp?parameters=" + cmnPcr.encodeURI(parameterStr));
		$("#" + okBtnId).click(function(){
			var sortedUnitIds = $("#" + editorFrameId)[0].contentWindow.getParameters().sortedItemIds;
	    	var unitContainer = $("#" +thatCE.containerId).find(".groupContainer[groupId=\"" + groupInfo.id + "\"] .unitContainer");
	    	$(unitContainer).empty();
	    	var allUnits = thatCE.getAllUnitInfos();
	    	var idToUnitItems = {};
	    	for(var i = 0; i < sortedUnitIds.length; i++){
	    		var unitId = sortedUnitIds[i];
	    		var unitInfo = allUnits[unitId];
    			thatCE.addUnitToGroupContainer(unitInfo, groupInfo.id);
	    	}

			popContainer.close();
		});
		$("#" + cancelBtnId).click(function(){
			popContainer.close();
		});
	}

    this.showUnitChangeGroupWindow = function(unitInfo){
		var unitItem = $("#" +thatCE.containerId).find(".groupContainer .unitContainer .unitItem[unitId=\"" + unitInfo.id + "\"]");
		var oldGroupId = $(unitItem).parent().parent().attr("groupId");
    	var allGroupContainers = $("#" +thatCE.containerId).find(".groupContainer");
    	var parameters = [];
    	for(var i = 0; i < allGroupContainers.length; i++){
    		var groupContainer = allGroupContainers[i];
    		var groupId = $(groupContainer).attr("groupId");
    		var groupName = $(groupContainer).attr("groupName");
    		parameters.push({
    			id: groupId,
    			name: groupName,
    			isActive: groupId == oldGroupId
    		});
    	}

		var popContainer = new PopupContainer( {
			width : 350,
			height : 550,
			top : 50,
			title: "更换分组"
		});

		popContainer.show();
		var inputId = cmnPcr.getRandomValue();
		var titleId = inputId + "_title";
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
			+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"
			+ "</iframe>"
			+ "</div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		var parameterStr = cmnPcr.jsonToStr(parameters);
		$("#" + editorFrameId).attr("src", "../common/itemSelector.jsp?parameters=" + cmnPcr.encodeURI(parameterStr));
		$("#" + okBtnId).click(function(){
			var selectedGroupId = $("#" + editorFrameId)[0].contentWindow.getParameters().selectedItemId;
			var unitItem = $("#" +thatCE.containerId).find(".groupContainer .unitContainer .unitItem[unitId=\"" + unitInfo.id + "\"]");
			var oldGroupId = $(unitItem).parent().parent().attr("groupId");
			if(oldGroupId != selectedGroupId){
				$(unitItem).remove();
    			thatCE.addUnitToGroupContainer(unitInfo, selectedGroupId);
			}
			popContainer.close();
		});
		$("#" + cancelBtnId).click(function(){
			popContainer.close();
		});
	}

    this.showUnitsChangeGroupWindow = function(unitInfos){
    	var allGroupContainers = $("#" +thatCE.containerId).find(".groupContainer");
    	var parameters = [];
    	for(var i = 0; i < allGroupContainers.length; i++){
    		var groupContainer = allGroupContainers[i];
    		var groupId = $(groupContainer).attr("groupId");
    		var groupName = $(groupContainer).attr("groupName");
    		parameters.push({
    			id: groupId,
    			name: groupName,
    			isActive: false
    		});
    	}

		var popContainer = new PopupContainer( {
			width : 350,
			height : 550,
			top : 50,
			title: "批量更换分组"
		});

		popContainer.show();
		var inputId = cmnPcr.getRandomValue();
		var titleId = inputId + "_title";
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
			+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"
			+ "</iframe>"
			+ "</div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		var parameterStr = cmnPcr.jsonToStr(parameters);
		$("#" + editorFrameId).attr("src", "../../design/common/itemSelector.jsp?parameters=" + cmnPcr.encodeURI(parameterStr));
		$("#" + okBtnId).click(function(){
			var selectedGroupId = $("#" + editorFrameId)[0].contentWindow.getParameters().selectedItemId;
			for(var i = 0; i < unitInfos.length; i++){
				var unitInfo = unitInfos[i];
				var unitItem = $("#" +thatCE.containerId).find(".groupContainer .unitContainer .unitItem[unitId=\"" + unitInfo.id + "\"]");
				var oldGroupId = $(unitItem).parent().parent().attr("groupId");
				if(oldGroupId != selectedGroupId){
					$(unitItem).remove();
	    			thatCE.addUnitToGroupContainer(unitInfo, selectedGroupId);
				}
			}
			popContainer.close();
		});
		$("#" + cancelBtnId).click(function(){
			popContainer.close();
		});
	}

	//获取对象所属的unit added by ls 20210913
	this.getUnitObject = function(object3D){
		if(object3D.type != "LineSegments"){
			var tempObject3D = object3D;
			while(tempObject3D != null){
				if(tempObject3D.unitData != null){
					return tempObject3D;
				}
				else{
					tempObject3D = tempObject3D.parent;
				}
			}
		}
		return null;
	}

	this.checkParameterEffectUnit = function(unitData, paramName){
		for(var expName in unitData.positionExps){
			var exp = unitData.positionExps[expName];
			if(thatCE.checkParameterEffectExp(exp, paramName)){
				return true;
			}
		}
		for(var expName in unitData.rotationExps){
			var exp = unitData.rotationExps[expName];
			if(thatCE.checkParameterEffectExp(exp, paramName)){
				return true;
			}
		}
		if(thatCE.checkParameterEffectExp(unitData.countExp, paramName)){
			return true;
		}
		for(var pName in unitData.parameters){
			var param = unitData.parameters[pName];
			if(thatCE.checkParameterEffectExp(param.exp, paramName)){
				return true;
			}
		}
		return false;
	}

	this.checkParameterEffectExp = function(exp, paramName){
		return exp != null && exp.ps != null && exp.ps.indexOf("|" + paramName + "|") != -1;
	}

	//检查是否碰撞 added by ls 20220606
	this.checkHit = function(object3DA, object3DB){
    	var hitDetection = new HitDetection();
    	var hitObject3Ds = hitDetection.processHitDetection({
    		fixNum: 4,
        	mainObject3D: object3DA,
        	object3Ds: [object3DB]
    	});
    	return hitObject3Ds.length > 0;
	}

	//开始选择位置点（用户参数录入时，选取参数值，要求参数类型是point2D、point3D、line2D、line3D、polyline2D、polyline3D等 added by ls 20220606
	this.setSelectLocationStatus = function(p){
        $("#" + thatCE.containerId).find(".coreContainer").focus();
		var commandJson = js3CommandProcessors[p.locationType];
		commandJson.locationType = p.locationType,
		commandJson.paramName = p.paramName,
		commandJson.unitComponentProcessor = p.unitComponentProcessor,
		thatCE.setStatus(commandJson.toStatus, p.locationType, commandJson);
	}

	//更新记录历史新增的子构件类型和参数值 added by ls 20230717
	this.addToAddedHistory = function(unitSetting){
		let tempList = [];
		let addedInfo = {
			code: unitSetting.code,
			parameters: {}
		};
		for(let paramName in unitSetting.parameters){
			addedInfo.parameters[paramName] = unitSetting.parameters[paramName].value
		}
		tempList.push(addedInfo);
		for(let i = 0; i < thatCE.addedHistoryComParamList.length; i++){
			let historyInfo = thatCE.addedHistoryComParamList[i];
			if(historyInfo.code != addedInfo.code){
				tempList.push(historyInfo);
			}
		}
		thatCE.addedHistoryComParamList = tempList;
	}

	//根据code获取记录历史新增的子构件类型和参数值 added by ls 20230717
	this.getAddedHistory = function(code){
		for(let i = 0; i < thatCE.addedHistoryComParamList.length; i++){
			let historyInfo = thatCE.addedHistoryComParamList[i];
			if(historyInfo.code == code){
				return historyInfo;
			}
		}
		return null;
	}

}
export default CoreEditor