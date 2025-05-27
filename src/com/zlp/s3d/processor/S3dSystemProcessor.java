package com.zlp.s3d.processor;

import java.io.File;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.zlp.mdl.processor.IMaterialProcessor;
import com.zlp.platform.common.*;
import com.zlp.platform.dao.sys.ContextUtil;
import org.hibernate.Session;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.redis.RedisException;
import com.zlp.platform.common.redis.RedisSessionCacheClient;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.platform.dao.db.DataTable;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.db.ValueType;

public class S3dSystemProcessor implements IS3dSystemProcessor {

	private String s3dResourcesRelativeFolder = "";
	public void setS3dResourcesRelativeFolder(String s3dResourcesRelativeFolder){
		this.s3dResourcesRelativeFolder = s3dResourcesRelativeFolder;
	}
	public String getS3dResourcesRelativeFolder(){
		return this.s3dResourcesRelativeFolder;
	}
	public String getUserResourcesRelativeFolder(){
		return this.s3dResourcesRelativeFolder + "user/";
	}

	private String systemImageRelativeFolder = "";
	public void setSystemImageRelativeFolder(String systemImageRelativeFolder){
		this.systemImageRelativeFolder = systemImageRelativeFolder;
	}
	public String getSystemImageRelativeFolder(){
		return this.systemImageRelativeFolder;
	}

	@Override
	public String getUserConfigFilePath(String userId, String fileName) {
		return ContextUtil.getAbsolutePath() + "/" + this.getUserResourcesRelativeFolder() + userId + "/config/" + fileName;
	}

	@Override
	public String getUserImageFolder(String userId) throws SQLException {
		return ContextUtil.getAbsolutePath() + "/" + this.getUserResourcesRelativeFolder() + userId + "/images/";
	}

	@Override
	public String getSystemImageFolder() throws SQLException {
		return ContextUtil.getAbsolutePath() + "/" + this.getSystemImageRelativeFolder();
	}

	@Override
	public String getUserComponentFolder(String userId) throws SQLException {
		return ContextUtil.getAbsolutePath() + "/" + this.getUserResourcesRelativeFolder() + userId + "/files/";
	}

