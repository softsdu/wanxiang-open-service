package com.zlp.external.resource.gltfZip.processor;
 
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.zip.ZipOutputStream;

import org.hibernate.Session;

import com.zlp.external.processor.ResourceFileProcessor;
import com.zlp.platform.common.FileOperate;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.SysConfig;
import com.zlp.platform.common.ValueConverter;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.platform.dao.db.DataTable;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.db.ValueType;
import com.zlp.platform.dao.sys.DataBaseDao;
import com.zlp.platform.dao.sys.IAccessoryDao;
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection; 

public class GltfZipProcessor extends ResourceFileProcessor implements IGltfZipProcessor{ 
	@Override
	public String importGltf(NcpSession session, String[] ids) throws Exception {
		String userId = session.getUserId();
		List<String> idList = new ArrayList<>();
		for(int i = 0; i < ids.length; i++){
			idList.add(ids[i]);
		}

		String gltfFileName = "";
		String binFileName = "";
		String assistFileName = "";
		String gltfFilePath = "";
		String binFilePath = "";
		String assistFilePath = "";		
		
		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		FileOperate fileOperate = this.getFileOperate();
		
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		Data accessoryData = DataCollection.getData("d_Accessory");
		DataTable accessoryDt = dbAccess.getDtByIds(dbSession, accessoryData, idList);
		List<DataRow> accessoryRows = accessoryDt.getRows();
		for(int i = 0; i < accessoryRows.size(); i++){
			 DataRow accessoryRow = accessoryRows.get(i);
			 String uploadUserId = accessoryRow.getStringValue("uploaduserid");
			 if(uploadUserId.equals(userId)){
				 String name = accessoryRow.getStringValue("name");
				 String fileType = accessoryRow.getStringValue("filetype");
				 Date uploadTime = accessoryRow.getDateTimeValue("uploadtime");
				 String millisecond = accessoryRow.getStringValue("millisecond");
				 switch(fileType){
				 	case "gltf":{
				 		gltfFileName = name;
				 		gltfFilePath = accessoryDao.getFilePathByNameAndUploadTime(name, uploadTime, millisecond);
				 		break;
				 	}
				 	case "bin":{
				 		binFileName = name;
				 		binFilePath = accessoryDao.getFilePathByNameAndUploadTime(name, uploadTime, millisecond);
				 		break;
				 	}
				 	case "assist":{
				 		assistFileName = name;
				 		assistFilePath = accessoryDao.getFilePathByNameAndUploadTime(name, uploadTime, millisecond);
				 		break;
				 	}
				 }
			 }
			 else{
				 throw new Exception("没有处理权限，");
			 }
		} 

		Date uploadTime = new Date();
		String zipFileName = gltfFileName.substring(0, gltfFileName.length() - 5);
		String dirPath = accessoryDao.getDirPathByNameAndUploadTime(zipFileName, uploadTime); 
		fileOperate.createFolder(dirPath); 
        SimpleDateFormat sdfFileName = new SimpleDateFormat("SSS");
        String millisecond = sdfFileName.format(uploadTime);
		String zipFilePath = accessoryDao.getFilePathByNameAndUploadTime(zipFileName, uploadTime, millisecond);		
		this.zipGltfFile(gltfFilePath, binFilePath, assistFilePath, zipFilePath, gltfFileName, binFileName, assistFileName);
		String zipFileType = "gltfZip"; 
		String accessoryId = accessoryDao.insertAccessoryRow(session, zipFileName, uploadTime, millisecond, zipFileType, "");

		Data resData = DataCollection.getData("res_Gltf");
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("name", zipFileName);
		p2vs.put("code", zipFileName + ValueConverter.dateTimeToString(uploadTime, SysConfig.getTimeFormat()));
		p2vs.put("filetype", zipFileType);
		p2vs.put("accessoryid", accessoryId);
		p2vs.put("createuser_xid",userId);
		p2vs.put("createtime", uploadTime);
		p2vs.put("companyid", session.getCompanyId());
		p2vs.put("deletetime", DataBaseDao.getDefaultDeleteTime());				 
		p2vs.put("isdeleted", "N");
		String resGltfId = dbAccess.insertByData(dbSession, resData, p2vs);		
		
		return resGltfId;
	}

