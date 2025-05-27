<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.zlp.platform.dao.sys.SystemContext"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:set var="base" value="<%=basePath %>" /> 
<c:set var="designCommon" value="${base}/web/design/common" />  
<c:set var="designCommonJs" value="${designCommon}/js" />  
<c:set var="designCommonPlugins" value="${designCommon}/plugins" />

<link rel="stylesheet" href="${designCommon}/css/coreEditor${sysNameStylePath}.css?t=<%=fileVersion%>">
<script type="text/javascript" src="${expressionjs}/expressionEditor.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/threejs/build/three.module.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/threejs/examples/jsm/loaders/GLTFLoader.js?t=<%=fileVersion%>""></script>
<script type="module" src="${designCommonJs}/threejs/examples/jsm/exporters/GLTFExporter.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/threejs/examples/jsm/controls/OrbitControls.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/controls/OrbitControlsGizmo.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/threejs/examples/jsm/controls/TrackballControls.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/threejs/examples/jsm/renderers/CSS2DRenderer.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/threejs/examples/jsm/controls/DragControls.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/threejs/examples/jsm/controls/TransformControls.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/threejs/examples/jsm/controls/FirstPersonControls.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/threejs/examples/jsm/renderers/Projector.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/threejs/examples/jsm/lines/Line2.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/pointControlProcessor.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/coreEditor.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonJs}/js3UvMaterialEditor.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/js3CommonFunction.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/loaders/constants.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/libs/stats.min.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/libs/dat.gui.min.js?t=<%=fileVersion%>"></script>

<!-- 新增zip/config.js added by ls 20230825-->
<script type="text/javascript" src="${designCommonJs}/zip/zip.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/zip/zip-fs.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/zip/zip-ext.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/zip/z-worker.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/zip/config.js?t=<%=fileVersion%>"></script>

<script type="text/javascript" src="${designCommonJs}/js3StandardMaterials.js?t=<%=System.currentTimeMillis()%>"></script>
<script type="text/javascript" src="${designCommonJs}/js3Static.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/mdlComponent.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/mdlFunction.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/mdlExpProcessor.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/componentObject3DCache.js?t=<%=fileVersion%>"></script>   
<script type="text/javascript" src="${designCommonJs}/js3Components.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/js3MapComs.js?t=<%=System.currentTimeMillis()%>"></script>
<script type="text/javascript" src="${designCommonJs}/js3ComponentParametersEditor.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/js3SysCatAndCom.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/js3CommonToolbarSettings.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommonJs}/js3CommandProcessors.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommon}/expression/expBimClientCommon.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${designCommon}/unitComponents/common/js3UnitComponentProcessor.js?t=<%=fileVersion%>"></script>	
	    
<!-- 通用的选择坐标 added by ls 202206 -->
<script type="module" src="${designCommonPlugins}/point2D/command.js?t=<%=fileVersion%>"></script> 
<script type="module" src="${designCommonPlugins}/point3D/command.js?t=<%=fileVersion%>"></script> 
<script type="module" src="${designCommonPlugins}/polyline2D/command.js?t=<%=fileVersion%>"></script> 
<script type="module" src="${designCommonPlugins}/polyline3D/command.js?t=<%=fileVersion%>"></script> 
<script type="module" src="${designCommonPlugins}/line2D/command.js?t=<%=fileVersion%>"></script> 
<script type="module" src="${designCommonPlugins}/line3D/command.js?t=<%=fileVersion%>"></script> 

<!-- 命令行帮助 added by ls 20220906 -->
<script type="module" src="${designCommonPlugins}/bimFunctionHelper/command.js?t=<%=fileVersion%>"></script> 

<!-- 编辑2d、3d路径 added by ls 20230208 -->
<script type="module" src="${designCommonPlugins}/path2D/command.js?t=<%=fileVersion%>"></script> 
<script type="module" src="${designCommonPlugins}/pathClosed2D/command.js?t=<%=fileVersion%>"></script> 
<script type="module" src="${designCommonPlugins}/path3D/command.js?t=<%=fileVersion%>"></script> 
<script type="module" src="${designCommonPlugins}/pathClosed3D/command.js?t=<%=fileVersion%>"></script> 

<!-- 生成管道系统 added by ls 20220810 -->
<script type="module" src="${designCommonPlugins}/pipeSystem/command.js?t=<%=fileVersion%>"></script>

<script type="module" src="${designCommonPlugins}/floorShape/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/deployElement/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/publish/command.js?t=<%=fileVersion%>"></script>

<!-- 编辑 -->
<script type="module" src="${designCommonPlugins}/save/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/insert/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/insert2d/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/insertRelatedUnit/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/replaceRelatedUnit/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/copy/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/paste/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/search/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/delete/command.js?t=<%=fileVersion%>"></script>

<!-- 视图 -->
<script type="module" src="${designCommonPlugins}/normalViewport/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/topView/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/bottomView/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/leftView/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/rightView/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/frontView/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/backView/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/sideContainer/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/commandRunner/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/setting/command.js?t=<%=fileVersion%>"></script> 

<!-- 辅助 -->
<script type="module" src="${designCommonPlugins}/assistPoint/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/ruler/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/pointTag/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/distanceTag/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/areaTag/command.js?t=<%=fileVersion%>"></script>

<!-- 工具 -->
<script type="module" src="${designCommonPlugins}/explode/command.js?t=<%=fileVersion%>"></script> 
<script type="module" src="${designCommonPlugins}/instantiateMultiUnits/command.js?t=<%=fileVersion%>"></script> 
<script type="module" src="${designCommonPlugins}/hitDetection/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/fixTerminalBoxPosition/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/geometryStats/command.js?t=<%=fileVersion%>"></script>	      
<script type="module" src="${designCommonPlugins}/renderStats/command.js?t=<%=fileVersion%>"></script>	      	   

<!-- 管理 -->
<script type="module" src="${designCommonPlugins}/componentBaseProperty/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/controlInfo/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/globalProperty/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/axisInfo/command.js?t=<%=fileVersion%>"></script>		

<!-- 数据共享 -->
<script type="module" src="${designCommonPlugins}/preview/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/saveSnapshot/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/exportS3D/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/exportS3Dc/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/exportGLTF/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/exportDAE/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/bomInfo/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/calcCarbon/command.js?t=<%=fileVersion%>"></script>

<!-- 景观绿化树木 -->
<script type="module" src="${designCommonPlugins}/createTree/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/bomGenerate/command.js?t=<%=fileVersion%>"></script>
<script type="module" src="${designCommonPlugins}/calcCarbon/command.js?t=<%=fileVersion%>"></script>

<!-- AI助手 -->
<script type="module" src="${designCommonPlugins}/assistantAI/command.js?t=<%=fileVersion%>"></script>