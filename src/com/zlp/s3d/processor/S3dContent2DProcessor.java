package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.FileOperate;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.SysConfig;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.platform.dao.db.DataTable;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.db.ValueType;
import com.zlp.platform.dao.sys.ContextUtil;
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection;
import org.hibernate.Session;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class S3dContent2DProcessor implements IS3dContent2DProcessor {

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

	private String s3dResourcesRelativeFolder = "";
	public void setS3dResourcesRelativeFolder(String s3dResourcesRelativeFolder){
		this.s3dResourcesRelativeFolder = s3dResourcesRelativeFolder;
	}
	@Override
	public String getS3dResourcesRelativeFolder(){
		return this.s3dResourcesRelativeFolder;
	}

	private String getConfigFilePath() {
		return ContextUtil.getAbsolutePath() + "/" + this.getS3dResourcesRelativeFolder() + "content2D.js";
	}

	private List<DataRow> getAllThemeRows(){
		Data data = DataCollection.getData("s3d_Content2DTheme");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDt(this.getDBSession(), data);
		List<DataRow> rows = dt.getRows();
		return rows;
	}

	private List<DataRow> getAllModuleRows(String parentThemeId){
		Data data = DataCollection.getData("s3d_Content2DModule");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDtByFieldValue(this.getDBSession(), data, "parentid", "=", parentThemeId);
		List<DataRow> rows = dt.getRows();
		return rows;
	}

	private List<DataRow> getAllNavigatorRows(){
		Data data = DataCollection.getData("s3d_Content2DNavigator");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDt(this.getDBSession(), data);
		List<DataRow> rows = dt.getRows();
		return rows;
	}

	private DataRow getNavigatorRowByCode(String navigatorCode){
		Data data = DataCollection.getData("s3d_Content2DNavigator");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDtByFieldValue(this.getDBSession(), data, "code", "=", navigatorCode);
		List<DataRow> rows = dt.getRows();
		return rows.size() == 0 ? null : rows.get(0);
	}

	private DataRow getModuleRowByCode(String moduleCode, String themeId) throws SQLException {
		Data data = DataCollection.getData("s3d_Content2DModule");

		String sql = "select t.id as id,"
				+ " t.code as code,"
				+ " t.name as name"
				+ " from s3d_Content2DModule t"
				+ " where t.code=" + SysConfig.getParamPrefix() + "modulecode"
				+ " and t.parentid=" + SysConfig.getParamPrefix() + "themeid";

		HashMap<String, Object> p2vs = new HashMap<>();
		p2vs.put("modulecode", moduleCode);
		p2vs.put("themeid", themeId);

		List<String> alias = new ArrayList<>();
		alias.add("id");
		alias.add("code");
		alias.add("name");

		HashMap<String, ValueType> valueTypes = new HashMap<>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("name", ValueType.String);

		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(this.getDBSession(),sql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();
		if(rows.isEmpty()){
			return null;
		}
		else{
			return rows.get(0);
		}
	}

	private DataRow getThemeRowByCode(String themeCode){
		Data data = DataCollection.getData("s3d_Content2DTheme");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDtByFieldValue(this.getDBSession(), data, "code", "=", themeCode);
		List<DataRow> rows = dt.getRows();
		return rows.size() == 0 ? null : rows.get(0);
	}

	private JSONObject getThemeJson(DataRow themeRow, List<DataRow> moduleRows){
		String code = themeRow.getStringValue("code");
		String name = themeRow.getStringValue("name");
		JSONObject themeJson = new JSONObject();
		themeJson.put("code", code);
		themeJson.put("name", name);

		JSONArray moduleJsons = new JSONArray();
		for(int i = 0; i < moduleRows.size(); i++){
			DataRow moduleRow = moduleRows.get(i);
			JSONObject moduleJson = new JSONObject();
			String moduleCode = moduleRow.getStringValue("code");
			String moduleName = moduleRow.getStringValue("name");
			moduleJson.put("code", moduleCode);
			moduleJson.put("name", moduleName);
			moduleJsons.add(moduleJson);
		}
		themeJson.put("modules", moduleJsons);
		return themeJson;
	}

	@Override
	public void generateContent2DConfigFile(INcpSession session) throws Exception {
		JSONObject content2DConfigJson = new JSONObject();

		JSONArray themeJsons = new JSONArray();
		List<DataRow> themeRows = this.getAllThemeRows();
		for(DataRow themeRow : themeRows){
			String themeId = themeRow.getStringValue("id");
			String themeCode = themeRow.getStringValue("code");
			List<DataRow> moduleRows = this.getAllModuleRows(themeId);
			JSONObject themeJson = this.getThemeJson(themeRow, moduleRows);
			themeJsons.add(themeJson);
		}
		content2DConfigJson.put("themes", themeJsons);

		JSONArray navigatorJsons = new JSONArray();
		List<DataRow> navigatorRows = this.getAllNavigatorRows();
		for(DataRow navigatorRow : navigatorRows){
			String navigatorCode = navigatorRow.getStringValue("code");
			String navigatorName = navigatorRow.getStringValue("name");
			JSONObject navigatorJson = new JSONObject();
			navigatorJson.put("code", navigatorCode);
			navigatorJson.put("name", navigatorName);
			navigatorJsons.add(navigatorJson);
		}
		content2DConfigJson.put("navigators", navigatorJsons);

	    String content2DConfigText = "export const content2D = " + content2DConfigJson.toJSONString() + ";";
		String filePath = this.getConfigFilePath();
		FileOperate fo = new FileOperate();
		fo.createFile(filePath, content2DConfigText, FileOperate.DefaultEncoding);
	}

	@Override
	public JSONObject getContent2DJson(INcpSession session, String navigatorCode, HashMap<String, JSONObject> moduleMap) throws SQLException {
		HashMap<String, DataRow> themeRowMap = new HashMap<>();
		HashMap<String, HashMap<String, DataRow>> themeModuleRowMap = new HashMap<>();
		for(String key : moduleMap.keySet()){
			JSONObject moduleThemeJson = moduleMap.get(key);
			String themeCode = moduleThemeJson.getString("themeCode");
			String moduleCode = moduleThemeJson.getString("moduleCode");
			if(!themeRowMap.containsKey(themeCode)){
				DataRow themeRow = this.getThemeRowByCode(themeCode);
				if(themeRow != null) {
					themeRowMap.put(themeCode, themeRow);
					themeModuleRowMap.put(themeCode, new HashMap<>());
				}
			}
			DataRow themeRow = themeRowMap.get(themeCode);
			HashMap<String, DataRow> moduleRowMap = themeModuleRowMap.get(themeCode);
			if(moduleRowMap != null) {
				String themeId = themeRow.getStringValue("id");
				DataRow moduleRow = this.getModuleRowByCode(moduleCode, themeId);
				if(moduleRow != null) {
					moduleRowMap.put(moduleCode, moduleRow);
				}
			}
		}

		JSONArray themeJsons = new JSONArray();
		for(String themeCode : themeRowMap.keySet()) {
			DataRow themeRow = themeRowMap.get(themeCode);
			String code = themeRow.getStringValue("code");
			String name = themeRow.getStringValue("name");
			JSONObject themeJson = new JSONObject();
			themeJson.put("code", code);
			themeJson.put("name", name);

			JSONArray moduleJsons = new JSONArray();
			HashMap<String, DataRow> moduleRowMap = themeModuleRowMap.get(themeCode);
			for(String moduleCode : moduleRowMap.keySet()) {
				DataRow moduleRow = moduleRowMap.get(moduleCode);
				JSONObject moduleJson = new JSONObject();
				String moduleName = moduleRow.getStringValue("name");
				moduleJson.put("code", moduleCode);
				moduleJson.put("name", moduleName);
				moduleJsons.add(moduleJson);
			}
			themeJson.put("modules", moduleJsons);
			themeJsons.add(themeJson);
		}

		JSONArray navigatorJsons = new JSONArray();
		DataRow navigatorRow = this.getNavigatorRowByCode(navigatorCode);
		if(navigatorRow != null){
			String navigatorName = navigatorRow.getStringValue("name");
			JSONObject navigatorJson = new JSONObject();
			navigatorJson.put("code", navigatorCode);
			navigatorJson.put("code", navigatorName);
			navigatorJsons.add(navigatorJson);
		}

		JSONObject content2DJson = new JSONObject();
		content2DJson.put("navigators", navigatorJsons);
		content2DJson.put("themes", themeJsons);

		return content2DJson;
	}

}
