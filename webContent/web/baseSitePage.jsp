<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.zlp.platform.dao.sys.SystemContext"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme() + "://" +request.getServerName() + ":"+ request.getServerPort() + path + "";
String platformStylePath = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_UI_STYLE);
String platformObjectTitle = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_PROJECT_NAME);
String platformRequestUrl = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_REQUEST_URL);
String platformPageJumpUrl = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_PAGEJUMP_URL);

%>
<c:set var="base" value="<%=basePath %>" />
<c:set var="platformStylePath" value="<%=platformStylePath %>" />
<c:set var="platformRequestUrl" value="<%=platformRequestUrl %>" />
<c:set var="platformPageJumpUrl" value="<%=platformPageJumpUrl %>" />   
<c:set var="platform" value="${base}/platform" />
<c:set var="plugins" value="${platform}/plugins" />
<c:set var="jquery" value="${platform}/jquery" /> 
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

<!-- 页面 -->
<c:set var="pagePath" value="${base}/web" />  

<!-- 确定当前要使用的样式 --> 
<c:set var="css" value="${base}/css" />
<c:set var="images" value="${base}/images" /> 

<script type="text/javascript">
var basePath = "${base}"; 
var pluginpath = "${plugins}"; 
var baseTitle = "${alertTitle}";
var baseImages = "${images}";
var baseCss = "${css}";
var uploadify = "${uploadify}";
var pagePath = "${pagePath}"; 
var _user_win = true; 
</script>

<link rel="shortcut icon" href="${images}/logo.ico" type="image/x-icon" />

<!-- 加载框架运行库 -->
<script type="text/javascript" src="${jquery}/jquery.min.js"></script> 
<script type="text/javascript" src="${jquery}/bootstrap.min.js"></script>
<script type="text/javascript" src="${basejs}/json.js"></script>
<script type="text/javascript" src="${basejs}/common.js"></script>
<script type="text/javascript" src="${basejs}/datatable.js"></script>
<script type="text/javascript" src="${basejs}/hashtable.js"></script>
<script type="text/javascript" src="${basejs}/datarow.js"></script>
<script type="text/javascript" src="${basejs}/static.js"></script>
<link rel="stylesheet" type="text/css" href="${pagePath}/cms/css/siteCommon.css">
<link rel="stylesheet" type="text/css" href="${jquery}/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="${jquery}/bootstrap-theme.min.css">
<link rel="stylesheet" type="text/css" href="${css}/common.css">

