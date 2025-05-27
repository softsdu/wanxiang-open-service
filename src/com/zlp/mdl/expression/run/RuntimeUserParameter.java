package com.zlp.mdl.expression.run;

//运行时用户参数
public class RuntimeUserParameter {
	
	public RuntimeUserParameter(String name, Object value){
		this.setName(name);
		this.setValue(value);
	}
	
	//参数名称
	private String name = "";
	public String getName(){
		return this.name;
	}
	public void setName(String name){
		this.name = name;
	}
	
	//参数值
	private Object value;
	public Object getValue(){
		return this.value;
	}
	public void setValue(Object value){
		this.value = value;
	}
}
