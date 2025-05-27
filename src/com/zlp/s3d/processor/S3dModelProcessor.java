package com.zlp.s3d.processor;

import com.zlp.mdl.processor.IMaterialProcessor;
import com.zlp.platform.common.FileOperate;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.SysConfig;
import com.zlp.platform.common.ValueConverter;
import com.zlp.platform.common.util.CommonFunction;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.platform.dao.db.DataTable;
import com.zlp.platform.dao.db.ValueType;
import com.zlp.platform.dao.sys.DataBaseDao;
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection;
import org.hibernate.Session;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.sys.IAccessoryDao;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.*;

public class S3dModelProcessor implements IS3dModelProcessor {

	private String blankS3dFileDirectory = "";
	public String getBlankS3dFileDirectory() {
		return blankS3dFileDirectory;
	}
	public void setBlankS3dFileDirectory(String blankS3dFileDirectory) {
		this.blankS3dFileDirectory = blankS3dFileDirectory;
	}

	private IAccessoryDao accessoryDao;
	public IAccessoryDao getAccessoryDao() {
		return accessoryDao;
	}
	public void setAccessoryDao(IAccessoryDao accessoryDao) {
		this.accessoryDao = accessoryDao;
	}

	private IDBParserAccess dBParserAccess;
	public void setDBParserAccess(IDBParserAccess dBParserAccess){ 
		this.dBParserAccess = dBParserAccess;
	}	
	public IDBParserAccess getDBParserAccess(){ 
		return this.dBParserAccess;
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

	private IMaterialProcessor materialProcessor = null;
	public IMaterialProcessor getMaterialProcessor() {
		return materialProcessor;
	}
	public void setMaterialProcessor(IMaterialProcessor materialProcessor) {
		this.materialProcessor = materialProcessor;
	}

	private IS3dSystemProcessor s3dSystemProcessor = null;
	public void setS3dSystemProcessor(IS3dSystemProcessor s3dSystemProcessor){
		this.s3dSystemProcessor = s3dSystemProcessor;
	}
	protected IS3dSystemProcessor getS3dSystemProcessor(){
		return this.s3dSystemProcessor;
	}

	private IS3dImageProcessor s3dImageProcessor = null;
	public void setS3dImageProcessor(IS3dImageProcessor s3dImageProcessor){
		this.s3dImageProcessor = s3dImageProcessor;
	}
	protected IS3dImageProcessor getS3dImageProcessor(){
		return this.s3dImageProcessor;
	}

	@Override
	public JSONObject getMaterialJsons(JSONObject offJson) throws Exception {
		JSONObject materialJsonHash = new JSONObject();
		IMaterialProcessor materialProcessor = this.getMaterialProcessor();
		this.getMaterialJsons(materialProcessor, offJson, materialJsonHash);
        return materialJsonHash;
    }

	private void getMaterialJsons(IMaterialProcessor materialProcessor, JSONObject offJson, JSONObject materialJsonHash) throws Exception {
		String materialName = offJson.getString("material");
		if(materialName != null && !materialName.isEmpty() && !materialJsonHash.containsKey(materialName)){
			JSONObject materialJson =  materialProcessor.getMaterialJson(materialName);
			if(materialJson != null){
				materialJsonHash.put(materialName, materialJson);
			}
		}
		String lineMaterialName = offJson.getString("lineMaterial");
		if(lineMaterialName != null && !lineMaterialName.isEmpty() && !materialJsonHash.containsKey(lineMaterialName)){
			JSONObject materialJson =  materialProcessor.getMaterialJson(lineMaterialName);
			if(materialJson != null){
				materialJsonHash.put(lineMaterialName, materialJson);
			}
		}
		JSONArray subOffObjs = offJson.getJSONArray("children");
		if(subOffObjs != null && !subOffObjs.isEmpty()){
			for(int i = 0; i < subOffObjs.size(); i++) {
				JSONObject subOffObj = subOffObjs.getJSONObject(i);
				this.getMaterialJsons(materialProcessor, subOffObj, materialJsonHash);
			}
		}

		//tag的材质也返回 added by ls 20240418
		JSONArray tagOffObjs = offJson.getJSONArray("tags");
		if(tagOffObjs != null && !tagOffObjs.isEmpty()){
			for(int i = 0; i < tagOffObjs.size(); i++) {
				JSONObject tagOffObj = tagOffObjs.getJSONObject(i);
				this.getMaterialJsons(materialProcessor, tagOffObj, materialJsonHash);
			}
		}
	}

	@Override
	public void saveModel(INcpSession session, String modelId, String modelName, String modelText, String imageBase64) throws Exception {
		DataRow modelRow = this.getModelRow(session, modelId);
		String modelCreateUserId = modelRow.getStringValue("createuser_xid");
		String userId = session.getUserId();
		if(userId.equals(modelCreateUserId)) {
			String accessoryId = this.saveModelAccessory(session, modelId, modelName, modelText);
			String imgAccessoryId = this.saveModelImageAccessory(session, modelId, modelName, imageBase64);
			this.createNewModelLog(session, accessoryId, modelId, modelName);
			this.updateModelRow(session, modelId, modelName, accessoryId, imgAccessoryId);
		}
		else{
			throw new Exception("当前用户非项目创建人, 不允许保存.");
		}
	}

	@Override
	public JSONObject getModel(INcpSession session, String modelId) throws Exception {
		DataRow modelRow = this.getModelRow(session, modelId);
		String accessoryId = modelRow.getStringValue("accessoryid");
		String text = this.getModelAccessoryText(session, accessoryId);
		JSONObject json = new JSONObject();
		json.put("id", modelId);
		json.put("name", modelRow.getStringValue("name"));
		json.put("text", CommonFunction.encode(text));
		return json;
	}

	@Override
	public String createModel(INcpSession session, String appName, String modelName, String moduleCode) throws Exception {
		IDBParserAccess dbAccess = this.getDBParserAccess();
		String appId = this.getAppId(session, appName);
		if(appId == null){
			throw new Exception("不存在的应用. AppName=" + appName);
		}
		else {
			String newModelId = dbAccess.getSequenceGenerator().getIdSequence("s3d_Model", 1).get(0);
			String accessoryId = this.createNewModelAccessory(session, moduleCode, newModelId, modelName, modelName);
			this.createNewModelLog(session, accessoryId, newModelId, modelName);
			this.insertModelRow(session, appId, newModelId, modelName, accessoryId);
			return newModelId;
		}
	}

	@Override
	public String copyModel(INcpSession session, String appName, String newModelName, String sourceModelId) throws Exception {
		IDBParserAccess dbAccess = this.getDBParserAccess();
		String appId = this.getAppId(session, appName);
		if(appId == null){
			throw new Exception("不存在的应用. AppName=" + appName);
		}
		else {
			String newModelId = dbAccess.getSequenceGenerator().getIdSequence("s3d_Model", 1).get(0);
			String sourceModelText = this.getModelText(session, sourceModelId);
			String newModelText = this.updateModelText(sourceModelText, newModelId, newModelName);
			String accessoryId = this.saveModelAccessory(session, newModelId, newModelName, newModelText);
			this.createNewModelLog(session, accessoryId, newModelId, newModelName);
			this.insertModelRow(session, appId, newModelId, newModelName, accessoryId);
			return newModelId;
		}
	}

	private String updateModelText(String sourceText, String newModelId, String newModelName){
		JSONObject modelJson = JSONObject.parseObject(sourceText);
		modelJson.put("id", newModelId);
		modelJson.put("code", newModelName);
		modelJson.put("name", newModelName);
		return modelJson.toString();
	}

	private String getAppId(INcpSession session, String appName){
		IDBParserAccess dbAccess = this.getDBParserAccess();
		Data data = DataCollection.getData("s3d_App");
		DataTable dt = dbAccess.getDtByFieldValue(this.getDBSession(), data, "appname", "=", appName);
		List<DataRow> rows = dt.getRows();
		if(rows.isEmpty()){
			return null;
		}
		else{
			DataRow row = rows.get(0);
			return row.getStringValue("id");
		}
	}

	private void insertModelRow(INcpSession session, String appId, String modelId, String modelName, String accessoryId) throws Exception {
		Date currentTime = new Date();
		IDBParserAccess dbAccess = this.getDBParserAccess();
		Data data = DataCollection.getData("s3d_Model");
		HashMap<String, Object> fieldValues = new HashMap<>();
		fieldValues.put("name", modelName);
		fieldValues.put("appid", appId);
		fieldValues.put("accessoryid", accessoryId);
		fieldValues.put("createuser_xid", session.getUserId());
		fieldValues.put("createtime", currentTime);
		fieldValues.put("modifyuser_xid", session.getUserId());
		fieldValues.put("modifytime", currentTime);
		fieldValues.put("deletetime", DataBaseDao.getDefaultDeleteTime());
		fieldValues.put("isdeleted", "N");
		dbAccess.insertByData(this.getDBSession(), data, fieldValues, modelId);
	}

	private void updateModelRow(INcpSession session, String modelId, String modelName, String accessoryId, String imgAccessoryId) throws Exception {
		Date currentTime = new Date();
		IDBParserAccess dbAccess = this.getDBParserAccess();
		Data data = DataCollection.getData("s3d_Model");
		HashMap<String, Object> fieldValues = new HashMap<>();
		fieldValues.put("name", modelName);
		fieldValues.put("accessoryid", accessoryId);
		fieldValues.put("imgaccessoryid", imgAccessoryId);
		fieldValues.put("modifyuser_xid", session.getUserId());
		fieldValues.put("modifytime", currentTime);
		dbAccess.updateByData(this.getDBSession(), data, fieldValues, modelId);
	}

	private void createNewModelLog(INcpSession session, String accessoryId, String modelId, String modelName){
		IDBParserAccess dbAccess = this.getDBParserAccess();
		Data data = DataCollection.getData("s3d_ModelLog");
		HashMap<String, Object> fieldValues = new HashMap<>();
		fieldValues.put("parentid", modelId);
		fieldValues.put("accessoryid", accessoryId);
		fieldValues.put("name", modelName);
		fieldValues.put("savetime", new Date());
		dbAccess.insertByData(this.getDBSession(), data, fieldValues);
	}

	private String createNewModelAccessory(INcpSession session, String moduleCode, String modelId, String modelName, String modelCode) throws Exception {
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(this.getDBSession());

		FileOperate fo = new FileOperate();
		String filePath = this.getBlankS3dFileDirectory() + moduleCode + ".s3dc";
		String normalText = fo.readTxt(filePath, "utf-8");
		normalText = normalText.replaceAll("##modelId##", modelId);
		normalText = normalText.replaceAll("##modelName##", modelName);
		normalText = normalText.replaceAll("##modelCode##", modelCode);

		InputStream inputStream = new ByteArrayInputStream(normalText.getBytes(StandardCharsets.UTF_8));
		return accessoryDao.saveAccessory(session, inputStream, modelName, "S3d_Model", modelId);
	}

	private String saveModelAccessory(INcpSession session, String modelId, String modelName, String modelText) throws Exception {
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(this.getDBSession());
		InputStream inputStream = new ByteArrayInputStream(modelText.getBytes(StandardCharsets.UTF_8));
		return accessoryDao.saveAccessory(session, inputStream, modelName, "S3d_Model", modelId);
	}

	private String saveModelImageAccessory(INcpSession session, String modelId, String modelName, String imageBase64) throws Exception {
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(this.getDBSession());
		byte[] imageBytes = Base64.getDecoder().decode(imageBase64);
		InputStream inputStream = new ByteArrayInputStream(imageBytes);
		return accessoryDao.saveAccessory(session, inputStream, modelName + ".png", "S3d_Model", modelId);
	}

	private String getModelText(INcpSession session, String modelId) throws Exception {
		DataRow modelRow = this.getModelRow(session, modelId);
		String accessoryId = modelRow.getStringValue("accessoryid");
		return this.getModelAccessoryText(session, accessoryId);
	}

	@Override
	public String getModelAccessoryText(INcpSession session, String accessoryId) throws Exception {
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(this.getDBSession());
		String filePath = accessoryDao.getFilePathById(accessoryId);
		FileOperate fo = new FileOperate();
		String modelText = fo.readTxt(filePath, "utf-8");
		return modelText;
	}

	@Override
	public DataRow getModelRow(INcpSession session, String modelId){
		Data data = DataCollection.getData("s3d_Model");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDtById(this.getDBSession(), data, modelId);
		List<DataRow> rows = dt.getRows();
		if(rows.isEmpty()){
			return null;
		}
		else{
			return rows.get(0);
		}
	}

	@Override
	public JSONObject getModelInfoJson(INcpSession session, String modelId){
		DataRow row = this.getModelRow(session, modelId);
		JSONObject json = new JSONObject();
		json.put("id", row.getStringValue("id"));
		json.put("name", row.getStringValue("name"));
		json.put("appId", row.getStringValue("appid"));
		json.put("appName", row.getStringValue("appname"));
		return json;
	}

	private List<DataRow> getLastModelRows(INcpSession session, String appId, int rowCount, String userId) throws SQLException {
		String sql = "select t.id as id,"
				+ " t.name as name,"
				+ " t.accessoryid as accessoryid,"
				+ " t.imgaccessoryid as imgaccessoryid,"
				+ " t.createtime as createtime,"
				+ " t.modifytime as modifytime"
				+ " from s3d_model t"
				+ " where t.isdeleted='N'"
				+ " and t.appid=" + SysConfig.getParamPrefix() + "appid"
				+ " and t.createuser_xid=" + SysConfig.getParamPrefix() + "userid"
				+ " order by t.modifytime desc";
		HashMap<String, Object> p2vs = new HashMap<>();
		p2vs.put("userid", userId);
		p2vs.put("appid", appId);

		HashMap<String, ValueType> valueTypes = new HashMap<>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("accessoryid", ValueType.String);
		valueTypes.put("imgaccessoryid", ValueType.String);
		valueTypes.put("createtime", ValueType.Time);
		valueTypes.put("modifytime", ValueType.Time);

		List<String> alias = new ArrayList<>();
		alias.add("id");
		alias.add("name");
		alias.add("accessoryid");
		alias.add("imgaccessoryid");
		alias.add("createtime");
		alias.add("modifytime");

		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(this.getDBSession(), sql, p2vs, alias, valueTypes, 0, rowCount);
		return dt.getRows();
	}

	@Override
	public JSONArray getLastModels(INcpSession session, String appName, int rowCount) throws Exception {
		String appId = this.getAppId(session, appName);

		List<DataRow> rows = this.getLastModelRows(session, appId, rowCount, session.getUserId());
		JSONArray jsonArray = new JSONArray();
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			JSONObject json = new JSONObject();
			json.put("id", row.getStringValue("id"));
			json.put("name", row.getStringValue("name"));
			json.put("accessoryId", row.getStringValue("accessoryid"));
			json.put("imgAccessoryId", row.getStringValue("imgaccessoryid"));
			json.put("createTime", ValueConverter.dateTimeToString(row.getDateTimeValue("createtime"), SysConfig.getTimeFormat()));
			json.put("modifyTime", ValueConverter.dateTimeToString(row.getDateTimeValue("modifytime"), SysConfig.getTimeFormat()));
			jsonArray.add(json);
		}
		return jsonArray;
	}
}
