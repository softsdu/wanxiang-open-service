<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>Data模型</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	
	<script type="text/javascript" src="${dataModel}/sys_Data.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_Data.js"></script>
	<script type="text/javascript" src="${dataModel}/sys_DataField.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_DataField.js"></script>
	<script type="text/javascript" src="${dataModel}/sys_DataFieldMap.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_DataFieldMap.js"></script>
	<script type="text/javascript" src="${dataModel}/sys_DataEventExpression.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_DataEventExpression.js"></script>
	<script type="text/javascript" src="${sheetModel}/data.js"></script>
	<script type="text/javascript" src="js/dataModelAutoEdit.js"></script> 
</head>
<body id="testSheetContainer">
	<div class="zlpCardStyleContainer">
		<div class="zlpCardStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer"> 
					<a name="backBtn" href="#" class="zlpToolbarBtn backBtn">切换</a>  
					<a name="addBtn" href="#" class="zlpToolbarBtn addBtn">新建</a>  
					<a name="editBtn" href="#" class="zlpToolbarBtn editBtn">编辑</a>  
					<a name="saveBtn" href="#" class="zlpToolbarBtn saveBtn">保存</a>
					<a name="cancelBtn" href="#" class="zlpToolbarBtn cancelBtn">取消</a>
					<a href="#" id="updateDBStrucureBtn" class="zlpToolbarBtn">更新表结构</a>  
					<a href="#" id="generateJsBtn" class="zlpToolbarBtn">生成JS模型</a>
				</div> 
			</div>
			<div class="zlpCardContainer" name="cardDiv">
				<div class="zlpCardMainContainer">
					<table class="zlpCardMainTable">
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:80px;">名称</td>
							<td class="zlpDispUnitValue" style="width:120px;"><input type="text" name="name" class="zlpDispUnitInput" style="width:120px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:80px;">启用</td>
							<td class="zlpDispUnitValue" style="width:30px;"><input type="checkbox" name="isusing" class="zlpDispUnitInput" style="width:30px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:80px;">主键字段</td>
							<td class="zlpDispUnitValue" style="width:60px;"><input type="text" name="idfieldname" class="zlpDispUnitInput" style="width:60px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:80px;">源类型</td>
							<td class="zlpDispUnitValue" style="width:60px"><input type="text" name="dstype" class="zlpDispUnitInput" style="width:60px;" cardCtrl="true"></input></td> 
							<td class="zlpDispUnitTitle" style="width:80px;">目标类型</td>
							<td class="zlpDispUnitValue" style="width:120px;"><input type="text" name="savetype" class="zlpDispUnitInput" style="width:120px;" cardCtrl="true"></input></td> 
							<td class="zlpDispUnitTitle" style="width:80px;">目标名称</td>
							<td class="zlpDispUnitValue" style="width:120px;"><input type="text" name="savedest" class="zlpDispUnitInput" style="width:120px;" cardCtrl="true"></input></td> 
							<td class="zlpDispUnitTitle" style="width:80px;">所属模块</td>
							<td class="zlpDispUnitValue" style="width:120px;"><input type="text" name="sysmodule" class="zlpDispUnitInput" style="width:120px;" cardCtrl="true"></input></td> 
						</tr>				
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" >描述</td>
							<td class="zlpDispUnitValue" colspan="13"><input type="text" name="description" class="zlpDispUnitInput" style="width:1110px;" cardCtrl="true"></input></td> 
						</tr>
						<tr style="height:85px;">
							<td class="zlpDispUnitTitle" >源表达式</td>
							<td class="zlpDispUnitValue" colspan="13" ><textarea  name="dsexp" class="zlpDispUnitInput" style="width:1110px;height:80px;" cardCtrl="true"></textarea></td> 
						</tr> 
					</table>
				</div>
				<div class="zlpCardDetailContainer">
					<ul class="nav nav-tabs zlpCardDetailTabbar">
						<li class="active"><a href="#">字段</a></li>
						<li><a href="#">其它</a></li>
					</ul>
					<div class="zlpCardDetailGridContainer zlpCardDetailGridContainerActive" sheetPart="line" > 
						<div class="zlpToolbarContainer zlpToolbarContainerGrid">
							<div class="zlpToolbarLeftContainer"> 
								<a name="addBtn" href="#" class="zlpToolbarBtn addBtn">新建</a>   
								<a name="deleteBtn" href="#" class="zlpToolbarBtn deleteBtn">删除</a> 
								<ul class="nav nav-tabs" style="border-bottom-width: 0px;margin-top:5px;">
									<li class="dropdown" class="active">
										<a id="autoAddFieldModelBtnMainId" class="dropdown-toggle" data-toggle="dropdown" href="#" style="padding:5px;margin-left:5px;margin-right:5px;background-color:#F0AD4E;color:#ffffff;">
											添加常用字段 <span class="caret"></span>
										</a>
										<ul id="autoAddFieldModelSubBtnContainerId" class="dropdown-menu" >
										</ul>
									</li> 
								</ul>
							</div> 
						</div>
						<div class="zlpSubGridContainer" name="gridDiv">
							<table name="gridCtrl" class="zlpGridTable"></table>
						</div>
					</div>
					<div class="zlpCardDetailGridContainer" sheetPart="lineline">
						<div class="zlpToolbarContainer zlpToolbarContainerGrid">
							<div class="zlpToolbarLeftContainer"> 
								<a name="addBtn" href="#" class="zlpToolbarBtn addBtn">新建</a>   
								<a name="deleteBtn" href="#" class="zlpToolbarBtn deleteBtn">删除</a>
							</div> 
						</div>
						<div class="zlpSubGridContainer" name="gridDiv">
							<table name="gridCtrl" class="zlpGridTable"></table>
						</div>				
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>