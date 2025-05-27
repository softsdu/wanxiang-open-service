package com.zlp.s3d.service;

import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
import com.zlp.platform.common.*;
import com.zlp.s3d.processor.IS3dContent2DProcessor;
import com.zlp.s3d.processor.IS3dSkyProcessor;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import java.sql.SQLException;
import java.util.HashMap;

public class S3dContent2DService extends NcpActionSupport implements IS3dContent2DService{

	private static Logger logger=Logger.getLogger(S3dContent2DService.class);
	
	private HibernateTransactionManager transactionManager;
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{
		return this.transactionManager.getSessionFactory().openSession(); 
	}

	private IS3dContent2DProcessor s3dContent2DProcessor = null;
	public void setS3dContent2DProcessor(IS3dContent2DProcessor s3dContent2DProcessor){
		this.s3dContent2DProcessor = s3dContent2DProcessor;
	}
	protected IS3dContent2DProcessor getS3dContent2DProcessor(){
		return this.s3dContent2DProcessor;
	}

	@Override
	public String generateContent2DConfigFile(){
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

			dbSession = this.openDBSession();
			IS3dContent2DProcessor s3dContent2DProcessor = this.getS3dContent2DProcessor();
			s3dContent2DProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), true);
			String modelId = requestObj.getString("id");

			s3dContent2DProcessor.generateContent2DConfigFile(session);

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("generateContent2DConfigFile", "提示: "+ ex.getMessage(), ex);
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