	private String s3dAppKeyCacheName = "s3dAppKeyCache";
	public String getS3dAppKeyCacheName() {
		return s3dAppKeyCacheName;
	}
	public void setS3dAppKeyCacheName(String s3dAppKeyCacheName) {
		this.s3dAppKeyCacheName = s3dAppKeyCacheName;
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
	
	private RedisSessionCacheClient redisSessionCacheClient = null;
	public void setRedisSessionCacheClient(RedisSessionCacheClient redisSessionCacheClient){
		this.redisSessionCacheClient = redisSessionCacheClient;
	}
	public RedisSessionCacheClient getRedisSessionCacheClient(){
		return this.redisSessionCacheClient;
	}

	private IMaterialProcessor materialProcessor = null;
	public IMaterialProcessor getMaterialProcessor() {
		return materialProcessor;
	}
	public void setMaterialProcessor(IMaterialProcessor materialProcessor) {
		this.materialProcessor = materialProcessor;
	}

	@Override
	public void refreshAppKeysCache(INcpSession session) throws SQLException, RedisException {
		List<DataRow> allRows = this.getAllAppKeyRows();
		this.deleteAllAppKeysCache();
		this.addAllAppKeysCache(allRows);
	}
	
	private void deleteAllAppKeysCache() throws RedisException{
		RedisSessionCacheClient cacheClient = this.getRedisSessionCacheClient(); 
		cacheClient.invalidate(this.getS3dAppKeyCacheName());
	}
	
	private void addAllAppKeysCache(List<DataRow> allRows) throws RedisException{ 
		Date checkTime = new Date();
		for(int i = 0; i < allRows.size(); i++){
			DataRow row = allRows.get(i);
			this.addAllAppKeyCache(row, checkTime);
		}
	}
	
	private void addAllAppKeyCache(DataRow row, Date checkTime) throws RedisException{
		String appName = row.getStringValue("appname");
		String appKey = row.getStringValue("appkey");
		String appUrlsStr = row.getStringValue("appurls");
		String[] appUrls = appUrlsStr == null ? (new String[]{ }) : appUrlsStr.split(";");
		Date expireTime = row.getDateTimeValue("expiretime");
		AppKeyStatus status = expireTime.compareTo(checkTime) > 0 ? AppKeyStatus.active : AppKeyStatus.overdue;
		this.addAllAppKeyCache(appName, appKey, status, expireTime, appUrls);
	}
	
	private void addAllAppKeyCache(String appName, String appKey, AppKeyStatus status, Date expireTime, String[] appUrls) throws RedisException{
		RedisSessionCacheClient cacheClient = this.getRedisSessionCacheClient(); 
		JSONObject json = new JSONObject();
		json.put("appName", appName);
		json.put("appKey", appKey);
		json.put("appUrls", appUrls);
		json.put("status", status.toString());
		json.put("expireTime", ValueConverter.dateTimeToString(expireTime, "yyyy-MM-dd HH:mm:ss"));
		cacheClient.setAttribute(this.getS3dAppKeyCacheName(), appKey, json.toString());
	}
	
	@Override
	public AppKeyStatus getAppKeyStatus(String checkKey, String checkUrl) throws Exception{
		RedisSessionCacheClient cacheClient = this.getRedisSessionCacheClient(); 
		String jsonText = cacheClient.getAttribute(this.getS3dAppKeyCacheName(), checkKey);
		if(jsonText == null){
			return AppKeyStatus.invalid;
		}
		else{
			JSONObject json = JSONProcessor.strToJSON(jsonText);
			AppKeyStatus status = AppKeyStatus.valueOf(json.getString("status"));
			if(status == AppKeyStatus.active){
				JSONArray appUrls = json.getJSONArray("appUrls");
				if(appUrls.isEmpty()){
					//如果没有设置appUrl，那么任何url都可以
					return AppKeyStatus.active;
				}
				else {
					for (int i = 0; i < appUrls.size(); i++) {
						String appUrl = appUrls.getString(i).trim();
						if (appUrl.equals(checkUrl)) {
							return AppKeyStatus.active;
						}
					}
					return AppKeyStatus.urlError;
				}
			}
			else{
				return status;
			}
		}
	}

	private List<DataRow> getAllAppKeyRows() throws SQLException{
		String sql = "select t.id as id,"
				+ " t.appname as appname,"
				+ " t.appkey as appkey,"
				+ " t.appurls as appurls,"
				+ " t.expiretime as expiretime"
				+ " from s3d_App t"
				+ " where t.isdeleted = 'N'";
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("appname", ValueType.String);
		valueTypes.put("appkey", ValueType.String);
		valueTypes.put("appurls", ValueType.String);
		valueTypes.put("expiretime", ValueType.Date);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("appname");
		alias.add("appkey");
		alias.add("appurls");
		alias.add("expiretime");
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		return dt.getRows();
	}

	//获取材质配置文件
	@Override
	public String getMaterialConfigText(INcpSession session) throws Exception {
		IMaterialProcessor materialProcessor = this.getMaterialProcessor();
		materialProcessor.setDBSession(this.getDBSession());
		String userId = session.getUserId();
		List<JSONObject> allMaterialJsons = materialProcessor.getAllMaterialJsons();
		JSONArray jsonArray = new JSONArray();
		for (JSONObject materialJson : allMaterialJsons) {
			JSONObject json = this.convertToMaterialTextJson(materialJson);
			jsonArray.add(json);
		}
		return jsonArray.toJSONString();
	}

	//获取材质配置文件
	@Override
	public void generateMaterialConfigFile(INcpSession session) throws Exception {
		IMaterialProcessor materialProcessor = this.getMaterialProcessor();
		materialProcessor.setDBSession(this.getDBSession());
		String userId = session.getUserId();
		List<JSONObject> allMaterialJsons = materialProcessor.getAllMaterialJsons();
		JSONArray jsonArray = new JSONArray();
		for (JSONObject materialJson : allMaterialJsons) {
			JSONObject json = this.convertToMaterialTextJson(materialJson);
			jsonArray.add(json);
		}
		String materialConfigText = "export const materialList = "
				+ jsonArray.toJSONString()
				+ ";";
		String filePath = this.getUserConfigFilePath(userId, "materialList.js");
		FileOperate fo = new FileOperate();
		File file = new File(filePath);
		fo.createFolderRecursion(file.getParentFile());
		fo.createFile(filePath, materialConfigText, FileOperate.DefaultEncoding);
	}

	//获取材质配置JSON
	@Override
	public JSONArray getMaterialConfigArray(String userId, List<String> materialCodes) throws Exception {
		IMaterialProcessor materialProcessor = this.getMaterialProcessor();
		materialProcessor.setDBSession(this.getDBSession());
		JSONArray jsonArray = new JSONArray();
		for(String code : materialCodes) {
			JSONObject materialJson = materialProcessor.getMaterialJson(userId, code);
			JSONObject json = this.convertToMaterialTextJson(materialJson);
			jsonArray.add(json);
		}
		return jsonArray;
	}

	private JSONObject convertToMaterialTextJson(JSONObject materialJson){
		JSONObject json = new JSONObject();
		json.put("code", materialJson.get("id"));
		json.put("name", materialJson.get("code"));
		String colorStr = materialJson.getString("color");
		if(colorStr != null && colorStr.length() == 6){
			int colorInt = Integer.parseInt(colorStr, 16);
			json.put("color", colorInt);
		}
		json.put("opacity", materialJson.get("opacity"));
		json.put("metalness", materialJson.get("metalness"));
		json.put("roughness", materialJson.get("roughness"));
		json.put("imageAccessoryId", materialJson.get("imageId"));
		json.put("imageName", materialJson.get("imageName") == null ? "" : materialJson.get("imageName"));
		json.put("normalImageAccessoryId", materialJson.get("normalImageId"));
		json.put("normalImageName", materialJson.get("normalImageName") == null ? "" : materialJson.get("normalImageName"));
		json.put("opacityImageAccessoryId", materialJson.get("opacityImageId"));
		json.put("opacityImageName", materialJson.get("opacityImageName") == null ? "" : materialJson.get("opacityImageName"));
		json.put("metalnessImageAccessoryId", materialJson.get("metalnessImageId"));
		json.put("metalnessImageName", materialJson.get("metalnessImageName") == null ? "" : materialJson.get("metalnessImageName"));
		json.put("roughnessImageAccessoryId", materialJson.get("roughnessImageId"));
		json.put("roughnessImageName", materialJson.get("roughnessImageName") == null ? "" : materialJson.get("roughnessImageName"));
		json.put("envMapIntensity", materialJson.get("envMapIntensity"));
		json.put("scaleWidth", materialJson.get("scaleWidth"));
		json.put("scaleHeight", materialJson.get("scaleHeight"));
		json.put("rotation", materialJson.get("rotation"));
		json.put("isMirror", materialJson.get("isMirror"));
		json.put("isDoubleSide", materialJson.get("isDoubleSide"));
		json.put("typeCode", materialJson.get("typeCode"));
		return json;
	}

	//生成组件配置文件
	@Override
	public String generateComponentConfigString(INcpSession ncpSession, String userId) throws Exception {
		List<DataRow> allComTypeRows = this.getComTypeRowsWithRootRow(ncpSession, userId);
		List<DataRow> allComponentLocalRows = this.getComponentLocalRows(ncpSession, userId);
		this.processComponentLocalRowsComType(allComponentLocalRows, allComTypeRows);
		List<DataRow> allComponentServerRows = this.getComponentServerRows(ncpSession, userId);
		this.processComponentServerRowsComType(allComponentServerRows, allComTypeRows);
		JSONArray comTypeJsons = this.generateSubComTypeJsons(null, allComTypeRows, allComponentLocalRows, allComponentServerRows);
		return comTypeJsons.toString();
	}

	//生成组件配置文件
	@Override
	public JSONArray generateComponentConfigJArray(INcpSession ncpSession, JSONArray componentLocalJsons, JSONArray componentServerJsons) throws Exception {
		String rootId = this.getComTypeRootId();
		List<DataRow> allComponentLocalRows = this.getComponentLocalRows(ncpSession, componentLocalJsons);
		List<DataRow> allComponentServerRows = this.getComponentServerRows(ncpSession, componentServerJsons);

		JSONArray comTypeJsons = new JSONArray();
		JSONObject comTypeJson = new JSONObject();
		comTypeJson.put("code", this.getComTypeRootCode());
		comTypeJson.put("name", this.getComTypeRootName());

		JSONArray componentJsons = new JSONArray();
		for (DataRow row : allComponentLocalRows) {
			JSONObject componentJson = this.getComponentLocalJson(row);
			componentJsons.add(componentJson);
		}

		for (DataRow row : allComponentServerRows) {
			JSONObject componentJson = this.getComponentServerJson(row);
			componentJsons.add(componentJson);
		}
		comTypeJson.put("components", componentJsons);
		comTypeJsons.add(comTypeJson);

		return comTypeJsons;
	}

	private void processComponentLocalRowsComType(List<DataRow> componentLocalRows, List<DataRow> comTypeRows){
		HashMap<String, Boolean> comTypeMap = new HashMap<>();
		for(DataRow row : comTypeRows){
			comTypeMap.put(row.getStringValue("id"), true);
		}
		String rootId = this.getComTypeRootId();
		for(DataRow row : componentLocalRows){
			String comTypeId = row.getStringValue("comtypeid");
			if(!comTypeMap.containsKey(comTypeId)){
				row.setValue("comtypeid", rootId);
			}
		}
	}

	private void processComponentServerRowsComType(List<DataRow> componentServerRows, List<DataRow> comTypeRows){
		HashMap<String, Boolean> comTypeMap = new HashMap<>();
		for(DataRow row : comTypeRows){
			comTypeMap.put(row.getStringValue("id"), true);
		}
		String rootId = this.getComTypeRootId();
		for(DataRow row : componentServerRows){
			String comTypeId = row.getStringValue("comtypeid");
			if(!comTypeMap.containsKey(comTypeId)){
				row.setValue("comtypeid", rootId);
			}
		}
	}

	private void saveComponentConfigFile(INcpSession ncpSession, String filePath, JSONArray comTypeJsons) throws Exception {
		String text = comTypeJsons.toString();
		FileOperate fo = new FileOperate();
		fo.createFile(filePath, text, "UTF-8");
	}

	//生成组件配置json added by ls 20240621
	@Override
	public JSONArray generateComponentConfigJsons(INcpSession ncpSession, String userId) throws SQLException {
		List<DataRow> allComTypeRows = this.getComTypeRowsWithRootRow(ncpSession, userId);
		List<DataRow> allComponentLocalRows = this.getComponentLocalRows(ncpSession, userId);
		List<DataRow> allComponentServerRows = this.getComponentServerRows(ncpSession, userId);
		JSONArray comTypeJsons = this.generateSubComTypeJsons(null, allComTypeRows, allComponentLocalRows, allComponentServerRows);
		return comTypeJsons;
	}

	private JSONArray generateSubComTypeJsons(String parentComTypeId, List<DataRow> allComTypeRows, List<DataRow> allComponentLocalRows, List<DataRow> allComponentServerRows){
		List<DataRow> comTypeRows = this.getSubComTypeRows(allComTypeRows, parentComTypeId);
		JSONArray comTypeJsons = new JSONArray();
		for(DataRow comTypeRow : comTypeRows){
			JSONObject comTypeJson = this.generateSubComTypeJson(comTypeRow, allComTypeRows, allComponentLocalRows, allComponentServerRows);
			comTypeJsons.add(comTypeJson);
		}
		return comTypeJsons;
	}

	private JSONObject generateSubComTypeJson(DataRow comTypeRow, List<DataRow> allComTypeRows, List<DataRow> allComponentLocalRows, List<DataRow> allComponentServerRows){
		String comTypeId = comTypeRow.getStringValue("id");

		JSONObject comTypeJson = new JSONObject();
		comTypeJson.put("code", comTypeRow.getStringValue("code"));
		comTypeJson.put("name", comTypeRow.getStringValue("name"));

		JSONArray componentJsons = new JSONArray();

		List<DataRow> componentLocalRows = this.getSubComponentLocalRows(allComponentLocalRows, comTypeId);
        for (DataRow row : componentLocalRows) {
			JSONObject componentJson = this.getComponentLocalJson(row);
            componentJsons.add(componentJson);
        }

		List<DataRow> componentServerRows = this.getSubComponentServerRows(allComponentServerRows, comTypeId);
        for (DataRow row : componentServerRows) {
			JSONObject componentJson = this.getComponentServerJson(row);
            componentJsons.add(componentJson);
        }

		componentJsons = this.sortComponentJsons(componentJsons);
		if(!componentJsons.isEmpty()) {
			comTypeJson.put("components", componentJsons);
		}

		JSONArray childComTypeJsons = this.generateSubComTypeJsons(comTypeId, allComTypeRows, allComponentLocalRows, allComponentServerRows);
		if(!childComTypeJsons.isEmpty()){
			comTypeJson.put("children", childComTypeJsons);
		}

		return comTypeJson;
	}

	@Override
	public JSONObject getComponentServerJson(DataRow row){
		JSONObject componentJson = new JSONObject();
		componentJson.put("code", row.getStringValue("code"));
		componentJson.put("name", row.getStringValue("name"));
		componentJson.put("versionNum", row.getStringValue("versionnum"));
		componentJson.put("description", row.getStringValue("description"));
		componentJson.put("isServer", true);

		String imgId = row.getStringValue("imgid");
		if(imgId != null && !imgId.isEmpty()){
			componentJson.put("imgId", imgId);
		}
		return componentJson;
	}

	@Override
	public JSONObject getComponentLocalJson(DataRow row){
		JSONObject componentJson = new JSONObject();
		componentJson.put("code", row.getStringValue("code"));
		componentJson.put("name", row.getStringValue("name"));
		componentJson.put("versionNum", row.getStringValue("versionnum"));
		componentJson.put("description", row.getStringValue("description"));
		componentJson.put("isLocal", true);
		componentJson.put("isPublic", row.getBooleanValue("ispublic"));

		JSONObject fileInfoJson = new JSONObject();
		fileInfoJson.put("type", row.getStringValue("fileinfotype"));
		fileInfoJson.put("directory", row.getStringValue("fileinfodirectory"));
		fileInfoJson.put("fileName", row.getStringValue("fileinfofilename"));
		fileInfoJson.put("imgName", row.getStringValue("fileinfoimgname"));
		componentJson.put("fileInfo", fileInfoJson);

		JSONObject scaleJson = new JSONObject();
		scaleJson.put("x", row.getBigDecimalValue("scalex").doubleValue());
		scaleJson.put("y", row.getBigDecimalValue("scaley").doubleValue());
		scaleJson.put("z", row.getBigDecimalValue("scalez").doubleValue());
		componentJson.put("scale", scaleJson);
		return componentJson;
	}

	private JSONArray sortComponentJsons(JSONArray componentJsons){
		JSONArray jsons = new JSONArray();
		for(int i = 0; i < componentJsons.size(); i++){
			JSONObject componentJson = componentJsons.getJSONObject(i);
			String componentName = componentJson.getString("name");
			JSONArray tempJsons = new JSONArray();
			boolean added = false;
			for(int j = 0; j < jsons.size(); j++){
				JSONObject json = jsons.getJSONObject(j);
				String name = json.getString("name");
				if(!added && name.compareTo(componentName) > 0){
					tempJsons.add(componentJson);
				}
				tempJsons.add(json);
			}
			if(!added){
				tempJsons.add(componentJson);
			}
			jsons = tempJsons;
		}
		return jsons;
	}

	private List<DataRow> getSubComTypeRows(List<DataRow> allRows, String parentId){
		List<DataRow> subRows = new ArrayList<>();
		for(int i = 0; i < allRows.size(); i++){
			DataRow row = allRows.get(i);
			String rowParentId = row.getStringValue("parentid");
			if(parentId == null){
				if(rowParentId == null || rowParentId.isEmpty()){
					subRows.add(row);
				}
			}
			else if(parentId.equals(rowParentId)){
				subRows.add(row);
			}
		}
		return subRows;
	}

	private List<DataRow> getSubComponentLocalRows(List<DataRow> allRows, String comTypeId){
		List<DataRow> subRows = new ArrayList<>();
		for(int i = 0; i < allRows.size(); i++){
			DataRow row = allRows.get(i);
			String rowComTypeId = row.getStringValue("comtypeid");
			if(comTypeId == null){
				if(rowComTypeId == null || rowComTypeId.isEmpty()){
					subRows.add(row);
				}
			}
			else if(comTypeId.equals(rowComTypeId)){
				subRows.add(row);
			}
		}
		return subRows;
	}

	private List<DataRow> getSubComponentServerRows(List<DataRow> allRows, String comTypeId){
		List<DataRow> subRows = new ArrayList<>();
		for(int i = 0; i < allRows.size(); i++){
			DataRow row = allRows.get(i);
			String rowComTypeId = row.getStringValue("comtypeid");
			if(comTypeId == null){
				if(rowComTypeId == null || rowComTypeId.isEmpty()){
					subRows.add(row);
				}
			}
			else if(comTypeId.equals(rowComTypeId)){
				subRows.add(row);
			}
		}
		return subRows;
	}

	private DataRow getAppRow(INcpSession ncpSession, String appId) throws SQLException {
		String sql = "select t.id as id,"
				+ " t.appname as appname,"
				+ " t.appkey as appkey,"
				+ " t.appurls as appurls,"
				+ " t.expiretime as expiretime"
				+ " from s3d_App t"
				+ " where t.isdeleted = 'N' and t.id=" +SysConfig.getParamPrefix() + "appid";
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("appname", ValueType.String);
		valueTypes.put("appkey", ValueType.String);
		valueTypes.put("appurls", ValueType.String);
		valueTypes.put("expiretime", ValueType.Date);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("appname");
		alias.add("appkey");
		alias.add("appurls");
		alias.add("expiretime");
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("appid", appId);
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();
		if(rows.isEmpty()){
			return null;
		}
		else {
			return rows.get(0);
		}
	}

	@Override
	public DataRow getAppRowByKey(INcpSession ncpSession, String appKey) throws SQLException {
		String sql = "select t.id as id,"
				+ " t.appname as appname,"
				+ " t.appkey as appkey,"
				+ " t.appurls as appurls,"
				+ " t.apprelativepath as apprelativepath,"
				+ " t.expiretime as expiretime"
				+ " from s3d_App t"
				+ " where t.isdeleted = 'N' and t.appkey=" +SysConfig.getParamPrefix() + "appkey";
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("appname", ValueType.String);
		valueTypes.put("appkey", ValueType.String);
		valueTypes.put("appurls", ValueType.String);
		valueTypes.put("apprelativepath", ValueType.String);
		valueTypes.put("expiretime", ValueType.Date);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("appname");
		alias.add("appkey");
		alias.add("appurls");
		alias.add("apprelativepath");
		alias.add("expiretime");
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("appkey", appKey);
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();
		if(rows.isEmpty()){
			return null;
		}
		else {
			return rows.get(0);
		}
	}

	private List<DataRow> getComTypeRowsWithRootRow(INcpSession ncpSession, String userId) throws SQLException {
		String sql = "select t.id as id,"
				+ " t.code as code,"
				+ " t.name as name,"
				+ " t.parentid as parentid"
				+ " from s3d_ComType t"
				+ " where t.isdeleted = 'N' "
				+ " and t.isactive = 'Y' and t.createuser_xid=" + SysConfig.getParamPrefix() +"userid"
				+ " order by t.code asc";
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("parentid", ValueType.String);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		alias.add("name");
		alias.add("parentid");
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", userId);
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();

		String rootId = this.getComTypeRootId();
		String rootCode = this.getComTypeRootCode();
		String rootName = this.getComTypeRootName();
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			row.setValue("parentid", rootId);
		}

		DataRow rootRow = new DataRow();
		rootRow.setValue("id", rootId);
		rootRow.setValue("code", rootCode);
		rootRow.setValue("name", rootName);
		rootRow.setValue("parentid", null);
		rows.add(rootRow);
		return rows;
	}

