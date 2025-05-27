//3D设计器简单类型
const js3SimpleUnitType = {
	sphere: "sphere", //球体
	cylinder: "cylinder", //圆柱
	cone: "cone", //圆锥	
	frustumOfCone: "frustumOfCone", //圆台
	ring: "ring", //环
	cuboid: "cuboid", //长方体
	prism: "prism", //棱柱
	prismaticTable: "prismaticTable", //棱台
	pyramid: "pyramid" //棱锥
}; 

//3D设计器常用视角
const js3NormalViewport = {
	init: "init",
	front: "front",
	back: "back",
	top: "top",
	bottom: "bottom",
	left: "left",
	right: "right"
};

//3D组件参数类型
const js3ParameterType = {
	string: "string",
	decimal: "decimal",
	boolean: "boolean",
	date: "date",
	time: "time",
	material: "material",

	//数组类型 added by liyh 20230606
	array: "array",

	gltfFile: "gltfFile",
	binFile: "binFile",
	pathFile: "pathFile",
	surfaceFile: "surfaceFile",

	//FBX文件 added by ls 20240112
	fbxFile: "fbxFile",

	//辅助点文件 added by ls 20230418
	assistFile: "assistFile",
	
	//增加参数类型 added by ls 20220607
	point2D: "point2D", 
	point3D: "point3D",
	polyline2D: "polyline2D", 
	polyline3D: "polyline3D", 

	//线参数类型 added by ls 20230613
	line2D: "line2D", 
	line3D: "line3D", 
	
	//增加path参数类型 added by ls 20230208
	path2D: "path2D", 
	path3D: "path3D",
	pathClosed2D: "pathClosed2D", 
	pathClosed3D: "pathClosed3D"
};

//系统支持的参数类型下拉行 added by ls 20210823
var js3ParameterTypeListRows = [
    {name: js3ParameterType.string},
    {name: js3ParameterType.boolean}, 
    {name: js3ParameterType.decimal}, 
    {name: js3ParameterType.date},
    {name: js3ParameterType.time},
    {name: js3ParameterType.material},

	//数组类型 added by liyh 20230606
	{name: js3ParameterType.array},

    {name: js3ParameterType.gltfFile},
    {name: js3ParameterType.binFile},
    {name: js3ParameterType.pathFile},
    {name: js3ParameterType.surfaceFile},

	//FBX文件 added by ls 20240112
	{name: js3ParameterType.fbxFile},
    
	//辅助点文件 added by ls 20230418
    {name: js3ParameterType.assistFile},
    
	//增加参数类型 added by ls 20220607
    {name: js3ParameterType.point2D},
    {name: js3ParameterType.point3D},
    {name: js3ParameterType.polyline2D},
    {name: js3ParameterType.polyline3D},

	//线参数类型 added by ls 20230613
    {name: js3ParameterType.line2D},
    {name: js3ParameterType.line3D},
    
	//增加path参数类型 added by ls 20230208
    {name: js3ParameterType.path2D},
    {name: js3ParameterType.path3D},
    {name: js3ParameterType.pathClosed2D},
    {name: js3ParameterType.pathClosed3D}  
]

//根据参数类型获取值类型
var getValueTypeByParameterType = function(paramType){
	switch(paramType){
		case js3ParameterType.string:
		case js3ParameterType.material:

		//数组类型 added by liyh 20230606
		case js3ParameterType.array:

		case js3ParameterType.gltfFile:
		case js3ParameterType.binFile:
		case js3ParameterType.pathFile:
		case js3ParameterType.surfaceFile:

		//FBX文件 added by ls 20240112
		case js3ParameterType.fbxFile:

		//辅助点文件 added by ls 20230418
		case js3ParameterType.assistFile:
			
		//增加参数类型 added by ls 20220607
		case js3ParameterType.point2D:
		case js3ParameterType.point3D:
		case js3ParameterType.polyline2D:
		case js3ParameterType.polyline3D: 
			
		//线参数类型 added by ls 20230613
		case js3ParameterType.line2D:
		case js3ParameterType.line3D: 
	    
		//增加path参数类型 added by ls 20230208
		case js3ParameterType.path2D:
		case js3ParameterType.path3D:
		case js3ParameterType.pathClosed2D:
		case js3ParameterType.pathClosed3D: {
			return valueType.string;
		}
		case js3ParameterType.decimal:{
			return valueType.decimal;
		}
		case js3ParameterType.boolean:{
			return valueType.boolean;
		}
		case js3ParameterType.date:{
			return valueType.date;
		}
		case js3ParameterType.time:{
			return valueType.time;
		}
		default:{
			throw "无法处理的类型: " + paramType;
		}
	}
};

//3D设计器状态类型
const js3CoreEditorStatus = {
	disabled: "disabled",  
	placeLimit3DPoints: "placeLimit3DPoints",
	placeLimit2DPoints: "placeLimit2DPoints",
	ruler: "ruler",
	normal: "normal",
	multiSelect: "multiSelect",
	pointCtrl: "pointCtrl",
	none: "none"
};

