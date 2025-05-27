<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>View模型</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	
	<script type="text/javascript" src="${dataModel}/sys_View.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_View.js"></script>
	<script type="text/javascript" src="${dataModel}/sys_ViewDispunit.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_ViewDispunit.js"></script>
	<script type="text/javascript" src="${sheetModel}/view.js"></script>
	<script type="text/javascript" src="js/viewModelAutoEdit.js"></script> 
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
					<a href="#" id="generatePageBtn" class="zlpToolbarBtn">生成JSP页面</a>  
					<a href="#" id="generateJsBtn" class="zlpToolbarBtn">生成JS模型</a>
				</div> 
			</div>
			<div class="zlpCardContainer" name="cardDiv">
				<div class="zlpCardMainContainer">
					<table class="zlpCardMainTable">
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">名称</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="name" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">标题</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="title" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td> 
						</tr>
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">数据模型</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="dataname" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td> 
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">所属模块</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="sysmodule" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td> 
						</tr>
					</table>
				</div>
				<div class="zlpCardDetailContainer">
					<ul class="nav nav-tabs zlpCardDetailTabbar">
						<li class="active"><a href="#">显示区域</a></li>
					</ul>
					<div class="zlpCardDetailGridContainer zlpCardDetailGridContainerActive" sheetPart="line" > 
						<div class="zlpToolbarContainer zlpToolbarContainerGrid">
							<div class="zlpToolbarLeftContainer"> 
								<a name="addBtn" href="#" class="zlpToolbarBtn addBtn">新建</a>   
								<a name="deleteBtn" href="#" class="zlpToolbarBtn deleteBtn">删除</a> 
								<a id="multiAddDispUnitBtnId" name="multiAddDispUnitBtn" href="#" class="zlpToolbarBtn">批量添加</a> 
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