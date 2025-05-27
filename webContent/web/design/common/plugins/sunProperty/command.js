import SunCalc from "./suncalc.js";
import DistrictList from "./districtList.js";

//日照分析
js3CommandProcessors["sunProperty"] = {
	toStatus: "normal",
	icon: "/images/sunProperty.png",
	hasSun: false,
	editor: null,
	run: function(p){ 
		var editor = p.editor;
		var tab = $("#" + editor.containerId).find(".core3dTabTitle[name='sunPropertyList']")[0];
		editor.setTabVisible(tab, true);
	},
	changeSunStatus: function(hasSun){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var editor = cmdJson.editor; 
		if(hasSun){
			cmdJson.onChangeDateTime();	
			
			//打开日照
			editor.mainLight.castShadow = true;
			cmdJson.hasSun = true;		
		}
		else{
			//关闭日照
			editor.mainLight.castShadow = false;
			cmdJson.hasSun = false;
		}
	},
	//初始化日照相关的UI界面及事件
	init: function(p){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var editor = p.editor;
		cmdJson.editor = editor;
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var currentTime = new Date();
		var dateTimeValues = cmdJson.getDateTimeValues(currentTime);
		cmdJson.initSunStatus(editor);
		cmdJson.initYearList(editor);
		cmdJson.initMonthList(editor);
		cmdJson.initDayList(editor, dateTimeValues.year, dateTimeValues.month);
		cmdJson.initHourList(editor);
		cmdJson.initMinuteList(editor);
		cmdJson.initSecondList(editor);
		cmdJson.initTimeSlider(editor);
		cmdJson.setDateTime(editor, dateTimeValues);

		cmdJson.initProvinceList(editor);
		cmdJson.refreshCityList(editor);
		cmdJson.refreshRegionList(editor);
		cmdJson.refreshLngLat(editor);
		cmdJson.refreshSunTimes();
		var progressValue = cmdJson.calcProgressValue();
		cmdJson.setSliderValue(progressValue);
		
		//日光状态改变
		$(sunUIContainer).find(".propertyInput[name='sunStatus']").change(function(){
			var cmdJson = js3CommandProcessors["sunProperty"];
			var sunStatus = $(sunUIContainer).find(".propertyInput[name='sunStatus']").val();
			switch(sunStatus){
				case "on":{
					cmdJson.changeSunStatus(true);
					break;
				}
				case "off":{
					cmdJson.changeSunStatus(false);
					break;
				}
				default:{
					break;
				}
			}
		});

		//year、month改变，引起day列表的改变
		$(sunUIContainer).find(".propertyInput[name='sunDateYear']").change(function(){
			var cmdJson = js3CommandProcessors["sunProperty"];
			cmdJson.changeDayList();
			cmdJson.refreshSunTimes();
		});
		$(sunUIContainer).find(".propertyInput[name='sunDateMonth']").change(function(){
			var cmdJson = js3CommandProcessors["sunProperty"];
			cmdJson.changeDayList();
			cmdJson.refreshSunTimes();
		});
		$(sunUIContainer).find(".propertyInput[name='sunDateDay']").change(function(){
			var cmdJson = js3CommandProcessors["sunProperty"];
			cmdJson.refreshSunTimes();
		});
		
		$(sunUIContainer).find(".sunDateTimeInput").change(function(){
			var cmdJson = js3CommandProcessors["sunProperty"];
			cmdJson.onChangeDateTime();
			var progressValue = cmdJson.calcProgressValue();
			cmdJson.setSliderValue(progressValue);
		});		

		//省市变化
		$(sunUIContainer).find(".propertyInput[name='locationProvince']").change(function(){
			var cmdJson = js3CommandProcessors["sunProperty"];
			var editor = cmdJson.editor;
			cmdJson.refreshCityList(editor);
			cmdJson.refreshRegionList(editor);
			cmdJson.refreshLngLat(editor);
			cmdJson.onChangeDateTime();
			cmdJson.refreshSunTimes();
			var progressValue = cmdJson.calcProgressValue();
			cmdJson.setSliderValue(progressValue);
		});
		$(sunUIContainer).find(".propertyInput[name='locationCity']").change(function(){
			var cmdJson = js3CommandProcessors["sunProperty"];
			var editor = cmdJson.editor;
			cmdJson.refreshRegionList(editor);
			cmdJson.refreshLngLat(editor);
			cmdJson.onChangeDateTime();
			cmdJson.refreshSunTimes();
			var progressValue = cmdJson.calcProgressValue();
			cmdJson.setSliderValue(progressValue);
		});
		$(sunUIContainer).find(".propertyInput[name='locationRegion']").change(function(){
			var cmdJson = js3CommandProcessors["sunProperty"];
			var editor = cmdJson.editor;
			cmdJson.refreshLngLat(editor);
			cmdJson.onChangeDateTime();
			cmdJson.refreshSunTimes();
			var progressValue = cmdJson.calcProgressValue();
			cmdJson.setSliderValue(progressValue);
		});
	},
	onChangeDateTime: function(){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var editor = cmdJson.editor;
		var dateTimeValues = cmdJson.getInputDateTimeValues();
		var lngLatValues = cmdJson.getInputLngLatValues();
		var dateTime = new Date(dateTimeValues.year, dateTimeValues.month - 1, dateTimeValues.day, dateTimeValues.hour, dateTimeValues.minute, dateTimeValues.second);
				
		//计算太阳位置
		var sunPosition = SunCalc.getPosition(dateTime, lngLatValues.lat, lngLatValues.lng);
		var sunAltitude = sunPosition.altitude * (180 / Math.PI);
		var sunAzimuth = sunPosition.azimuth * (180 / Math.PI);
		var theta = (90 - sunAltitude) * (Math.PI / 180);
		var phi = (-sunAzimuth + 180) * (Math.PI / 180); // 考虑太阳在地平线以下的情况
		var x = 200 * Math.sin(theta) * Math.cos(phi);
		var y = 200 * Math.cos(theta);
		var z = 200 * Math.sin(theta) * Math.sin(phi);
		
		editor.mainLight.position.set(-z, y, -x);
		
	},
	refreshSunTimes: function(){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var editor = cmdJson.editor;
		var dateTimeValues = cmdJson.getInputDateTimeValues();
		var lngLatValues = cmdJson.getInputLngLatValues();
		var dateTime = new Date(dateTimeValues.year, dateTimeValues.month - 1, dateTimeValues.day, dateTimeValues.hour, dateTimeValues.minute, dateTimeValues.second);
		var sunTimes = SunCalc.getTimes(dateTime, lngLatValues.lat, lngLatValues.lng);
		
		//刷新
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var dateTimeFormat = "HH:mm:ss";
		$(sunUIContainer).find(".propertyValue[name='sunDawnTime']").text(cmnPcr.datetimeToStr(sunTimes.dawn, dateTimeFormat));
		$(sunUIContainer).find(".propertyValue[name='sunRiseTime']").text(cmnPcr.datetimeToStr(sunTimes.sunrise, dateTimeFormat));
		$(sunUIContainer).find(".propertyValue[name='sunSetTime']").text(cmnPcr.datetimeToStr(sunTimes.sunset, dateTimeFormat));
		$(sunUIContainer).find(".propertyValue[name='sunDuskTime']").text(cmnPcr.datetimeToStr(sunTimes.dusk, dateTimeFormat));
		$(sunUIContainer).find(".propertyValue[name='sunNightTime']").text(cmnPcr.datetimeToStr(sunTimes.night, dateTimeFormat));
	},
	getInputLngLatValues: function(){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var editor = cmdJson.editor;
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var lng = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyValue[name='locationLng']").text());
		var lat = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyValue[name='locationLat']").text());
		return {
			lng: lng,
			lat: lat
		}
	},
	getInputDateTimeValues: function(){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var editor = cmdJson.editor;
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var year = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyInput[name='sunDateYear']").val())
		var month = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyInput[name='sunDateMonth']").val());
		var day = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyInput[name='sunDateDay']").val());
		var hour = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyInput[name='sunTimeHour']").val());
		var minute = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyInput[name='sunTimeMinute']").val());
		var second = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyInput[name='sunTimeSecond']").val());
		return {
			year: year,
			month: month,
			day: day,
			hour: hour,
			minute: minute,
			second: second
		};		
	},
	changeDayList: function(){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var editor = cmdJson.editor;
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var day = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyInput[name='sunDateDay']").val());
		var year = $(sunUIContainer).find(".propertyInput[name='sunDateYear']").val();
		var month = $(sunUIContainer).find(".propertyInput[name='sunDateMonth']").val();
		var cmdJson = js3CommandProcessors["sunProperty"];
		cmdJson.initDayList(editor, year, month);
		var getMaxDay = cmdJson.getMaxDay(year, month);
		day = day <= getMaxDay ? day : getMaxDay;
		$(sunUIContainer).find(".propertyInput[name='sunDateDay']").val(day);	
	},
	getDateTimeValues: function(dateTime){
		return {
			year: dateTime.getFullYear(),
			month: dateTime.getMonth() + 1,
			day: dateTime.getDate(),
			hour: dateTime.getHours(),
			minute: dateTime.getMinutes(),
			second: dateTime.getSeconds()
		}		
	},
	setDateTime: function(editor, dateTimeValues){
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		$(sunUIContainer).find(".propertyInput[name='sunDateYear']").val(dateTimeValues.year);
		$(sunUIContainer).find(".propertyInput[name='sunDateMonth']").val(dateTimeValues.month);
		$(sunUIContainer).find(".propertyInput[name='sunDateDay']").val(dateTimeValues.day);
		$(sunUIContainer).find(".propertyInput[name='sunTimeHour']").val(dateTimeValues.hour);
		$(sunUIContainer).find(".propertyInput[name='sunTimeMinute']").val(dateTimeValues.minute);
		$(sunUIContainer).find(".propertyInput[name='sunTimeSecond']").val(dateTimeValues.second);
	},
	setTime: function(editor, dateTimeValues){
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		$(sunUIContainer).find(".propertyInput[name='sunTimeHour']").val(dateTimeValues.hour);
		$(sunUIContainer).find(".propertyInput[name='sunTimeMinute']").val(dateTimeValues.minute);
		$(sunUIContainer).find(".propertyInput[name='sunTimeSecond']").val(dateTimeValues.second);
	},
	initTimeSlider: function(editor){
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var slide = $(sunUIContainer).find(".sunTimeSlider")[0];
		var progress = $(slide).find(".sunTimeSliderProgress")[0];
		var handle = $(slide).find(".sunTimeSliderHandle")[0];

		var onmouse = false; //判断是否mousedown

		var moveDown = function(e){
			onmouse = true;
			var l = handle.offsetLeft; 
			var x = e.clientX ;  

			var disX = x-l;  //点击滑块内区域，即鼠标点击点距离元素左边缘的距离
			var max = slide.offsetWidth - handle.offsetWidth;  //移动最大距离	
			$(handle).attr("max", max);
			$(handle).attr("disX", disX);
		}

		var moveMove = function(e){
			if (!onmouse) {   //若没有mousedown滑块，则mousemove不产生距离
				return;
			}

			var max = cmnPcr.strToDecimal($(handle).attr("max"));
			var disX = cmnPcr.strToDecimal($(handle).attr("disX"));
			
			var moveX = e.clientX; 
			var moveL = Math.min(max, Math.max(0,moveX - disX));

			//handle.style.left = moveL + 'px';  //设置滑块left值
			//progress.style.width = moveL + 'px';
			var cmdJson = js3CommandProcessors["sunProperty"];
			var editor = cmdJson.editor;
			var progressValue = moveL / ($(slide).width() - 14);
			cmdJson.setSliderValue(progressValue);
			var sunTimeValues = cmdJson.calcSunTimeByProgress(progressValue);
			cmdJson.setTime(editor, sunTimeValues);
			cmdJson.onChangeDateTime();
		}

		var moveUp = function(e){
			onmouse = false; 
		}

		handle.addEventListener("mousedown", moveDown, false);
		sunUIContainer.addEventListener("mousemove", moveMove, false);
		sunUIContainer.addEventListener("mouseup", moveUp, false);
	},
	setSliderValue: function(progressValue){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var editor = cmdJson.editor;
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var slide = $(sunUIContainer).find(".sunTimeSlider")[0];
		var progress = $(slide).find(".sunTimeSliderProgress")[0];
		var handle = $(slide).find(".sunTimeSliderHandle")[0];
		var moveL = ($(slide).width() - 14) * progressValue;
		handle.style.left = moveL + 'px';  //设置滑块left值
		progress.style.width = moveL + 'px';
	},
	calcProgressValue: function(){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var editor = cmdJson.editor;
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var sunriseTimeText = $(sunUIContainer).find(".propertyValue[name='sunRiseTime']").text();
		var sunriseTimeParts = sunriseTimeText.split(":");
		var sunsetTimeText = $(sunUIContainer).find(".propertyValue[name='sunSetTime']").text();
		var sunsetTimeParts = sunsetTimeText.split(":");
		var hour = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyInput[name='sunTimeHour']").val());
		var minute = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyInput[name='sunTimeMinute']").val());
		var second = cmnPcr.strToDecimal($(sunUIContainer).find(".propertyInput[name='sunTimeSecond']").val());
		var beginValue = cmnPcr.strToDecimal(sunriseTimeParts[0]) * 60 * 60 + cmnPcr.strToDecimal(sunriseTimeParts[1]) * 60 + cmnPcr.strToDecimal(sunriseTimeParts[2]);
		var endValue = cmnPcr.strToDecimal(sunsetTimeParts[0]) * 60 * 60 + cmnPcr.strToDecimal(sunsetTimeParts[1]) * 60 + cmnPcr.strToDecimal(sunsetTimeParts[2]);
		var sunTimeValue = hour * 60 * 60 + minute * 60 + second;
		return sunTimeValue < beginValue ? 0: (sunTimeValue > endValue ? 1 : (sunTimeValue - beginValue) / (endValue - beginValue)); 
	},
	calcSunTimeByProgress: function(progressValue){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var editor = cmdJson.editor;
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var sunriseTimeText = $(sunUIContainer).find(".propertyValue[name='sunRiseTime']").text();
		var sunriseTimeParts = sunriseTimeText.split(":");
		var sunsetTimeText = $(sunUIContainer).find(".propertyValue[name='sunSetTime']").text();
		var sunsetTimeParts = sunsetTimeText.split(":");

		var beginValue = cmnPcr.strToDecimal(sunriseTimeParts[0]) * 60 * 60 + cmnPcr.strToDecimal(sunriseTimeParts[1]) * 60 + cmnPcr.strToDecimal(sunriseTimeParts[2]);
		var endValue = cmnPcr.strToDecimal(sunsetTimeParts[0]) * 60 * 60 + cmnPcr.strToDecimal(sunsetTimeParts[1]) * 60 + cmnPcr.strToDecimal(sunsetTimeParts[2]);
		var sunTimeValue = (endValue - beginValue) * progressValue + beginValue;
		var sunTimeHour = Math.floor(sunTimeValue / (60 * 60));
		var sunTimeRemain = sunTimeValue % (60 * 60);
		var sunTimeMinute = Math.floor(sunTimeRemain / 60);
		var sunTimeSecond = Math.floor(sunTimeRemain % 60);
		return {
			hour: sunTimeHour,
			minute: sunTimeMinute,
			second: sunTimeSecond
		};		
	},
	initSunStatus: function(editor){
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var inputSelect = $(sunUIContainer).find(".propertyInput[name='sunStatus']")[0];
		$(inputSelect).empty();
		var allOptionHtml = "";
		allOptionHtml += ("<option value=\"off\">已关闭</option>"); 
		allOptionHtml += ("<option value=\"on\">已启用</option>"); 
		$(inputSelect).html(allOptionHtml);
	},
	initYearList: function(editor){
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var inputSelect = $(sunUIContainer).find(".propertyInput[name='sunDateYear']")[0];
		$(inputSelect).empty();
		var allOptionHtml = "";
		for(var i = 2000; i < 2051; i++){
			allOptionHtml += ("<option value=\"" + i + "\">" + i + "</option>"); 
		}
		$(inputSelect).html(allOptionHtml);
	},
	initMonthList: function(editor){
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var inputSelect = $(sunUIContainer).find(".propertyInput[name='sunDateMonth']")[0];
		$(inputSelect).empty();
		var allOptionHtml = "";
		for(var i = 1; i <= 12; i++){
			allOptionHtml += ("<option value=\"" + i + "\">" + i + "</option>"); 
		}
		$(inputSelect).html(allOptionHtml);
	},
	getMaxDay: function(year, month){
		var stratDate = new Date(year, month - 1, 1);
		var endData = new Date(year, month, 1);
		var maxDay = (endData - stratDate) / (1000 * 60 * 60 * 24);
		return maxDay;
	},
	initDayList: function(editor, year, month){
		var stratDate = new Date(year, month - 1, 1);
		var endData = new Date(year, month, 1);
		var days = (endData - stratDate) / (1000 * 60 * 60 * 24);
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var inputSelect = $(sunUIContainer).find(".propertyInput[name='sunDateDay']")[0];
		$(inputSelect).empty();
		var allOptionHtml = "";
		for(var i = 1; i <= days; i++){
			allOptionHtml += ("<option value=\"" + i + "\">" + i + "</option>"); 
		}
		$(inputSelect).html(allOptionHtml);
	},
	initHourList: function(editor){
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var inputSelect = $(sunUIContainer).find(".propertyInput[name='sunTimeHour']")[0];
		$(inputSelect).empty();
		var allOptionHtml = "";
		for(var i = 0; i < 24; i++){
			allOptionHtml += ("<option value=\"" + i + "\">" + i + "</option>"); 
		}
		$(inputSelect).html(allOptionHtml);
	},
	initMinuteList: function(editor){
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var inputSelect = $(sunUIContainer).find(".propertyInput[name='sunTimeMinute']")[0];
		$(inputSelect).empty();
		var allOptionHtml = "";
		for(var i = 0; i < 60; i++){
			allOptionHtml += ("<option value=\"" + i + "\">" + i + "</option>"); 
		}
		$(inputSelect).html(allOptionHtml);
	},
	initSecondList: function(editor){
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var inputSelect = $(sunUIContainer).find(".propertyInput[name='sunTimeSecond']")[0];
		$(inputSelect).empty();
		var allOptionHtml = "";
		for(var i = 0; i < 60; i++){
			allOptionHtml += ("<option value=\"" + i + "\">" + i + "</option>"); 
		}
		$(inputSelect).html(allOptionHtml);
	},
	getChildDistrictInfos: function(parentCode){
		var list = [];
		for(var i = 0; i < DistrictList.length; i++){
			var d = DistrictList[i];
			if(d.parentCode == parentCode){
				list.push(DistrictList[i]);
			}
		}
		return list;
	},
	getDistrictInfo: function(code){
		for(var i = 0; i < DistrictList.length; i++){
			var d = DistrictList[i];
			if(d.code == code){
				return d;
			}
		}
		return null;
	},
	getChildDistrictHtmls: function(parentCode){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var editor = cmdJson.editor;
		var list = cmdJson.getChildDistrictInfos(parentCode);
		var allOptionHtml = "";
		for(var i = 0; i < list.length; i++){
			var d = list[i];
			allOptionHtml += ("<option value=\"" + d.code + "\">" + d.name + "</option>"); 
		}
		return allOptionHtml;
	},
	initProvinceList: function(editor){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var inputSelect = $(sunUIContainer).find(".propertyInput[name='locationProvince']")[0];
		$(inputSelect).empty();
		var allOptionHtml = cmdJson.getChildDistrictHtmls("");
		$(inputSelect).html(allOptionHtml);
	},
	refreshCityList: function(editor){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var provinceCode = $(sunUIContainer).find(".propertyInput[name='locationProvince']").val();
		var allOptionHtml = cmdJson.getChildDistrictHtmls(provinceCode);		
		var inputSelect = $(sunUIContainer).find(".propertyInput[name='locationCity']")[0];
		$(inputSelect).empty();
		$(inputSelect).html(allOptionHtml);
	},
	refreshRegionList: function(editor){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var cityCode = $(sunUIContainer).find(".propertyInput[name='locationCity']").val();
		var allOptionHtml = cmdJson.getChildDistrictHtmls(cityCode);		
		var inputSelect = $(sunUIContainer).find(".propertyInput[name='locationRegion']")[0];
		$(inputSelect).empty();
		$(inputSelect).html(allOptionHtml);
	},
	refreshLngLat: function(editor){
		var cmdJson = js3CommandProcessors["sunProperty"];
		var sunUIContainer = $("#" + editor.containerId).find(".core3dTabContent[name='sunPropertyList']")[0];
		var regionCode = $(sunUIContainer).find(".propertyInput[name='locationRegion']").val();
		if(regionCode != null){
			var district = cmdJson.getDistrictInfo(regionCode);
			$(sunUIContainer).find(".propertyValue[name='locationLng']").text(district.lng);
			$(sunUIContainer).find(".propertyValue[name='locationLat']").text(district.lat);
		}
	}
};