package com.zlp.mdl.expression.definition;

import java.util.ArrayList;
import java.util.List; 

//函数
public class Function {
	//函数的各种重载设置
	private List<FunctionSetting> allFunctionSettings = null;	 
	public List<FunctionSetting> getAllFunctionSettings(){
		return this.allFunctionSettings;
	}
	public void setAllFunctionSettings(List<FunctionSetting> allFunctionSettings){
		this.allFunctionSettings = allFunctionSettings;
	}	
	
	public FunctionSetting getFunctionSetting(List<String> paramTypes){
		if(this.allFunctionSettings != null){
			for(int i=0;i<this.allFunctionSettings.size();i++){
				FunctionSetting funcSetting = this.allFunctionSettings.get(i);
			 	List<Parameter> ps = funcSetting.getAllParameters();
			 	if((ps == null || ps.size() == 0 )){
			 		if((paramTypes == null || paramTypes.size() ==0)){
			 			return funcSetting;
			 		}
			 		else{
			 			continue;
			 		}
			 	}
			 	else{
			 		if(paramTypes == null){
			 			continue;
			 		}
			 		else {
				 		int funcSettingParamCount = ps.size();
				 		int expFuncParamCount = paramTypes.size();
				 		
			 			if(expFuncParamCount == funcSettingParamCount){
				 			boolean checked = true;
				 			for(int j=0;j<funcSettingParamCount;j++){
				 				Parameter p = ps.get(j);
				 				if(!p.getValueType().equals(paramTypes.get(j))){
				 					checked = false;
				 					break;
				 				}
				 			}
				 			if(checked){
				 				return funcSetting;
				 			}
				 			else{
				 				continue;
				 			} 
			 			}
				 		else if(expFuncParamCount > funcSettingParamCount){
				 			//参数个数不相等，看看表达式中的参数多出来的部分，是不是函数定义里允许参数重复了
				 			List<String> repeatableParamType = new ArrayList<String>();
				 			int fromRepeatIndex = 0;
				 			for(int j = funcSettingParamCount - 1; j >=0; j--){
				 				Parameter p = ps.get(j);
				 				if(p.getRepeatable()){
				 					repeatableParamType.add(0, p.getValueType());
				 					fromRepeatIndex = j;
				 				}
				 				else{
				 					break;
				 				}
				 			}
				 			int repeatableParamCount = repeatableParamType.size();
				 			if(repeatableParamCount == 0){
				 				continue;
				 			}
				 			else {
				 				int repeatParamCount = expFuncParamCount - fromRepeatIndex;
				 				if(repeatParamCount % repeatParamCount  == 0){
				 					int repeatCount = repeatParamCount / repeatableParamCount;
				 					
				 					StringBuilder allRepeatParamValueTypeStr = new StringBuilder(); 
				 					for(int j = fromRepeatIndex; j < expFuncParamCount; j++){
				 						allRepeatParamValueTypeStr.append(paramTypes.get(j) + ";");
				 					}
				 					
				 					StringBuilder allRepeatableParamValueTypeStr = new StringBuilder(); 
				 					for(int j = 0; j < repeatCount; j++){
				 						for(int k = 0; k < repeatableParamCount; k++){
				 							allRepeatableParamValueTypeStr.append(repeatableParamType.get(k) + ";");
				 						}
				 					}
				 					if(allRepeatParamValueTypeStr.toString().equals(allRepeatableParamValueTypeStr.toString())){
				 						return funcSetting;
				 					}
				 					else{
				 						continue;
				 					}
				 				}
				 				else{
				 					continue;
				 				}
				 			}
				 		}
				 		else {
				 			continue;
				 		}
			 		}
			 	}
			}
			return null;
		}
		else{
			return null;
		}
	}

	//函数名
	private String name = "";
	public String getName(){
		return this.name;
	}
	public void setName(String name){
		this.name = name;
	}

	//描述
	private String description = "";
	public String getDescription(){
		return this.description;
	}
	public void setDescription(String description){
		this.description = description;
	}

	//对应的bean名称
	private String beanName = "";
	public String getBeanName(){
		return this.beanName;
	}
	public void setBeanName(String beanName){
		this.beanName = beanName;
	}

	//对应的bean里的方法名
	private String methodName = "";
	public String getMethodName(){
		return this.methodName;
	}
	public void setMethodName(String methodName){
		this.methodName = methodName;
	}


	//运行位置
	private RunAt runAt;
	public RunAt getRunAt(){
		return this.runAt;
	}
	public void setRunAt(RunAt runAt){
		this.runAt = runAt;
	}


	//分类
	private String category = "";
	public String getCategory(){
		return this.category;
	}
	public void setCategory(String category){
		this.category = category;
	}
	
}
