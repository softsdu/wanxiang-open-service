<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>菜单</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/sys_Menu.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_Menu.js"></script>
	<script type="text/javascript" src="${treeModel}/menu.js"></script>
	<style>
		.zlpCardStyleContainer{
			border-top: solid 1px #505050;
		}
		.zlpToolbarContainer{
			border-top: solid 1px #505050;
		}
		.zlpCardContainer{
			top: 0px;
			bottom: auto;
		}
		.zlpToolbarContainer{
			top: auto;
			bottom: 0px;
		}
		.zlpToolbarBtn{
			float: right;
		}
		.zlpToolbarLeftContainer{
			top: 5px;
		}
		.zlpCardMainContainer{
			top: 5px;
		}
	</style>
	
	<script>  
	$(document).ready(function(){
		var initParam = window.parent.treeCardInitParam; 
		initParam.containerId = "testCardContainer";
		var treeCard = new NcpTreeCard(initParam);
		treeCard.show(); 
	}); 
	</script>
</head>  
<body id="testCardContainer">
	<div class="zlpCardStyleContainer">
		<div class="zlpCardStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer">   
					<a name="saveBtn" href="#" class="zlpToolbarBtn saveBtn">保存</a>
				</div>
			</div> 
			<div class="zlpCardContainer" name="cardDiv">
				<div class="zlpCardMainContainer">
					<table class="zlpCardMainTable">
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">编码</td>
							<td class="zlpDispUnitValue" style="width:150px;"><input type="text" name="code" class="zlpDispUnitInput"  style="width:150px;" cardCtrl="true"></input></td> 
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">名称</td>
							<td class="zlpDispUnitValue" style="width:150px;"><input type="text" name="name" class="zlpDispUnitInput"  style="width:150px;" cardCtrl="true"></input></td>
						</tr>  
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">描述</td>
							<td class="zlpDispUnitValue" style="width:150px;"><input type="text" name="description" class="zlpDispUnitInput"  style="width:150px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">图标名</td>
							<td class="zlpDispUnitValue" style="width:150px;"><input type="text" name="icon" class="zlpDispUnitInput"  style="width:150px;" cardCtrl="true"></input></td>
						</tr>    
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">已启用</td>
							<td class="zlpDispUnitValue" style="width:150px;"><input type="checkbox" name="isdefaultenable" class="zlpDispUnitInput"  style="width:150px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">隐藏</td>
							<td class="zlpDispUnitValue" style="width:150px;"><input type="checkbox" name="ishidden" class="zlpDispUnitInput"  style="width:150px;" cardCtrl="true"></input></td>
						</tr>   
						<tr style="height:65px;">
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">执行表达式</td>
							<td class="zlpDispUnitValue" colspan="3"><textarea name="actionexp" class="zlpDispUnitInput"  style="width:380px;height:60px" cardCtrl="true"></textarea></td> 
						</tr>    
						<tr style="height:65px;">
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">页面地址</td>
							<td class="zlpDispUnitValue" colspan="3"><textarea name="pageurl" class="zlpDispUnitInput"  style="width:380px;height:60px" cardCtrl="true"></textarea></td> 
						</tr>  
					</table>
				</div> 
			</div>
		</div>
	</div>
</body>
</html>