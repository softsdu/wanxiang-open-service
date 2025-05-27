package com.zlp.mdl.expression.definition;
 
public interface IEnvironment{  
	Category getCategory(String name); 
	Function getFunction(String name); 
	Operator getOperator(String name);
	KeyWord getKeyWord(String name);  
}
