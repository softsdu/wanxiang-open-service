package com.zlp.mdl.expression.run;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.ArrayList; 
import java.util.HashMap;
import java.util.List;
import java.util.Map; 
import org.hibernate.Session;

import com.zlp.mdl.expression.definition.ExpCommonValueType;
import com.zlp.mdl.expression.definition.ExpTreePart;
import com.zlp.mdl.expression.definition.Function;
import com.zlp.mdl.expression.definition.FunctionSetting;
import com.zlp.mdl.expression.definition.IEnvironment;
import com.zlp.mdl.expression.definition.Parameter;
import com.zlp.mdl.expression.definition.PartType;
import com.zlp.mdl.expression.definition.ValidateResult;
import com.zlp.platform.dao.sys.ContextUtil;

//运行
public class Runner {
	
	private IEnvironment expEnvironment;
	public void setExpEnvironment(IEnvironment expEnvironment){
		this.expEnvironment = expEnvironment;
	}
	
	private Session dBSession = null;
	private void setDBSession(Session dBSession){
		this.dBSession = dBSession;
	}
	
	public RunResult runExp(ValidateResult validateResult, List<RuntimeUserParameter> parameters, Session dbSession){
		
		this.setDBSession(dbSession);
		try
		{
			if(validateResult.getSucceed()){
				Map<String, Object> p2vs = new HashMap<String, Object>();
				if(parameters != null && parameters.size() != 0){
					for(int i=0;i<parameters.size();i++){
						RuntimeUserParameter userP = parameters.get(i);
						p2vs.put(userP.getName().toLowerCase(), userP.getValue());
					}
				}
				Object resultValue = getResultValue(validateResult.getPartTree(), p2vs);
				RunResult runResult = new RunResult();
				runResult.setSucceed(true);
				runResult.setValue(resultValue);
				return runResult;
			}
			else{
				throw new Exception("表达式验证不通过，不允许执行");
			}
		}
		catch(Exception ex){
			RunResult runResult = new RunResult();
			runResult.setSucceed(false);
			runResult.setValue(null);
			runResult.setError(ex.getMessage() + (ex.getCause() == null ? "" :( "," + ex.getCause().getMessage())));
			return runResult;
		}
	}
	
	public Object getResultValue(ExpTreePart part, Map<String, Object> p2vs) throws Exception {
		if(part == null){
			return null;
		}
		else{
			PartType partType = part.getPartType();
			if(partType == PartType.Bracket){
			    List<ExpTreePart> childParts = part.getAllChildParts();
				return this.getResultValue(childParts.get(0), p2vs);
			}
			else if(partType == PartType.Constant){
				String valueType = part.getResultType(); 
				try {
					Object value = ExpCommonValueType.convertTo(part.getText(), valueType);
					if(valueType.equals(ExpCommonValueType.Decimal)){
						value = value == null ? null : BigDecimal.valueOf((Double)value);
					}
					return value;
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
			    	throw new RuntimeException("转换到类型"+valueType.toString()+"失败, 值为\"" + part.getText() + "\"");
				} 
			}
			else if(partType == PartType.UserParameter){
				String pName = part.getText().toLowerCase();
				if(p2vs.containsKey(pName)){
					Object value = p2vs.get(pName);
					return value;
				}
				else{
			    	throw new RuntimeException("无法获取用户自定义参数值, 参数名为\"" + pName + "\"");
				}
			}
			else if(partType == PartType.Function){			
				return runFunction(part, p2vs);
			}
			else{
		    	throw new RuntimeException("无法获取片段返回值, 片段为" + part.getText() + ", 类型为\"" + part.getPartType().toString() + "\"");
			}
		}
	}
	
	public Object runFunction(ExpTreePart part, Map<String, Object> p2vs) throws Exception {
		String functionName = part.getText();
		Function func = expEnvironment.getFunction(functionName);
	    String beanName = func.getBeanName();
	    String methodName = func.getMethodName();
	    Object bean = ContextUtil.getBean(beanName);
	    if(bean == null){ 
	    	throw new RuntimeException("未找到对应的Bean, 名为\"" + beanName + "\"");
	    }
	    
	    if(bean instanceof ExternalBase){
	    	IDatabaseAccess databaseAccess = ((ExternalBase)bean).getDatabaseAccess();
	    	if(databaseAccess != null){
	    		databaseAccess.setSession(this.dBSession);
	    	}
	    }
	    
	    
	    FunctionSetting funcSetting = part.getFunctionSetting();
	    List<Parameter> allParameters = funcSetting.getAllParameters();
	    Object[] parameterValues = new Object[allParameters.size()];
	    Class[] parameterClassArray = new Class[allParameters.size()];
	    List<ExpTreePart> childParts = part.getAllChildParts();
	    if(allParameters != null){
	    	int funcSettingParamCount = allParameters.size();
	    	int childPartCount = childParts.size();
	    	int repeatableParamCount = 0;
	    	List<List<Object>> repeatParameterValues = new ArrayList<List<Object>>(); 
	    	for(int i = 0; i < funcSettingParamCount; i++){ 
	    		ExpTreePart childP = childParts.get(i*2);
    			Parameter parameter = allParameters.get(i);
    			String valueType = parameter.getValueType();
    			boolean repeatable = parameter.getRepeatable();
    			Class cl = null;    			
    			String runValueType = ""; 
    			try {
    				if(!repeatable){
    					runValueType = valueType;
    					cl = Class.forName(valueType);
    				}
    				else{
    					//runValueType = "java.util.List<" + valueType + ">";
    					runValueType = "java.util.List";
    					cl = Class.forName(runValueType);
    				}
        			parameterClassArray[i] = cl;
				} 
    			catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
    				throw new Exception("无法找到对应方法，无效的参数类型: " + runValueType, e);
				}
				if(!repeatable){
					parameterValues[i] = getResultValue(childP, p2vs);
				}
				else {
					List<Object> paramObjects = new ArrayList<Object>();
					paramObjects.add(getResultValue(childP, p2vs));
					parameterValues[i] = paramObjects;
					repeatParameterValues.add(paramObjects);
					repeatableParamCount++;
				}
	    	}
	    	if(repeatableParamCount > 0){
	    		//可重复的参数
		    	for(int i = funcSettingParamCount * 2; i < childPartCount; i = (i + 2 * repeatableParamCount)){
		    		for(int j = 0; j < repeatableParamCount; j++){
		    			List<Object> paramObjects = repeatParameterValues.get(j);
			    		ExpTreePart childP = childParts.get(i + j * 2);
			    		Object value = getResultValue(childP, p2vs);
						paramObjects.add(value);
		    		}
		    	}
	    	}
	    }  
	    
	    Method method;
		try {
			method = bean.getClass().getMethod(methodName, parameterClassArray);
			if(method == null){ 
		    	StringBuilder s = new StringBuilder();
		    	for(int i=0;i<allParameters.size();i++){
		    		s.append( (i==0?"":", ") + allParameters.get(i).getValueType().toString());
		    	}
		    	throw new Exception("未找到对应的函数. methodName = " + methodName + ",参数为" + s.toString()); 
			}
			else{
		    	try {
					return method.invoke(bean, parameterValues);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();  
			    	throw new Exception("运行函数出错, methodName = " + methodName, (e instanceof InvocationTargetException) ? ((InvocationTargetException)e).getTargetException() : e);
				}
			}
		} 
		catch (Exception e) { 
			throw e;
		}    
	}
}
