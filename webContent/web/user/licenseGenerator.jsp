<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>

<html>
<head>
	<title>生成授权码</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<script type="text/javascript" src="js/licenseGenerator.js"></script>

</head>
<body>
	<p style="padding-left:20px;font-weight:600;">publicKey</p>
	<p style="padding-left:60px;"><input id="publicKeyId" type="input" style="width:1000px;" /></p>
	<p style="padding-left:20px;font-weight:600;">Sys Info</p>
	<p style="padding-left:60px;"><input id="sysInfoId" type="input" style="width:1000px;" /></p>  
	<p style="padding-left:20px;font-weight:600;">License Type</p> 
	<p style="padding-left:60px;"><input id="licenseTypeId" type="input" style="width:1000px;" /></p> 
	<p style="padding-left:60px;"><input id="generateLicenseSNId" type="button" style="width:200px;" value="Generate License SN" /></p> 
	<p style="padding-left:20px;font-weight:600;">LicenseSN</p>
	<p style="padding-left:60px;" id="licenseSNId"></p>
</body>
</html>