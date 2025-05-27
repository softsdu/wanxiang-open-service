package com.zlp.s3d.service;

import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
import com.zlp.platform.common.*;
import com.zlp.platform.dao.sys.ContextUtil;
import com.zlp.s3d.processor.IS3dSkyProcessor;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import java.sql.SQLException;
import java.util.HashMap;

public class S3dSkyService extends NcpActionSupport implements IS3dSkyService{

	private static Logger logger=Logger.getLogger(S3dSkyService.class);
	
	private HibernateTransactionManager transactionManager;
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{
		return this.transactionManager.getSessionFactory().openSession(); 
	}

	private IS3dSkyProcessor s3dSkyProcessor = null;
	public void setS3dSkyProcessor(IS3dSkyProcessor s3dSkyProcessor){
		this.s3dSkyProcessor = s3dSkyProcessor;
	}
	protected IS3dSkyProcessor getS3dSkyProcessor(){
		return this.s3dSkyProcessor;
	}

	@Override
	public String generateSkyConfigFile(){
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

			dbSession = this.openDBSession();
			IS3dSkyProcessor s3dSkyProcessor = this.getS3dSkyProcessor();
			s3dSkyProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), true);
			String modelId = requestObj.getString("id");

			s3dSkyProcessor.generateSkyConfigFile(session);

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("generateSkyConfigFile", "提示: "+ ex.getMessage(), ex);
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