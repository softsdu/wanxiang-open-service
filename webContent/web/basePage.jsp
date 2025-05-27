<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.zlp.platform.dao.sys.SystemContext"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%
String path = request.getContextPath();
String basePath = request.getScheme() + "://" +request.getServerName() + ":"+ request.getServerPort() + path + "";
String platFormStylePath = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_UI_STYLE);
String platFormObjectTitle = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_PROJECT_NAME);
String platFormRequestUrl = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_REQUEST_URL);
String platFormPageJumpUrl = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_PAGEJUMP_URL);

%>
<c:set var="base" value="<%=basePath %>" />
<c:set var="platFormStylePath" value="<%=platFormStylePath %>" />
<c:set var="platFormRequestUrl" value="<%=platFormRequestUrl %>" />
<c:set var="platFormPageJumpUrl" value="<%=platFormPageJumpUrl %>" /> 
<c:set var="platformStyle" value="${base}/platform-style" />
<c:set var="plugins" value="${platformStyle}/plugins" />
<c:set var="platform" value="${plugins}/platform" />
<c:set var="jquery" value="${plugins}/jquery" />
<c:set var="themes" value="${platform}/themes" />
<c:set var="basejs" value="${platform}/base" />
<c:set var="expressionjs" value="${platform}/expression" />
<c:set var="model" value="${platform}/data-model" />
<c:set var="dataModel" value="${model}/data" />
<c:set var="viewModel" value="${model}/view" />
<c:set var="treeModel" value="${model}/tree" />
<c:set var="sheetModel" value="${model}/sheet" />
<c:set var="paramWinModel" value="${model}/paramWin" />
<c:set var="reportModel" value="${model}/report" />
<c:set var="locale" value="${platform}/locale" />
<!-- js组件路径 -->
<c:set var="components" value="${plugins}/components" />
<!--扩展-->
<c:set var="expansion" value="${components}/expansion" />
<c:set var="validform" value="${components}/validform" />
<c:set var="swfupload" value="${components}/swfupload" />
<c:set var="uploadify" value="${components}/accessory" />
<c:set var="ajaxupload" value="${components}/ajaxFileUpload" /><!-- 上传 -->
<c:set var="editor" value="${components}/kindeditor-4.1.10" /><!-- 富文本编辑 -->

<!-- 页面 -->
<c:set var="pagePath" value="${base}/web" />
<c:set var="jsutil" value="${pagePath}/jsUtil"/>
<!-- 流程 -->
<c:set var="workflowPath" value="${pagePath}/workflow" />


<!-- 加载所有样式路径 
<c:set var="defaults" value="${themes}/default" />
<c:set var="gray" value="${themes}/gray" />
-->

<!-- zTree控件目录 -->
<c:set var="ztree" value="${components}/zTree" />
<c:set var="ztreecss" value="${ztree}/css/zTreeStyle" />
<c:set var="ztreejs" value="${ztree}/js" />

<!-- easyui-1.3.2 -->
<c:set var="easyui" value="${components}/easyui" />
<c:set var="easyuicss" value="${easyui}/themes" />

<!-- 确定当前要使用的样式 -->
<c:set var="style" value="${themes}/${platFormStylePath}" />
<c:set var="css" value="${style}" />
<c:set var="images" value="${style}/images" />
<c:set var="js" value="${themes}/" />


<!-- 项目名称(根据项目更改此处即可) -->
<c:set var="alertTitle" value="<%=platFormObjectTitle %>" />

<c:set var="nochoiceEdit" value="请选择一条要修改的数据！" />
<c:set var="nochoiceDel" value="请至少选择一条要删除的数据！" />
<c:set var="oneAtATime" value="一次只能修改一条数据！" />
<c:set var="sureToDel" value="确定要删除选择的数据吗？删除后数据将无法恢复！" />

<script type="text/javascript">
var basePath = "${base}";
var platformBanner = basePath+"/<%=session.getAttribute("novaBanner")%>";
var pluginpath = "${plugins}"; 
var baseTitle = "${alertTitle}";
var baseImages = "${images}";
var baseCss = "${css}";
var uploadify = "${uploadify}";
var imageServer = "${imageServer}";
var pagePath = "${pagePath}";
var workflowPath = "${workflowPath}";
var _user_win = true;

//alert("basePage.jsp-->---"+platformBanner+"--------");

// <!-- 禁止鼠标右键 -->
//ocument.oncontextmenu=function(){
//	event.cancelBubble=true;
//	event.returnValue=false;
//	return false;
//};
// <!-- 禁止鼠标右键兼容火狐 -->
function stop(){ 
	return false; 
} 
//document.oncontextmenu=stop; 
</script>

