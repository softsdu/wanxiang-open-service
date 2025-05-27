package com.zlp.external.resource.fbxZip.service;
  
import java.util.HashMap;

import com.zlp.external.resource.fbxZip.processor.IFbxZipProcessor;
import com.zlp.s3d.processor.IS3dComponentLocalProcessor;
import com.zlp.s3d.processor.IS3dComponentProcessor;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import com.zlp.external.service.ResourceFileService;
import com.zlp.platform.common.JSONProcessor;
import com.zlp.platform.common.NcpException;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.ServiceResultProcessor;
import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
 
public class FbxZipService extends ResourceFileService implements IFbxZipService {

	private static final long serialVersionUID = 3858570159382712974L;
	
	private static Logger logger = Logger.getLogger(FbxZipService.class);

	private IS3dComponentLocalProcessor s3dComponentLocalProcessor = null;
	public void setS3dComponentLocalProcessor(IS3dComponentLocalProcessor s3dComponentLocalProcessor){
		this.s3dComponentLocalProcessor = s3dComponentLocalProcessor;
	}
	protected IS3dComponentLocalProcessor getS3dComponentLocalProcessor(){
		return this.s3dComponentLocalProcessor;
	}

	private IS3dComponentProcessor s3dComponentProcessor = null;
	public void setS3dComponentProcessor(IS3dComponentProcessor s3dComponentProcessor){
		this.s3dComponentProcessor = s3dComponentProcessor;
	}
	protected IS3dComponentProcessor getS3dComponentProcessor(){
		return this.s3dComponentProcessor;
	}

	@Override
	public String importFbx(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), true);
			IFbxZipProcessor processor =  (IFbxZipProcessor)this.getResourceFileProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			IS3dComponentLocalProcessor componentLocalProcessor = this.getS3dComponentLocalProcessor();
			componentLocalProcessor.setDBSession(dbSession);

			IS3dComponentProcessor componentProcessor = this.getS3dComponentProcessor();
			componentProcessor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			String accessoryIds = requestObj.getString("accessoryIds");
			String[] ids = accessoryIds.split("_");
			String resFbxId = processor.importFbx(session, ids);
			componentLocalProcessor.createComponentLocal(session, resFbxId, "fbx", null);
			componentProcessor.generateAppComponentsAndConfig(session, "", session.getUserId());
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("resFbxId", resFbxId);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString());
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("importFbx", "导入fbx相关文件", ex);
			this.addResponse(ncpEx.toJsonString());
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
		return ActionSupport.SUCCESS;	
	} 

	//完成上传fbx added by ls 20230825
	@Override
	public String endImportFbx(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), true);
			IFbxZipProcessor processor = (IFbxZipProcessor)this.getResourceFileProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String id = requestObj.getString("id"); 
			double sizeX = requestObj.getDouble("sizeX"); 
			double sizeY= requestObj.getDouble("sizeY"); 
			double sizeZ = requestObj.getDouble("sizeZ"); 
			processor.endImportFbx(session, id, sizeX, sizeY, sizeZ); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString());
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("endImportFbx", "完成导入fbx相关文件", ex);
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