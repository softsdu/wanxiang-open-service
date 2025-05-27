<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>Tree模型</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/sys_Tree.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_Tree.js"></script>
	
	<script> 
		$(document).ready(function(){ 			
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testCardContainer";
			var cardWin = new NcpMultiStyleCardWin(initParam); 
			cardWin.show();	
			var cardCtrl = cardWin.cardCtrl;
			
			$("#generateJsBtn").click(function(){
			 	var idValue = cardCtrl.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有记录."});
			 	}
			 	else{
			 		cardCtrl.doOtherAction({
						actionName:"generateJs",
						customParam:{treeId: idValue},
						successFunc: function(obj){ 
							if(obj.result.succeed == "true"){
								alert( "生成JS模型成功.");
							}
							else{
								var errors = obj.result.errors;
								var errorStr = cmnPcr.arrayToString(errors, "\r\n");							
								alert("提示:\r\n" + errorStr);								
							}
						},
						failFunc:function(obj){
							alert("生成JS模型失败.\r\n" + obj.code + ": " + obj.message);
						}
					});
			 	}
			});
			
			$("#generatePageBtn").click(function(){
			 	var idValue = cardCtrl.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有记录."});
			 	}
			 	else{
			 		cardCtrl.doOtherAction({
						actionName:"generatePage",
						customParam:{treeId: idValue},
						successFunc: function(obj){ 
							if(obj.result.succeed == "true"){
								alert( "生成JSP页面成功.");
							}
							else{
								var errors = obj.result.errors;
								var errorStr = cmnPcr.arrayToString(errors, "\r\n");							
								alert("提示:\r\n" + errorStr);								
							}
						},
						failFunc:function(obj){
							alert("生成JSP页面失败.\r\n" + obj.code + ": " + obj.message);
						}
					});
			 	}
			});
	});  
	</script>
</head>  
<body id="testCardContainer">
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
							<td class="zlpDispUnitValue" style="width:200px;"><input type="text" name="name" class="zlpDispUnitInput" style="width:150px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">标题</td>
							<td class="zlpDispUnitValue" style="width:200px;"><input type="text" name="title" class="zlpDispUnitInput" style="width:150px;" cardCtrl="true"></input></td> 
						</tr>  
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">View</td>
							<td class="zlpDispUnitValue" style="width:200px;"><input type="text" name="viewname" class="zlpDispUnitInput" style="width:150px;" cardCtrl="true"></input></td> 
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">Label字段</td>
							<td class="zlpDispUnitValue" style="width:200px;"><input type="text" name="labelfield" class="zlpDispUnitInput" style="width:150px;" cardCtrl="true"></input></td>
						</tr>   
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">关联字段</td>
							<td class="zlpDispUnitValue" style="width:200px;"><input type="text" name="parentpointerfield" class="zlpDispUnitInput" style="width:150px;" cardCtrl="true"></input></td> 
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">叶节点字段</td>
							<td class="zlpDispUnitValue" style="width:200px;"><input type="text" name="isleaffield" class="zlpDispUnitInput" style="width:150px;" cardCtrl="true"></input></td>
						</tr>   
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">排序字段</td>
							<td class="zlpDispUnitValue" style="width:200px;"><input type="text" name="sortfield" class="zlpDispUnitInput" style="width:150px;" cardCtrl="true"></input></td> 
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">所属模块</td>
							<td class="zlpDispUnitValue" style="width:200px;"><input type="text" name="sysmodule" class="zlpDispUnitInput" style="width:150px;" cardCtrl="true"></input></td>
						</tr>   
					</table>
				</div> 
			</div>
		</div>
	</div>
</body>
<body class="easyui-layout" style="width:100%;height:100%;" id = "testCardContainer">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpCardToolbar">
			<a name="backBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-back'">返回</a> 
			<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a>
			<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">取消</a>
			<a href="#" id="generateJsBtn" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-enable'">生成JS模型</a>  
			<a href="#" id="generatePageBtn" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-enable'">生成JSP页面</a>
		</span>
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false" > 
		<table>
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">名称</td>
				<td style="width:200px;height:22px;"><input type="text" name="name" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:100px;text-align:right;">标题</td>
				<td style="width:200px;height:22px;"><input type="text" name="title" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
			</tr>  
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">View</td>
				<td style="width:200px;height:22px;"><input type="text" name="viewname" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
				<td style="width:100px;text-align:right;">Label字段</td>
				<td style="width:200px;height:22px;"><input type="text" name="labelfield" style="width:150px;height:22px;" cardCtrl="true"></input></td>
			</tr>   
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">关联字段</td>
				<td style="width:200px;height:22px;"><input type="text" name="parentpointerfield" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
				<td style="width:100px;text-align:right;">叶节点字段</td>
				<td style="width:200px;height:22px;"><input type="text" name="isleaffield" style="width:150px;height:22px;" cardCtrl="true"></input></td>
			</tr>   
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">排序字段</td>
				<td style="width:200px;height:22px;"><input type="text" name="sortfield" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
				<td style="width:100px;text-align:right;">所属模块</td>
				<td style="width:200px;height:22px;"><input type="text" name="sysmodule" style="width:150px;height:22px;" cardCtrl="true"></input></td>
			</tr>   
		</table>   
	</div> 
</body>	 
</html>