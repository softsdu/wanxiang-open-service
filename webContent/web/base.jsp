<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.zlp.platform.dao.sys.SystemContext"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%@page import="com.zlp.platform.common.INcpSession"%>
<%@page import="com.zlp.platform.common.NcpSession"%>
<%@ page import="com.nova.frame.utils.StringUtils" %>

<%
INcpSession basePageNcpSession = new NcpSession(request.getCookies(), false);
String basePageNcpSessionUserId = basePageNcpSession.getUserId();
String basePageNcpSessionUserCode = basePageNcpSession.getUserCode();
String basePageNcpSessionUserName = basePageNcpSession.getUserName();
String basePageNcpSessionCompanyId = basePageNcpSession.getCompanyId();

String path = request.getContextPath();
//String basePath = request.getScheme() + "://" +request.getServerName() + ":"+ request.getServerPort() + path + "";
String basePath =  com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PROJECT_ROOTURL) + path;
String platFormStylePath = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_UI_STYLE);
String platFormObjectTitle = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_PROJECT_NAME);
String platFormRequestUrl = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_REQUEST_URL);
String platFormPageJumpUrl = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_PAGEJUMP_URL);

String sysNamePath = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.SYS_NAME_PATH);
String sysNameStylePath="";
if(StringUtils.isNotNullOrEmpty(sysNamePath)){
    sysNameStylePath = "_"+sysNamePath;
}

String fileVersion = "202312211113";
%>
<c:set var="base" value="<%=basePath %>" />
<c:set var="platFormStylePath" value="<%=platFormStylePath %>" />
<c:set var="platFormRequestUrl" value="<%=platFormRequestUrl %>" />
<c:set var="platFormPageJumpUrl" value="<%=platFormPageJumpUrl %>" />
 
<c:set var="platform" value="${base}/platform" />  

<c:set var="baseImages" value="${base}/images" /> 
<c:set var="jquery" value="${platform}/jquery" /> 
<c:set var="basejs" value="${platform}/base" />
<c:set var="expressionjs" value="${platform}/expression" />
<c:set var="model" value="${platform}/model" />
<c:set var="dataModel" value="${model}/data" />
<c:set var="viewModel" value="${model}/view" />
<c:set var="treeModel" value="${model}/tree" />
<c:set var="sheetModel" value="${model}/sheet" />
<c:set var="paramWinModel" value="${model}/paramWin" />
<c:set var="reportModel" value="${model}/report" />   
<c:set var="pagePath" value="${base}/web" /> 
<c:set var="css" value="${base}/css" />
<c:set var="images" value="${base}/images" />
<c:set var="plugins" value="${platform}/plugins" />
<c:set var="components" value="${plugins}/components" />
<c:set var="uploadify" value="${components}/accessory" />

<c:set var="basePageNcpSessionUserId" value="<%=basePageNcpSessionUserId %>" />
<c:set var="basePageNcpSessionUserCode" value="<%=basePageNcpSessionUserCode %>" />
<c:set var="basePageNcpSessionUserName" value="<%=basePageNcpSessionUserName %>" />
<c:set var="basePageNcpSessionCompanyId" value="<%=basePageNcpSessionCompanyId %>" />
<c:set var="sysNameStylePath" value="<%=sysNameStylePath %>" />

<!-- 项目名称(根据项目更改此处即可) -->
<c:set var="alertTitle" value="<%=platFormObjectTitle %>" />
<script type="text/javascript">
var basePath = "${base}";
var uploadify = "${uploadify}";
var baseImages = "${baseImages}";

var sessionScope = {
    userId: "${basePageNcpSessionUserId}",
    userCode: "${basePageNcpSessionUserCode}",
    userName: "${basePageNcpSessionUserName}",
    companyId: "${basePageNcpSessionCompanyId}",
};

</script>
 
<!-- 加载框架运行库 -->
<script type="text/javascript" src="${jquery}/jquery.min.js?t=<%=fileVersion%>"></script> 
<script type="text/javascript" src="${jquery}/bootstrap.min.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/json.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/common.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/datatable.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/hashtable.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/datarow.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/static.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/ncpGrid.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/ncpGridCard.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/ncpCard.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/ncpView.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/ncpSheet.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/ncpTree.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/ncpTreeCard.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/ncpTreeStyleGrid.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/ncpMultiStyleWin.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/ncpDocumentMultiStyleWin.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${basejs}/ncpParamWin.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${jquery}/jquery.jqGrid.min.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${jquery}/myDatepicker.js?t=<%=fileVersion%>"></script> 
<script type="text/javascript" src="${basejs}/dispunit.js?t=<%=fileVersion%>"></script>
 

<!-- 表达式函数列表 -->
<script type="text/javascript" src="${expressionjs}/functionList.js?t=<%=fileVersion%>"></script>

<!-- 运行js表达式 -->
<script type="text/javascript" src="${expressionjs}/expressionRunner.js?t=<%=fileVersion%>"></script>

<!-- 表达式用户自定义扩展库 -->
<script type="text/javascript" src="${expressionjs}/expCommon.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${expressionjs}/expMath.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${expressionjs}/expModel.js"?t=<%=fileVersion%>></script>
<script type="text/javascript" src="${expressionjs}/expGeometry.js?t=<%=fileVersion%>"></script>

<!-- 表达式扩展，获取标准信息  added by ls 20211008 -->
<script type="text/javascript" src="${expressionjs}/expStandard.js?t=<%=fileVersion%>"></script>
<script type="text/javascript" src="${expressionjs}/standardList.js?t=<%=fileVersion%>"></script>

<!-- 表达式扩展，获取阶梯值信息  added by liyh 20211109 -->
<script type="text/javascript" src="${expressionjs}/funcStepList.js?t=<%=fileVersion%>"></script>
 
<link rel="stylesheet" type="text/css" href="${jquery}/ui.jqgrid.css?t=<%=fileVersion%>">
<link rel="stylesheet" type="text/css" href="${jquery}/jquery-ui-custom.css?t=<%=fileVersion%>">
<link rel="stylesheet" type="text/css" href="${jquery}/ui.multiselect.css?t=<%=fileVersion%>">
<link rel="stylesheet" type="text/css" href="${jquery}/bootstrap.min.css?t=<%=fileVersion%>">
<link rel="stylesheet" type="text/css" href="${jquery}/bootstrap-theme.min.css?t=<%=fileVersion%>">
<link rel="stylesheet" type="text/css" href="${css}/common.css?t=<%=fileVersion%>">

<link rel="shortcut icon" type="image/x-icon" href="${images}/logo.ico">