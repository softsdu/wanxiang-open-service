package com.zlp.external.resource.gltfZip.service;
  
import java.util.HashMap;

import com.zlp.external.resource.gltfZip.processor.IGltfZipProcessor;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import com.zlp.external.service.ResourceFileService;
import com.zlp.platform.common.JSONProcessor;
import com.zlp.platform.common.NcpException;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.ServiceResultProcessor;
import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
 
public class GltfZipService extends ResourceFileService implements IGltfZipService{

	private static final long serialVersionUID = 3858570159382712974L;
	
	private static Logger logger = Logger.getLogger(GltfZipService.class); 
		
	@Override
	public String importGltf(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), false); 
			IGltfZipProcessor processor =  (IGltfZipProcessor)this.getResourceFileProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String accessoryIds = requestObj.getString("accessoryIds"); 
			String[] ids = accessoryIds.split("_");
			String resGltfId = processor.importGltf(session, ids);			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("resGltfId", resGltfId);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("importGltf", "导入gltf相关文件", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
		return ActionSupport.SUCCESS;	
	} 

	//完成上传gltf added by ls 20230825
	@Override
	public String endImportGltf(){
		Session dbSession = null;
		try{
			logger.info(requestParam);
			
			NcpSession session = new NcpSession(this.getHttpCookies(), false); 
			IGltfZipProcessor processor = (IGltfZipProcessor)this.getResourceFileProcessor();
			dbSession = this.openDBSession();
			processor.setDBSession(dbSession);

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String id = requestObj.getString("id"); 
			double sizeX = requestObj.getDouble("sizeX"); 
			double sizeY= requestObj.getDouble("sizeY"); 
			double sizeZ = requestObj.getDouble("sizeZ"); 
			processor.endImportGltf(session, id, sizeX, sizeY, sizeZ); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("endImportGltf", "完成导入gltf相关文件", ex);
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