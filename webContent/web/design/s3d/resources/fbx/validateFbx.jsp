<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.zlp.platform.common.NcpSession" %>
<%@ page import="com.zlp.platform.dao.sys.ContextUtil" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<% 
	NcpSession ncpSession = new NcpSession(request.getCookies(), true);
	String userId = ncpSession.getUserId();
%>
<head>
	<title>第二步: 确认解析Fbx相关文件</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage">
	<script type="importmap">
		{
			"imports": {
				"three": "../../common/js/threejs/build/three.module.js",
				"three/addons/": "../../common/js/threejs/examples/jsm/",
				"common/js/":"../../common/js/"
			}
		}
	</script>
	<%@ include file="../../../../base.jsp" %>
	<%@ include file="../../../../design/common/commonDesignJs.jsp" %>
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="css/create.css">
	<script type="module">
		import FbxValidator from "./js/validateFbx.js";
		var fbxValidator = null;
		$(document).ready(function(){

			let parentWinAccessoryIdStr = window.parent.uploadFbxInfo.ids;

			let args = cmnPcr.getQueryStringArgs();
			let accessoryIds = args["aids"];
			let fbxName = args["fbx"];
			let assistName = args["assist"];
			if(!parentWinAccessoryIdStr.startWith(accessoryIds)){
				msgBox.alert({info: "错误的AccessoryIds"});
			}
			else {
				fbxValidator = new FbxValidator();
				fbxValidator.init({
					previewContainerId: "filePreviewId",
					endImportFbxBtnId: "endImportFbxBtnId",
					accessoryIds: parentWinAccessoryIdStr,
					fbxName: fbxName,
					assistName: assistName
				});
			}
		});
		</script>
</head>
<body>
	<div id="pageContentDiv" class="pageContent" style="height:100%;width:100%;background-color:#ffffff;text-align:center;">
		<div style="width:100%;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;left:100px;right:100px;height:100%;" id = "testGridContainer">
				<div class="createFileNavigator" id="createFileNavigatorId">
					<div class="createFileTitleDiv">
						<span class="createFileTitle">第二步: 预览</span>
					</div>
					<div class="fileInfoContainerDiv" id="fileInfoContainerDivId">
						<div class="processStatusDiv">正在加载预览内容</div>
					</div>
					<div class="endImportFbxBtn" id="endImportFbxBtnId">下一步</div>	
					<div id="filePreviewId" class="filePreview">
					
					</div>	
				</div>
			</div>
		</div>
	</div>
</body>
</html>