package com.zlp.mdl.expression.definition; 

//函数分类
public class Category {
	//名称
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
}