	@Override
	public String getComTypeRootId() {
		return "root";
	}

	@Override
	public String getComTypeRootCode() {
		return "root";
	}

	public String getComTypeRootName() {
		return "所有模型";
	}

	@Override
	public DataRow getComTypeRowByCode(String userId, String comTypeCode) throws SQLException {
		String sql = "select t.id as id,"
				+ " t.code as code,"
				+ " t.name as name,"
				+ " t.parentid as parentid"
				+ " from s3d_ComType t"
				+ " where t.isactive = 'Y' "
				+ " and t.isdeleted = 'N' "
				+ " and t.createuser_xid=" + SysConfig.getParamPrefix() +"userid"
				+ " and t.code=" + SysConfig.getParamPrefix() +"comtypecode"
				+ " order by t.code asc";
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("parentid", ValueType.String);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		alias.add("name");
		alias.add("parentid");
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", userId);
		p2vs.put("comtypecode", comTypeCode);
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();
		if(rows.size() == 0){
			return null;
		}
		else{
			return rows.get(0);
		}
	}

	@Override
	public List<DataRow> getComponentLocalRows(INcpSession ncpSession, String userId) throws SQLException {
		String sql = "select t.id as id,"
				+ " t.code as code,"
				+ " t.name as name,"
				+ " t.versionnum as versionnum,"
				+ " t.comtypeid as comtypeid,"
				+ " t.fileinfotype as fileinfotype,"
				+ " t.fileinfodirectory as fileinfodirectory,"
				+ " t.fileinfofilename as fileinfofilename,"
				+ " t.fileinfoimgname as fileinfoimgname,"
				+ " t.scalex as scalex,"
				+ " t.scaley as scaley,"
				+ " t.scalez as scalez,"
				+ " t.ispublic as ispublic,"
				+ " t.description as description"
				+ " from s3d_ComponentLocal t"
				+ " where t.isdeleted ='N' and t.isactive='Y'"
				+ " and (t.createuser_xid=" + SysConfig.getParamPrefix() +"userid or t.ispublic='Y')"
				+ " order by t.code asc";
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("versionnum", ValueType.String);
		valueTypes.put("comtypeid", ValueType.String);
		valueTypes.put("fileinfotype", ValueType.String);
		valueTypes.put("fileinfodirectory", ValueType.String);
		valueTypes.put("fileinfofilename", ValueType.String);
		valueTypes.put("fileinfoimgname", ValueType.String);
		valueTypes.put("scalex", ValueType.Decimal);
		valueTypes.put("scaley", ValueType.Decimal);
		valueTypes.put("scalez", ValueType.Decimal);
		valueTypes.put("ispublic", ValueType.Decimal);
		valueTypes.put("description", ValueType.String);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		alias.add("name");
		alias.add("versionnum");
		alias.add("comtypeid");
		alias.add("fileinfotype");
		alias.add("fileinfodirectory");
		alias.add("fileinfofilename");
		alias.add("fileinfoimgname");
		alias.add("scalex");
		alias.add("scaley");
		alias.add("scalez");
		alias.add("ispublic");
		alias.add("description");
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", userId);
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		return dt.getRows();
	}

