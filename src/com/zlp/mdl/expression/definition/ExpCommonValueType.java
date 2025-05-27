package com.zlp.mdl.expression.definition;

import com.zlp.platform.common.ValueConverter;
import com.zlp.platform.dao.db.ValueType;

public class ExpCommonValueType { 
	/*
	<ValueTypeDes Name="java.lang.String" Description="字符串"></ValueTypeDes>
	<ValueTypeDes Name="java.lang.Boolean" Description="布尔类型"></ValueTypeDes>
	<ValueTypeDes Name="java.util.Date" Description="日期时间"></ValueTypeDes>
	<ValueTypeDes Name="java.math.BigDecimal" Description="数值(BigDecimal)"></ValueTypeDes>
	<ValueTypeDes Name="void" Description="无类型"></ValueTypeDes>
	<ValueTypeDes Name="com.alibaba.fastjson.JSONObject" Description="Json对象"></ValueTypeDes>
	<ValueTypeDes Name="com.alibaba.fastjson.JSONArray" Description="Json数组"></ValueTypeDes>
	<ValueTypeDes Name="HashMap&lt;String, Object&gt;" Description="字符串对对象的键值对"></ValueTypeDes>
	<ValueTypeDes Name="INcpSession" Description="应用服务器会话"></ValueTypeDes>
	<ValueTypeDes Name="js.DataTable" Description="DataTable(js)"></ValueTypeDes>
	<ValueTypeDes Name="org.hibernate.Session" Description="数据库会话"></ValueTypeDes>		
	<ValueTypeDes Name="js.NcpView" Description="前端View窗口"></ValueTypeDes>			
	<ValueTypeDes Name="js.NcpSheet" Description="前端Sheet窗口"></ValueTypeDes>			
	<ValueTypeDes Name="js.NcpTree" Description="前端Tree窗口"></ValueTypeDes>			
	<ValueTypeDes Name="js.Array" Description="数组(js)"></ValueTypeDes>		
	*/
	public static final String String = "java.lang.String";
	public static final String Decimal = "java.math.BigDecimal";
	public static final String Boolean = "java.lang.Boolean";
	public static final String DateTime = "java.util.Date"; 
	public static final String Void = "void";	
	public static final String JSONObject = "JSONObject";	
	public static final String JSONArray = "JSONArray";	
	public static final String HashMap = "HashMap";	
	public static final String INcpSession = "INcpSession";	
	public static final String DataTable = "DataTable";	
	public static final String Session = "Session";	
	public static final String NcpView = "NcpView";	
	public static final String NcpSheet = "NcpSheet";	
	public static final String NcpTree = "NcpTree";	
	public static final String Array = "Array";	
	
	public static Object convertTo(String str, String valueType) throws Exception{
		if(ExpCommonValueType.String.equals(valueType)){
			return ValueConverter.convertToObject(str, ValueType.String);
		}
		else if(ExpCommonValueType.Decimal.equals(valueType)){
			return ValueConverter.convertToObject(str, ValueType.Decimal);
		}
		else if(ExpCommonValueType.Boolean.equals(valueType)){
			return ValueConverter.convertToObject(str, ValueType.Boolean);
		}
		else if(ExpCommonValueType.DateTime.equals(valueType)){
			return ValueConverter.convertToObject(str, ValueType.Time);
		} 
		else{
			return ValueConverter.convertToObject(str, valueType);
		}
	}

	public static String getClientValueType(String runtimeValueType) throws Exception{
		if(runtimeValueType == null || runtimeValueType.length() == 0){
			return null;
		}
		else {
			switch(runtimeValueType){
				case ExpCommonValueType.String://"java.lang.String":
					return "string";
				case ExpCommonValueType.Decimal://"java.math.BigDecimal":
					return "decimal";
				case ExpCommonValueType.Boolean://"java.lang.Boolean":
					return "boolean";
				case ExpCommonValueType.DateTime://"java.util.Date":
					return "date";
				case ExpCommonValueType.Void :
					return "void";	
				case ExpCommonValueType.JSONObject:
					return "JSONObject";	
				case ExpCommonValueType.JSONArray:
					return "JSONArray";	
				case ExpCommonValueType.HashMap:
				case ExpCommonValueType.INcpSession:
				case ExpCommonValueType.DataTable:
				case ExpCommonValueType.Session:
				case ExpCommonValueType.NcpView:
				case ExpCommonValueType.NcpSheet:
				case ExpCommonValueType.NcpTree:
				case ExpCommonValueType.Array:
				default:
					throw new Exception("Can not convert to client value type : '" + runtimeValueType + "'.");
			}
		}
	}
	
	public static String getRuntimeValueType(String clientValueType) throws Exception{
		clientValueType = clientValueType.toLowerCase();
		if(clientValueType == null || clientValueType.length() == 0){
			return null;
		}
		else {
			switch(clientValueType){
				case "string"://"java.lang.String":
					return ExpCommonValueType.String;
				case "decimal"://"java.math.BigDecimal":
					return ExpCommonValueType.Decimal;
				case "boolean"://"java.lang.Boolean":
					return ExpCommonValueType.Boolean;
				case "date"://"java.util.Date":
					return ExpCommonValueType.DateTime;
				case "time"://"java.util.Time":
					return ExpCommonValueType.DateTime;
				case "void":
					return ExpCommonValueType.Void;	
				case "JSONObject":
					return ExpCommonValueType.JSONObject;
				case "JSONArray":
					return ExpCommonValueType.JSONArray;
				case "HashMap":
				case "INcpSession":
				case "DataTable":
				case "Session":
				case "NcpView":
				case "NcpSheet":
				case "NcpTree":
				case "Array":
				default:
					throw new Exception("Can not convert to runtime value type : '" + clientValueType + "'.");
			}
		}
	}
}
