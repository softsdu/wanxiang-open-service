package com.zlp.s3d.service;
  
import java.sql.SQLException;
import java.util.HashMap;

import com.zlp.s3d.processor.AppKeyStatus;
import com.zlp.s3d.processor.IS3dModelProcessor;
import com.zlp.s3d.processor.IS3dSystemProcessor;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.mdl.processor.IMdlComponentProcessor;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.JSONProcessor;
import com.zlp.platform.common.NcpActionSupport;
import com.zlp.platform.common.NcpException;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.ServiceResultProcessor;
import com.zlp.platform.common.util.CommonFunction;
import com.opensymphony.xwork2.ActionSupport;
 
public class S3dModelService extends NcpActionSupport implements IS3dModelService{

	private static Logger logger=Logger.getLogger(S3dModelService.class);
	
	private HibernateTransactionManager transactionManager;
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{
		return this.transactionManager.getSessionFactory().openSession(); 
	} 

	private IMdlComponentProcessor mdlComponentProcessor = null;
	public void setMdlComponentProcessor(IMdlComponentProcessor mdlComponentProcessor){
		this.mdlComponentProcessor = mdlComponentProcessor;
	}
	protected IMdlComponentProcessor getMdlComponentProcessor(){
		return this.mdlComponentProcessor;
	}

	private IS3dModelProcessor s3dModelProcessor = null;
	public void setS3dModelProcessor(IS3dModelProcessor s3dModelProcessor){
		this.s3dModelProcessor = s3dModelProcessor;
	}
	protected IS3dModelProcessor getS3dModelProcessor(){
		return this.s3dModelProcessor;
	}

	private IS3dSystemProcessor s3dSystemProcessor = null;
	public void setS3dSystemProcessor(IS3dSystemProcessor s3dSystemProcessor){
		this.s3dSystemProcessor = s3dSystemProcessor;
	}
	protected IS3dSystemProcessor getS3dSystemProcessor(){
		return this.s3dSystemProcessor;
	}
	//检测授权状态
	private void checkAppStatus(JSONObject requestObj ) throws Exception {
		String appKey = this.getHttpRequest().getHeader("App-Key");
		String url = this.getHttpRequest().getRequestURI();
		this.checkAppStatus(appKey, url);
	}

	//检测授权状态
	private void checkAppStatus(String appKey, String url) throws Exception {
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		AppKeyStatus appKeyStatus = s3dSystemProcessor.getAppKeyStatus(appKey, url);
		switch(appKeyStatus){
			case active:{
				break;
			}
			case overdue:{
				throw new Exception("授权超期");
			}
			case invalid:{
				throw new Exception("没有获取授权");
			}
			case urlError:{
				throw new Exception("授权地址错误");
			}
		}
	}

