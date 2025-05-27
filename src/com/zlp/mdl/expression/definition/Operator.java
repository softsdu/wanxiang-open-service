package com.zlp.mdl.expression.definition;

//操作符
public class Operator {

	//操作符名称
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

	//对应的函数名称
	private String functionName = "";
	public String getFunctionName(){
		return this.functionName;
	}
	public void setFunctionName(String functionName){
		this.functionName = functionName;
	} 

	//优先级,1为最低
	private int level = 1;
	public int getLevel(){
		return this.level;
	}
	public void setLevel(int level){
		this.level = level;
	} 
	
	
}
