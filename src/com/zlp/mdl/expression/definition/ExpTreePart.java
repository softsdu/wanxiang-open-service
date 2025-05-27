package com.zlp.mdl.expression.definition;

import java.util.List; 

//表达式片段
public class ExpTreePart {

	//子片段
	private List<ExpTreePart> allChildParts= null;
	public List<ExpTreePart> getAllChildParts(){
		return this.allChildParts;
	}
	public void setAllChildParts(List<ExpTreePart> allChildParts){
		this.allChildParts = allChildParts;
	}
	
	private ExpTreePart parentPart;
	public ExpTreePart getParentPart(){
		return this.parentPart;
	}
	public void setParentPart(ExpTreePart parentPart){
		this.parentPart = parentPart;
	}
	
	//此片段内容
	private String text = null;
	public String getText(){
		return this.text;
	}
	public void setText(String text){
		this.text = text;
	}
	
	//此部分类型
	private PartType partType = null;
	public PartType getPartType(){
		return this.partType;
	}
	public void setPartType(PartType partType){
		this.partType = partType;
	}
		
	//返回值类型
	private String resultType = null;
	public String getResultType(){
		return this.resultType;
	}
	public void setResultType(String resultType){
		this.resultType = resultType;
	}

	
	//返回值类型
	private FunctionSetting functionSetting = null;
	public FunctionSetting getFunctionSetting(){
		return this.functionSetting;
	}
	public void setFunctionSetting(FunctionSetting functionSetting){
		this.functionSetting = functionSetting;
	}
	
}