	@Override
	public String getCategoryTree(){ 
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			this.checkAppStatus(requestObj);

			dbSession = this.openDBSession();
			IMdlComponentProcessor mdlComponentProcessor = this.getMdlComponentProcessor();
			mdlComponentProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), false);

			//默认为all modified by ls 202202
			JSONArray mdlTypeArray = requestObj.containsKey("mdlTypes") ? requestObj.getJSONArray("mdlTypes") : null; 
			String[] mdlTypes = new String[mdlTypeArray.size()];
			for(int i = 0; i < mdlTypeArray.size(); i++){
				mdlTypes[i] = mdlTypeArray.getString(i);
			}
			
			JSONArray categoryTreeJsonArray = mdlComponentProcessor.getCategoryTree(session, mdlTypes);  
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();		 
			resultHash.put("categoryTree", categoryTreeJsonArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getCategoryTree", "提示: "+ ex.getMessage(), ex);
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
	public String queryComponents(){ 
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			this.checkAppStatus(requestObj);

			dbSession = this.openDBSession();
			IMdlComponentProcessor mdlComponentProcessor = this.getMdlComponentProcessor();
			mdlComponentProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), false);
			String componentName = CommonFunction.decode(requestObj.getString("componentName"));  
			String categoryId = requestObj.getString("categoryId");  
			JSONArray propertyJsonArray = requestObj.getJSONArray("properties");  
			
			JSONArray componentJsonArray = mdlComponentProcessor.queryComponents(session, componentName, categoryId, propertyJsonArray);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();		 
			resultHash.put("components", componentJsonArray);   
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("queryComponents", "提示: "+ ex.getMessage(), ex);
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
	public String getComponentFilesByCodes(){ 
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			this.checkAppStatus(requestObj);

			dbSession = this.openDBSession();
			IMdlComponentProcessor mdlComponentProcessor = this.getMdlComponentProcessor();
			mdlComponentProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), false);  
			//这里不再处理缓存问题 modified by ls 20220909
			String resultString = this.getComponentFileByCodesText(session, requestParam);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getComponentFilesByCodes", "提示: "+ ex.getMessage(), ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}
		finally{ 
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	} 
	
	private String getComponentFileByCodesText(INcpSession session, String requestParam) throws Exception{
		JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 	
		JSONArray componentCodeAndVersionNumArray = requestObj.getJSONArray("componentCodeAndVersionNumArray");
		JSONArray componentInfos = new JSONArray();
		for(int i = 0; i < componentCodeAndVersionNumArray.size(); i++){
			JSONObject componentCodeAndVersionNum = componentCodeAndVersionNumArray.getJSONObject(i);
			String componentCode = componentCodeAndVersionNum.getString("code");
			String versionNum = componentCodeAndVersionNum.getString("versionNum");
 
			JSONObject json = mdlComponentProcessor.getComponentFileByCode(session, componentCode, versionNum);
			componentInfos.add(json);
		}
		
		HashMap<String, Object> resultHash = new HashMap<String, Object>();		 
		resultHash.put("componentInfos", componentInfos);
        return ServiceResultProcessor.createJsonResultStr(resultHash);
	}

	@Override
	public String getComponentFileByCode(){ 
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			this.checkAppStatus(requestObj);

			dbSession = this.openDBSession();
			IMdlComponentProcessor mdlComponentProcessor = this.getMdlComponentProcessor();
			mdlComponentProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), false);
			String componentCode = requestObj.getString("componentCode"); 
			String versionNum = requestObj.getString("versionNum");
 
			JSONObject json = mdlComponentProcessor.getComponentFileByCode(session, componentCode, versionNum);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();		 
			resultHash.put("componentInfo", json);  
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getComponentFileByCode", "提示: "+ ex.getMessage(), ex);
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
	public String createModel(){
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

			dbSession = this.openDBSession();
			IS3dModelProcessor s3dModelProcessor = this.getS3dModelProcessor();
			s3dModelProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), true);
			String appName = CommonFunction.decode(requestObj.getString("appName"));
			String modelName = CommonFunction.decode(requestObj.getString("modelName"));
			String moduleCode = CommonFunction.decode(requestObj.getString("moduleCode"));

			String modelId = s3dModelProcessor.createModel(session, appName, modelName, moduleCode);
			JSONObject modelInfoJson = s3dModelProcessor.getModelInfoJson(session, modelId);

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("modelInfo", modelInfoJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("createModel", "提示: "+ ex.getMessage(), ex);
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
	public String copyModel(){
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

			dbSession = this.openDBSession();
			IS3dModelProcessor s3dModelProcessor = this.getS3dModelProcessor();
			s3dModelProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), true);
			String appName = CommonFunction.decode(requestObj.getString("appName"));
			String newModelName = CommonFunction.decode(requestObj.getString("newModelName"));
			String sourceModelId = CommonFunction.decode(requestObj.getString("sourceModelId"));

			String modelId = s3dModelProcessor.copyModel(session, appName, newModelName, sourceModelId);
			JSONObject modelInfoJson = s3dModelProcessor.getModelInfoJson(session, modelId);

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("modelInfo", modelInfoJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("copyModel", "提示: "+ ex.getMessage(), ex);
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
	public String saveModel(){
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

			dbSession = this.openDBSession();
			IS3dModelProcessor s3dModelProcessor = this.getS3dModelProcessor();
			s3dModelProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), true);
			String modelId = requestObj.getString("modelId");
			String modelName = CommonFunction.decode(requestObj.getString("modelName"));
			String modelText = CommonFunction.decode(requestObj.getString("modelText"));
			String imageBase64 = requestObj.getString("imageBase64");

			s3dModelProcessor.saveModel(session, modelId, modelName, modelText, imageBase64);

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("modelId", modelId);
			resultHash.put("modelName", modelName);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("saveModel", "提示: "+ ex.getMessage(), ex);
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
	public String getModel(){
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

			dbSession = this.openDBSession();
			IS3dModelProcessor s3dModelProcessor = this.getS3dModelProcessor();
			s3dModelProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), false);
			String modelId = requestObj.getString("modelId");

			JSONObject modelInfoJson = s3dModelProcessor.getModel(session, modelId);

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("modelInfo", modelInfoJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("getModel", "提示: "+ ex.getMessage(), ex);
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
	public String getLastModels(){
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

			dbSession = this.openDBSession();
			IS3dModelProcessor s3dModelProcessor = this.getS3dModelProcessor();
			s3dModelProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), false);
			String appName = requestObj.getString("appName");
			int rowCount = requestObj.getIntValue("rowCount");

			JSONArray modelJArray = s3dModelProcessor.getLastModels(session, appName, rowCount);

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("models", modelJArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("getLastModels", "提示: "+ ex.getMessage(), ex);
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
	public String getMaterialConfigText() {
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			dbSession = this.openDBSession();
			IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
			s3dSystemProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), false);
			String materialConfigText = s3dSystemProcessor.getMaterialConfigText(session);
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("materialConfigText", CommonFunction.encode(materialConfigText));
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("getMaterialConfigText", "提示: "+ ex.getMessage(), ex);
			this.addResponse(ncpEx.toJsonString());
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	}
}