//3D设计器状态名称
var js3GetStatusName = function(status){
	switch(status){
		case js3CoreEditorStatus.placeLimit3DPoints: 
		case js3CoreEditorStatus.placeLimit2DPoints:{
			return "绘制";
			break;
		}
		case js3CoreEditorStatus.ruler:{
			return "测量";
			break;
		}
		case js3CoreEditorStatus.normal:{
			return "普通";
			break;
		}
		case js3CoreEditorStatus.multiSelect:{
			return "多选";
			break;
		}
		//增加辅助点状态 add by ls 20220606
		case js3CoreEditorStatus.pointCtrl:{
			return "新建辅助点";
			break;
		}
	}
};

const js3ToolbarBtnStatus = {
	"save": {"toStatus": js3CoreEditorStatus.normal, "selected": [], "disabled": false, "normal": true},
	"ruler": {"toStatus": js3CoreEditorStatus.ruler, "selected": [], "disabled": false, "normal": true},
	"normalViewport": {"toStatus": js3CoreEditorStatus.normal, "selected": [], "disabled": false, "normal": true},
	"topView": {"toStatus": js3CoreEditorStatus.normal, "selected": [], "disabled": false, "noacarmal": true},
	"otherViewport": {"toStatus": js3CoreEditorStatus.normal, "selected": [], "disabled": false, "normal": true},
	"backView": {"toStatus": js3CoreEditorStatus.normal, "selected": [], "disabled": false, "normal": true},
	"bottomView": {"toStatus": js3CoreEditorStatus.normal, "selected": [], "disabled": false, "normal": true},
	"leftView": {"toStatus": js3CoreEditorStatus.normal, "selected": [], "disabled": false, "normal": true},
	"rightView": {"toStatus": js3CoreEditorStatus.normal, "selected": [], "disabled": false, "normal": true} 
};

const js3ClipBoardType = {
	cut: "cut",
	copy: "copy"
};

const js3UnitMixType = {
	none: "none",
	union: "union", //并集
	subtract: "subtract", //差集	
	intersect: "intersect", //交集
    
    getMixTypeText: function(mixType){
    	switch(mixType){
	    	case js3UnitMixType.union:
	    		return "并集";
	    	case js3UnitMixType.subtract:
	    		return "差集";
	    	case js3UnitMixType.intersect:
	    		return "交集";
	    	case js3UnitMixType.none:
    		default:
	    		return "";
    	}
    }
};

const js3RefComponentParameterEditFormSetting = { 
	formWidth: 800,
	formHeight: 580,
	pageUrl: "../../design/common/unitComponents/common/commonForm.jsp"
};

//操作类型 added by ls 20210825
const js3OperateType = {
	modifyComponentParameter: "modifyComponentParameter",
	modifyUnitUserParameter: "modifyUnitUserParameter",
	modifyUnitSysParameter: "modifyUnitSysParameter",
	addUnit: "addUnit",
	deleteUnit: "deleteUnit",
	addGroup: "addGroup",
	deleteGroup: "deleteGroup",
	modifyGroup: "modifyGroup",
	changeUnitGroup: "changeUnitGroup",
	sortGroup: "sortGroup",
	sortUnit: "sortUnit"
};

//resource类型 added by ls 20240111
const js3ResourceType = {
	gltf: "gltf",
	fbx: "fbx"
}

//显示级别 added by ls 20230403
const js3ViewLevelType = {
	always: "always",
	low: "low",
	medium: "medium",
	high: "high",
	    
    getViewLevelText: function(viewLevel){
    	switch(viewLevel){
	    	case js3ViewLevelType.low:
	    		return "低";
	    	case js3ViewLevelType.medium:
	    		return "中";
	    	case js3ViewLevelType.high:
	    		return "高";
	    	case js3ViewLevelType.always:
    		default:
	    		return "";
    	}
    },
	    
    getViewLevel: function(viewLevelText){
    	switch(viewLevelText){
	    	case "低":
	    		return js3ViewLevelType.low;
	    	case "中":
	    		return js3ViewLevelType.medium;
	    	case "高":
	    		return js3ViewLevelType.high;
	    	case "始终显示":
    		default:
	    		return js3ViewLevelType.always;
    	}
    }
}

//侧边栏分组
var sideTabGroups = {
	leftSingleSelect: ["groupUnitList"],
	leftMultiSelect: ["groupUnitList", "multiUnitSelectedList"],
	rightComponentSelect: ["componentBasePropertyList", "controlInfoList", "axisInfoList", "globalPropertyList", "workPlanePropertyList", "commandPropertyList", "componentSeniorPropertyList", "assistantAIList"],
	rightUnitSelect: ["unitBasePropertyList", "propertyDrivenPropertyList", "ruleDrivenPropertyList", "otherPropertyList", "workPlanePropertyList", "commandPropertyList", "assistantAIList"],
	rightMultiSelect: ["commandPropertyList", "assistantAIList"]
}


const js3StandardMaterials = new JS3StandardMaterials();