
function GridListDispUnit(param){
	var that = this;
		
	this.base = DispUnit;
	this.base(param); 

	this.editType = "list";
	this.jsonValue = {}; 
	this.idField = param.idField; 
	this.textField = param.textField; 
	
	this.getHtml = function(param) {
		var	html = "<input id=\"" + this.id + "\"  class=\"easyui-combogrid dispUnit\" />";
		return html;
	};
	
	//param包含container、idField、textField、columns、getListFunc、changeFunc、options(扩展属性,在NcpView中，包含了fieldName、rowId)
	this.setAttr = function(param){
		var ctrl = this.getCtrl();
		param.panelWidth = 0;
		for(var i=0;i<param.columns[0].length;i++){
			var column = param.columns[0][i];
			param.panelWidth += (column.hidden?0:column.width);
		}
	
		$(ctrl).combogrid({  
			fitColumns:true,
			panelWidth:param.panelWidth,   
			idField:param.idField,
			textField:param.textField,
			columns:param.columns,
			onShowPanel:function(){
				$("#"+that.id).combogrid({panelHeight:27});
			    var value =	$("#"+that.id).combogrid("getValue");			    
				param.getListFunc({value:value, options:param.options, showListFunc:function(data){
					var panelHeight =  28 + 25 * (data.length > 6 ? 6 : data.length);
					var panelWidth = param.panelWidth;
					if(param.panelWidth < $("#"+that.id).width()){
						panelWidth = $("#"+that.id).width();
						
					}
					$("#"+that.id).combogrid({panelHeight:panelHeight,panelWidth:panelWidth});
					var grid = $("#"+that.id).combogrid("grid");   
					grid.datagrid({data:data});  
				}}); 
			},
			onHidePanel:function(){
				var grid = $("#"+that.id).combogrid("grid");  
				var selectedRow = grid.datagrid('getSelected');
				if(selectedRow != null){
					var isChanged = false;
					if(that.idField == null){
						isChanged = selectedRow[this.textField] == that.jsonValue[this.textField];
					}
					else{
						isChanged = selectedRow[this.idField] == that.jsonValue[this.idField];
					}
						
					if(isChanged){ 
						that.jsonValue = selectedRow;
						if(param.changeFunc != undefined){
							param.changeFunc(selectedRow);
						}
					}
				}
			}
		});
	};
	
	this.getValue = function(){ 
		return this.jsonValue;
	};
	
	this.setValue = function(value){
		this.jsonValue = value;
		$("#"+this.id).combogrid("setValue",value[this.textField]);	
	};
	
	this.setReadonly = function(isReadonly){
		$("#"+this.id).combogrid(isReadonly ? "disable":"enable"); 
	};
	
	this.init(param);
}
function ButtonDispUnit(param){
	var that = this;
	this.base = DispUnit;
	this.base(param); 
	this.editType = "button";
	this.isReadonly = false;
	
	this.getHtml = function(param) {
		var	html = "<a href=\"#\" id=\"" + this.id + "\" class=\"dispUnit\" ></a>";
		return html;
	};
	
	//param包含name(按钮名称)
	this.setAttr = function(param){ 
		$("#"+this.id).click(function(){
			if(!this.isReadonly){
				this.param.clickFunc();
			}
			else{
				msgBox.alert({info:"按钮不可用."});
			}
			return false;
		});
		$("#"+this.id).html(this.param.name);
	};
	
	this.getValue = function(){  
		return null;
	};
	
	this.setValue = function(value){ 
	};
	
	this.setReadonly = function(isReadonly){
		this.isReadonly = isReadonly;
	};
	
	this.init(param);
}
function CheckboxDispUnit(param){
	var that = this;
		
	this.base = DispUnit;
	this.base(param); 
	this.editType = "boolean";
	
	this.getHtml = function(param) {
		var	html = "<input id=\"" + this.id + "\" type=\"checkbox\" class=\"dispUnit\"/>";
		return html;
	};

	//param包含，以后扩展是否允许三态
	this.setAttr = function(param){ 
	};
	
	this.getValue = function(){ 
		return $("#"+this.id).prop("checked");
	};
	
	this.setValue = function(value){
		if(value){
			$("#"+this.id).prop("checked", true);
		}
		else{
			$("#"+this.id).prop("checked", false);
		}
	};
	
	this.setReadonly = function(isReadonly){
		if(isReadonly){
			$("#"+this.id).attr("disabled","disabled");
		}
		else{
			$("#"+this.id).removeAttr("disabled");
		}
	};
	
	this.init(param);
}
function TimeDispUnit(param){
	var that = this;
		
	this.base = DispUnit;
	this.base(param); 
	this.editType = "time";
	
	this.getHtml = function(param) {
		var	html = "<input id=\"" + this.id + "\" class=\"easyui-datetimebox dispUnit\" />";
		return html;
	};
	
	this.setAttr = function(param){
		var ctrl = this.getCtrl();
		$(ctrl).datetimebox({
			formatter:function(date){return cmnPcr.datetimeToStr(date, "yyyy-MM-dd HH:mm")},
			parser:function(s){return cmnPcr.strToTime(s);}
		});
	};
	
	this.getValue = function(){ 
		return $("#"+this.id).datetimebox("getValue");
	};
	
	this.setValue = function(value){
		$("#"+this.id).datetimebox("setValue",value);	
	};
	
	this.setReadonly = function(isReadonly){
		if(isReadonly){
			$("#"+this.id).attr("disabled","disabled");
		}
		else{
			$("#"+this.id).removeAttr("disabled");
		}
	};
	
	this.init(param);
}

