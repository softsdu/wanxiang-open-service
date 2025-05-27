<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.zlp.platform.common.NcpSession" %>
<%@ page import="com.zlp.platform.dao.sys.ContextUtil" %>
<%@ include file="../base.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml"> 
<% 
	Cookie[] cookies = request.getCookies();
	NcpSession ncpSession = new NcpSession(cookies, true); 
	String userId = ncpSession.getUserId();
%> 
<head> 
	<title>上传附件</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	
	<!--  此页面保留easyui，左侧参数和函数树  added by liyh 20210201 -->
	<!--  去掉原来easyui的样式  added by ls 20220606
	<script type="text/javascript" src="./js/jquery.easyui.min.js"></script>
	<link rel="stylesheet" type="text/css" href="./css/easyui.css?timestamp='201905071412'">
	-->
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css"> 
	<link rel="stylesheet" type="text/css" href="${uploadify}/uploadify.css">
	<link rel="stylesheet" type="text/css" href="${uploadify}/uploadifive.css">
	<script type="text/javascript" src="${uploadify}/swfobject.js"></script>
	<script type="text/javascript" src="${uploadify}/jquery.uploadify.min.js"></script>
	<script type="text/javascript" src="${uploadify}/jquery.uploadifive.js"></script>
	<link rel="stylesheet" type="text/css" href="css/uploadFiles.css">
	<script type="text/javascript" src="js/uploadFiles.js"></script> 
	<script type="text/javascript" src="${dataModel}/d_Accessory.js"></script>
	<script type="text/javascript" src="${viewModel}/d_Accessory.js"></script>

	<!--  去掉原有样式  added by ls 20220606
	<style type="text/css">
		.panel-body{padding:0px;}
	</style>
	-->

</head>
<body>
	<!-- 更换样式 modified by ls 202203 -->
	<div style="position:absolute;width:250px;top:0px;left:0px;bottom:0px;">	
		<div class="uploadFilesStyleUpload">			
	        <div class="selectFilesDiv">
	        	<input type="file" name="uploadify" id="selectFilesBtnId" />
        		<span class="selectFilesPromptDiv">文件大小不能超过50M</span>
        	</div>		       	
			<div class="uploadFilesBtnDiv" id="uploadFilesBtnDivId">执行上传</div>	
			<div class="selectErrorDiv" id="selectErrorDivId"></div>
			<div id="fileQueueDivId" class="fileQueueDiv"></div>	        
		</div> 
	</div>
	<div style="position:absolute;top:0px;width:5px;left:250px;bottom:0px;">	
	</div>
	<div style="position:absolute;top:0px;right:0px;left:255px;bottom:0px;">		
		<div class="zlpGridStyleContainer" id="fileListGridContainerId">	
			<div class="zlpGridStyleInnerContainer">
				<div class="zlpToolbarContainer">
					<div class="zlpToolbarLeftContainer">  
						<div class="zlpToolbarQueryContainer">
							<input type="text" class="zlpToolbarQueryInputText" placeholder="请输入关键字" />
							<a name="queryBtn" href="#" class="zlpToolbarQueryBtn">查询</a>
						</div>
					</div> 
				</div>
				<div class="zlpGridContainer" name="gridDiv" style="bottom:5px;">
					<table name="gridCtrl" class="zlpGridTable"></table>
				</div>
				<div class="zlpBottomContainer" style="top:0px;bottom:auto;left:150px;">
					<ul class="zlpNavUl pagination" style="margin-top: 5px;"> 
					</ul> 
				</div>
			</div>
		</div>
	</div>
</body>
</html>