	@Override
	public void endImportGltf(NcpSession session, String resGltfId, double sizeX, double sizeY, double sizeZ) throws Exception {
		String userId = session.getUserId();
		Date currentTime = new Date();
		
		String resSql = "select t.id as id,  t.createuser_xid as createuser_xid, t.name as name from res_gltf t"
				+ " where t.id = " + SysConfig.getParamPrefix() + "id";
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("createuser_xid");
		alias.add("name");
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("createuser_xid", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("id", resGltfId);

		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		
		DataTable resDt = dbAccess.selectList(dbSession, resSql, p2vs, alias, fieldValueTypes);
		List<DataRow> resRows = resDt.getRows();
		if(resRows.size() == 0){
			throw new Exception("不存在的gltf. res_Gltf.id = " + resGltfId);
		}
		else {
			DataRow resRow = resRows.get(0);
			String createUserId = resRow.getStringValue("createuser_xid");
			String name = resRow.getStringValue("name");
			if(createUserId.equals(userId)){
				Data resData = DataCollection.getData("res_Gltf");
				 HashMap<String, Object> updateP2vs = new HashMap<String, Object>();
				 updateP2vs.put("sizex", sizeX);
				 updateP2vs.put("sizey", sizeY);
				 updateP2vs.put("sizez", sizeZ);
				 updateP2vs.put("modifytime", currentTime);
				 updateP2vs.put("isactive", "Y");
				 updateP2vs.put("code", name);
				 dbAccess.updateByData(dbSession, resData, updateP2vs, resGltfId);
			 }
		}
	}
	
	private String getGltfAccessoryId(String gltfFileName, String fileType) throws Exception{
		String sql = "select t.accessoryid as accessoryid from res_Gltf t where t.name = " + SysConfig.getParamPrefix() + "name and t.filetype = " + SysConfig.getParamPrefix() + "filetype and t.isdeleted = 'N' and t.isactive = 'Y'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("name", gltfFileName);
		p2vs.put("filetype", fileType);

		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		String accessoryId = (String)dbAccess.selectOne(dbSession, sql, p2vs);
		if(accessoryId == null){
			throw new Exception("没有找到对应的文件, gltfFileName = " + gltfFileName);
		}
		else{
			return accessoryId;
		}
	} 
	
	private String getDxfAccessoryId(String gltfFileName, String fileType) throws Exception{
		String sql = "select t.accessoryid as accessoryid from res_Dxf t where t.name = " + SysConfig.getParamPrefix() + "name and t.filetype = " + SysConfig.getParamPrefix() + "filetype and t.isdeleted = 'N'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("name", gltfFileName);
		p2vs.put("filetype", fileType);
		
		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		String accessoryId = (String)dbAccess.selectOne(dbSession, sql, p2vs);
		if(accessoryId == null){
			throw new Exception("没有找到对应的文件, dxfFileName = " + gltfFileName);
		}
		else{
			return accessoryId;
		}
	}
	
	@Override
	public String getGltfFilePath(String gltfFileName) throws java.lang.Exception {		
		Session dbSession = this.getDBSession();
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		String accessoryId = this.getGltfAccessoryId(gltfFileName, "gltf");
		String filePath = accessoryDao.getFilePathById(accessoryId);
		return filePath;
	}
	
	@Override
	public String getBinFilePath(String binFileName) throws java.lang.Exception {	
		Session dbSession = this.getDBSession();	
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		String accessoryId = this.getGltfAccessoryId(binFileName, "bin");
		String filePath = accessoryDao.getFilePathById(accessoryId);
		return filePath;
	}

	//辅助点文件 added by ls 20230418
	@Override
	public String getAssistFilePath(String assistFileName) throws java.lang.Exception {	
		Session dbSession = this.getDBSession();	
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		String accessoryId = this.getGltfAccessoryId(assistFileName, "assist");
		String filePath = accessoryDao.getFilePathById(accessoryId);
		return filePath;
	}
	
	@Override
	public String getGltfZipFilePathByCode(String code) throws Exception {
		Data resData = DataCollection.getData("res_Gltf");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		DataTable resDt = dbAccess.getDtByFieldValue(dbSession, resData, "code", "=", code);
		List<DataRow> resRows = resDt.getRows();
		if(resRows.size() == 0){
			throw new Exception("不存在的gltf. code = " + code);
		}
		else{
			DataRow resRow = resRows.get(0);
			String accessoryId = resRow.getStringValue("accessoryid");
			IAccessoryDao accessoryDao = this.getAccessoryDao();
			accessoryDao.setDBSession(dbSession);
			String filePath = accessoryDao.getFilePathById(accessoryId);
			return filePath;
		}
	}
	
	@Override
	public String getGltfZipFilePathById(String id) throws Exception {
		String resSql = "select t.id as id,  t.createuser_xid as createuser_xid, t.name as name, t.accessoryid as accessoryid from res_gltf t"
				+ " where t.id = " + SysConfig.getParamPrefix() + "id";
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("createuser_xid");
		alias.add("name");
		alias.add("accessoryid");
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("createuser_xid", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		fieldValueTypes.put("accessoryid", ValueType.String);
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("id", id);

		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		DataTable resDt = dbAccess.selectList(dbSession, resSql, p2vs, alias, fieldValueTypes);
		
		List<DataRow> resRows = resDt.getRows();
		if(resRows.size() == 0){
			throw new Exception("不存在的gltf. id = " + id);
		}
		else{
			DataRow resRow = resRows.get(0);
			String accessoryId = resRow.getStringValue("accessoryid");
			IAccessoryDao accessoryDao = this.getAccessoryDao();
			accessoryDao.setDBSession(dbSession);
			String filePath = accessoryDao.getFilePathById(accessoryId);
			return filePath;
		}
	}

	//创建压缩文件 added by ls 20230825
	@Override
	public void zipGltfFile(String sourceGltfFilePath, String sourceBinFilePath, String sourceAssistFilePath, String zippedFilePath, String gltfName, String binName, String assistName) throws IOException{
		File zipFile = new File(zippedFilePath);
		if(!zipFile.exists()){
	        ZipOutputStream zos = null;
	        BufferedInputStream bis = null;
	        try{ 
		        zos = new ZipOutputStream (new FileOutputStream(zippedFilePath)) ;  
		        this.zipFile(sourceGltfFilePath, gltfName, zos);
		        //如果binName为空，那么无需压缩 modified by ls 20230417
		        if(binName != null && binName.length() != 0){
		        	this.zipFile(sourceBinFilePath, binName, zos);
		        }

		        //辅助点 added by ls 20230418
		        if(assistName != null && assistName.length() != 0){
		        	this.zipFile(sourceAssistFilePath, assistName, zos);
		        }
	        }
	        catch(Exception ex){
	        	throw ex;
	        }
	        finally{ 
	        	if(zos != null){
	        		zos.close();
	        	}
	        }	
		}
	} 
    
    //获取gltf尺寸 added by ls 20230829
    @Override
    public Double[] getGltfSize(String code) throws Exception{
		Data resData = DataCollection.getData("res_Gltf");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		DataTable resDt = dbAccess.getDtByFieldValue(dbSession, resData, "code", "=", code);
		List<DataRow> resRows = resDt.getRows();
		if(resRows.size() == 0){
			throw new Exception("None gltf. Code = " + code);
		}
		else{
			DataRow resRow = resRows.get(0);
			Double[] sizeValues = new Double[3];
			sizeValues[0] = resRow.getBigDecimalValue("sizex").doubleValue();
			sizeValues[1] = resRow.getBigDecimalValue("sizey").doubleValue();
			sizeValues[2] = resRow.getBigDecimalValue("sizez").doubleValue();
			return sizeValues;
		}
    }
	
}
