var expStandard = { 
	getStandardValue: function(standardCode, itemName, propertyName){
		var stdJson = standardJsons[standardCode];
		if(stdJson == null){
			throw "没有找到对应的标准. Standard Code = " + standardCode;
		}
		else{
			var itemJson = stdJson[itemName]; 
			if(itemJson == null){
				throw "没有找到对应的标准条目. Item Name = " + itemName;
			}
			else{
				var propertyValue = itemJson[propertyName];
				if(itemJson == null){
					throw "没有找到对应的属性. Property Name = " + propertyName;
				}
				else{
					return propertyValue;
				}
			}
		}
	},

	//新增获取阶梯值函数 added by liyh 20211109
    getStepValue: function(stepCode, case_value){
        var stepJson = stepJsons[stepCode];
        if(stepJson == null){
            throw "没有找到对应的标准. Step Code = " + stepCode;
        }
        else {
			var result="";

            for(var key in stepJson){//遍历json对象的每个key/value对,p为key
                if(cmnPcr.strToDecimal(key)>case_value){
                    result = stepJson[key];
                    break;
                }
            }
            return result;
        }
    }
}