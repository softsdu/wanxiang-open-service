package com.zlp.mdl.expression.expFunction;

import java.math.BigDecimal; 
import java.util.Date;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.JSONProcessor; 

//执行四则运算 重新整理了此类，允许抛出异常 modified by ls 20170911
public class ExpCommon {

	//修改为public modified by liyh 20180719
	public Boolean checkIsDecimal(String param) {	//private Boolean checkIsDecimal(String param) {
		
		//修改判断逻辑 modified by liyh 20180720
		
		/*修改前逻辑
		 * if (param == null || param.length() == 0) {
			return true;
		} else {
			param = param.replace("\r", "");
			if (param.length() == 0) {
				return true;
			} else {
				 return ValueConverter.CheckDecimal(param);
			}
		}*/
		
		/*修改后逻辑*/
		param = param == null? "" : param.trim();
		if (param == null || param.length() == 0) {
			return true;
		} 
		else {
			param = param.replace("\r", "");
			param = param.replace(",", "");
			if (param.length() == 0) {
				return true;
			} 
			else {
				try{
					BigDecimal devimalValue = new BigDecimal(param);
					return true;
				}
				catch(NumberFormatException e)
				{
					//System.out.println("异常：\"" + param + "\"不是数字...");
					return false;
				}
			}
		}		
	}

	//modified by ls 20180404 更改函数为public
	public BigDecimal toBigDecimal(String param) {

		param = param == null? "" : param.trim();
		if (param == null || param.length() == 0) {
			return new BigDecimal(0);
		} else if (param.trim().equals("-")) {
			return new BigDecimal(0);
		} else {
			param = param.replace("\r", "");
			param = param.replace(",", "");
			if (param.length() == 0) {
				return new BigDecimal(0);
			} else {				
				return new BigDecimal(param.trim());
			}
		}

	}

	/***  屏蔽原有add函数   deleted by liyh 20190213  start  ***/
	
	/**
	 * 加法
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 * @throws Exception
	 */
	/*public String add(String param1, String param2) throws Exception {
		String calResult = "";
		try {
			// add的参数为string时，变换成decimal前先trim modified by ls 20170908
			BigDecimal bigDecimal1 = toBigDecimal(param1);
			BigDecimal bigDecimal2 = toBigDecimal(param2);
			calResult = add(bigDecimal1, bigDecimal2).toString();
		} catch (Exception e) {
			String errorInfo = "无法将 " + param1 + " 与 " + param2 + " 相加";
			e.printStackTrace();
			throw new Exception(errorInfo);
		}
		return calResult;
	}*/

	/**
	 * 加法
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	/*public String add(String param1, BigDecimal param2) {
		String calResult = "";
		try {
			BigDecimal bigDecimal1 = toBigDecimal(param1);
			calResult = add(bigDecimal1, param2).toString();
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		return calResult;
	}*/

	/**
	 * 加法
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	/*public BigDecimal add(BigDecimal param1, BigDecimal param2) {
		if (param1 == null) {
			if (param2 == null) {
				return new BigDecimal("0");
			} else {
				return param2;
			}
		} else if (param2 == null) {
			return param1;
		} else {
			return param1.add(param2);
		}
	}*/

	/**
	 * 加法
	 * 
	 * @param param1
	 * @return
	 */
	/*public BigDecimal add(BigDecimal param1) {
		return param1;
	}*/
	
	/***  屏蔽原有add函数   deleted by liyh 20190213  end  ***/
	
	
	/***  修正add函数错误的问题   added by liyh 20190213  start  ***/
	//连接
	public String andString(Object param1, Object param2){
		String p1 = param1 == null ? "" : param1.toString();
		String p2 = param1 == null ? "" : param2.toString(); 
		return p1 + p2;
	}
	//加法
	public BigDecimal add(BigDecimal param1, BigDecimal param2){
		if(param1 == null){
			return param2;
		}
		else if(param2 == null){
			return param1;
		}
		else{
			return param1.add(param2);
		}
	}
	//加法
	public String add(String param1, String param2){
		String p1 = param1 == null ? "" : param1.toString();
		String p2 = param1 == null ? "" : param2.toString(); 
		return p1 + p2;
	}
	
