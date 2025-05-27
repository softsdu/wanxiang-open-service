//对话框
var expCommon = {
	andString: function(var1, var2){
		var s = "";
		if(var1 != null){
			s += var1;
		}
		if(var2 != null){
			s += var2;
		}
		return s;
	},
	//加减乘除
	add:function(var1, var2){
		//更改空字符串相加的处理方式 modified by ls 20230420
		if((var1 === "" || var1 == null) && (var2 === "" || var2 == null)){
			return "";
		}
		else if(var1 === "" || var1 == null){
			return var2;
		}
		else if(var2 === "" || var2 == null){
			return var1;
		}
		else{
			if(typeof(var1) == "string"){
				return expCommon.andString(var1, var2);
			}
			else{
				var1 = parseFloat(var1);
			}
			if(typeof(var2) == "string"){
				return expCommon.andString(var1, var2);
			}
			else{
				var2 = parseFloat(var2);
			}
			return cmnPcr.floatAdd(var1, var2);
		}
	},

	 subtract:function(var1, var2){
		 if(var2 == undefined){
			 return 0 - var1;
		 }
		 else{
			 return cmnPcr.floatAdd(var1, 0 - var2); 
		 }
	 },
	 multiply:function(var1, var2){
	    var m = 0, s1 = var1.toString(), s2 = var2.toString();  
	    try{ m += s1.split(".")[1].length; }catch(e){}  
	    try{ m += s2.split(".")[1].length; }catch(e){}  
	    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)  
		 //return var1 * var2;
	 },
	 divide:function(var1, var2){
		 try{
		 	if(var1 == null){
		 		throw new Error("被除数不能为空");
		 	}
		 	else if(var2 == null){
		 		throw new Error("除数不能为空");
		 	}
		 	else if(var2 == 0){
				throw new Error("除数不能为0");
		 	}
		 	else {
		 	   var t1 = 0, t2 = 0, r1, r2;  
			    try{t1 = var1.toString().split(".")[1].length}catch(e){}  
			    try{t2 = var2.toString().split(".")[1].length}catch(e){}  
			    with(Math){  
			        r1=Number(var1.toString().replace(".",""))  
			        r2=Number(var2.toString().replace(".",""))  
			        return (r1/r2)*pow(10,t2-t1);  
			    }	 	
				//return var1 / var2;
			}
		}
		catch(ex){
			throw ex;
		}
	 },

	 //取余 added by ls 20210827
	 remaind:function(var1, var2){
		 try{
		 	if(var1 == null){
		 		throw new Error("被除数不能为空");
		 	}
		 	else if(var2 == null){
		 		throw new Error("除数不能为空");
		 	}
		 	else if(var2 == 0){
				throw new Error("除数不能为0");
		 	}
		 	else {
		 	    return var1 % var2;
			}
		}
		catch(ex){
			throw ex;
		}
	 },
	 
	 //判断相等
	 equal:function(var1, var2){
		 return var1 == var2;
	 },

	 //大于
	 moreThan:function(var1, var2){
		 return var1 > var2;
	 },
	 //小于
	 lessThan:function(var1, var2){
		 return var1 < var2;
	 },
	 //大于等于
	 moreThanOrEqual:function(var1, var2){
		 return var1 >= var2;
	 },
	 //小于等于
	 lessThanOrEqual:function(var1, var2){
		 return var1 <= var2;
	 },
	 
	 //字符串和json对象互转
	 jsonToString:function(json){
		 return cmnPcr.jsonToStr(json);
	 },
	 stringToJson:function(str){
		 return cmnPcr.strToJson(str);
	 },
	 
	 //IIF
	 iif:function(boolValue, returnValue1, returnValue2){
		 return boolValue ? returnValue1 : returnValue2;
	 },
	 
	 //and
	 and:function(param1, param2){
		 return param1 && param2;
	 },
	 //or
	 or:function(param1, param2){
		 return param1 || param2;
	 },
	 toString: function(param1){
		 return param1 == null ? "" : param1.toString();
	 },
	 strToDecimal: function(param1){
		return cmnPcr.strToObject(param1, valueType.decimal);
	},
	strToBoolean: function(param1){
		return cmnPcr.strToObject(param1, valueType.boolean);
	},
	strToDate: function(param1){
		return cmnPcr.strToObject(param1, valueType.date);
	},
	strToTime: function(param1){
		return cmnPcr.strToObject(param1, valueType.time);
	},
	//判断是否为空  added by ls 20220606
	isEmpty: function(param1){
		return (param1 == null) || (typeof param1=='string' && param1.length == 0);
	},
	//获取字符串长度  added by ls 20220606
	len: function(param1){
		return param1 == null ? 0 : param1.length;
	},
	//去掉前后空格、回车 added by ls 20220606
	trim: function(param1){
		return param1 == null ? "" : param1.trim();
	},
	/*获取数组从0到索引位置所有值的加和 added by liyh 20240528*/
	getArraySumByIndex:function(arrayStr, index) {
		let result=0;
		try {
			if (arrayStr == null) {
				result=0;
			}
			let numberList = arrayStr.split(",");
			if(numberList.length>0) {
				for (var i = 0; i <= index; i++) {
					var currentNum = expCommon.strToDecimal(numberList[i]);
					result = cmnPcr.floatAdd(result, currentNum);
				}
			}
			return result;
		} catch (ex) {
			throw ex;
		}
	},

	/*获取一维数组指定索引位置的值 added by liyh 20230303*/
	getArrayData:function(param1, param2) {
		try {
			if (param1 == null) {
				// throw new Error("数组字符串不允许为空");
				return "";
			}
			let arrayList1 = param1.split(",");
			if (arrayList1.length > param2) {
				return arrayList1[param2];
			} else {
				//throw new Error("参数2超过了索引值，请检查数据录入正确性");
				return "";
			}

		} catch (ex) {
			throw ex;
		}
	},
	/*获取二维数组指定索引位置的值 added by liyh 20230303*/
	getArrayData_TwoDim:function(param1, param2, param3) {
		try {
			if (param1 == null) {
				//throw new Error("数组字符串不允许为空");
				return "";
			}
			let arrayList1 = param1.split(";");
			if (arrayList1.length > param2) {
				let arrayList2 = arrayList1[param2].split(",");
				if (arrayList2.length > param3) {
					return arrayList2[param3];
				} else {
					//throw new Error("参数3超过了索引值，请检查数据录入正确性");
					return "";
				}
			} else {
				//throw new Error("参数2超过了索引值，请检查数据录入正确性");
				return "";
			}

		} catch (ex) {
			throw ex;
		}
	},
	/*获取最大值 added by liyh 20230807*/
	max:function(arrayStr) {
		let result=0;
		try {
			if (arrayStr == null) {
				result=0;
			}
			let numberList = arrayStr.split(",");
			if(numberList.length>0) {
				result = expCommon.strToDecimal(numberList[0]);
			}
			for(var i=0;i<numberList.length;i++) {

				var currentNum=expCommon.strToDecimal(numberList[i]);
				if (currentNum > result) {
					result = currentNum;
				}
			}
			return result;
		} catch (ex) {
			throw ex;
		}
	}
	,
	/*获取最小值 added by liyh 20230807*/
	min:function(arrayStr) {
		let result=0;
		try {
			if (arrayStr == null) {
				result=0;
			}
			let numberList = arrayStr.split(",");
			if(numberList.length>0) {
				result = expCommon.strToDecimal(numberList[0]);
			}
			for(var i=0;i<numberList.length;i++) {

				var currentNum=expCommon.strToDecimal(numberList[i]);
				if (currentNum < result) {
					result = currentNum;
				}
			}
			return result;
		} catch (ex) {
			throw ex;
		}
	},
	/*获取二维数组的行数量 added by liyh 20240104*/
	getMatrixRowsNumber:function(param1) {
		try {
			if (param1 == null) {
				return 0;
			}
			let arrayList = param1.split(";");
			return arrayList.length;
		} catch (ex) {
			throw ex;
		}
	},
}