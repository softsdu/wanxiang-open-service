<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<html>
	<head>
		<title>建筑设计系统</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<script type="importmap">
			{
				"imports": {
					"three": "../../../../common/js/threejs/build/three.module.js",
					"three/addons/": "../../../../common/js/threejs/examples/jsm/",
					"common/js/":"../../../../common/js/",
					"explodeCom/js/":"./js/"
				}
			}
		</script>

    	<!-- 更改通用js的引用方式 modified by ls 20230529-->
		<%@ include file="../../../../../base.jsp" %>
		<%@ include file="../../../../../design/common/commonDesignJs.jsp" %>
		
	    <!-- ads相关 -->
	    <script type="module" src="./js/object3DExplodeCreator.js?t=<%=fileVersion%>"></script>
  		<link rel="stylesheet" href="css/explodeEditor.css?t=<%=fileVersion%>">
		<script type="module" src="js/explodeEditor.js?t=<%=fileVersion%>"></script>
	    <script type="text/javascript" src="js/js3SystemToolbarSettings.js?t=<%=System.currentTimeMillis()%>"></script>
	    
		<script type="module">
		import ExplodeEditor from "explodeCom/js/explodeEditor.js";
		let sourceComponentInfo = window.parent.js3CommandProcessors["exportS3D"].sourceComponentInfo;
		let canExplodeItemTree = window.parent.js3CommandProcessors["exportS3D"].canExplodeItemTree;
		$(document).ready(function(){
			window.comEditor = new ExplodeEditor();
			comEditor.init({
				containerId: "containerId", 
				componentId: sourceComponentInfo.id,
				sourceComponentInfo: sourceComponentInfo,
				canExplodeItemTree: canExplodeItemTree,
				gridVisible: false,
				groundPlaneVisible: true,
				transformControlVisible: true,
				attachLine2dVisible: true,
				hasShadow: false
	    	}); 
		});
		</script>
	</head>

	<body id="containerId">  
		<div class="popPosSettingContainer">
			<div class="popPosSettingBackground"></div>
			<div class="popPosSettingInputContainer">
				<input class="popPosSettingInput" />
			</div>
		</div> 
		<div class="popLengthSettingContainer">
			<div class="popLengthSettingBackground"></div>
			<div class="popLengthSettingInputContainer">
				<input class="popLengthSettingInput" />
			</div>
		</div> 
		<div class="coreContainer" tabindex="0"> 
			<div class="coreInnerContainer">				
			</div> 
			<div class="statusInfoContainer">
				<span class="statusInfoInnerContainer"></span>
			</div>
			<div class="gizmoContainer">				
			</div>
			<div class="contextMenuContainer contextMenuGroundPlaneContainer">
				<div class="contextMenuContainerBackground">
				</div>
				<div class="contextMenuInnerContainer">
					<!-- 增加切换视角的菜单 added by ls 20230609 -->
					<div class="contextMenuBtnContainer contextMenuBtnContainerEnable"><a class="contextMenuBtn contextMenuBtnRoot contextMenuBtnWorkPlaneViewport" title="切换视角">切换视角</a></div>
					
					<div class="contextMenuBtnContainer contextMenuBtnContainerEnable"><a class="contextMenuBtn contextMenuBtnRoot contextMenuBtnPaste" title="粘贴">粘贴 (Ctrl+V)</a></div>
					<div class="contextMenuBtnContainer contextMenuBtnContainerEnable"><a class="contextMenuBtn contextMenuBtnRoot contextMenuBtnMultiPaste" title="批量粘贴">批量粘贴</a></div> 
				</div> 
			</div>
			<div class="contextMenuContainer contextMenuMultiGroundPlaneContainer">
				<div class="contextMenuContainerBackground">
				</div>
				<div class="contextMenuInnerContainer">
					<div class="contextMenuBtnContainer contextMenuBtnContainerEnable"><a class="contextMenuBtn contextMenuBtnRoot contextMenuBtnMultiPaste" title="批量粘贴">批量粘贴</a></div> 
				</div> 
			</div>	
			<div class="contextMenuContainer contextMenuComponentContainer">
				<div class="contextMenuContainerBackground">
				</div>
				<div class="contextMenuInnerContainer">  
					<div class="contextMenuBtnContainer contextMenuBtnContainerEnable"><a class="contextMenuBtn contextMenuBtnRoot contextMenuBtnEditUnitParameters" title="编辑参数">编辑参数 (E)</a></div>
					<div class="contextMenuBtnContainer contextMenuBtnContainerEnable"><a class="contextMenuBtn contextMenuBtnRoot contextMenuBtnSetCenter" title="设为中心">设为中心 (F)</a></div>
					<div class="contextMenuBtnContainer contextMenuBtnContainerEnable"><a class="contextMenuBtn contextMenuBtnRoot contextMenuBtnMove" title="移动">移动 (M)</a></div>
					<div class="contextMenuBtnContainer contextMenuBtnContainerEnable"><a class="contextMenuBtn contextMenuBtnRoot contextMenuBtnRotate" title="旋转">旋转 (R)</a></div>
					<div class="contextMenuBtnContainer contextMenuBtnContainerEnable"><a class="contextMenuBtn contextMenuBtnRoot contextMenuBtnCopy" title="复制">复制 (Ctrl+C)</a></div>
					<div class="contextMenuBtnContainer contextMenuBtnContainerEnable"><a class="contextMenuBtn contextMenuBtnRoot contextMenuBtnDelete" title="删除">删除 (Del)</a></div>
					<div class="contextMenuBtnContainer contextMenuBtnContainerEnable"><a class="contextMenuBtn contextMenuBtnRoot contextMenuBtnEditUnitComponent" title="编辑组件">编辑组件</a></div>
				</div> 
			</div>
		</div>
		<div class="core3dLeftContainer">
			<div class="core3dTabContentContainer core3dTabContentContainerLeft">
				<div class="core3dTabContent" name="groupUnitList">
					<div class="core3dListContainer"></div>
					<div class="core3dToolbar">
						<div class="core3dToolbarBtn addGroupBtn">添加分组</div>
						<div class="core3dToolbarBtn sortGroupBtn">分组排序</div>
					</div>
				</div>
				<div class="core3dTabContent" name="multiUnitSelectedList">
					<div class="propertyList">
						<div class="propertyItem"><div class="propertyCategory">已选（<span class="multiUnitCount"></span>）</div></div>
						<div class="propertyItem multiUnitList">
						</div>
						<div class="propertyItem multiUnitBtnContainer">
							<div class="propertyBtn" name="multiUnitCancelBtn">取消多选</div>
						</div>
						<div class="propertyItem"><div class="propertyCategory">基本操作</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitCopyBtn">批量复制</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitChangeGroupBtn">更换分组</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitDeleteBtn">批量删除</div></div>
						<div class="propertyItem"><div class="propertyCategory">对齐操作</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitMinXAlignBtn">左对齐</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitMaxXAlignBtn">右对齐</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitMaxYAlignBtn">上对齐</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitMinYAlignBtn">下对齐</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitMaxZAlignBtn">前对齐</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitMinZAlignBtn">后对齐</div></div>
						<div class="propertyItem"><div class="propertyCategory">分布</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitEquipartitionXBtn">左右均匀分布</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitEquipartitionYBtn">上下均匀分布</div></div>
						<div class="propertyItem"><div class="propertyBtn" name="multiUnitEquipartitionZBtn">前后均匀分布</div></div>
					</div>
				</div>
			</div>
			<div class="core3dTabTitleContainer core3dTabTitleContainerLeft">
				<div class="core3dTabTitleTop" name="leftTabContainer">&lt;&lt;</div>
				<div class="core3dTabTitle" name="groupUnitList">图元</div>
				<div class="core3dTabTitle" name="multiUnitSelectedList">多选</div>
			</div>
		</div>
		<div class="loadingContainer">
			<div class="loadingContainerBackground"></div>
			<div class="loadingInnerContainer"></div>
			<div class="loadingTextContainer">
				<div class="loadingText">准备加载</div>
			</div>
		</div>
	</body>
</html>