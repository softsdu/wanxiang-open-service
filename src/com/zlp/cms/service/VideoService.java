package com.zlp.cms.service;
  
import java.sql.SQLException;
import java.util.HashMap; 

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import com.zlp.cms.processor.IVideoProcessor;
import com.zlp.cms.processor.VideoProcessor;
import com.zlp.platform.common.JSONProcessor;
import com.zlp.platform.common.NcpActionSupport;
import com.zlp.platform.common.NcpException;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.ServiceResultProcessor;
import com.zlp.platform.common.util.CommonFunction;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
 
public class VideoService extends NcpActionSupport implements IVideoService{
  	private static Logger logger=Logger.getLogger(VideoService.class); 
	
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	 
	private IVideoProcessor videoProcessor;
	public void setVideoProcessor(IVideoProcessor videoProcessor){
		this.videoProcessor = videoProcessor;
	}
	private IVideoProcessor getVideoProcessor(){
		return this.videoProcessor;
	} 
	   
	@Override
	public String getVideoList(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), false); 
			IVideoProcessor processor =  this.getVideoProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			String videoName = CommonFunction.decode(requestObj.getString("videoName"));   
			JSONArray videoRowArray = processor.getVideoList(session, videoName);
			

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("videos", videoRowArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getVideoList", "获取视频列表失败", ex);
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
	public String importVideo(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), false); 
			IVideoProcessor processor =  this.getVideoProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String accessoryIds = requestObj.getString("accessoryIds"); 
			String[] ids = accessoryIds.split("_");
			processor.importVideo(session, ids); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("importVideo", "导入视频失败", ex);
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