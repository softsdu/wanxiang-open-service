package com.zlp.mdl.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import com.zlp.platform.common.JSONProcessor;
import com.zlp.platform.common.NcpActionSupport;
import com.zlp.platform.common.NcpException;
import com.zlp.platform.common.ServiceResultProcessor;
import com.zlp.platform.common.util.CommonFunction; 
import com.zlp.platform.dao.sys.ContextUtil;
import com.zlp.platform.expression.definition.ExpCommonValueType;
import com.zlp.platform.expression.definition.Parameter;
import com.zlp.platform.expression.definition.RunAt;
import com.zlp.platform.expression.definition.ValidateResult;
import com.zlp.platform.expression.definition.Validator;
import com.zlp.platform.expression.run.RunResult;
import com.zlp.platform.expression.run.Runner;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport; 

public class ExpressionService  extends NcpActionSupport implements IExpressionService {

	private static final long serialVersionUID = -1833058337174419317L;
	
	private Validator expValidator = null;
	public void setExpValidator(Validator expValidator){
		this.expValidator = expValidator;
	}

	private Runner expRunner = null;
	public void setExpRunner(Runner expRunner){
		this.expRunner = expRunner;
	}

	@Override
	public String validateExp(){ 
		try{  
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String expression = CommonFunction.decode(requestObj.getString("expression"));
			String needResultType = requestObj.containsKey("needResultType") ? requestObj.getString("needResultType") : null; 
			RunAt runAt = RunAt.valueOf(requestObj.getString("runAt"));
			List<Parameter> parameters = this.getUserParameters(requestObj);
 			ValidateResult result = expValidator.validateExp(expression, parameters, runAt, needResultType);
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("succeed",result.getSucceed());
			resultHash.put("info",result.getSucceed() ? "验证通过." : "验证不通过");
			resultHash.put("errors", result.getErrors());
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("validate expression", "验证表达式失败", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 
		return ActionSupport.SUCCESS;
	}

	@Override
	public String validateJsExp(){ 
		try{  
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String expression = CommonFunction.decode(requestObj.getString("expression")); 

			//增加名称 added by ls 20220905	
			String name = requestObj.containsKey("name") ? requestObj.getString("name") : ""; 
			
			List<Parameter> parameters = this.getUserParameters(requestObj); 
			String needResultType = requestObj.containsKey("needResultType") ? requestObj.getString("needResultType") : null; 
			
			List<String> functionCategories = new ArrayList<String>();
			functionCategories.add("Common");
			functionCategories.add("Geometry"); 
			functionCategories.add("BimClient"); 
			
 			ValidateResult validateResult = expValidator.validateExp(expression, parameters , RunAt.Js, needResultType, functionCategories);
			String jsCode = validateResult.getSucceed()? expValidator.toJsCode(validateResult):"";
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("succeed",validateResult.getSucceed());
			resultHash.put("validateErrors", validateResult.getErrors()); 
			resultHash.put("valueType", validateResult.getValueType());
			resultHash.put("jsCode", CommonFunction.encode(jsCode));

			//增加返回值类型 added by ls 20220905
			resultHash.put("valueType", validateResult.getValueType());
			
			//增加名称 added by ls 20220905		
			resultHash.put("name", name);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("validate js expression", "验证js表达式失败", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 
		return ActionSupport.SUCCESS;
	}
	
	private List<Parameter> getUserParameters(JSONObject requestObj) throws Exception{ 
		if(requestObj.containsKey("userParameters")){
			List<Parameter> parameters = new ArrayList<Parameter>();
			JSONArray parameterJsons = requestObj.getJSONArray("userParameters");
			for(int i=0;i<parameterJsons.size();i++){
				JSONObject parameterJson = parameterJsons.getJSONObject(i);
				Parameter parameter = new Parameter();
				
				String name = parameterJson.getString("name");
				parameter.setName(name);

				String valueType = parameterJson.getString("valueType");  
				String runtimeValueType = ExpCommonValueType.getRuntimeValueType(valueType);
				parameter.setValueType(runtimeValueType);
				
				parameters.add(parameter);
			}
			return parameters;
		}
		else{
			return null;
		}
	}

	@Override
	public String runExp(){ 
		Session dbSession = null;
		try{  
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String expression = CommonFunction.decode(requestObj.getString("expression"));  
			String needResultType = requestObj.containsKey("needResultType") ? requestObj.getString("needResultType") : null; 
			RunAt runAt = RunAt.valueOf(requestObj.getString("runAt"));
			Date dt1 = new Date();
 			ValidateResult validateResult = expValidator.validateExp(expression, null, runAt, needResultType);
			Date dt2 = new Date();
			HibernateTransactionManager transactionManager = (HibernateTransactionManager)ContextUtil.getBean("transactionManager");  
			dbSession = transactionManager.getSessionFactory().openSession();			
 			RunResult runResult = expRunner.runExp(validateResult, null, dbSession);
			Date dt3 = new Date();
			double timespan1 = dt2.getTime() - dt1.getTime();
			double timespan2 = dt3.getTime() - dt2.getTime();
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("succeed", runResult.getSucceed()?"true":"false");
			resultHash.put("info", !runResult.getSucceed() || runResult.getValue()==null ? "" : runResult.getValue().toString()); 
			resultHash.put("runError", runResult.getError());		
			resultHash.put("validateErrors", validateResult.getErrors());
			resultHash.put("timespan1", timespan1);
			resultHash.put("timespan2", timespan2);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("run expression", "运行表达式失败", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	}

	@Override
	public String generateFunctionListJs(){
		try{  
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String expression = CommonFunction.decode(requestObj.getString("expression")); 
			String needResultType = requestObj.containsKey("needResultType") ? requestObj.getString("needResultType") : null; 
			List<Parameter> parameters = this.getUserParameters(requestObj);
 			ValidateResult validateResult = expValidator.validateExp(expression, parameters , RunAt.Js, needResultType);
			String jsCode = validateResult.getSucceed()? expValidator.toJsCode(validateResult):"";
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("succeed",validateResult.getSucceed());
			resultHash.put("validateErrors", validateResult.getErrors()); 
			resultHash.put("jsCode", CommonFunction.encode(jsCode));
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("validate js expression", "验证js表达式失败", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 
		return ActionSupport.SUCCESS;
	}
}
