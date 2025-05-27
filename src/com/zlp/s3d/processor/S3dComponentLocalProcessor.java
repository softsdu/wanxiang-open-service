package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONObject;
import com.zlp.external.resource.fbxZip.processor.FbxZipProcessor;
import com.zlp.external.resource.fbxZip.processor.IFbxZipProcessor;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.SysConfig;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.platform.dao.db.DataTable;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.db.ValueType;
import com.zlp.platform.dao.sys.DataBaseDao;
import com.zlp.platform.dao.sys.IAccessoryDao;
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection;
import org.apache.commons.fileupload.FileItem;
import org.hibernate.Session;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

public class S3dComponentLocalProcessor implements IS3dComponentLocalProcessor {

	private IAccessoryDao accessoryDao;
	public IAccessoryDao getAccessoryDao() {
		return accessoryDao;
	}
	public void setAccessoryDao(IAccessoryDao accessoryDao) {
		this.accessoryDao = accessoryDao;
	}

	private IFbxZipProcessor fbxZipProcessor;
	public IFbxZipProcessor getFbxZipProcessor() {
		return fbxZipProcessor;
	}
	public void setFbxZipProcessor(IFbxZipProcessor fbxZipProcessor) {
		this.fbxZipProcessor = fbxZipProcessor;
	}

	private IDBParserAccess dBParserAccess;
	public void setDBParserAccess(IDBParserAccess dBParserAccess){ 
		this.dBParserAccess = dBParserAccess;
	}	
	public IDBParserAccess getDBParserAccess(){ 
		return this.dBParserAccess;
	}

	private IS3dSystemProcessor s3dSystemProcessor = null;
	public void setS3dSystemProcessor(IS3dSystemProcessor s3dSystemProcessor) {
		this.s3dSystemProcessor = s3dSystemProcessor;
	}
	public IS3dSystemProcessor getS3dSystemProcessor(){
		return this.s3dSystemProcessor;
	}

	private Session dbSession = null;
	protected Session getDBSession(){ 
		if(this.dbSession == null){
			throw new RuntimeException("none db session.");
		}
		return this.dbSession;
	} 
	public void setDBSession(Session dbSession){
		this.dbSession = dbSession;
	}

	@Override
	public JSONObject createComponentLocal(INcpSession session, List<FileItem> fileList, String appKey, String comTypeCode) throws Exception {
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(this.getDBSession());
		IS3dSystemProcessor systemProcessor = this.getS3dSystemProcessor();
		systemProcessor.setDBSession(this.getDBSession());
		IFbxZipProcessor fbxZipProcessor = this.getFbxZipProcessor();
		fbxZipProcessor.setDBSession(this.getDBSession());

		int fileCount = fileList.size();
		String[] accessoryIds = new String[fileCount];
		String componentName = "";
		String componentFileName = "";
		String fileInfoType = "";
		String filterType = "";

		for (int i = 0; i < fileList.size(); i++) {
			FileItem fileItem = fileList.get(i);
			String fileName = fileItem.getName();
			int dotIndex = fileName.lastIndexOf(".") + 1;
			String postfix = fileName.substring(dotIndex).toLowerCase();
			switch (postfix) {
				case "fbx": {
					componentFileName = fileName;
					componentName = componentFileName.substring(0, dotIndex - 1);
					fileInfoType = "fbx";
					filterType = fbxZipProcessor.getDefaultFilterType();
					break;
				}
				case "gltf":{
					throw new Exception("暂未支持gltf格式");
				}
			}
		}
		if(componentName.length() == 0){
			throw new Exception("没有发现模型文件（*.fbx）");
		}

		for (int i = 0; i < fileList.size(); i++) {
			FileItem fileItem = fileList.get(i);
			InputStream fileStream = fileItem.getInputStream();
			String fileName = fileItem.getName();
			String accessoryId = accessoryDao.saveAccessory(session, fileStream, fileName, filterType, appKey);
			accessoryIds[i] = accessoryId;
		}
		String resId = null;

		switch (fileInfoType) {
			case "fbx": {
				resId = fbxZipProcessor.importFbx(session, accessoryIds);
				break;
			}
			case "gltf":{
				break;
			}
		}

		String comTypeId = "";
		if(comTypeCode.equals(systemProcessor.getComTypeRootCode())){
			comTypeId = null;
		}
		else if (!comTypeCode.isEmpty()) {
			DataRow comTypeRow = systemProcessor.getComTypeRowByCode(session.getUserId(), comTypeCode);
			if (comTypeRow == null) {
				throw new Exception("未找到对应的构件类型. ComTypeCode=" + comTypeCode);
			} else {
				comTypeId = comTypeRow.getStringValue("id");
			}
		}
		return this.createComponentLocal(session, resId, componentFileName, componentName, fileInfoType, comTypeId);
	}

