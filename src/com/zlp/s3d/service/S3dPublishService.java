package com.zlp.s3d.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
import com.zlp.mdl.processor.IMdlComponentProcessor;
import com.zlp.platform.common.*;
import com.zlp.platform.common.util.CommonFunction;
import com.zlp.s3d.processor.AppKeyStatus;
import com.zlp.s3d.processor.IS3dModelProcessor;
import com.zlp.s3d.processor.IS3dPublishProcessor;
import com.zlp.s3d.processor.IS3dSystemProcessor;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import java.sql.SQLException;
import java.util.HashMap;

public class S3dPublishService extends NcpActionSupport implements IS3dPublishService{

	private static Logger logger=Logger.getLogger(S3dPublishService.class);
	
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

	private IS3dPublishProcessor s3dPublishProcessor = null;
	public void setS3dPublishProcessor(IS3dPublishProcessor s3dPublishProcessor){
		this.s3dPublishProcessor = s3dPublishProcessor;
	}
	protected IS3dPublishProcessor getS3dPublishProcessor(){
		return this.s3dPublishProcessor;
	}

	@Override
	public String publishModel(){
		Session dbSession = null;
		try
		{
			logger.info(requestParam);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

			dbSession = this.openDBSession();
			IS3dPublishProcessor s3dPublishProcessor = this.getS3dPublishProcessor();
			s3dPublishProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), true);
			String modelId = requestObj.getString("id");

			s3dPublishProcessor.publishModel(session, modelId);
			String zipFilePath = s3dPublishProcessor.generatePublishZipFile(session, modelId);

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("modelId", modelId);
			resultHash.put("userId", session.getUserId());
			resultHash.put("zipFilePath", zipFilePath);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("publishModel", "提示: "+ ex.getMessage(), ex);
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