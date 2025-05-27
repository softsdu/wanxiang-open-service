<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>主页</title>
	<link rel="stylesheet" type="text/css" href="./css/m_mainPage.css">
	<script type="text/javascript" src="./js/portalSetting.js"></script>
	<script type="text/javascript" src="../design/common/js/coreGrid.js"></script>
	<script type="text/javascript" src="../design/cds/js/cdsGrid.js"></script>
	<script type="text/javascript" src="./js/m_mainPage.js"></script>
	<script type="text/javascript">
		var portal = null;
		$(document).ready(function(){
			portal = new MainPortal();
			portal.init({
				portalSetting: portalSetting
			});
		});
	</script>
</head>
<body>
	<div class="outerContainer">
		<div class="sectionContainer leftContainer">
			<!-- 暂不显示
			<div class="blockContainer assetFunctionContainer">
				<div class="blockInnerContainer">
					<div class="blockHeader">
						<div class="blockTitle">资产管理</div>
					</div>
					<div class="blockItemContainer blockItemImageContainer">
					</div>
				</div>
			</div>
			-->
			<div class="blockContainer s3dModelContainer">
				<div class="blockInnerContainer">
					<div class="blockHeader">
						<div class="blockTitle">我的项目</div>
						<span class="blockHeaderMore" name="more"><a class="itemBtnLink">更多&nbsp;&#x00BB;</a></span>
					</div>
					<div class="blockItemContainer blockItemImageContainer">
					</div>
				</div>
			</div>
		</div>
		<div class="sectionContainer centerContainer">
			<div class="blockContainer s3dModuleContainer">
				<div class="blockInnerContainer">
					<div class="blockHeader">
						<div class="blockTitle">新建项目</div>
					</div>
					<div class="blockItemContainer blockItemImageContainer">
					</div>
				</div>
			</div>
		</div>
		<div class="sectionContainer rightContainer">
		</div>	 
	</div>	 
</body>
</html>