	@Override
	public List<DataRow> getComponentLocalRows(INcpSession ncpSession, JSONArray componentLocalJsons) throws SQLException {
		String sql = "select t.id as id,"
				+ " t.code as code,"
				+ " t.name as name,"
				+ " t.versionnum as versionnum,"
				+ " t.comtypeid as comtypeid,"
				+ " t.fileinfotype as fileinfotype,"
				+ " t.fileinfodirectory as fileinfodirectory,"
				+ " t.fileinfofilename as fileinfofilename,"
				+ " t.fileinfoimgname as fileinfoimgname,"
				+ " t.scalex as scalex,"
				+ " t.scaley as scaley,"
				+ " t.scalez as scalez,"
				+ " t.ispublic as ispublic,"
				+ " t.description as description"
				+ " from s3d_ComponentLocal t"
				+ " where t.code=" + SysConfig.getParamPrefix() + "code"
				+ " and t.versionnum=" + SysConfig.getParamPrefix() + "versionnum"
				+ " and t.isdeleted='N' and t.isactive='Y'"
				+ " order by t.code asc";
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("versionnum", ValueType.String);
		valueTypes.put("comtypeid", ValueType.String);
		valueTypes.put("fileinfotype", ValueType.String);
		valueTypes.put("fileinfodirectory", ValueType.String);
		valueTypes.put("fileinfofilename", ValueType.String);
		valueTypes.put("fileinfoimgname", ValueType.String);
		valueTypes.put("scalex", ValueType.Decimal);
		valueTypes.put("scaley", ValueType.Decimal);
		valueTypes.put("scalez", ValueType.Decimal);
		valueTypes.put("ispublic", ValueType.Boolean);
		valueTypes.put("description", ValueType.String);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		alias.add("name");
		alias.add("versionnum");
		alias.add("comtypeid");
		alias.add("fileinfotype");
		alias.add("fileinfodirectory");
		alias.add("fileinfofilename");
		alias.add("fileinfoimgname");
		alias.add("scalex");
		alias.add("scaley");
		alias.add("scalez");
		alias.add("ispublic");
		alias.add("description");
		List<DataRow> localRows = new ArrayList<>();
		for(int i = 0; i < componentLocalJsons.size(); i++){
			JSONObject componentJson = componentLocalJsons.getJSONObject(i);
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			p2vs.put("code", componentJson.getString("code"));
			p2vs.put("versionnum", componentJson.getString("versionNum"));
			IDBParserAccess dbAccess = this.getDBParserAccess();
			DataTable dt = dbAccess.selectList(getDBSession(), sql, p2vs, alias, valueTypes);
			List<DataRow> rows = dt.getRows();
			if(!rows.isEmpty()){
				localRows.add(rows.get(0));
			}
		}
		return localRows;
	}

