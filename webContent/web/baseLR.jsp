<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.zlp.platform.dao.sys.SystemContext"%>
<%@page import="com.zlp.platform.common.SysConfig"%>
<%@ page import="com.zlp.platform.common.NcpSession" %>
<%@ page import="com.zlp.platform.dao.sys.Role" %> 
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%
String path = request.getContextPath();
boolean isMobile = SysConfig.judgelsMobile(request);
String basePath = request.getScheme() + "://" +request.getServerName() + ":"+ request.getServerPort() + path + "";
String platFormStylePath = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_UI_STYLE);
String platFormObjectTitle = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_PROJECT_NAME);
String platFormRequestUrl = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_REQUEST_URL);
String platFormPageJumpUrl = com.zlp.platform.core.ConfigContext.getConfigMap().get(com.zlp.platform.constants.ZlpState.PLATFORM_PAGEJUMP_URL);

Cookie[] cookies = request.getCookies();
NcpSession ncpSession = new NcpSession(cookies, false); 
String userCode = ncpSession.getUserCode();
String userName = ncpSession.getUserName();
List<Role> allRoles = ncpSession.getRoleList(); 
%>
<script type="text/javascript">
var userInfo = {userCode: "<%=userCode%>", roles: []};
<%
	if(allRoles != null){		
		for(int i = 0; i < allRoles.size(); i++){
			Role role = allRoles.get(i); 
			String roleCode = role.getCode();
%>
userInfo.roles.push("<%=roleCode%>");
<%
		}
	}
%>
</script>
<c:set var="base" value="<%=basePath %>" />
<c:set var="platFormStylePath" value="<%=platFormStylePath %>" />
<c:set var="platFormRequestUrl" value="<%=platFormRequestUrl %>" />
<c:set var="platFormPageJumpUrl" value="<%=platFormPageJumpUrl %>" />

<!-- 
<c:set var="platform" value="http://storage.goondata.com:1910/goondata/platform" />
-->
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
<c:set var="echarts" value="${components}/echarts" />

<!-- 项目名称(根据项目更改此处即可) -->
<c:set var="alertTitle" value="<%=platFormObjectTitle %>" />
<script type="text/javascript">
var basePath = "${base}";
var uploadify = "${uploadify}";
var baseImages = "${baseImages}";
</script>
 
<!-- 加载框架运行库 -->
<script type="text/javascript" src="${jquery}/jquery.min.js"></script> 
<script type="text/javascript" src="${jquery}/bootstrap.min.js"></script>
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
<script type="text/javascript" src="${jquery}/jquery.jqGrid.min.js"></script>
<script type="text/javascript" src="${jquery}/myDatepicker.js"></script> 
<script type="text/javascript" src="${basejs}/dispunit.js?t=202002291732"></script>

<!-- 表达式函数列表 -->
<script type="text/javascript" src="${expressionjs}/functionList.js"></script>

<!-- 运行js表达式 -->
<script type="text/javascript" src="${expressionjs}/expressionRunner.js"></script>

<!-- 用户自定义扩展库 -->
<script type="text/javascript" src="${expressionjs}/expCommon.js"></script>
<script type="text/javascript" src="${expressionjs}/expMath.js"></script>

<!-- 图谱 -->
<script type="text/javascript" src="${basejs}/zlpNcpGrid.js"></script>
<script type="text/javascript" src="${basejs}/zlpNcpCard.js"></script>
<script type="text/javascript" src="${basejs}/zlpNGraph.js"></script> 
<script type="text/javascript" src="${basejs}/zlpNGraphCommon.js"></script> 
<script type="text/javascript" src="${echarts}/echarts.min.js"></script> 
 
<link rel="stylesheet" type="text/css" href="${jquery}/ui.jqgrid.css">
<link rel="stylesheet" type="text/css" href="${jquery}/jquery-ui-custom.css">
<link rel="stylesheet" type="text/css" href="${jquery}/ui.multiselect.css">
<link rel="stylesheet" type="text/css" href="${jquery}/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="${jquery}/bootstrap-theme.min.css">
<link rel="stylesheet" type="text/css" href="${css}/common.css"> 
<link rel="stylesheet" type="text/css" href="${css}/commonLR.css"> 
<%
	if(isMobile){
%>
<link rel="stylesheet" type="text/css" href="${css}/commonLRMobile.css"> 
<%		
	}
%>

<link rel="shortcut icon" type="image/x-icon" href="${images}/logo.ico">