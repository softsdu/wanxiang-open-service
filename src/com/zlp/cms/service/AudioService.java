package com.zlp.cms.service;
  
import java.sql.SQLException;
import java.util.HashMap; 

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager; 

import com.zlp.cms.processor.AudioProcessor;
import com.zlp.cms.processor.IAudioProcessor;
import com.zlp.platform.common.JSONProcessor;
import com.zlp.platform.common.NcpActionSupport;
import com.zlp.platform.common.NcpException;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.ServiceResultProcessor;
import com.zlp.platform.common.util.CommonFunction;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
 
public class AudioService extends NcpActionSupport implements IAudioService{
  	private static Logger logger=Logger.getLogger(AudioService.class); 
	
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	 
	private IAudioProcessor audioProcessor;
	public void setAudioProcessor(IAudioProcessor audioProcessor){
		this.audioProcessor = audioProcessor;
	}
	private IAudioProcessor getAudioProcessor(){
		return this.audioProcessor;
	} 
	   
	@Override
	public String getAudioList(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), false); 
			IAudioProcessor processor =  this.getAudioProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			String audioName = CommonFunction.decode(requestObj.getString("audioName"));   
			JSONArray audioRowArray = processor.getAudioList(session, audioName);
			

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("audios", audioRowArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getAudioList", "获取音频列表失败", ex);
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
	public String importAudio(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), false); 
			IAudioProcessor processor =  this.getAudioProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String accessoryIds = requestObj.getString("accessoryIds"); 
			String[] ids = accessoryIds.split("_");
			processor.importAudio(session, ids); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("importAudio", "导入音频失败", ex);
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