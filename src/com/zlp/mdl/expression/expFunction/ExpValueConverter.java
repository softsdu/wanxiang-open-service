package com.zlp.mdl.expression.expFunction;

import java.math.BigDecimal; 
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date; 
import com.zlp.platform.common.SysConfig; 

//值类型转换
public class ExpValueConverter { 
	public String timeToString(Date timeValue, String format){
		if(timeValue == null){
			return "";
		}
		else{
			SimpleDateFormat sdf = new SimpleDateFormat(format);
			return sdf.format(timeValue);
		}
	}
	
	public String timeToString(Date timeValue){
		return timeToString(timeValue, SysConfig.getTimeFormat());
	}
	
	public String dateToString(Date dateValue, String format){
		if(dateValue == null){
			return "";
		}
		else{
			SimpleDateFormat sdf = new SimpleDateFormat(format);
			return sdf.format(dateValue);
		}
	}
	
	public String dateToString(Date dateValue){
		return timeToString(dateValue, SysConfig.getTimeFormat());
	}
	
	public String decimalToString(BigDecimal decimalValue, String format){
		if(decimalValue == null){
			return "";
		}
		else{
			DecimalFormat decimalFormat=new DecimalFormat(format);  
			return decimalFormat.format(decimalValue); 
		}
	}
	
	public String decimalToString(BigDecimal decimalValue){
		if(decimalValue == null){
			return "";
		}
		else{   
			return decimalValue.toString();
		}
	}

	public Date stringToTime(String stringValue, String format) throws ParseException{
		if(stringValue == null || stringValue.isEmpty()){
			return null;
		}
		else{
			SimpleDateFormat sdf = new SimpleDateFormat(format);
			return sdf.parse(stringValue);
		}
	}

	public Date stringToDate(String stringValue, String format) throws ParseException{
		if(stringValue == null || stringValue.isEmpty()){
			return null;
		}
		else{
			SimpleDateFormat sdf = new SimpleDateFormat(format);
			return sdf.parse(stringValue);
		}
	}

	public BigDecimal stringToDecimal(String stringValue, String format) throws ParseException{
		if(stringValue == null || stringValue.isEmpty()){
			return null;
		}
		else{
			DecimalFormat decimalFormat=new DecimalFormat(format);  
			Number num = decimalFormat.parse(stringValue);
			return BigDecimal.valueOf(num.doubleValue());
		}
	}

	public BigDecimal stringToDecimal(String stringValue) throws ParseException{
		if(stringValue == null || stringValue.isEmpty()){
			return null;
		}
		else{
			double dou = Double.parseDouble(stringValue);
			return BigDecimal.valueOf(dou);
		}
	}
}
