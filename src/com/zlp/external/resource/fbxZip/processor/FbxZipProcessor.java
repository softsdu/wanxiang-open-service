package com.zlp.external.resource.fbxZip.processor;
 
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.zip.ZipOutputStream;

import com.alibaba.fastjson.JSONObject;
import com.zlp.s3d.processor.IS3dSystemProcessor;
import org.hibernate.Session;

import com.zlp.external.processor.ResourceFileProcessor;
import com.zlp.platform.common.FileOperate;
import com.zlp.platform.common.INcpSession;
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

public class FbxZipProcessor extends ResourceFileProcessor implements IFbxZipProcessor{
	private String defaultFilterType;
	@Override
	public String getDefaultFilterType() {
		return defaultFilterType;
	}
	public void setDefaultFilterType(String defaultFilterType) {
		this.defaultFilterType = defaultFilterType;
	}

	private IS3dSystemProcessor s3dSystemProessor;
	public void setS3dSystemProcessor(IS3dSystemProcessor s3dSystemProessor){
		this.s3dSystemProessor = s3dSystemProessor;
	}
	public IS3dSystemProcessor getS3dSystemProcessor(){
		return this.s3dSystemProessor;
	}

	private String getComponentAbsoluteDirPath(INcpSession session, String userImageFolder, String resId) throws SQLException {
		return userImageFolder + resId + "/";
	}

