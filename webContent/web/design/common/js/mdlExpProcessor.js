function M3dExpProcessor(){
	var thatExpProcessor = this;
	
	this.core = null;
	
	this.init = function(p){
		thatExpProcessor.core = p.core;
	};
	
	this.run = function(exp){ 
		thatExpProcessor.validate(exp);
	};
	
	this.runJsCode = function(p){

		//传递当前的coreEditor added by ls 20220905
		expBimClientCommon.editor = thatExpProcessor.core;
		
		thatExpProcessor.core.runJsCode(p);
	}
	
	this.showCmdInfos = function(errors){
		thatExpProcessor.core.showCmdInfos(errors);
	}
    
	this.validate = function(exp){
		var requestParam = {
			expression: encodeURIComponent(exp)
		};
		serverAccess.request({
			serviceName:"bimExpressionNcpService",
			funcName:"validateJsExp",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
			successFunc: function(obj) {   
				var succeed = obj.result.succeed; 
				var validateErrors = obj.result.validateErrors;
				if(validateErrors != null && validateErrors.length > 0){
					thatExpProcessor.showCmdInfos(validateErrors);
				}
				else{
					var jsCode = decodeURIComponent(obj.result.jsCode);
					var valueType = decodeURIComponent(obj.result.valueType);
					thatExpProcessor.runJsCode({
						jsCode: jsCode,
						valueType: valueType
					});
				}
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});
	}
	
}  