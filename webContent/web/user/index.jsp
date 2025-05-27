<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>${alertTitle}</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	 
 
	<link rel="stylesheet" type="text/css" href="${css}/index/m_index${sysNameStylePath}.css?t=202002291732">
	<script type="text/javascript" src="js/m_index.js?t=202002291732"></script>
</head>
<body>
	<div class="indexPageHeaderContainer" >		
		<div class="indexPageHeaderInnerContainer" > 
		    <div class="indexPageHeaderLeftContainer" href="#">
        		<div class="indexPageHeaderImage"></div> 	
		    </div>
	        <div class="indexPageHeaderRightContainer">  
	            <div class="indexPageAllMenuBtn" id="indexPageAllMenuBtnId">☰</div>  
		    </div> 
		</div>	
	</div>	
    <div class="indexPageHeaderCenterContainer" id="mainMenuContainerId"> 
    	<div class="indexPageHeaderCenterContainerBackground"></div>
    	<div class="indexPageHeaderMainMenuContainer"></div>
		<div class="indexPageHMenuContainer" >
			<div class="indexPageHMenuInnerContainer" id="indexPageHMenuInnerContainerId"> 
			</div>
		</div>
		<div class="indexPageCloseMenuBtn"><div  style="height: 30px;margin-top: 10px;background-image: url('../../images/index/closeMenu.webp')"></div></div>
    </div>	 
	<div class="indexPageMainContainer" >
		<div class="indexPageMainInnerContainer" id="mainTabContainerId">
	  		<div class="indexPageTabPageHeader">
	  			<div class="indexPageTabPageImage"></div>
	  			<div class="indexPageTabPageTitle" id="indexPageTabPageTitleId"></div>
	  			<div class="indexPageTabPageTabCloseBtn" id="indexPageTabPageTabCloseBtnId" title="关闭当前窗口"></div>
	  			<div class="indexPageTabPageTabListBtn" id="indexPageTabPageTabListBtnId" title="已打开的窗口"></div>
	  		</div>
		  	<div class="indexPageTabPageContainer" id="indexPageTabPageContainerId"> 
		  	</div>
		</div>	
	</div>	
	<div class="indexPageFooterContainer" >		
		<div class="indexPageFooterInnerContainer">
		  	 <div class="indexPageFooterLine">
		  	 	<span class="sysParamUserInfoContainer">当前用户：<span id="sysParamUserInfoId"></span></span>
		  	 </div>
		</div>	
	</div>	
	<div class="indexPageTabHelperContainer" id="indexPageTabHelperContainerId">
		<div class="indexPageTabHelperBack"></div>	
		<div class="indexPageTabHelper"></div>	
	</div>
</body>
</html>