	@Override
	public JSONObject createComponentLocal(INcpSession session, String resId, String fileInfoType, String comTypeId) throws Exception {
		DataRow resRow = null;
		switch (fileInfoType) {
			case "fbx": {
				IFbxZipProcessor fbxZipProcessor = this.getFbxZipProcessor();
				fbxZipProcessor.setDBSession(this.getDBSession());
				resRow = fbxZipProcessor.getResRow(session, resId);
				break;
			}
			case "gltf":{
				throw new Exception("暂未支持gltf格式");
			}
		}
		String componentName = resRow.getStringValue("name");
		String componentFileName = componentName + "." + fileInfoType;
		return this.createComponentLocal(session, resId, componentFileName, componentName, fileInfoType, comTypeId);
	}

	private JSONObject createComponentLocal(INcpSession session, String resId, String componentFileName, String componentName, String fileInfoType, String comTypeId) throws Exception {
		IFbxZipProcessor fbxZipProcessor = this.getFbxZipProcessor();
		fbxZipProcessor.setDBSession(this.getDBSession());
		IS3dSystemProcessor systemProcessor = this.getS3dSystemProcessor();
		systemProcessor.setDBSession(this.getDBSession());

		String componentLocalId = this.createComponentLocalRow(session, comTypeId, componentFileName, componentName, fileInfoType, resId);
		DataRow componentLocalRow = this.getComponentLocalRow(session, componentLocalId);
		JSONObject componentJson = systemProcessor.getComponentLocalJson(componentLocalRow);
		return componentJson;
	}

	private DataRow getComponentRowsByCodeAndVersionNum(INcpSession session, String componentCode, String versionNum, String userId) throws Exception {
		String sql = "select t.id as id, t.code as code, t.versionnum as versionnum"
				+ " from s3d_ComponentLocal t"
			 	+ " where t.code=" + SysConfig.getParamPrefix() + "code"
				+ " and t.versionnum=" + SysConfig.getParamPrefix() + "versionnum"
				+ " and t.createuser_xid=" + SysConfig.getParamPrefix() + "userid"
				+ " and t.isdeleted='N'";
		HashMap<String, Object> p2vs = new HashMap<>();
		p2vs.put("code", componentCode);
		p2vs.put("versionnum", versionNum);
		p2vs.put("userid", userId);

		HashMap<String, ValueType> valueTypes = new HashMap<>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("versionnum", ValueType.String);

		List<String> alias = new ArrayList<>();
		alias.add("id");
		alias.add("code");
		alias.add("versionnum");

		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(this.getDBSession(), sql, p2vs, alias, valueTypes);
		List<DataRow> rows =  dt.getRows();
		if(rows.isEmpty()){
			return null;
		}
		else{
			return rows.get(0);
		}
	}

	@Override
	public void removeComponentLocal(INcpSession session, String appKey, String componentCode, String versionNum) throws Exception {
		Data data = DataCollection.getData("s3d_ComponentLocal");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDtByFieldValue(this.getDBSession(), data, "code", "=", componentCode);
		DataRow row = this.getComponentRowsByCodeAndVersionNum(session, componentCode, versionNum, session.getUserId());
		if(row == null){
			throw new Exception("没有对应的模型. ComponentCode=" + componentCode + ", VersionNum=" + versionNum);
		}
		else{
			String componentLocalId = row.getStringValue("id");
			HashMap<String, Object> p2vs = new HashMap<>();
			p2vs.put("isdeleted", "Y");
			p2vs.put("deletetime", new Date());
			dbAccess.updateByData(this.getDBSession(), data, p2vs, componentLocalId);
		}
	}

	private DataRow getComponentLocalRow(INcpSession session, String componentLocalId){
		Data data = DataCollection.getData("s3d_ComponentLocal");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDtById(this.getDBSession(), data, componentLocalId);
		List<DataRow> rows = dt.getRows();
		if(rows.size() == 0){
			return null;
		}
		else {
			return rows.get(0);
		}
	}

	private String createComponentLocalRow(INcpSession session, String comTypeId, String modelFileName, String modelName, String fileInfoType, String resFbxId) throws Exception {
		Data data = DataCollection.getData("s3d_ComponentLocal");
		HashMap<String, Object> p2vs = new HashMap<>();
		p2vs.put("comtypeid", comTypeId);
		p2vs.put("code", resFbxId);
		p2vs.put("versionnum", "1.0");
		p2vs.put("scalex", 1);
		p2vs.put("scaley", 1);
		p2vs.put("scalez", 1);
		p2vs.put("fileinfofilename", modelFileName);
		p2vs.put("fileinfoimgname", "");
		p2vs.put("fileinfodirectory", resFbxId);
		p2vs.put("name", modelName);
		p2vs.put("fileinfotype", fileInfoType);
		p2vs.put("isactive", "Y");
		Date nowTime = new Date();
		p2vs.put("createtime", nowTime);
		p2vs.put("modifytime", nowTime);
		p2vs.put("deletetime", DataBaseDao.getDefaultDeleteTime());
		p2vs.put("createuser_xid", session.getUserId());
		p2vs.put("ispublic", "N");
		p2vs.put("isdeleted", "N");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		String componentLocalId = dbAccess.insertByData(this.getDBSession(), data, p2vs);
		return componentLocalId;
	}
}