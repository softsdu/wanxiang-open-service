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
	<title>第一步:上传fbx/bin/assist文件</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">

	<link rel="stylesheet" type="text/css" href="${css}/common.css"> 
	<link rel="stylesheet" type="text/css" href="${uploadify}/uploadify.css">
	<link rel="stylesheet" type="text/css" href="${uploadify}/uploadifive.css">
	<script type="text/javascript" src="${uploadify}/swfobject.js"></script>
	<script type="text/javascript" src="${uploadify}/jquery.uploadify.min.js"></script>
	<script type="text/javascript" src="${uploadify}/jquery.uploadifive.js"></script>
	<link rel="stylesheet" type="text/css" href="css/create.css">
	<script type="text/javascript" src="js/uploadFbx.js"></script> 
</head>
<body>
	<div id="pageContentDiv" class="pageContent" style="height:100%;width:100%;background-color:#ffffff;text-align:center;"> 
		<div style="width:100%;position:relative;height:100%;margin:1px auto;">
 			<div style="position:absolute;left:100px;right:100px;height:100%;" id = "testGridContainer">
				<div class="createFileNavigator" id="createFileNavigatorId">
					<div class="createFileTitleDiv">
						<span class="createFileTitle">第一步: 选择文件</span> 
					</div>
					<div class="createFileStyleUpload">			
				        <div class="selectFileDiv">
				        	<input type="file" name="uploadify" id="selectFileBtnId" />
			        		<span class="selectFilePromptDiv">请选择要上传的fbx相关文件(例如fbx、assist文件，要求文件大小&lt;500M)</span>
			        	</div>		       	
						<div id="fileQueueDivId" style="max-height:260px;overflow-y:auto;"></div>
						<div class="selectErrorDiv" id="selectErrorDivId"></div>
						<div class="uploadFileBtnDiv" id="uploadFileBtnDivId">下一步</div>		        
					</div> 
				</div> 
			</div> 
		</div> 
	</div>  
</body>
</html>