package com.zlp.mdl.expression.definition;

//表达式组成部分类型
public enum PartType {
	//常量
	Constant,
	
	//函数
	Function,
	
	//操作符
	Operator, 

	//括号
	Bracket, 
	
	//逗号
	Comma, 
	
	//用户参数
	UserParameter,
	
	//未知
	Unknown
}