	@Override
	public List<DataRow> getComponentServerRows(INcpSession ncpSession, String userId) throws SQLException {
		String sql = "select t.id as id,"
				+ " t.name as name,"
				+ " t.comtypeid as comtypeid,"
				+ " c.code as code,"
				+ " c.versionnum as versionnum,"
				+ " c.imgid as imgid,"
				+ " t.description as description"
				+ " from s3d_ComponentServer t"
				+ " left outer join mdl_component c on c.id = t.componentid"
				+ " where t.isdeleted='N' and t.isactive='Y' and t.createuser_xid=" + SysConfig.getParamPrefix() +"userid"
				+ " order by t.name asc";
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("comtypeid", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("versionnum", ValueType.String);
		valueTypes.put("imgid", ValueType.String);
		valueTypes.put("description", ValueType.String);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("comtypeid");
		alias.add("code");
		alias.add("versionnum");
		alias.add("imgid");
		alias.add("description");
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", userId);
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		return dt.getRows();
	}

	@Override
	public List<DataRow> getComponentServerRows(INcpSession ncpSession, JSONArray componentServerJsons) throws SQLException {
		String sql = "select t.id as id,"
				+ " t.name as name,"
				+ " t.comtypeid as comtypeid,"
				+ " c.code as code,"
				+ " c.versionnum as versionnum,"
				+ " c.imgid as imgid,"
				+ " t.description as description"
				+ " from s3d_ComponentServer t"
				+ " left outer join mdl_component c on c.id = t.componentid"
				+ " where t.code=" + SysConfig.getParamPrefix() + "code"
				+ " and t.versionnum=" + SysConfig.getParamPrefix() + "versionnum"
				+ " and t.isdeleted='N' and t.isactive='Y'"
				+ " order by t.name asc";
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("comtypeid", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("versionnum", ValueType.String);
		valueTypes.put("imgid", ValueType.String);
		valueTypes.put("description", ValueType.String);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("comtypeid");
		alias.add("code");
		alias.add("versionnum");
		alias.add("imgid");
		alias.add("description");
		List<DataRow> serverRows = new ArrayList<>();
		for(int i = 0; i < componentServerJsons.size(); i++){
			JSONObject componentJson = componentServerJsons.getJSONObject(i);
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			p2vs.put("code", componentJson.getString("code"));
			p2vs.put("versionnum", componentJson.getString("versionNum"));
			IDBParserAccess dbAccess = this.getDBParserAccess();
			DataTable dt = dbAccess.selectList(getDBSession(), sql, p2vs, alias, valueTypes);
			List<DataRow> rows = dt.getRows();
			if(!rows.isEmpty()){
				serverRows.add(rows.get(0));
			}
		}
		return serverRows;
	}

	@Override
	public boolean checkAppMaterialConfig(INcpSession session) throws Exception {
		String userId = session.getUserId();
		String filePath = this.getUserConfigFilePath(userId, "materialList.js");
		FileOperate fo = new FileOperate();
		return fo.exists(filePath);
	}
}