	@Override
	public String importFbx(INcpSession session, String[] ids) throws Exception {
		String userId = session.getUserId();
		List<String> idList = new ArrayList<>();
		for(int i = 0; i < ids.length; i++){
			idList.add(ids[i]);
		}

		String fbxFileName = "";
		String assistFileName = "";
		String assistFilePath = "";
		List<String> imageFiles = new ArrayList<>();

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
				 switch(fileType) {
					 case "fbx": {
						 fbxFileName = name;
						 break;
					 }
					 case "assist": {
						 Date uploadTime = accessoryRow.getDateTimeValue("uploadtime");
						 String millisecond = accessoryRow.getStringValue("millisecond");
						 assistFileName = name;
						 assistFilePath = accessoryDao.getFilePathByNameAndUploadTime(name, uploadTime, millisecond);
						 break;
					 }
					 default: {
						 break;
					 }
				 }
			 }
			 else{
				 throw new Exception("没有处理权限，");
			 }
		} 

		Date uploadTime = new Date();
		String zipFileName = fbxFileName.substring(0, fbxFileName.length() - 4);
		String dirPath = accessoryDao.getDirPathByNameAndUploadTime(zipFileName, uploadTime); 
		fileOperate.createFolder(dirPath); 
        SimpleDateFormat sdfFileName = new SimpleDateFormat("SSS");
        String millisecond = sdfFileName.format(uploadTime);
		String zipFilePath = accessoryDao.getFilePathByNameAndUploadTime(zipFileName, uploadTime, millisecond);		
		this.zipFbxFile(zipFilePath, fbxFileName, assistFileName, assistFilePath);
		String zipFileType = "fbxZip"; 
		String fbxZipAccessoryId = accessoryDao.insertAccessoryRow(session, zipFileName, uploadTime, millisecond, zipFileType, "");

		for(int i = 0; i < accessoryRows.size(); i++) {
			DataRow accessoryRow = accessoryRows.get(i);
			String accessoryId = accessoryRow.getStringValue("id");
			HashMap<String, Object> accessoryP2vs = new HashMap<>();
			accessoryP2vs.put("filtertype", this.getDefaultFilterType());
			accessoryP2vs.put("filtervalue", fbxZipAccessoryId);
			dbAccess.updateByData(this.getDBSession(), accessoryData, accessoryP2vs, accessoryId);
		}

		Data resData = DataCollection.getData("res_Fbx");
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("name", zipFileName);
		p2vs.put("code", zipFileName + ValueConverter.dateTimeToString(uploadTime, SysConfig.getTimeFormat()));
		p2vs.put("filetype", zipFileType);
		p2vs.put("accessoryid", fbxZipAccessoryId);
		p2vs.put("createuser_xid",userId);
		p2vs.put("createtime", uploadTime);
		p2vs.put("companyid", session.getCompanyId());
		p2vs.put("deletetime", DataBaseDao.getDefaultDeleteTime());
		p2vs.put("isactive", "Y");
		p2vs.put("isdeleted", "N");
		String resFbxId = dbAccess.insertByData(dbSession, resData, p2vs);

		//更新filterValue
		for(int i = 0; i < accessoryRows.size(); i++){
			DataRow accessoryRow = accessoryRows.get(i);
			String fileAccId = accessoryRow.getStringValue("id");
			String updateSql = "update d_accessory set filtervalue=" + SysConfig.getParamPrefix() + "resfbxid where id=" + SysConfig.getParamPrefix() + "fileaccid";
			HashMap<String, Object> fileAccP2vs = new HashMap<>();
			fileAccP2vs.put("resfbxid", resFbxId);
			fileAccP2vs.put("fileaccid", fileAccId);
			dbAccess.update(dbSession, updateSql, fileAccP2vs);
		}

		return resFbxId;
	}

	@Override
	public void endImportFbx(INcpSession session, String resFbxId, double sizeX, double sizeY, double sizeZ) throws Exception {
		String userId = session.getUserId();
		Date currentTime = new Date();
		
		String resSql = "select t.id as id,  t.createuser_xid as createuser_xid, t.name as name from res_fbx t"
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
		p2vs.put("id", resFbxId);

		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		
		DataTable resDt = dbAccess.selectList(dbSession, resSql, p2vs, alias, fieldValueTypes);
		List<DataRow> resRows = resDt.getRows();
		if(resRows.size() == 0){
			throw new Exception("不存在的fbx. res_Fbx.id = " + resFbxId);
		}
		else {
			DataRow resRow = resRows.get(0);
			String createUserId = resRow.getStringValue("createuser_xid");
			String name = resRow.getStringValue("name");
			if(createUserId.equals(userId)){
				Data resData = DataCollection.getData("res_Fbx");
				 HashMap<String, Object> updateP2vs = new HashMap<String, Object>();
				 updateP2vs.put("sizex", sizeX);
				 updateP2vs.put("sizey", sizeY);
				 updateP2vs.put("sizez", sizeZ);
				 updateP2vs.put("modifytime", currentTime);
				 updateP2vs.put("isactive", "Y");
				 updateP2vs.put("code", name);
				 dbAccess.updateByData(dbSession, resData, updateP2vs, resFbxId);
			 }
		}
	}
	
	private String getFbxAccessoryId(String fbxFileName, String fileType) throws Exception{
		String sql = "select t.accessoryid as accessoryid from res_Fbx t where t.name = " + SysConfig.getParamPrefix() + "name and t.filetype = " + SysConfig.getParamPrefix() + "filetype and t.isdeleted = 'N' and t.isactive = 'Y'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("name", fbxFileName);
		p2vs.put("filetype", fileType);

		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		String accessoryId = (String)dbAccess.selectOne(dbSession, sql, p2vs);
		if(accessoryId == null){
			throw new Exception("没有找到对应的文件, fbxFileName = " + fbxFileName);
		}
		else{
			return accessoryId;
		}
	} 
	
	private String getDxfAccessoryId(String fbxFileName, String fileType) throws Exception{
		String sql = "select t.accessoryid as accessoryid from res_Dxf t where t.name = " + SysConfig.getParamPrefix() + "name and t.filetype = " + SysConfig.getParamPrefix() + "filetype and t.isdeleted = 'N'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("name", fbxFileName);
		p2vs.put("filetype", fileType);
		
		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		String accessoryId = (String)dbAccess.selectOne(dbSession, sql, p2vs);
		if(accessoryId == null){
			throw new Exception("没有找到对应的文件, dxfFileName = " + fbxFileName);
		}
		else{
			return accessoryId;
		}
	}
	
	@Override
	public String getFbxFilePath(String fbxFileName) throws java.lang.Exception {		
		Session dbSession = this.getDBSession();
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		String accessoryId = this.getFbxAccessoryId(fbxFileName, "fbx");
		String filePath = accessoryDao.getFilePathById(accessoryId);
		return filePath;
	}

	//辅助点文件 added by ls 20230418
	@Override
	public String getAssistFilePath(String assistFileName) throws java.lang.Exception {	
		Session dbSession = this.getDBSession();	
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		String accessoryId = this.getFbxAccessoryId(assistFileName, "assist");
		String filePath = accessoryDao.getFilePathById(accessoryId);
		return filePath;
	}
	
	@Override
	public String getFbxZipFilePathByCode(String code) throws Exception {
		Data resData = DataCollection.getData("res_Fbx");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		DataTable resDt = dbAccess.getDtByFieldValue(dbSession, resData, "code", "=", code);
		List<DataRow> resRows = resDt.getRows();
		if(resRows.size() == 0){
			throw new Exception("不存在的fbx. code = " + code);
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
	public String getFbxZipFilePathById(String id) throws Exception {
		String resSql = "select t.id as id,  t.createuser_xid as createuser_xid, t.name as name, t.accessoryid as accessoryid from res_fbx t"
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
		if(resRows.isEmpty()){
			throw new Exception("不存在的fbx. id = " + id);
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
	public void zipFbxFile(String zippedFilePath, String fbxName, String assistName, String assistFilePath) throws IOException{
		JSONObject json = new JSONObject();
		json.put("fbxName", fbxName);
		json.put("assistName", assistName);
		File zipFile = new File(zippedFilePath);
		if(!zipFile.exists()){
	        ZipOutputStream zos = null;
	        BufferedInputStream bis = null;
	        try{ 
		        zos = new ZipOutputStream (new FileOutputStream(zippedFilePath)) ;
				this.zipText(json.toJSONString(), fbxName, zos);

				//辅助点
				if(assistName != null && !assistName.isEmpty()){
					this.zipFile(assistFilePath, assistName, zos);
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
    
    //获取fbx尺寸 added by ls 20230829
    @Override
    public Double[] getFbxSize(String code) throws Exception{
		Data resData = DataCollection.getData("res_Fbx");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		DataTable resDt = dbAccess.getDtByFieldValue(dbSession, resData, "code", "=", code);
		List<DataRow> resRows = resDt.getRows();
		if(resRows.isEmpty()){
			throw new Exception("None fbx. Code = " + code);
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

	@Override
	public String getFbxImgFilePathByName(String resFbxName, String imgName) throws Exception {
		String resSql = "select t.id as id "
				+ "from res_fbx t"
				+ " where t.code = " + SysConfig.getParamPrefix() + "code"
				+ " and t.isdeleted = 'N'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("code", resFbxName);

		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		String resFbxId = (String) dbAccess.selectOne(dbSession, resSql, p2vs);

		if(resFbxId == null){
			throw new Exception("不存在的fbx. resFbxName = " + resFbxName);
		}
		else{
			return this.getFbxImgFilePathById(resFbxId, imgName);
		}
	}

	@Override
	public String getFbxImgFilePathById(String resFbxId, String imgName) throws Exception {
		String accSql = "select t.id as id "
				+ " from d_accessory t "
				+ " where t.filtervalue=" + SysConfig.getParamPrefix() + "resfbxid "
				+ " and t.name=" + SysConfig.getParamPrefix() + "imgname";
		HashMap<String, Object> accP2vs = new HashMap<>();
		accP2vs.put("resfbxid", resFbxId);
		accP2vs.put("imgname", imgName);

		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		String accessoryId = (String) dbAccess.selectOne(dbSession, accSql, accP2vs);
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		return accessoryDao.getFilePathById(accessoryId);
	}

	@Override
	public String getFbxFilePathByName(String resFbxName, String fbxName) throws Exception {
		String resSql = "select t.id as id "
				+ "from res_fbx t"
				+ " where t.code = " + SysConfig.getParamPrefix() + "code"
				+ " and t.isdeleted = 'N'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("code", resFbxName);

		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		String resFbxId = (String) dbAccess.selectOne(dbSession, resSql, p2vs);

		if(resFbxId == null){
			throw new Exception("不存在的fbx. resFbxName = " + resFbxName);
		}
		else{
			return this.getFbxImgFilePathById(resFbxId, fbxName);
		}
	}

	@Override
	public String getFbxFilePathById(String resFbxId, String fbxName) throws Exception {
		String accSql = "select t.id as id "
				+ " from d_accessory t "
				+ " where t.filtervalue=" + SysConfig.getParamPrefix() + "resfbxid "
				+ " and t.name=" + SysConfig.getParamPrefix() + "fbxname";
		HashMap<String, Object> accP2vs = new HashMap<>();
		accP2vs.put("resfbxid", resFbxId);
		accP2vs.put("fbxname", fbxName);

		IDBParserAccess dbAccess = this.getDBParserAccess();
		Session dbSession = this.getDBSession();
		String accessoryId = (String) dbAccess.selectOne(dbSession, accSql, accP2vs);
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		return accessoryDao.getFilePathById(accessoryId);
	}

	private String getUserComponentConfigFilePath(String userId){
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());
		String configFilePath = s3dSystemProcessor.getUserConfigFilePath(userId, "componentList.js");
		return configFilePath;
	}

	@Override
	public void copyComponentsToResourceFolder(INcpSession session) throws Exception {
		String userId = session.getUserId();
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());
		String userComponentFolder = s3dSystemProcessor.getUserComponentFolder(userId);
		this.copyComponentsToResourceFolder(session, userComponentFolder);
	}

	private void copyComponentsToResourceFolder(INcpSession session, String userComponentFolder) throws Exception {
		String userId = session.getUserId();
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());
		List<DataRow> rows = s3dSystemProcessor.getComponentLocalRows(session, session.getUserId());
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			String resId = row.getStringValue("fileinfodirectory");
			this.copyComponentToResourceFolder(session, userComponentFolder, resId);
		}
	}

	@Override
	public boolean checkComponentsInResourceFolder(INcpSession session) throws Exception {
		String userId = session.getUserId();
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());
		String userComponentFolder = s3dSystemProcessor.getUserComponentFolder(userId);
		String configFilePath = this.getUserComponentConfigFilePath(userId);
		return this.checkComponentsInResourceFolder(session, userComponentFolder, configFilePath);
	}

	private boolean checkComponentsInResourceFolder(INcpSession session, String userComponentFolder, String configFilePath) throws Exception {
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());
		List<DataRow> rows = s3dSystemProcessor.getComponentLocalRows(session, session.getUserId());
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			String code = row.getStringValue("code");
			if(!this.checkExistComponentFile(session, userComponentFolder, code)){
				return false;
			}
		}

		FileOperate fo = new FileOperate();
		return fo.exists(configFilePath);
	}

	private boolean checkExistComponentFile(INcpSession session, String userComponentFolder, String code) throws Exception {
		String destFilePath = this.getComponentAbsoluteDirPath(session, userComponentFolder, code);
		FileOperate fo = new FileOperate();
		return fo.exists(destFilePath);
	}

	@Override
	public void copyComponentToResourceFolder(INcpSession session, String resId) throws Exception {
		String userId = session.getUserId();
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());
		String userComponentFolder = s3dSystemProcessor.getUserComponentFolder(userId);
		this.copyComponentToResourceFolder(session, userComponentFolder, resId);
	}

	private void copyComponentToResourceFolder(INcpSession session, String userImageFolder, String resId) throws Exception {
		String destDirPath = this.getComponentAbsoluteDirPath(session, userImageFolder, resId);
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(this.getDBSession());
		File dir = new File(destDirPath);
		FileOperate fo = new FileOperate();
		fo.createFolderRecursion(dir);

		List<DataRow> accessoryRows = accessoryDao.getAccessoryDataRows(this.getDefaultFilterType(), resId);
		for(int i = 0; i < accessoryRows.size(); i++){
			DataRow accessoryRow = accessoryRows.get(i);
			String id = accessoryRow.getStringValue("id");
			String name = accessoryRow.getStringValue("name");
			Date uploadTime = accessoryRow.getDateTimeValue("uploadtime");
			String millisecond = accessoryRow.getStringValue("millisecond");
			String sourceFilePath = accessoryDao.getFilePathByNameAndUploadTime(name, uploadTime, millisecond);
			String destFilePath = destDirPath + name;
			if(!fo.exists(destFilePath)) {
				fo.copyFile(sourceFilePath, destFilePath);
			}
		}
	}

	@Override
	public void generateComponentListConfigFile(INcpSession session) throws Exception {
		String userId = session.getUserId();
		String configFilePath = this.getUserComponentConfigFilePath(userId);
		this.generateComponentListConfigFile(session, configFilePath);
	}

	@Override
	public DataRow getResRow(INcpSession session, String resId) {
		Data data = DataCollection.getData("res_Fbx");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDtById(this.getDBSession(), data, resId);
		List<DataRow> rows = dt.getRows();
		if(rows.isEmpty()){
			return null;
		}
		else{
			return rows.get(0);
		}
	}

	private void generateComponentListConfigFile(INcpSession session, String configFilePath) throws Exception {
		String userId = session.getUserId();
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());
		String configText = s3dSystemProcessor.generateComponentConfigString(session, userId);

		StringBuilder fileStr = new StringBuilder("export const componentList = ");
		fileStr.append(configText);
		fileStr.append(";");

		FileOperate fo = new FileOperate();
		File file = new File(configFilePath);
		fo.createFolderRecursion(file.getParentFile());

		fo.createFile(configFilePath, fileStr.toString(), FileOperate.DefaultEncoding);
	}

	private String getAppComponentFolder(INcpSession session, String appFolder) throws SQLException {
		return appFolder + "resources/files/";
	}
}
