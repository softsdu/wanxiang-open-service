var js3CommonToolbarSettings = [{
	id: "011",
	name: "编辑",
	buttons:[{
		type: "plugin",
		id: "011020",
		code: "save",
		name: "保存",
		description: "保存当前模型"
	},{
		type: "spliter"
	},{
		type: "plugin",
		id: "011030",
		code: "copy",
		name: "复制",
		description: "复制选中的构件"
	},{
		type: "plugin",
		id: "011040",
		code: "paste",
		name: "粘贴",
		description: "插入被复制的构件副本"
	},{
		type: "plugin",
		id: "011010",
		code: "insert",
		name: "插入",
		description: "插入新的构件"
	},{
		type: "plugin",
		id: "011050",
		code: "search",
		name: "查找",
		description: "查找构件"
	},{
		type: "spliter"
	},{
		type: "plugin",
		id: "011060",
		code: "delete",
		name: "删除",
		description: "删除选中的构件"
	},{
		type: "spliter"
	},{
		//插入关系件 added by ls 20230802
		type: "plugin",
		id: "011070",
		code: "insertRelatedUnit",
		name: "插入关系件",
		description: "插入关系构件"
	},{
		//替换关系件 added by ls 20231127
		type: "plugin",
		id: "011071",
		code: "replaceRelatedUnit",
		name: "替换关系件",
		description: "替换关系构件"
	}]
},{
	id: "012",
	name: "视图",
	buttons:[{
		type: "plugin",
		id: "012010",
		code: "normalViewport",
		name: "初始视角",
		description: "将视角还原到初始状态"
	},{
		type: "spliter"
	},{
		type: "plugin",
		id: "012020",
		code: "topView",
		name: "俯视",
		description: "摄像机切换到模型上方"
	},{
		type: "plugin",
		id: "012030",
		code: "bottomView",
		name: "仰视",
		description: "摄像机切换到模型下方"
	},{
		type: "plugin",
		id: "012040",
		code: "leftView",
		name: "左视",
		description: "摄像机切换到模型左侧"
	},{
		type: "plugin",
		id: "012050",
		code: "rightView",
		name: "右视",
		description: "摄像机切换到模型右侧"
	},{
		type: "plugin",
		id: "012060",
		code: "frontView",
		name: "主视",
		description: "摄像机切换到模型前面"
	},{
		type: "plugin",
		id: "012070",
		code: "backView",
		name: "后视",
		description: "摄像机切换到模型后面"
	},{
		type: "spliter"
	},{
		type: "plugin",
		id: "012080",
		code: "sideContainer",
		name: "侧边栏",
		description: "隐藏或显示侧边栏"
	},{
		type: "plugin",
		id: "012090",
		code: "commandRunner",
		name: "命令行",
		description: "打开命令行编辑侧边栏"
}]
},{
	id: "013",
	name: "辅助",
	buttons:[{
		type: "plugin",
		id: "013010",
		code: "assistPoint",
		name: "辅助点",
		description: "插入辅助点"
	},{
		type: "spliter"
	},{
		type: "plugin",
		id: "013020",
		code: "ruler",
		name: "测距",
		description: "水平测距"
	},{
		type: "plugin",
		id: "013030",
		code: "pointTag",
		name: "点标注",
		description: "插入点标注"
	},{
		type: "plugin",
		id: "013040",
		code: "distanceTag",
		name: "距离标注",
		description: "插入距离标注"
	},{
		type: "plugin",
		id: "013050",
		code: "areaTag",
		name: "面标注",
		description: "插入面标注"
	},{
		type: "component",
		id: "013060",
		code: "993010-01",
		name: "横向文字",
		imgId:"07b3df6a-2f5b-4709-8370-0dd8e4e65b38",
		description: "插入横向文字"
	},{
		type: "component",
		id: "013060",
		code: "993010-02",
		name: "竖向文字",
		imgId:"a04599d3-45df-43a9-9ee2-92d0a385fc88",
		description: "插入竖向文字"
	}
	]
},{
	id: "014",
	name: "工具",
	buttons:[{
		type: "plugin",
		id: "014010",
		code: "explode",
		name: "分解",
		description: "按照选中构件的结构，将其分解为多个小构件"
	},{
		type: "plugin",
		id: "014020",
		code: "instantiateMultiUnits",
		name: "数量实例化",
		description: "按照数量（UnitNum），将其实例化为多个构件"
	},{
		type: "spliter"
	},{
		type: "plugin",
		id: "014030",
		code: "hitDetection",
		name: "碰撞检测",
		description: "对选中构件进行碰撞检测"
	},{
		type: "spliter"
	},{
		type: "plugin",
		id: "014040",
		code: "geometryStats",
		name: "几何统计",
		description: "统计并显示模型中的几何信息"
	},{
		type: "plugin",
		id: "014050",
		code: "renderStats",
		name: "渲染监视",
		description: "前端渲染性能监视"
	}]
},{
	id: "015",
	name: "管理",
	buttons:[{
		type: "plugin",
		id: "015010",
		code: "componentBaseProperty",
		name: "模型信息",
		description: "打开模型信息编辑侧边栏"
	},{
		type: "plugin",
		id: "015030",
		code: "globalProperty",
		name: "全局变量",
		description: "打开全局变量编辑侧边栏"
	},{
		type: "plugin",
		id: "015020",
		code: "controlInfo",
		name: "控制器",
		description: "打开控制器信息编辑侧边栏"
	},{
		type: "plugin",
		id: "015040",
		code: "axisInfo",
		name: "轴网",
		description: "打开轴网编辑侧边栏"
	},{
		type: "plugin",
		id: "012100",
		code: "setting",
		name: "环境变量",
		description: "弹出环境设置窗口"
	}]
},{
	id: "016",
	name: "数据共享",
	buttons:[{
		type: "plugin",
		id: "016010",
		code: "preview",
		name: "预览",
		description: "打开预览窗口"
	},{
		type: "spliter"
	},{
		type: "plugin",
		id: "016020",
		code: "saveSnapshot",
		name: "生成缩略图",
		description: "给模型生成并上传缩略图, 缩略图用于显示在工具栏或模型列表中"
	},{
		type: "spliter"
	},{
		type: "plugin",
		id: "016031",
		code: "exportS3D",
		name: "导出S3D",
		description: "将当前模型导出为S3D格式（包含语义的三维模型），并下载"
	},{
		type: "plugin",
		id: "016032",
		code: "exportS3Dc",
		name: "导出S3Dc",
		description: "将当前模型导出为S3Dc格式（纯文本），并下载"
	},{
		type: "plugin",
		id: "016035",
		code: "exportGLTF",
		name: "导出GLTF",
		description: "将当前模型导出为GLTF格式，并下载"
	},{
		type: "plugin",
		id: "016036",
		code: "exportDAE",
		name: "导出DAE",
		description: "将当前模型导出为DAE格式，并下载"
	},{
		type: "spliter"
	},{
		type: "plugin",
		id: "016051",
		code: "bomGenerate",
		name: "生成BOM",
		description: "生成当前模型的物料清单（BOM）"
	},{
		type: "spliter"
	},{
		type: "plugin",
		id: "016050",
		code: "bomInfo",
		name: "查看BOM",
		description: "查看当前模型的物料清单（BOM）"
	},{
		type: "plugin",
		id: "016060",
		code: "calcCarbon",
		name: "统计计算",
		description: "根据选中的指标进行数据统计"
	}]
}];