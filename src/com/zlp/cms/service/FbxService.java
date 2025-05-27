package com.zlp.cms.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
import com.zlp.cms.processor.FbxProcessor;
import com.zlp.cms.processor.IFbxProcessor;
import com.zlp.platform.common.*;
import com.zlp.platform.common.util.CommonFunction;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import java.sql.SQLException;
import java.util.HashMap;

public class FbxService extends NcpActionSupport implements IFbxService{
  	private static Logger logger=Logger.getLogger(FbxService.class);
	
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	 
	private IFbxProcessor fbxProcessor;
	public void setFbxProcessor(IFbxProcessor fbxProcessor){
		this.fbxProcessor = fbxProcessor;
	}
	private IFbxProcessor getFbxProcessor(){
		return this.fbxProcessor;
	} 
	   
	@Override
	public String getFbxList(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), false);
			IFbxProcessor processor =  this.getFbxProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			String fbxName = CommonFunction.decode(requestObj.getString("fbxName"));
			JSONArray fbxRowArray = processor.getFbxList(session, fbxName);
			

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("fbxs", fbxRowArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getFbxList", "获取FBX列表失败", ex);
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
	public String importFbx(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), false); 
			IFbxProcessor processor =  this.getFbxProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String accessoryIds = requestObj.getString("accessoryIds"); 
			String[] ids = accessoryIds.split("_");
			processor.importFbx(session, ids);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("importFbx", "导入FBX失败", ex);
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