<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>系统查询语句</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/sys_Sql.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_Sql.js"></script>
	<script type="text/javascript" src="${dataModel}/sys_SqlFieldType.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_SqlFieldType.js"></script>
	<script type="text/javascript" src="${sheetModel}/sql.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testSheetContainer";
			var sheetWin = new NcpMultiStyleSheetWin(initParam); 
			sheetWin.show();	
			var sheetCtrl = sheetWin.sheetCtrl;
			
			$("#generateJsBtn").click(function(){
				var mainCard = sheetCtrl.getMainCardCtrl();
			 	var idValue = mainCard.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有记录."});
			 	}
			 	else{
			 		mainCard.doOtherAction({
						actionName:"generateJs",
						customParam:{dataId: idValue},
						successFunc: function(obj){
							alert(cmnPcr.jsonToStr(obj));
						},
						failFunc:function(obj){
							alert(cmnPcr.jsonToStr(obj));
						}
					});
			 	}
			}); 
		});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testSheetContainer">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpCardToolbar">
			<a name="backBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-back'">返回</a> 
			<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a>
			<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">取消</a>  
		</span>
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false">  
		<div class="easyui-layout" data-options="fit:true" >
			<div data-options="region:'north',border:false">
				<table>
					<tr style="height:22px;">
						<td style="width:50px;height:22px;text-align:right;">名称</td>
						<td style="width:200px;height:22px;"><input type="text" name="name" class="easyui-validatebox" style="width:200px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">启用</td>
						<td style="width:100px;height:22px;"><input type="checkbox" name="isusing" style="width:100px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">类型</td>
						<td style="width:100px;height:22px;"><input type="text" name="sqltype" style="width:100px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">描述</td>
						<td style="width:100px;height:22px;"><input type="text" name="description" style="width:100px;" cardCtrl="true"></input></td> 
					</tr> 
					<tr style="height:80px;">
						<td style="text-align:right;">描述</td>
						<td colspan="7"><textarea name="sqlcontext" style="width:800px;height:80px;" cardCtrl="true"></textarea></td> 
					</tr> 
				</table>
			</div>			
			<div data-options="region:'center',border:false" class="ncpInnerContainer">
				<div class="easyui-tabs" data-options="fit:true,plain:true">
					<div title="显示区域" class="ncpCardTab">   
						<div class="easyui-layout" sheetPart="line" data-options="fit:true" id="testCardContainer2">
							<div data-options="region:'north',border:false" class="ncpGridToolbarContainer">	 
								<span class="ncpGridToolbar">
									<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'"></a>
									<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'"></a> 
								</span>	 
							</div>   
							<div data-options="region:'center',border:false" name="gridDiv" class="ncpGridDiv">   
								<table name="gridCtrl" ></table>  
							</div>
						</div>   
					</div>			
				</div>  
			</div>
		</div>
	</div>
</body>	 
</html>