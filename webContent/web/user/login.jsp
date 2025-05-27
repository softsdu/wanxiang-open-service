<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html>
<head>
	<title>${alertTitle}</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	 
 
	<link rel="stylesheet" type="text/css" href="${css}/login/login.css">
	<script type="text/javascript" src="js/login.js"></script>

</head>
<body>
	<div class="pageGroundContainer">		
		<div class="pageBackground"></div>
		<div class="pageForeground"></div>
	</div>
	<div class="loginContainer">
		<div class="loginBackground"></div>
		<div class="loginInnerContainer">
			<div class="loginLogo"></div>
			<div class="loginTitle">用户登录</div>
			<div class="loginInputContainer loginUsernameContainer">
				<input id="userCodeText" type="text" name="user"  class="loginInput loginUsername" placeholder="请输入用户名" />
			</div>
			<div class="loginInputContainer loginPasswordContainer">		
				<input id="userPasswordText" type="password" name="pass"  class="loginInput loginPassword" placeholder="请输入密码" />
			</div>
			<div class="loginRemember">
				<label>
					<input id="remember" class="loginRememberCheckbox" type="checkbox" onclick="rememberUser()" checked="false">
					<span class="loginRememberLabel">记住账号</span> 
				</label>
			</div>
			<div class="loginInputContainer loginSubmitBtnContainer">
				<input type="button" id="loginBtn" type="button" class="loginBtn" value="登    录" />
			</div>
			<div class="loginBottomLine">
				<a id="regBtn" class="loginBottomLink">注册</a>
				<span class="loginBottomSpliter">|</span>
				<a id="helpDocBtn" class="loginBottomLink">帮助文档</a>
				<span class="loginBottomSpliter">|</span>
				<a id="contactBtn" class="loginBottomLink">产研合作</a>
			</div>
		</div>
	</div>
	<div class="sloganContainer">
		<div class="sloganPartA">Tada3D</div>
		<div class="sloganPartB">Models & Open Source</div>
	</div>
	<div class="copyrightContainer">
		<span class="copyrightText">Tada3D&trade;&nbsp;&nbsp;山东大学软件学院</span>
	</div>
</body>
</html>