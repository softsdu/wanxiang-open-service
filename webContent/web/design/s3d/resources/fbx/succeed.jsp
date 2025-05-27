<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.zlp.platform.common.NcpSession" %>
<%@ page import="com.zlp.platform.dao.sys.ContextUtil" %>
<%@ include file="../../../../base.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<% 
	NcpSession ncpSession = new NcpSession(request.getCookies(), true);
	String userId = ncpSession.getUserId();
%>
<head>
	<title>第三步: 导入成功</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage">
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="css/create.css">
</head>
<body>
	<div id="pageContentDiv" class="pageContent" style="height:100%;width:100%;background-color:#ffffff;text-align:center;">
		<div style="width:100%;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;left:100px;right:100px;height:100%;" id = "testGridContainer">
				<div class="createFileNavigator" id="createFileNavigatorId">
					<div class="createFileTitleDiv">
						<span class="createFileTitle">第三步: 导入成功</span>
						<a class="createFileBackToBegin" href="importFbx.jsp">返回到第一步</a>
					</div>
					<div class="fileInfoContainerDiv" id="fileInfoContainerDivId">
						<div class="processStatusDiv">已完成导入!</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>