function DateDispUnit(param){
	var that = this;
		
	this.base = DispUnit;
	this.base(param); 
	this.editType = "date";
	
	this.getHtml = function(param) {
		var	html = "<input id=\"" + this.id + "\" class=\"easyui-datebox dispUnit\" />";
		return html;
	};

	this.setAttr = function(param){
		var ctrl = this.getCtrl();
		$(ctrl).datebox({
			formatter:function(date){return cmnPcr.datetimeToStr(date, "yyyy-MM-dd HH:mm")},
			parser:function(s){return cmnPcr.strToTime(s);}
		});
	};
	
	this.getValue = function(){ 
		return $("#"+this.id).datebox("getValue");
	};
	
	this.setValue = function(value){
		$("#"+this.id).datebox("setValue",value);	
	};
	
	this.setReadonly = function(isReadonly){
		if(isReadonly){
			$("#"+this.id).attr("disabled","disabled");
		}
		else{
			$("#"+this.id).removeAttr("disabled");
		}
	};
	
	this.init(param);
}

function DecimalDispUnit(param){
	var that = this;
		
	this.base = DispUnit;
	this.base(param); 
	this.editType = "decimal";
	
	this.getHtml = function(param) {
		var	html = "<input id=\"" + this.id + "\" class=\"easyui-numberbox dispUnit\" style=\"text-align:right;\" />";
		return html;
	};

	//param包含isComma、decimalNum
	this.setAttr = function(param){
		var ctrl = this.getCtrl();
		$(ctrl).numberbox({ 
			groupSeparator:param.isComma ? "," : "",
			precision:param.decimalNum
		});
	};
	
	this.getValue = function(){ 
		return $("#"+this.id).numberbox("getValue");
	};
	
	this.setValue = function(value){
		$("#"+this.id).numberbox("setValue",value);	
	};
	
	this.setReadonly = function(isReadonly){
		if(isReadonly){
			$("#"+this.id).attr("disabled","disabled");
		}
		else{
			$("#"+this.id).removeAttr("disabled");
		}
	};
	
	this.init(param);
}

function TextDispUnit(param){
	var that = this;
		
	this.base = DispUnit;
	this.base(param); 
	this.editType = "text";
	
	this.getHtml = function(param) {
		var	html = "<input id=\"" + this.id + "\" class=\"easyui-validatebox dispUnit\" />";
		return html;
	};
	
	//param 
	this.setAttr = function(param){
		var ctrl = this.getCtrl();
		$(ctrl).validatebox({ fit:true });
	};
	
	this.getValue = function(){ 
		return $("#"+this.id).val();
	};
	
	this.setValue = function(value){
		$("#"+this.id).val(value);	
	};
	
	this.setReadonly = function(isReadonly){
		if(isReadonly){
			$("#"+this.id).attr("disabled","disabled");
		}
		else{
			$("#"+this.id).removeAttr("disabled");
		}
	};
	this.init(param);
}

function TextareaDispUnit(param){
	var that = this;
		
	this.base = DispUnit;
	this.base(param); 
	this.editType = "textarea";
	
	this.getHtml = function(param) {
		var	html = "<textarea id=\"" + this.id + "\" class=\"easyui-validatebox dispUnit\"></textarea>";
		return html;
	};
	
	//param
	this.setAttr = function(param){
		var ctrl = this.getCtrl();
		$(ctrl).validatebox({ });
	};
	
	this.getValue = function(){ 
		return $("#"+this.id).val();
	};
	
	this.setValue = function(value){
		$("#"+this.id).val(value);	
	};
	
	this.setReadonly = function(isReadonly){
		if(isReadonly){
			$("#"+this.id).attr("disabled","disabled");
		}
		else{
			$("#"+this.id).removeAttr("disabled");
		}
	};
	this.init(param);
}

function DispUnit(param){
	var that = this;
	this.id = cmnPcr.getRandomValue();
	
	this.getId = function(){
		return this.id;
	};
	
	this.getHtml = function(param) {
		alert("没有实现getHtml方法");
	};
	
	this.getCtrl = function(){
		return $(param.container).find("#"+this.id)[0];
	};
	
	this.init = function(param) {
		var html = this.getHtml(param);
		$(param.container).html(html);		
		this.setStyle(param);
		this.setAttr(param); 
	};
	
	this.setStyle = function(param){
		var ctrl = this.getCtrl();
		if(param.style != undefined){
			$(ctrl).css(param.style);
		} 
	};
	
	this.setAttr = function(param){
		alert("没有实现setAttr方法");	
	};
	
	this.getValue = function(){
		alert("没有实现getValue方法");		
	};
	
	this.setValue = function(){
		alert("没有实现setValue方法");				
	};
	
	this.change = function(){
		alert("没有实现change方法");			
	};
	
	this.setReadonly = function(isReadonly){
		alert("没有实现setReadonly方法");				
	}
}