	//正数
	public BigDecimal add(BigDecimal param1){
		return param1;
	}
	/***    added by liyh 20190213   end    ***/
	
	
	
	

	/**
	 * 减法
	 * 
	 * @param param1
	 * @return
	 */
	public BigDecimal subtract(BigDecimal param1) {
		return BigDecimal.ZERO.subtract(param1);
	}

	/**
	 * 减法
	 * 
	 * @param param1
	 * @return
	 */
	public BigDecimal subtract(String param1) {
		try {
			BigDecimal bigDecimal1 = toBigDecimal(param1);
			return BigDecimal.ZERO.subtract(bigDecimal1);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	/**
	 * 减法
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public BigDecimal subtract(BigDecimal param1, BigDecimal param2) {
		if (param1 == null) {
			return subtract(param1);
		} else {
			return param1.subtract(param2);
		}
	}

	/**
	 * 减法
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public String subtract(String param1, String param2) {
		try {
			BigDecimal bigDecimal1 = toBigDecimal(param1);
			BigDecimal bigDecimal2 = toBigDecimal(param2);
			return subtract(bigDecimal1, bigDecimal2).toString();
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}

	}

	/**
	 * 乘法
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public BigDecimal multiply(BigDecimal param1, BigDecimal param2) {
		if (null == param1 || null == param2) {
			return new BigDecimal("0");
		}
		return param1.multiply(param2);
	}

	/**
	 * 乘法
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public String multiply(String param1, String param2) {
		try {
			BigDecimal bigDecimal1 = toBigDecimal(param1);
			BigDecimal bigDecimal = toBigDecimal(param2);
			return bigDecimal.multiply(bigDecimal1).toString();
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	/**
	 * 乘法
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public String multiply(String param1, BigDecimal param2) {
		try {
			BigDecimal bigDecimal1 = toBigDecimal(param1);
			return param2 == null ? "0" : param2.multiply(bigDecimal1).toString();
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	/**
	 * 除法
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public BigDecimal divide(BigDecimal param1, BigDecimal param2) throws Exception {
		if (null == param2 || param2.compareTo(new BigDecimal("0")) == 0) {
			if (param1.compareTo(new BigDecimal("0")) != 0) {
				// 除数为空，那么返回0
				return new BigDecimal("0");
				// throw new Exception("除数不能为0!");
			} else {
				return new BigDecimal("0");
			}
		}
		if (null == param1) {
			return new BigDecimal("0");
		}
		return param1.divide(param2, 10, BigDecimal.ROUND_HALF_UP);
	}

	/**
	 * 除法
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 * @throws Exception
	 */
	public String divide(String param1, String param2) throws Exception {
		try {
			BigDecimal bigDecimal1 = toBigDecimal(param1);
			BigDecimal bigDecimal2 = toBigDecimal(param2);
			return divide(bigDecimal1, bigDecimal2).toString();
		} catch (Exception e) {
			throw e;
		}
	}

	//取余  added by ls 20210827
	public BigDecimal remaind(BigDecimal param1, BigDecimal param2) throws Exception {
		if (null == param2 || param2.compareTo(new BigDecimal("0")) == 0) {
			if (param1.compareTo(new BigDecimal("0")) != 0) {
				// 除数为空，那么返回0
				return new BigDecimal("0");
				// throw new Exception("除数不能为0!");
			} else {
				return new BigDecimal("0");
			}
		}
		if (null == param1) {
			return new BigDecimal("0");
		}
		return param1.remainder(param2);
	}

	/**
	 * 相等
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public Boolean equal(BigDecimal param1, BigDecimal param2) {
		if (param1 == null) {
			return param2 == null;
		} else {
			return param1.equals(param2);
		}
	}

	/**
	 * 判断相等
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public Boolean equal(String param1, String param2) {
		try {
			if (checkIsDecimal(param1) && checkIsDecimal(param1)) {
				BigDecimal bigDecimal1 = toBigDecimal(param1);
				BigDecimal bigDecimal2 = toBigDecimal(param2);
				return equal(bigDecimal1, bigDecimal2);
			} else {
				if (param1 == null) {
					return param2 == null;
				} else {
					return param1.equals(param2);
				}
			}
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * 大于
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public Boolean moreThan(BigDecimal param1, BigDecimal param2) {
		if (param1 == null || param2 == null) {
			return false;
		} else {
			param1 = param1.setScale(20, BigDecimal.ROUND_HALF_UP);
			param2 = param2.setScale(20, BigDecimal.ROUND_HALF_UP);
			return param1.compareTo(param2) == 1;
		}
	}

	/**
	 * 大于
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public Boolean moreThan(String param1, String param2) {
		try {
			BigDecimal bigDecimal1 = toBigDecimal(param1);
			BigDecimal bigDecimal2 = toBigDecimal(param2);
			return moreThan(bigDecimal1, bigDecimal2);
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * 小于
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public Boolean lessThan(BigDecimal param1, BigDecimal param2) {
		if (param1 == null || param2 == null) {
			return false;
		} else {
			param1 = param1.setScale(20, BigDecimal.ROUND_HALF_UP);
			param2 = param2.setScale(20, BigDecimal.ROUND_HALF_UP);
			return param1.compareTo(param2) == -1;
		}
	}

	/**
	 * 小于
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public Boolean lessThan(String param1, String param2) {
		try {
			BigDecimal bigDecimal1 = toBigDecimal(param1);
			BigDecimal bigDecimal2 = toBigDecimal(param2);
			return lessThan(bigDecimal1, bigDecimal2);
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * 大于等于
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public Boolean moreThanOrEqual(BigDecimal param1, BigDecimal param2) {
		if (param1 == null || param2 == null) {
			return false;
		} else {
			param1 = param1.setScale(20, BigDecimal.ROUND_HALF_UP);
			param2 = param2.setScale(20, BigDecimal.ROUND_HALF_UP);
			return param1.compareTo(param2) >= 0;
		}
	}

	/**
	 * 大于等于
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public Boolean moreThanOrEqual(String param1, String param2) {
		try {
			BigDecimal bigDecimal1 = toBigDecimal(param1);
			BigDecimal bigDecimal2 = toBigDecimal(param2);
			return moreThanOrEqual(bigDecimal1, bigDecimal2);
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * 小于等于
	 * 
	 * @param param1
	 * @param param2
	 * @return
	 */
	public Boolean lessThanOrEqual(BigDecimal param1, BigDecimal param2) {
		if (param1 == null || param2 == null) {
			return false;
		} else {
			return param1.compareTo(param2) <= 0;
		}
	}

	public Boolean lessThanOrEqual(String param1, String param2) {
		try {
			// 参数为string时，变换成decimal前先trim modified by ls 20170908
			BigDecimal bigDecimal1 = toBigDecimal(param1);
			BigDecimal bigDecimal2 = toBigDecimal(param2);
			return lessThanOrEqual(bigDecimal1, bigDecimal2);
		} catch (Exception e) {
			throw e;
		}
	}

	// Json转字符串
	public String jsonToString(JSONObject json) {
		String s = JSONProcessor.jsonToStr(json);
		return s;
	}

	// 字符串转Json
	public JSONObject stringToJson(String str) throws Exception {
		JSONObject obj = JSONProcessor.strToJSON(str);
		return obj;
	}

	// IIF判断
	public String iif(Boolean check, String returnValue1, String returnValue2) {
		return check ? returnValue1 : returnValue2;
	}

	// IIF判断
	public Date iif(Boolean check, Date returnValue1, Date returnValue2) {
		return check ? returnValue1 : returnValue2;
	}

	// IIF判断
	public BigDecimal iif(Boolean check, BigDecimal returnValue1, BigDecimal returnValue2) {
		return check ? returnValue1 : returnValue2;
	}

	// IIF判断
	public JSONObject iif(Boolean check, JSONObject returnValue1, JSONObject returnValue2) {
		return check ? returnValue1 : returnValue2;
	}

	// and
	public Boolean and(Boolean param1, Boolean param2) {
		return param1 && param2;
	}

	// or
	public Boolean or(Boolean param1, Boolean param2) {
		return param1 || param2;
	}
	
	public String toString(BigDecimal param1){
		return param1 == null ? "" : param1.toString();
	}
}
