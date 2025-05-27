package com.zlp.mdl.expression.definition;
 
//参数
public class Parameter {

	//参数名称
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
	
	//值类型
	private String valueType;
	public String getValueType(){
		return this.valueType;
	}
	public void setValueType(String valueType){
		this.valueType = valueType;
	}
	
	//可重复的
	private boolean repeatable;
	public boolean getRepeatable(){
		return this.repeatable;
	}
	public void setRepeatable(boolean repeatable){
		this.repeatable = repeatable;
	}
}
