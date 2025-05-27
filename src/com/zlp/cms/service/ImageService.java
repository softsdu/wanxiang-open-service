package com.zlp.cms.service;
  
import java.sql.SQLException;
import java.util.HashMap; 

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import com.zlp.cms.processor.ImageProcessor;
import com.zlp.platform.common.JSONProcessor;
import com.zlp.platform.common.NcpActionSupport;
import com.zlp.platform.common.NcpException;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.ServiceResultProcessor;
import com.zlp.platform.common.util.CommonFunction;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
 
public class ImageService extends NcpActionSupport implements IImageService{
  	private static Logger logger=Logger.getLogger(ImageService.class); 
	
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	 
	private ImageProcessor imageProcessor;
	public void setImageProcessor(ImageProcessor imageProcessor){
		this.imageProcessor = imageProcessor;
	}
	private ImageProcessor getImageProcessor(){
		return this.imageProcessor;
	} 
	   
	@Override
	public String getImageList(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), false); 
			ImageProcessor processor =  this.getImageProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			String imageName = CommonFunction.decode(requestObj.getString("imageName"));   
			JSONArray imageRowArray = processor.getImageList(session, imageName);
			

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("images", imageRowArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getImageList", "获取图片列表失败", ex);
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
	public String importImage(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), false); 
			ImageProcessor processor =  this.getImageProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String accessoryIds = requestObj.getString("accessoryIds"); 
			String[] ids = accessoryIds.split("_");
			processor.importImage(session, ids); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("importImage", "导入图片失败", ex);
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