package com.zlp.mdl.expression.definition;

import java.util.List; 

//函数的设置
public class FunctionSetting {
	
	//参数
	private List<Parameter> allParameters = null;
	public List<Parameter> getAllParameters(){
		return this.allParameters;
	}
	public void setAllParameters(List<Parameter> allParameters){
		this.allParameters = allParameters;
	}
	
	//返回值类型
	private String resultType;
	public String getResultType(){
		return this.resultType;
	}
	public void setResultType(String resultType){
		this.resultType = resultType;
	}

	//描述
	private String description = "";
	public String getDescription(){
		return this.description;
	}
	public void setDescription(String description){
		this.description = description;
	}
	
}
