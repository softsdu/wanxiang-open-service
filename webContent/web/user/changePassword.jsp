<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>修改密码</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<style>
		.titleTd{
			width:150px;
			text-align:right;
			height:30px;
			line-height: 30px;
		}
		.inputTd{
			width:200px;
			text-align:left;
		}
		.passwordInput{
			color: #000000;
			width:150px;
			height:30px;
			line-height: 30px;
		}
		.changePasswordBtnContainer{
			width:100px;
			height:35px;
			border:solid 1px #dddddd;
			line-height:35px;
			text-align:center;
			background-color:#CCCCCC;
			color:#222222;
			border-radius: 5px;
		}
		.changePasswordBtn{
			width:100%;
			height:100%;
			display:block;
			text-decoration:none;
			cursor: pointer;
		}
		.changePasswordBtnContainer:hover{
			color: #000000;
			background-color:#f2f2f2;
			text-decoration:none;
		}
	</style>
	<script> 
		 
		function changePasswordOnServer(oldpassword, newpassword){
			var serverAccess = new ServerAccess();
			var requestParam ={
					serviceName:"userNcpService",
					waitingBarParentId : "bobyId",
					funcName : "changePassword",
					successFunc : function(obj){ 
						var info = obj.result.info; 
						alert(info);
                        parent.location.href = "${base}"+"/web/user/login.html";
					},
					args : {requestParam:cmnPcr.jsonToStr({
						oldpassword: oldpassword,
						newpassword: newpassword
					})}
				};
			serverAccess.request(requestParam); 
		}
	
		//获取预览数据
		$(document).ready(function(){
			$("#changePasswordBtn").click(function(){
				var oldpassword = $("#oldpasswordTextboxId").val();
				var newpassword = $("#newpasswordTextboxId").val();
				var confirmpassword = $("#confirmpasswordTextboxId").val();
				
				if(oldpassword == "" || newpassword == "" || confirmpassword == ""){
					alert("请输入完整，密码不允许为空!");
				}
				else if(newpassword != confirmpassword){
					alert("新密码两次输入不同!");
				}
				else{
					changePasswordOnServer(oldpassword, newpassword);
				}
			});
			return false;
		});
	</script>
</head>  
<body id="bodyId" style="text-align:center;">
	<table style="width:100%;height:100%;font-size:15px;" cellspacing="0" cellpadding="0">
		<tr style="height:50px;">
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:50px;">
			<td>&nbsp;</td> 
			<td colspan="2" style="font-size:18px;font-weight:800;border-bottom:solid 1px #555555;letter-spacing:1px;">修改密码</td>
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:10px;">
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:35px;">
			<td>&nbsp;</td> 
			<td class="titleTd">原密码：</td>
			<td class="inputTd"><input id="oldpasswordTextboxId" class="passwordInput" type="password" /></td>
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:35px;">
			<td>&nbsp;</td> 
			<td class="titleTd">新密码：</td>
			<td class="inputTd"><input id="newpasswordTextboxId" class="passwordInput" type="password" /></td>
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:35px;">
			<td>&nbsp;</td> 
			<td class="titleTd">确认新密码：</td>
			<td class="inputTd"><input id="confirmpasswordTextboxId" class="passwordInput" type="password" /></td>
			<td>&nbsp;</td> 
		</tr> 
		<tr style="height:5px;">
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:5px;">
			<td>&nbsp;</td> 
			<td colspan="2" style="font-size:15px;font-weight:800;border-top:solid 1px #555555;text-align:center;">&nbsp;</td>
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:35px;">
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td style="font-size:15px;font-weight:800;text-align:center;">
				<div class="changePasswordBtnContainer">
					<div id="changePasswordBtn" class="changePasswordBtn">提&nbsp;&nbsp;交</div>
				</div>
			</td> 
			<td>&nbsp;</td> 
		</tr>
		<tr>
			<td>&nbsp;</td> 			
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
		</tr>
	</table> 
</body>	 
</html>