<!-- 加载框架运行库 -->
<script type="text/javascript" src="${jquery}/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="${jquery}/jquery.simplemodal.1.4.4.min.js"></script>
<script type="text/javascript" src="${jquery}/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${jquery}/jquery.jqGrid.min.js"></script>
<script type="text/javascript" src="${jquery}/grid.locale-cn.js"></script>
<script type="text/javascript" src="${basejs}/json.js"></script>
<script type="text/javascript" src="${basejs}/common.js"></script>
<script type="text/javascript" src="${basejs}/datatable.js"></script>
<script type="text/javascript" src="${basejs}/hashtable.js"></script>
<script type="text/javascript" src="${basejs}/datarow.js"></script>
<script type="text/javascript" src="${basejs}/static.js"></script>
<script type="text/javascript" src="${basejs}/ncpGrid.js"></script>
<script type="text/javascript" src="${basejs}/ncpGridCard.js"></script>
<script type="text/javascript" src="${basejs}/ncpCard.js"></script>
<script type="text/javascript" src="${basejs}/ncpView.js"></script>
<script type="text/javascript" src="${basejs}/ncpSheet.js"></script>
<script type="text/javascript" src="${basejs}/ncpTree.js"></script>
<script type="text/javascript" src="${basejs}/ncpTreeCard.js"></script>
<script type="text/javascript" src="${basejs}/ncpTreeStyleGrid.js"></script>
<script type="text/javascript" src="${basejs}/ncpMultiStyleWin.js"></script>
<script type="text/javascript" src="${basejs}/ncpDocumentMultiStyleWin.js"></script>
<script type="text/javascript" src="${basejs}/ncpParamWin.js"></script>
<script type="text/javascript" src="${basejs}/dispunit.js?timestamp='201904291200'"></script>

<!-- 表达式函数列表 -->
<script type="text/javascript" src="${expressionjs}/functionList.js"></script>

<!-- 运行js表达式 -->
<script type="text/javascript" src="${expressionjs}/expressionRunner.js"></script>

<!-- 用户自定义扩展库 -->
<script type="text/javascript" src="${expressionjs}/expCommon.js"></script>
<script type="text/javascript" src="${expressionjs}/expMath.js"></script>

<!-- 加载扩展库 -->
<!-- 
<script type="text/javascript" src="${expansion}/w3util.js"></script>
 -->
<script type="text/javascript" src="${expansion}/w3scripts.js"></script>
<script type="text/javascript" src="${expansion}/w3ajax_v3.0.2_min.js"></script>
<script type="text/javascript" src="${expansion}/w3base_v3.0.2_min.js"></script>
<!-- 密码强度验证 -->
<script type="text/javascript" src="${expansion}/passwordStrength-min.js"></script>
<link rel="stylesheet" type="text/css" href="${expansion}/passwordStrength.css">

<!-- ztree -->
<script type="text/javascript" src="${ztreejs}/jquery.ztree.core-3.5.min.js"></script>
<script type="text/javascript" src="${ztreejs}/jquery.ztree.excheck-3.5.js"></script>

<!-- 富文本编辑 -->
<link rel="stylesheet" type="text/css" href="${editor}/themes/default/default.css">
<link rel="stylesheet" type="text/css" href="${editor}/plugins/code/prettify.css">
<script type="text/javascript" charset="utf-8" src="${editor}/kindeditor.js"></script>
<script type="text/javascript" charset="utf-8" src="${editor}/lang/zh_CN.js"></script>
<script type="text/javascript" charset="utf-8" src="${editor}/plugins/code/prettify.js"></script>
<script type="text/javascript" src="${editor}/platform-keditor.min.js"></script>

<!-- 上传 -->
<script type="text/javascript" src="${ajaxupload}/ajaxfileupload.js"></script>
<script type="text/javascript" src="${ajaxupload}/platform-upload.min.js"></script>

<!-- jquery form表单验证 -->
<script type="text/javascript" src="${validform}/Validform_v5.3.2_min.js"></script>
<link rel="stylesheet" type="text/css" href="${validform}/validform.css">
<script type="text/javascript" src="${swfupload}/swfuploadv2.2-min.js"></script>
<script type="text/javascript" src="${swfupload}/Validform.swfupload.handler-min.js"></script>

<!-- jquery提示 -->
<script src="${jquery}/jquery.noty.packaged.min.js"></script>

<%--
<script type="text/javascript" src="${themes}/login.js"></script>
<script type="text/javascript" src="${themes}/main.js"></script>
--%>

<link rel="stylesheet" type="text/css" href="${css}/jquery-ui-custom.css">
<link rel="stylesheet" type="text/css" href="${css}/ui.jqgrid.css">
<link rel="stylesheet" type="text/css" href="${css}/easyui.css?timestamp='201905071412'">
<link rel="stylesheet" type="text/css" href="${css}/icon.css">
<link rel="stylesheet" type="text/css" href="${css}/common.css">
<link rel="stylesheet" type="text/css" href="${css}/ncpCard.css">
<link rel="stylesheet" type="text/css" href="${css}/ncpGrid.css">
<link rel="stylesheet" type="text/css" href="${css}/main.css">
<link rel="stylesheet" type="text/css" href="${css}/login.css?t='20220906'">

<!-- added by liyh 20190430 -->
<link rel="shortcut icon" type="image/x-icon" href="${images}/login/favicon.ico">