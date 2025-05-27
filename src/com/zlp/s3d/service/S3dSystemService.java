package com.zlp.s3d.service;
  
import java.sql.SQLException;
import java.util.HashMap;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.*;
import com.zlp.s3d.processor.IS3dSystemProcessor;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import com.opensymphony.xwork2.ActionSupport;
 
public class S3dSystemService extends NcpActionSupport implements IS3dSystemService{

	private static final Logger logger=Logger.getLogger(com.zlp.s3d.service.S3dSystemService.class);

	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	} 

	private IS3dSystemProcessor s3dSystemProcessor = null;
	public void setS3dSystemProcessor(IS3dSystemProcessor s3dSystemProcessor){
		this.s3dSystemProcessor = s3dSystemProcessor;
	}
	protected IS3dSystemProcessor getS3dSystemProcessor(){
		return this.s3dSystemProcessor;
	} 

	@Override
	public String refreshAppKeysCache(){ 
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			
			dbSession = this.openDBSession();
			IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
			s3dSystemProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), true);
			s3dSystemProcessor.refreshAppKeysCache(session);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();		 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("refreshAppKeysCache", "提示: "+ ex.getMessage(), ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}
		finally{ 
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	}

	//生成组件配置json added by ls 20240621
	@Override
	public String generateComponentConfigJsons(){
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			dbSession = this.openDBSession();
			IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
			s3dSystemProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), true);
			String appId = requestObj.getString("appId");
			JSONArray componentConfigJsons = s3dSystemProcessor.generateComponentConfigJsons(session, appId);

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("componentConfigJsons", componentConfigJsons);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("generateComponentConfigJsons", "提示: "+ ex.getMessage(), ex);
			this.addResponse(ncpEx.toJsonString());
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	}

	//生成材质配置json
	@Override
	public String generateMaterialConfigFile(){
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			dbSession = this.openDBSession();
			IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
			s3dSystemProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), true);
			s3dSystemProcessor.generateMaterialConfigFile(session);
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("generateMaterialConfigFile", "提示: "+ ex.getMessage(), ex);
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
	public String checkAppMaterialConfig() {
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

			dbSession = this.openDBSession();
			IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
			s3dSystemProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), true);
			boolean autoGenerate = requestObj.getBoolean("autoGenerate");

			boolean exist = s3dSystemProcessor.checkAppMaterialConfig(session);
			if(!exist){
				s3dSystemProcessor.generateMaterialConfigFile(session);
			}

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("checkAppMaterialConfig", "提示: "+ ex.getMessage(), ex);
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