package com.zlp.mdl.processor;
  
import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.nova.frame.utils.StringUtils;
import org.hibernate.Session;
import com.zlp.cms.processor.IImageProcessor;
import com.zlp.constraintSolver.processor.MdlComponentParameter;
import com.zlp.constraintSolver.processor.ResourceGeometryType;
import com.zlp.external.resource.gltfZip.processor.IGltfZipProcessor;
import com.zlp.platform.common.FileOperate;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.JSONProcessor;
import com.zlp.platform.common.SysConfig;
import com.zlp.platform.common.ValueConverter;
import com.zlp.platform.common.redis.RedisException;
import com.zlp.platform.common.redis.RedisSessionCacheClient;
import com.zlp.platform.common.util.CommonFunction;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.platform.dao.db.DataTable;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.db.ValueType;
import com.zlp.platform.dao.sys.ContextUtil;
import com.zlp.platform.dao.sys.DataBaseDao;
import com.zlp.platform.dao.sys.IAccessoryDao;
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection; 

public class MdlComponentProcessor implements IMdlComponentProcessor{

	//Redis客户端 added by ls 20220913
	private RedisSessionCacheClient redisSessionCacheClient = null;
	public void setRedisSessionCacheClient(RedisSessionCacheClient redisSessionCacheClient){
		this.redisSessionCacheClient = redisSessionCacheClient;
	}
	public RedisSessionCacheClient getRedisSessionCacheClient(){
		return this.redisSessionCacheClient;
	}
	
	//模型缓存前缀 added by ls 20220913
	private String mdlComponentCacheKeyPrefix = "";
	public void setMdlComponentCacheKeyPrefix(String mdlComponentCacheKeyPrefix){
		this.mdlComponentCacheKeyPrefix = mdlComponentCacheKeyPrefix;
	}
	public String getMdlComponentCacheKeyPrefix(){
		return this.mdlComponentCacheKeyPrefix;
	}	
	 
	//附件处理接口
	private IAccessoryDao accessoryDao = null;
	public IAccessoryDao getAccessoryDao() {
		return accessoryDao;
	}
	public void setAccessoryDao(IAccessoryDao accessoryDao) {
		this.accessoryDao = accessoryDao;
	}  
	 
	private String filterType = "mdlComponent"; 
	public void setFilterType(String filterType) {
		 this.filterType = filterType;
	} 
	protected String getFilterType() {
		return filterType;
	} 
	 
	private String imageFilterType = "mdlComponentImage"; 
	public void setImageFilterType(String imageFilterType) {
		 this.imageFilterType = imageFilterType;
	} 
	protected String getImageFilterType() {
		return imageFilterType;
	} 
	
	private String exportDir = "";
	public void setExportDir(String exportDir){
		this.exportDir = exportDir;
	}
	public String getExportDir(){
		return this.exportDir;
	}
	
	//执行数据库操作的通用类
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	protected IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	}
	
	private Session dbSession = null;
	private Session getDBSession() {
		return dbSession;
	}
	
	@Override
	public void setDBSession(Session dbSession) {
		this.dbSession = dbSession;
	} 
	
	private String normalComponentFilePath = null;
	protected String getNormalComponentFilePath(){
		return this.normalComponentFilePath;
	}
	public void setNormalComponentFilePath(String normalComponentFilePath){
		this.normalComponentFilePath = normalComponentFilePath;
	}
	
	protected String getNormalComponentFilePath(String postfix){
		return this.normalComponentFilePath + "." + postfix;
	}
	
	private IImageProcessor imageProcessor = null;
	public IImageProcessor getImageProcessor() {
		return this.imageProcessor;
	}
	public void setImageProcessor(IImageProcessor imageProcessor) {
		this.imageProcessor = imageProcessor;
	}

	@Override
	public JSONObject getComponentFile(INcpSession session, String componentId) throws Exception{
		String userId = session.getUserId();
		JSONObject json = this.getComponentFile(session, componentId, userId);
		return json;
	}

	@Override
	public JSONObject getComponentFileByCode(INcpSession session, String componentCode, String versionNum) throws Exception{
		String userId = session.getUserId();
		JSONObject json = this.getComponentFileByCode(session, componentCode, versionNum, userId);
		return json;
	}

	@Override
	public JSONObject getComponentFileByName(INcpSession session, String componentName, String versionNum) throws Exception{
		String userId = session.getUserId();
		JSONObject json = this.getComponentFileByName(session, componentName, versionNum, userId);
		return json;
	}

	//根据国标码+版本号 获取部品信息 added by liyh 20220424
	@Override
	public JSONObject getComponentFileByGbCode(INcpSession session, String gbCode, String versionNum,String note) throws Exception{
		String userId = session.getUserId();
		JSONObject json = this.getComponentFileByGbCode(session, gbCode, versionNum, userId,note);
		return json;
	}
	  
	private String getComponentContentByComponentId(INcpSession session, String componentId) throws Exception{
		Data data = DataCollection.getData("mdl_Component");
		DataTable dt = this.getDBParserAccess().getDtById(getDBSession(), data, componentId);
		List<DataRow> rows = dt.getRows();
		if(rows.size() > 0){
			DataRow row = rows.get(0);			 
			String accessoryId = row.getStringValue("accessoryid"); 
			String content = this.getComponentContent(accessoryId); 
			return content; 
		}
		else{
			throw new Exception("不存在此组件. componentId = " + componentId);
		}
	}
	  
	//获取组件记录 added by ls 20220913
	private DataRow getComponentRow(INcpSession session, String componentCode, String versionNum) throws Exception{ 
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("code", componentCode);
		p2vs.put("versionnum", versionNum);
		
		//同时也获取id added by ls 20220913
		String sql = "select t.id as id, t.accessoryid as accessoryid from mdl_component t where t.isdeleted='N' and t.code = " + SysConfig.getParamPrefix() + "code and t.versionnum = " + SysConfig.getParamPrefix() + "versionnum";
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("accessoryid");
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("accessoryid", ValueType.String);
				
		DataTable dt = this.getDBParserAccess().selectList(dbSession, sql, p2vs, alias, fieldValueTypes);
		List<DataRow> rows = dt.getRows();
		if(rows.size() != 0){ 
			DataRow row = rows.get(0);
			return row;
		}
		else{
			throw new Exception("不存在此组件. componentCode = " + componentCode + ", versionNum = " + versionNum);
		}
	} 
	  
	private String getComponentContent(INcpSession session, String componentCode, String versionNum) throws Exception{ 
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("code", componentCode);
		p2vs.put("versionnum", versionNum);
		String sql = "select t.accessoryid as accessoryid from mdl_component t where t.isdeleted='N' and t.code = " + SysConfig.getParamPrefix() + "code and t.versionnum = " + SysConfig.getParamPrefix() + "versionnum";
		String accessoryId = (String)this.getDBParserAccess().selectOne(dbSession, sql, p2vs); 
		if(accessoryId != null){ 
			String content = this.getComponentContent(accessoryId); 
			return content; 
		}
		else{
			throw new Exception("不存在此组件. componentCode = " + componentCode + ", versionNum = " + versionNum);
		}
	}
	  
	private String getComponentContent(INcpSession session, String componentId) throws Exception{ 
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("componentid", componentId); 
		String sql = "select t.accessoryid as accessoryid from mdl_component t where t.isdeleted='N' and t.id = " + SysConfig.getParamPrefix() + "componentid";
		String accessoryId = (String)this.getDBParserAccess().selectOne(dbSession, sql, p2vs); 
		if(accessoryId != null){ 
			String content = this.getComponentContent(accessoryId); 
			return content; 
		}
		else{
			throw new Exception("不存在此组件. componentId = " + componentId);
		}
	}
	  
	private void getComponentJsonRecursion(INcpSession session, String componentCode, String versionNum, HashMap<String, JSONObject> componentJsonMap) throws Exception{ 
		//获取模型内容的同时，也获取id modified by ls 20220913
		DataRow row = this.getComponentRow(session, componentCode, versionNum);
		String id = row.getStringValue("id");
		String accessoryId = row.getStringValue("accessoryid");
		String content = this.getComponentContent(accessoryId);
		JSONObject componentJson = JSONProcessor.strToJSON(content);
		componentJson.put("id", id);
		String key = componentCode + "_" + versionNum;
		componentJsonMap.put(key, componentJson);
		this.getComponentJsonRecursion(session, componentJson, componentJsonMap);
	}
	
	@Override
	public void getComponentJsonRecursion(INcpSession session, JSONObject componentJson, HashMap<String, JSONObject> componentJsonMap) throws Exception{
		JSONObject allUnitJsons = componentJson.getJSONObject("units"); 
		for(Object unitIdObj : allUnitJsons.keySet()){
			JSONObject unitJson = allUnitJsons.getJSONObject((String)unitIdObj); 
			String refComponentCode = unitJson.getString("code");
			String refComponentVersionNum = unitJson.getString("versionNum");
			String refComponentKey = refComponentCode + "_" + refComponentVersionNum;
			if(!componentJsonMap.containsKey(refComponentKey)){
				this.getComponentJsonRecursion(session, refComponentCode, refComponentVersionNum, componentJsonMap);
			} 
		}
	}
	
	private String getComponentContent(String accessoryId) throws Exception{
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		String filePath = accessoryDao.getFilePathById(accessoryId);
		FileOperate fo = new FileOperate();
		String content = fo.readTxt(filePath, "utf-8");
		return content;
	}  
	
	private JSONObject getComponentFile(INcpSession session, String componentId, String userId) throws Exception{
		Data data = DataCollection.getData("mdl_Component");
		DataTable dt = this.getDBParserAccess().getDtById(getDBSession(), data, componentId);
		List<DataRow> rows = dt.getRows();
		if(rows.size() > 0){
			DataRow row = rows.get(0); 
			String accessoryId = row.getStringValue("accessoryid");
			String categoryId = row.getStringValue("categoryid");
			String componentName = row.getStringValue("name");
			String metadata = row.getStringValue("metadata");//元数据扩展属性
			
			String content = this.getComponentContent(accessoryId);

			JSONObject componentJson = JSONProcessor.strToJSON(content);	
			HashMap<String, JSONObject> refComponentJsonMap = new HashMap<String, JSONObject>();
			this.getComponentJsonRecursion(session, componentJson, refComponentJsonMap);
			JSONObject refComponents = new JSONObject();
			for(String refComponentKey : refComponentJsonMap.keySet()){
				refComponents.put(refComponentKey, refComponentJsonMap.get(refComponentKey));
			}	
			componentJson.put("refComponents", refComponents);
			String componentContent = JSONProcessor.jsonToStr(componentJson);
			
			JSONObject json = new JSONObject();
			json.put("id", componentId);
			json.put("categoryId", categoryId); 
			json.put("name", CommonFunction.encode(componentName)); 
			json.put("content", CommonFunction.encode(componentContent));

			json.put("metadata",CommonFunction.encode(metadata));//元数据扩展属性

			return json;
		}
		else{
			throw new Exception("不存在此组件. componentId = " + componentId);
		}
	}

	private JSONObject getComponentFileByCode(INcpSession session, String componentCode, String versionNum, String userId) throws Exception{
		String sql = "select t.id as id,"
				+ " t.name as name,"
				+ " t.accessoryid as accessoryid,"
				+ " t.imgid as imgid,"
				+ " t.categoryid as categoryid"
				+ " from mdl_Component t"
				+ " where t.isdeleted='N'"
				+ " and t.code = " + SysConfig.getParamPrefix() + "code"
				+ " and t.versionnum = " + SysConfig.getParamPrefix() + "versionnum ";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("code", componentCode);
		p2vs.put("versionnum", versionNum);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("accessoryid");
		alias.add("imgid");
		alias.add("categoryid");
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		fieldValueTypes.put("accessoryid", ValueType.String);
		fieldValueTypes.put("imgid", ValueType.String);
		fieldValueTypes.put("categoryid", ValueType.String);
		DataTable dt = this.getDBParserAccess().selectList(dbSession, sql, p2vs, alias, fieldValueTypes);

		List<DataRow> rows = dt.getRows();
		if(rows.size() > 0){
			DataRow row = rows.get(0);
			String componentId = row.getStringValue("id");
			String accessoryId = row.getStringValue("accessoryid");
			String categoryId = row.getStringValue("categoryid");
			String imgId = row.getStringValue("imgid");
			String componentName = row.getStringValue("name");
			String content = this.getComponentContent(accessoryId);

			JSONObject componentJson = JSONProcessor.strToJSON(content);
			HashMap<String, JSONObject> refComponentJsonMap = new HashMap<String, JSONObject>();
			this.getComponentJsonRecursion(session, componentJson, refComponentJsonMap);
			JSONObject refComponents = new JSONObject();
			for(String refComponentKey : refComponentJsonMap.keySet()){
				refComponents.put(refComponentKey, refComponentJsonMap.get(refComponentKey));
			}
			componentJson.put("refComponents", refComponents);
			String componentContent = JSONProcessor.jsonToStr(componentJson);

			JSONObject json = new JSONObject();
			json.put("id", componentId);
			json.put("categoryId", categoryId);
			json.put("imgId", imgId);
			json.put("name", CommonFunction.encode(componentName));
			json.put("content", CommonFunction.encode(componentContent));
			return json;
		}
		else{
			throw new Exception("不存在此组件. componentCode = " + componentCode + ", versionNum = " + versionNum);
		}
	}

	private JSONObject getComponentFileByName(INcpSession session, String componentName, String versionNum, String userId) throws Exception{
		String sql = "select t.id as id,"
				+ " t.name as name,"
				+ " t.code as code,"
				+ " t.accessoryid as accessoryid,"
				+ " t.imgid as imgid,"
				+ " t.categoryid as categoryid"
				+ " from mdl_Component t"
				+ " where t.isdeleted='N'"
				+ " and t.name = " + SysConfig.getParamPrefix() + "name"
				+ " and t.versionnum = " + SysConfig.getParamPrefix() + "versionnum "
				+ " order by t.modifytime desc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("name", componentName);
		p2vs.put("versionnum", versionNum);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("code");
		alias.add("accessoryid");
		alias.add("imgid");
		alias.add("categoryid");
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		fieldValueTypes.put("code", ValueType.String);
		fieldValueTypes.put("accessoryid", ValueType.String);
		fieldValueTypes.put("imgid", ValueType.String);
		fieldValueTypes.put("categoryid", ValueType.String);
		DataTable dt = this.getDBParserAccess().selectList(dbSession, sql, p2vs, alias, fieldValueTypes);

		List<DataRow> rows = dt.getRows();
		if(rows.size() > 0){
			DataRow row = rows.get(0);
			String componentId = row.getStringValue("id");
			String accessoryId = row.getStringValue("accessoryid");
			String categoryId = row.getStringValue("categoryid");
			String imgId = row.getStringValue("imgid");
			String componentCode = row.getStringValue("code");
			String content = this.getComponentContent(accessoryId);

			JSONObject componentJson = JSONProcessor.strToJSON(content);
			HashMap<String, JSONObject> refComponentJsonMap = new HashMap<String, JSONObject>();
			this.getComponentJsonRecursion(session, componentJson, refComponentJsonMap);
			JSONObject refComponents = new JSONObject();
			for(String refComponentKey : refComponentJsonMap.keySet()){
				refComponents.put(refComponentKey, refComponentJsonMap.get(refComponentKey));
			}
			componentJson.put("refComponents", refComponents);
			String componentContent = JSONProcessor.jsonToStr(componentJson);

			JSONObject json = new JSONObject();
			json.put("id", componentId);
			json.put("categoryId", categoryId);
			json.put("imgId", imgId);
			json.put("code", CommonFunction.encode(componentCode));
			json.put("versionNum", versionNum);
			json.put("name", CommonFunction.encode(componentName));
			json.put("content", CommonFunction.encode(componentContent));
			return json;
		}
		else{
			throw new Exception("不存在此组件. componentName = " + componentName + ", versionNum = " + versionNum);
		}
	}

	//根据国标码+版本号 获取部品信息 added by liyh 20220424
	private JSONObject getComponentFileByGbCode(INcpSession session, String gbCode, String versionNum, String userId,String note) throws Exception{
		String sql = "select t.id as id,"
				+ " t.name as name,"
				+ " t.accessoryid as accessoryid,"
				+ " t.imgid as imgid,"
				+ " t.categoryid as categoryid"
				+ " from mdl_Component t"
				+ " where t.isdeleted='N'"
				+ " and t.gbcode = " + SysConfig.getParamPrefix() + "gbcode"
				+ " and t.versionnum = " + SysConfig.getParamPrefix() + "versionnum ";

		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("gbcode", gbCode);
		p2vs.put("versionnum", versionNum);

		if(!StringUtils.isNullOrEmpty(note)){
			sql+= " and t.note = " + SysConfig.getParamPrefix() + "note ";
			p2vs.put("note", note);
		}

		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("accessoryid");
		alias.add("imgid");
		alias.add("categoryid");
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		fieldValueTypes.put("accessoryid", ValueType.String);
		fieldValueTypes.put("imgid", ValueType.String);
		fieldValueTypes.put("categoryid", ValueType.String);

		DataTable dt = this.getDBParserAccess().selectList(dbSession, sql, p2vs, alias, fieldValueTypes);

		List<DataRow> rows = dt.getRows();
		if(rows.size() > 0){
			DataRow row = rows.get(0);
			String componentId = row.getStringValue("id");
			String accessoryId = row.getStringValue("accessoryid");
			String categoryId = row.getStringValue("categoryid");
			String imgId = row.getStringValue("imgid");
			String componentName = row.getStringValue("name");
			String content = this.getComponentContent(accessoryId);

			JSONObject componentJson = JSONProcessor.strToJSON(content);
			HashMap<String, JSONObject> refComponentJsonMap = new HashMap<String, JSONObject>();
			this.getComponentJsonRecursion(session, componentJson, refComponentJsonMap);
			JSONObject refComponents = new JSONObject();
			for(String refComponentKey : refComponentJsonMap.keySet()){
				refComponents.put(refComponentKey, refComponentJsonMap.get(refComponentKey));
			}
			componentJson.put("refComponents", refComponents);
			String componentContent = JSONProcessor.jsonToStr(componentJson);

			JSONObject json = new JSONObject();
			json.put("id", componentId);
			json.put("categoryId", categoryId);
			json.put("imgId", imgId);
			json.put("name", CommonFunction.encode(componentName));
			json.put("content", CommonFunction.encode(componentContent));
			return json;
		}
		else{
			throw new Exception("不存在此组件. gbCode = " + gbCode + ", versionNum = " + versionNum);
		}
	}

	//根据编码和版本号，获取组件信息 added by ls 20210820
	public JSONObject getComponentInfoByCode(INcpSession session, String componentCode, String versionNum) throws Exception{		
		String sql = "select t.id as id, "
				+ "t.name as name, "
				+ "t.code as code, "
				+ "t.versionnum as versionnum, "
				+ "t.imgid as imgid, "
				+ "t.mdltype as mdltype, "
				+ "t.gbcode as gbcode, " //新增国标码 added by liyh 20220415
				+ "c.code as categorycode "
				+ "from mdl_Component t "
				+ "left outer join cat_Category c on c.id = t.categoryid "
				+ "where t.isdeleted='N' "
				+ "and t.code = " + SysConfig.getParamPrefix() + "code "
				+ "and t.versionnum = " + SysConfig.getParamPrefix() + "versionnum ";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("code", componentCode);
		p2vs.put("versionnum", versionNum);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("code");
		alias.add("versionnum");
		alias.add("imgid");
		alias.add("mdltype");
		alias.add("gbcode");//
		alias.add("categorycode"); 
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		fieldValueTypes.put("code", ValueType.String);	
		fieldValueTypes.put("versionnum", ValueType.String);
		fieldValueTypes.put("imgid", ValueType.String);		
		fieldValueTypes.put("mdltype", ValueType.String);
		fieldValueTypes.put("gbcode", ValueType.String);//
		fieldValueTypes.put("categorycode", ValueType.String);	 	
		DataTable dt = this.getDBParserAccess().selectList(dbSession, sql, p2vs, alias, fieldValueTypes);
		
		List<DataRow> rows = dt.getRows();
		if(rows.size() > 0){
			DataRow row = rows.get(0); 
			String componentId = row.getStringValue("id"); 
			String componentName = row.getStringValue("name");        
			String mdlType = row.getStringValue("mdltype");
			String gbcode = row.getStringValue("gbcode");//
			String categoryCode = row.getStringValue("categorycode");  
			String imgId = row.getStringValue("imgid");    
			
			JSONObject json = new JSONObject();
			json.put("id", componentId);
			json.put("name", CommonFunction.encode(componentName)); 
			json.put("code", CommonFunction.encode(componentCode)); 
			json.put("versionNum", CommonFunction.encode(versionNum));  
			json.put("mdlType", mdlType);
			json.put("gbcode", CommonFunction.encode(gbcode));//
			json.put("imgId", imgId);   
			json.put("categoryCode", categoryCode);  
			return json; 
		}
		else{
			throw new Exception("不存在此组件. componentCode = " + componentCode + ", versionNum = " + versionNum);
		}
	} 
	
	public String getCategoryCode(INcpSession session, String categoryId) throws Exception{
		Data data = DataCollection.getData("cat_Category");
		DataTable dt = this.getDBParserAccess().getDtById(getDBSession(), data, categoryId);
		List<DataRow> rows = dt.getRows();
		if(rows.size() != 0){
			String categoryCode = rows.get(0).getStringValue("code");
			return categoryCode;
		}
		else{
			return null;
		}		
	}

	//创建component的内容文本（涉及返回模型文件20220714）  added by ls 20220705
	@Override
	public String createComponentText(INcpSession session, String componentCode, String componentName, String versionNum, String categoryCode) throws Exception{
		String normalFilePath = this.getNormalComponentFilePath(categoryCode);
		FileOperate fo = new FileOperate();
		if(!fo.exists(normalFilePath)){
			//如果没有这个类型单独的模板，那么使用通用模板
			normalFilePath = this.getNormalComponentFilePath();
		}
		String normalText = fo.readTxt(normalFilePath, "utf-8");
		normalText = normalText.replaceAll("componentCode", componentCode);
		normalText = normalText.replaceAll("componentName", componentName);
		normalText = normalText.replaceAll("componentVersionNum", versionNum);
		return normalText;
	}

	//创建component文件
	//将原有的函数拆分，分为创建文件字符串和更新数据库两步（涉及返回模型文件20220714）  modified by ls 20220705
	@Override
	public String createComponent(INcpSession session, String componentCode, String componentName, String note, String shareType,String gbCode, String versionNum, String categoryId, String mdlType
			,String m900,String m904,String goodsMid,String sBaseMid,String metadata,String userId,String companyId,JSONObject unitSettingObject,String projectid,String projectunitid) throws Exception{
		if(this.hasComponent(session, componentCode, versionNum, null)){
			throw new Exception("已存在此编码和版本的组件.");
		}
		else {
			this.isValidFileName(componentName);
			
	    	UUID uuid = UUID.randomUUID();  
	    	String componentId = uuid.toString();
			Date createTime = new Date(); 
			Date deleteTime = ValueConverter.convertToTime(DataBaseDao.getDefaultDeleteTime(), SysConfig.getTimeFormat());
			Session dbSession = this.getDBSession();
						 
			//改为根据mdlType获取对应的模型模板文件
			String normalFilePath = this.getNormalComponentFilePath(mdlType);			
			FileOperate fo = new FileOperate();
			if(!fo.exists(normalFilePath)){
				//如果没有这个类型单独的模板，那么使用通用模板
				normalFilePath = this.getNormalComponentFilePath();
			} 
			String normalText = fo.readTxt(normalFilePath, "utf-8");
			normalText = normalText.replaceAll("componentCode", componentCode); 
			normalText = normalText.replaceAll("componentName", componentName); 
			normalText = normalText.replaceAll("componentVersionNum", versionNum);


			//增加对新建模型时直接传入 实例化参数进行实例化的 功能 Start  added by liyh 20221229
			if(unitSettingObject!=null) {
				//1-新建unit，并插入到units中
				JSONObject componentJson = JSONObject.parseObject(normalText);

				JSONObject unitJsonObject = new JSONObject();
				String  unitId = UUID.randomUUID().toString();
				unitJsonObject.put("id",unitId);
				unitJsonObject.put("code",unitSettingObject.getString("code"));
				unitJsonObject.put("name","组件1");
				unitJsonObject.put("versionNum",unitSettingObject.getString("versionNum"));
				unitJsonObject.put("parameters",unitSettingObject.getJSONObject("parameters"));

				JSONArray positionArray= new JSONArray();
				positionArray.add(0);
				positionArray.add(0);
				positionArray.add(0);
				unitJsonObject.put("position",positionArray);

				JSONArray rotationArray= new JSONArray();
				rotationArray.add(0);
				rotationArray.add(0);
				rotationArray.add(0);
				unitJsonObject.put("rotation",rotationArray);

				//补充必要信息 added by liyh 20230103
				unitJsonObject.put("mixType","none");


				JSONObject unitsJsonObject = new JSONObject();
				unitsJsonObject.put(unitId,unitJsonObject);
				componentJson.replace("units",unitsJsonObject);

				//补充必要信息 added by liyh 20230103
				componentJson.put("sizeExp",new JSONObject());

				//2-插入unitid到对应的默认分组的units中
				JSONArray groupsJsonArray = componentJson.getJSONArray("groups");
				JSONObject defaultGroupJsonObject = groupsJsonArray.getJSONObject(0);
				defaultGroupJsonObject.getJSONArray("units").add(unitId);

				//
				normalText = componentJson.toString();
			}
			//增加对新建模型时直接传入 实例化参数进行实例化的 功能  End


			InputStream inputStream = new ByteArrayInputStream(normalText.getBytes("utf-8"));   
	    	
			IAccessoryDao accessoryDao = this.getAccessoryDao();
			accessoryDao.setDBSession(dbSession);
			String accessoryId = accessoryDao.saveAccessory(session, inputStream, componentName, filterType, componentId);
			
			Data data = DataCollection.getData("mdl_Component");
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			p2vs.put("name", componentName);
			p2vs.put("note", note);//增加备注 20220222
			p2vs.put("sharetype", shareType);//增加共享范围 20220329
			p2vs.put("gbcode", gbCode);//国标码 20220408
			p2vs.put("code", componentCode); 
			p2vs.put("versionnum", versionNum); 
			p2vs.put("categoryid", categoryId); 
			p2vs.put("createtime", createTime);
			//p2vs.put("createuser_xid", session.getUserId());
			p2vs.put("createuser_xid", StringUtils.isNullOrEmpty(userId)? session.getUserId():userId);//如果外部单独传递用户ID,则使用外部传递的ID (Adim集成用) modified by liyh 20221130
			p2vs.put("modifytime", createTime);
			//p2vs.put("modifyuser_xid", session.getUserId());
			p2vs.put("modifyuser_xid", StringUtils.isNullOrEmpty(userId)? session.getUserId():userId);//如果外部单独传递用户ID,则使用外部传递的ID (Adim集成用) modified by liyh 20221130
			p2vs.put("deletetime", deleteTime);
			p2vs.put("isdeleted", "N");
			//p2vs.put("companyid", DataBaseDao.getDefaultCompanyId(session));
			p2vs.put("companyid", StringUtils.isNullOrEmpty(companyId)?DataBaseDao.getDefaultCompanyId(session):companyId);//如果外部单独传递企业ID,则使用外部传递的企业ID (Adim集成用) modified by liyh 20221130
			p2vs.put("accessoryid", accessoryId);
			p2vs.put("mdltype", mdlType);

			p2vs.put("m_900", m900);
			p2vs.put("m_904", m904);
			p2vs.put("goods_mid", goodsMid);
			p2vs.put("s_base_mid", sBaseMid);
			p2vs.put("metadata", metadata);

			p2vs.put("projectid", projectid);
			p2vs.put("projectunitid", projectunitid);
			
			//默认未发布 added by ls 20230811
			p2vs.put("ispublished", "N");

			
			IDBParserAccess dbAccess = this.getDBParserAccess();
			dbAccess.insertByData(dbSession, data, p2vs, componentId);

			//修改组件时间戳 added by ls 20220913
			this.updateComponentTimeMark(componentId, createTime);
			
			return componentId;
		}
	}
	
	//复制组件 added by ls 20210823
	@Override
	public String copyComponent(INcpSession session, String copiedId, String componentCode, String componentName, String versionNum, String categoryId,
								String mdlType, String note, String shareType, String gbCode,String userId,String companyId) throws Exception{
		if(this.hasComponent(session, componentCode, versionNum, null)){
			throw new Exception("已存在此编码和版本的组件.");
		}
		else {
			this.isValidFileName(componentName);
			
	    	UUID uuid = UUID.randomUUID();  
	    	String componentId = uuid.toString();
			Date createTime = new Date(); 
			Date deleteTime = ValueConverter.convertToTime(DataBaseDao.getDefaultDeleteTime(), SysConfig.getTimeFormat());
			Session dbSession = this.getDBSession(); 
			
			String content = this.getComponentContent(session, copiedId);			
			JSONObject contentJson = JSONObject.parseObject(content);
			contentJson.put("code", componentCode);
			contentJson.put("name", componentName);
			contentJson.put("versionNum", versionNum);  
			InputStream inputStream = new ByteArrayInputStream(contentJson.toString().getBytes("utf-8"));	    	
			IAccessoryDao accessoryDao = this.getAccessoryDao();
			accessoryDao.setDBSession(dbSession); 
			String accessoryId = accessoryDao.saveAccessory(session, inputStream, componentName, filterType, componentId);
			
			Data data = DataCollection.getData("mdl_Component");
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			p2vs.put("name", componentName);
            p2vs.put("note", note);//增加备注 added by liyh 20220225
			p2vs.put("sharetype", shareType);//增加共享范围 20220329
			p2vs.put("gbcode", gbCode);//国标码 20220408
            p2vs.put("code", componentCode);
			p2vs.put("versionnum", versionNum); 
			p2vs.put("categoryid", categoryId); 
			p2vs.put("createtime", createTime);
			p2vs.put("createuser_xid", StringUtils.isNullOrEmpty(userId)? session.getUserId():userId);//如果外部单独传递用户ID,则使用外部传递的ID (Adim集成用) modified by liyh 20221130
			p2vs.put("modifytime", createTime);
			p2vs.put("modifyuser_xid", StringUtils.isNullOrEmpty(userId)? session.getUserId():userId);//如果外部单独传递用户ID,则使用外部传递的ID (Adim集成用) modified by liyh 20221130
			p2vs.put("deletetime", deleteTime);
			p2vs.put("isdeleted", "N");
			p2vs.put("companyid", StringUtils.isNullOrEmpty(companyId)?DataBaseDao.getDefaultCompanyId(session):companyId);//如果外部单独传递企业ID,则使用外部传递的企业ID (Adim集成用) modified by liyh 20221130
			p2vs.put("accessoryid", accessoryId);
			p2vs.put("mdltype", mdlType);
			
			//默认未发布 added by ls 20230811
			p2vs.put("ispublished", "N");
			
			IDBParserAccess dbAccess = this.getDBParserAccess();
			dbAccess.insertByData(dbSession, data, p2vs, componentId);

			//修改组件时间戳 added by ls 20220913
			this.updateComponentTimeMark(componentId, createTime);

			this.saveComponentPropertiesToDB(session, componentId, contentJson);
			
			return componentId;
		}
	}
	
	//更新组件缓存的时间戳 added by ls 20220913
	private void updateComponentTimeMark(String id) throws Exception{
		DataRow row = this.getComponentRow(id);
		Date modifyTime = row.getDateTimeValue("modifytime");
		this.updateComponentTimeMark(id, modifyTime);
	}

	//获取组件记录 added by ls 20220913
	private DataRow getComponentRow(String id) throws Exception{
		Data data = DataCollection.getData("mdl_Component");
		DataTable dt =  this.dBParserAccess.getDtById(getDBSession(), data, id);
		List<DataRow> rows = dt.getRows();
		if(rows.size() == 0){
			throw new Exception("None mdl_Component, id = " + id);
		}
		else{
			DataRow row = rows.get(0);
			return row;
		}
	}
	
	//修改组件缓存的时间戳 added by ls 20220913
	private void updateComponentTimeMark(String id, Date modifyTime) throws RedisException{
		RedisSessionCacheClient redisSessionCacheClient = this.getRedisSessionCacheClient(); 		
		String key = this.getMdlComponentCacheKeyPrefix() + id;
		String modifyTimeMark = ValueConverter.dateTimeToString(modifyTime, "yyyy-MM-dd HH:mm:ss");
		redisSessionCacheClient.setAttribute(key, "modifyTime", modifyTimeMark);		
	}
	
	//获取组件最后一次修改时间 add by ls 20220913
	@Override
	public String getLastModifyTimeMark(String id) throws Exception{
		RedisSessionCacheClient redisSessionCacheClient = this.getRedisSessionCacheClient(); 		
		String key = this.getMdlComponentCacheKeyPrefix() + id; 
		String modifyTimeMark = redisSessionCacheClient.getAttribute(key, "modifyTime");
		if(modifyTimeMark == null){
			DataRow row = this.getComponentRow(id);
			Date modifyTime = row.getDateTimeValue("modifytime");
			this.updateComponentTimeMark(id, modifyTime);
			modifyTimeMark = ValueConverter.dateTimeToString(modifyTime, "yyyy-MM-dd HH:mm:ss");
			return modifyTimeMark;
		}
		else{
			return modifyTimeMark;
		}		
	}
	 
	@Override
	public void saveComponent(INcpSession session, String componentId, String componentCode, String componentName, String versionNum, String content, String snapshot,String userId) throws Exception{
		if(this.checkUser(session, componentId,userId)){
			this.isValidFileName(componentName);
			Date modifyTime = new Date();  
			Session dbSession = this.getDBSession();
			 
			InputStream inputStream = new ByteArrayInputStream(content.getBytes("utf-8"));    	
			IAccessoryDao accessoryDao = this.getAccessoryDao();
			accessoryDao.setDBSession(dbSession);
			String accessoryId = accessoryDao.saveAccessory(session, inputStream, componentName, this.getFilterType(), componentId);

			String snapshotId = this.saveComponentImage(session, componentId, snapshot);
			
			Data data = DataCollection.getData("mdl_Component");
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			p2vs.put("name", componentName); 
			p2vs.put("code", componentCode); 
			p2vs.put("versionnum", versionNum); 
			p2vs.put("modifytime", modifyTime);
			p2vs.put("modifyuser_xid", StringUtils.isNullOrEmpty(userId)? session.getUserId():userId);//如果外部单独传递用户ID,则使用外部传递的ID (Adim集成用) modified by liyh 20221130
			p2vs.put("accessoryid", accessoryId);
			p2vs.put("snapshotid", snapshotId);
			
			IDBParserAccess dbAccess = this.getDBParserAccess();
			dbAccess.updateByData(dbSession, data, p2vs, componentId); 

			//修改组件时间戳 added by ls 20220913
			this.updateComponentTimeMark(componentId, modifyTime);
			
			this.saveComponentPropertiesToDB(session, componentId, content);
			
		}
		else{
			throw new Exception("该用户没有保存权限. componentId = " + componentId);
		}
	}
	 
	@Override
	public void saveImage(INcpSession session, String componentId, String imageBase64,String userId) throws Exception{
		if(this.checkUser(session, componentId, userId)){
			Session dbSession = this.getDBSession();
			String imgId = this.saveComponentImage(session, componentId, imageBase64);
			Data data = DataCollection.getData("mdl_Component");
			HashMap<String, Object> p2vs = new HashMap<String, Object>(); 
			p2vs.put("imgid", imgId);
			IDBParserAccess dbAccess = this.getDBParserAccess();
			dbAccess.updateByData(dbSession, data, p2vs, componentId);   
			
		}
		else{
			throw new Exception("该用户没有保存权限. componentId = " + componentId);
		}
	}
	
	private String saveComponentImage(INcpSession session, String componentId, String image) throws Exception {
		if(image != null){			
			byte[] imageBytes = Base64.getDecoder().decode(image);        
			InputStream inputStream = new ByteArrayInputStream(imageBytes);
			IAccessoryDao accessoryDao = this.getAccessoryDao();
			accessoryDao.setDBSession(dbSession);
			String accessoryId = accessoryDao.saveAccessory(session, inputStream, componentId + ".png", this.getImageFilterType(), componentId);
			return accessoryId;
		}
		else{
			return null;
		}
	}
	private void saveComponentPropertiesToDB(INcpSession session, String componentId, String content) throws Exception{
		JSONObject componentJson = JSONProcessor.strToJSON(content); 
		this.saveComponentPropertiesToDB(session, componentId, componentJson);
	}
	
	private void saveComponentPropertiesToDB(INcpSession session, String componentId, JSONObject componentJson) throws Exception{
		Data componentPropertyData = DataCollection.getData("mdl_ComponentProperty");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		
		//删除组件原有的属性记录
		dbAccess.deleteByData(getDBSession(), componentPropertyData, "componentid", "=", componentId);
				
		JSONObject parametersJson = componentJson.containsKey("parameters") ? componentJson.getJSONObject("parameters") : null;
		
		if(parametersJson != null){
			List<HashMap<String, Object>> allP2vs = new ArrayList<HashMap<String, Object>>();
			for(Object paramNameObj : parametersJson.keySet()){
				String paramName = (String) paramNameObj;
				JSONObject paramJson = parametersJson.getJSONObject(paramName);
				ValueType valueType = MdlComponentParameter.getValueType(paramJson.getString("paramType"));
				String defaultValue = paramJson.getString("defaultValue");
				HashMap<String, Object> p2vs = new HashMap<String, Object>();
				p2vs.put("propertyname", paramName);
				p2vs.put("valuetype", valueType.toString());
				p2vs.put("componentid", componentId);
				switch (valueType) {
					case String: 
					case Boolean:
					case Time:
					case Date:{ 
						p2vs.put("stringvalue", defaultValue);
						break;
					} 
					case Decimal:{
						Object decimalValue = ValueConverter.convertToObject(defaultValue, valueType); 
						p2vs.put("decimalvalue", decimalValue);
						break;
					}					
					default:{
						throw new Exception("尚未处理的数据类型, valueType = " + valueType.toString() + ". (saveComponentPropertiesToDB)");
					}
				}
				allP2vs.add(p2vs);				
			}
			dbAccess.insertByData(getDBSession(), componentPropertyData, allP2vs);
		}
	}
	
	@Override
	public JSONArray queryComponents(INcpSession session, String componentName, String categoryId, JSONArray propertyJsonArray) throws Exception{
		List<DataRow> rows = this.queryComponentRows(session, componentName, categoryId, propertyJsonArray);		
		JSONArray jsonArray = new JSONArray();
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			JSONObject componentJson = new JSONObject();
			componentJson.put("id", row.getStringValue("id"));
			componentJson.put("name", CommonFunction.encode(row.getStringValue("name")));
			componentJson.put("code", CommonFunction.encode(row.getStringValue("code")));
			componentJson.put("versionnum", row.getStringValue("versionnum"));
			componentJson.put("categoryid", row.getStringValue("categoryid"));
			componentJson.put("categoryname", CommonFunction.encode(row.getStringValue("categoryname")));
			componentJson.put("imgid", row.getStringValue("imgid")); 
			jsonArray.add(componentJson);
		}
		return jsonArray;
	}
	
	private List<DataRow> queryComponentRows(INcpSession session, String componentName, String categoryId, JSONArray propertyJsonArray) throws Exception{
		String categoryCode = this.getCategoryCode(session, categoryId);

		//增加categoryCode为null的判断处理  added by liyh 20221017
		if(categoryCode == null) {
			throw new Exception("不存在categoryId= '"+categoryId+"' 的组件.");
		}
		 
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("versionnum", ValueType.String);
		valueTypes.put("categoryid", ValueType.String);
		valueTypes.put("categoryname", ValueType.String);
		valueTypes.put("imgid", ValueType.String); 
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("code");
		alias.add("versionnum");
		alias.add("categoryid");
		alias.add("categoryname");
		alias.add("imgid");
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		String sql = "select t.id as id,"
			+ " t.name as name,"
			+ " t.code as code,"
			+ " t.versionnum as versionnum,"
			+ " t.categoryid as categoryid,"
			+ " cat.name as categoryname,"
			+ " t.imgid as imgid"
			+ " from mdl_component t"
			+ " left outer join cat_category cat on cat.id = t.categoryid"
			+ " where t.isdeleted = 'N'";

		//类型过滤
		sql += (" and cat.code like " + SysConfig.getParamPrefix() + "categorycode");
		p2vs.put("categorycode", categoryCode + "%"); 

		//名称过滤
		if(componentName != null && componentName.trim().length() != 0){
			sql += (" and t.name like " + SysConfig.getParamPrefix() + "name");
			p2vs.put("name", "%" + componentName.trim() + "%");
		}
		
		//属性值过滤
		if(propertyJsonArray != null && propertyJsonArray.size() > 0){		
			List<DataRow> catPropertyRows = this.getCategoryPropertyRows(session, categoryId);
			if(catPropertyRows.size() > 0){
				
				//获取每个属性的类型
				HashMap<String, ValueType> propertyValueTypes = new HashMap<String, ValueType>();
				for(int i = 0; i < catPropertyRows.size(); i++){
					DataRow catPropertyRow = catPropertyRows.get(i);
					String propertyName = catPropertyRow.getStringValue("name");
					String paramTypeStr = catPropertyRow.getStringValue("paramtype");
					ValueType valueType = MdlComponentParameter.getValueType(paramTypeStr);
					propertyValueTypes.put(propertyName, valueType);
				}
			
				for(int i = 0; i < propertyJsonArray.size(); i++){
					sql += " and exists( select p.id from mdl_componentproperty p where t.id = p.componentid";
					JSONObject paramJson = propertyJsonArray.getJSONObject(i);
					String propertyName = paramJson.getString("propertyName");
					String propertyValue = paramJson.getString("propertyValue");
					if(!propertyValueTypes.containsKey(propertyName)){
						throw new Exception(categoryCode + "类型不存在名为" + propertyName + "的属性.");
					}
					else{
						ValueType valueType = propertyValueTypes.get(propertyName);
						switch(valueType){
							case String:{
								sql += (" and (p.propertyname=" + SysConfig.getParamPrefix() + "propertyname" + i + " and p.stringvalue like " + SysConfig.getParamPrefix() + "propertyvalue" + i + ")");								
								p2vs.put("propertyname" + i, propertyName);								
								p2vs.put("propertyvalue" + i, "%" + propertyValue + "%");
								break;
							}
							case Boolean:{								
								sql += (" and (p.propertyname=" + SysConfig.getParamPrefix() + "propertyname" + i + " and p.stringvalue = " + SysConfig.getParamPrefix() + "propertyvalue" + i + ")");
								p2vs.put("propertyname" + i, propertyName);								
								p2vs.put("propertyvalue" + i, propertyValue);
								break;
							}
							case Decimal:{
								Object decimalValue = ValueConverter.convertToObject(propertyValue, valueType);
								sql += (" and (p.propertyname=" + SysConfig.getParamPrefix() + "propertyname" + i + " and p.decimalvalue = " + SysConfig.getParamPrefix() + "propertyvalue" + i + ")");
								p2vs.put("propertyname" + i, propertyName);
								p2vs.put("propertyvalue" + i, decimalValue);
								break;
							}
							case Date:
							case Time:
							default:{
								throw new Exception("没有处理的属性类型, valueType = " + valueType.toString() + ".");
							}
						}
					}
					sql += ")";
				}
				
			}
			else{
				throw new Exception(categoryCode + "类型没有定义属性.");
			}
		}

		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		return dt.getRows();
	}

	private boolean hasComponent(INcpSession session, String componentCode, String versionNum, String exceptComponentId) throws Exception{  
		String checkSql = "select count(1) as rowcount"
				+ " from mdl_component t where t.code = " + SysConfig.getParamPrefix() +"code"
				+ " and t.versionnum = " + SysConfig.getParamPrefix() + "versionnum" 
				+ " and t.isdeleted = 'N'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("code", componentCode);
		p2vs.put("versionnum", versionNum);
		if(exceptComponentId != null){
			checkSql += " and t.id <> " + SysConfig.getParamPrefix() + "componentid";
			p2vs.put("componentid", exceptComponentId);			
		}				
		int rowCount = ((BigInteger)this.getDBParserAccess().selectOne(getDBSession(), checkSql, p2vs)).intValue();
		return rowCount > 0;
	}

	//新增外部传递的用户ID(外部调用删除部品验证用,比如Adim等) modified by liyh 20221130
	private boolean checkUser(INcpSession session, String componentId,String userId_external) throws Exception{
		Data data = DataCollection.getData("mdl_Component");

		//String userId = session.getUserId();
		String userId = StringUtils.isNullOrEmpty(userId_external) ? session.getUserId() : userId_external;

		DataTable dt = this.getDBParserAccess().getDtById(getDBSession(), data, componentId);
		List<DataRow> rows = dt.getRows();
		if(rows.size() > 0){
			DataRow row = rows.get(0);			
			String createUserId = row.getStringValue("createuser_xid");
			if(userId.equals(createUserId)){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			throw new Exception("不存在此组件. componentId = " + componentId);
		}
	}

	@Override
	public void deleteComponent(INcpSession session, String componentId,String userId,String isdeleted) throws Exception{
		if(this.checkUser(session, componentId,userId)) {
			Date modifyTime = new Date();
			Session dbSession = this.getDBSession();
			Data data = DataCollection.getData("mdl_Component");
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			p2vs.put("isdeleted", isdeleted);//p2vs.put("isdeleted", "Y");
			p2vs.put("modifytime", modifyTime);

			//如果外部单独传递用户ID,则使用外部传递的ID (Adim集成用) modified by liyh 20221130
			//p2vs.put("modifyuser_xid", session.getUserId());
			p2vs.put("modifyuser_xid", StringUtils.isNullOrEmpty(userId) ? session.getUserId() : userId);

			IDBParserAccess dbAccess = this.getDBParserAccess();
			dbAccess.updateByData(dbSession, data, p2vs, componentId);
		}
		else{
			throw new Exception("该用户没有删除权限. componentId = " + componentId);
		}
	}
	
	private void isValidFileName(String fileName) throws Exception { 
		if(fileName == null || fileName.length() < 2 || fileName.length() > 100) {
			throw new Exception("模型名称长度应为2~100个字符.");
		}
		else {
			if(! fileName.matches("[^\\s\\\\/:\\*\\?\\\"<>\\|](\\x20|[^\\s\\\\/:\\*\\?\\\"<>\\|])*[^\\s\\\\/:\\*\\?\\\"<>\\|\\.]$")){
				throw new Exception("模型名称包含了非法字符.");
			}
		}
	}
	@Override
	public void changeComponentProperty(INcpSession session, String componentId, String componentCode, String componentName, String note,String shareType,String gbCode, String versionNum, String categoryId
			,String m900,String m904,String goodsMid,String sBaseMid,String metadata,String userId,String projectid,String projectunitid) throws Exception {
		if(this.hasComponent(session, componentCode, versionNum, componentId)){
			throw new Exception("已存在此编码和版本的组件.");
		}
		else {
			this.isValidFileName(componentName);  

			//把文件里存储的componentName、code、versionNum也修改了
			String content = this.getComponentContent(session, componentId);
			JSONObject contentJson = JSONObject.parseObject(content);
			contentJson.put("name", componentName);
			contentJson.put("code", componentCode);
			contentJson.put("versionNum", versionNum);
			content = contentJson.toString();

			Session dbSession = this.getDBSession();			 
			InputStream inputStream = new ByteArrayInputStream(content.getBytes("utf-8"));    	
			IAccessoryDao accessoryDao = this.getAccessoryDao();
			accessoryDao.setDBSession(dbSession);
			String accessoryId = accessoryDao.saveAccessory(session, inputStream, componentName, this.getFilterType(), componentId);
			
			Date modifyTime = new Date(); 
			
			Data data = DataCollection.getData("mdl_Component");
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			p2vs.put("name", componentName);
			p2vs.put("note", note);//增加备注 20220222
			p2vs.put("sharetype", shareType);//增加共享范围 20220329
			p2vs.put("gbcode", gbCode);//增加共享范围 20220329
			p2vs.put("code", componentCode); 
			p2vs.put("versionnum", versionNum); 
			p2vs.put("categoryid", categoryId);  
			p2vs.put("accessoryid", accessoryId);
			p2vs.put("modifytime", modifyTime);
			p2vs.put("modifyuser_xid", StringUtils.isNullOrEmpty(userId)? session.getUserId():userId);//如果外部单独传递用户ID,则使用外部传递的ID (Adim集成用) modified by liyh 20221130

			 p2vs.put("m_900", m900);
			 p2vs.put("m_904", m904);
			 p2vs.put("goods_mid", goodsMid);
			 p2vs.put("s_base_mid", sBaseMid);
			 p2vs.put("metadata", metadata);
			 p2vs.put("projectid", projectid);
			 p2vs.put("projectunitid", projectunitid);

			IDBParserAccess dbAccess = this.getDBParserAccess();
			dbAccess.updateByData(this.getDBSession(), data, p2vs, componentId); 

			//修改组件时间戳 added by ls 20220913
			this.updateComponentTimeMark(componentId, modifyTime);		
		}
	}
	
	//发布 added by ls 20230723
	@Override
	public void changePublishStatus(INcpSession session, String componentId, boolean isPublished) throws Exception {
		String userId = session.getUserId();
		if(this.checkUser(session, componentId, null)) {
			Date modifyTime = new Date(); 
			
			Data data = DataCollection.getData("mdl_Component");
			HashMap<String, Object> p2vs = new HashMap<String, Object>(); 
			p2vs.put("ispublished", isPublished ? "Y" : "N");
			p2vs.put("modifytime", modifyTime);
			p2vs.put("modifyuser_xid", userId);
			IDBParserAccess dbAccess = this.getDBParserAccess();
			dbAccess.updateByData(this.getDBSession(), data, p2vs, componentId);  
			this.updateComponentTimeMark(componentId, modifyTime);		
		} 
		else{
			throw new Exception("该用户没有保存权限. componentId = " + componentId);
		}
	}
		
	@Override
	public String exportLZW(INcpSession session, String componentId, String componentCode, String componentName, JSONObject mainInfoJson, JSONArray allUnitSettingArray, JSONObject allGeoContentsJson, JSONObject allMaterialsJson) throws Exception {
		String exportDir = ContextUtil.getAbsolutePath() + this.getExportDir() + "/" + componentId;
		File exportDirObj = new File(exportDir);
		if(exportDirObj.exists()){
			deleteDir(exportDirObj);
		}
		exportDirObj.mkdir();
		FileOperate fo = new FileOperate();

		String mainFilePath = exportDir + "/main.json";
		String unitSettingsFilePath = exportDir + "/unitSettings.json";
		String geoContentsFilePath = exportDir + "/geoContents.json"; 
		String materialsFilePath = exportDir + "/materials.json";  
		
		fo.createFile(mainFilePath, mainInfoJson.toString(), "utf-8");
		fo.createFile(unitSettingsFilePath, allUnitSettingArray.toString(), "utf-8");
		fo.createFile(geoContentsFilePath, allGeoContentsJson.toString(), "utf-8");
		fo.createFile(materialsFilePath, allMaterialsJson.toString(), "utf-8");

		String resourceDir = exportDir + "/resources";
		File resourceDirObj = new File(resourceDir); 	
		resourceDirObj.mkdir();
		for(Object geoKeyObj : allGeoContentsJson.keySet()){
			JSONObject geoContentJson = allGeoContentsJson.getJSONObject((String)geoKeyObj);
			this.exportGltfFile(resourceDir, geoContentJson, fo);
		}
		
		String uvDir = exportDir + "/uvs";
		File uvDirObj = new File(uvDir); 	
		uvDirObj.mkdir();
		IImageProcessor imageProcessor = this.getImageProcessor();
		imageProcessor.setDBSession(getDBSession());
		for(Object geoKeyObj : allGeoContentsJson.keySet()){
			JSONObject geoContentJson = allGeoContentsJson.getJSONObject((String)geoKeyObj);
			this.exportUv(session, uvDir, geoContentJson, imageProcessor, fo);
		}
		for(int i = 0; i < allUnitSettingArray.size(); i++){
			JSONObject unitSettingJson = allUnitSettingArray.getJSONObject(i);
			this.exportUv(session, uvDir, unitSettingJson, imageProcessor, fo);
		}
		
		String imageDir = exportDir + "/images";
		File imageDirObj = new File(imageDir);
		imageDirObj.mkdir();
		for(Object materialKeyObj : allMaterialsJson.keySet()){
			JSONObject materialJson = allMaterialsJson.getJSONObject((String)materialKeyObj);
			this.exportImageFile(imageDir, materialJson, fo);
		}
		
		//处理文件名里的特殊字符 modified by ls 20220623
		String fileName = CommonFunction.processSpecialCharInFileName(componentCode, "_");
		String exportFileName = fileName + ".lzw";
        
		String exportFilePath =  ContextUtil.getAbsolutePath() + this.getExportDir() + "/" + exportFileName;
		this.zipDirToFile(exportDir, exportFilePath);
		
		return exportFileName;
	}
	
	private void exportUv(INcpSession session, String uvDir, JSONObject geoContentJson, IImageProcessor imageProcessor, FileOperate fo) throws Exception{
		JSONObject uvsJson = geoContentJson.getJSONObject("uvs");
		if(uvsJson != null){
			for(Object meshKeyObj : uvsJson.keySet()){
				String meshKey = (String)meshKeyObj;
				JSONObject facesJson = uvsJson.getJSONObject(meshKey);
				for(Object facekeyObj : facesJson.keySet()){
					String faceKey = (String)facekeyObj;
					JSONObject uvJson = facesJson.getJSONObject(faceKey);
					String imageName = uvJson.getString("imageName");
					String destFilePath = uvDir + "/" + imageName;
					if(!fo.exists(destFilePath)){
						String sourceFilePath = imageProcessor.getImagePathByName(imageName);
						fo.copyFile(sourceFilePath, destFilePath);
					}
				}
			}
		}

		if(geoContentJson.containsKey("children")){
			JSONArray childJsons = geoContentJson.getJSONArray("children");
			for(int i = 0; i < childJsons.size(); i++){
				JSONObject childJson = childJsons.getJSONObject(i);
				this.exportUv(session, uvDir, childJson, imageProcessor, fo);
			}
		}
	}
	
    private static boolean deleteDir(File dir) {
        if (dir.isDirectory()) {
            String[] children = dir.list(); 
            for (int i=0; i<children.length; i++) {
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success) {
                    return false;
                }
            }
        } 
        return dir.delete();
    }
	
	private void exportImageFile(String exportDir, JSONObject materialJson, FileOperate fo) throws Exception{
		String imageName = materialJson.getString("imageName");
		if(imageName != null && imageName.length() > 0){
			String fromImageFilePath = ContextUtil.getAbsolutePath() + "/web/design/common/img/material/" + imageName + ".jpg";
			String toImageFilePath = exportDir + "/" +imageName + ".jpg";
			fo.copyFile(fromImageFilePath, toImageFilePath);
		}
	}
	
	private void exportGltfFile(String exportDir, JSONObject geoContentJson, FileOperate fo) throws Exception{
		if(geoContentJson.containsKey("resource")){
			JSONObject resourceJson = geoContentJson.getJSONObject("resource");
			String resourceTypeStr = resourceJson.getString("resourceType");
			ResourceGeometryType resourceType = ResourceGeometryType.valueOf(resourceTypeStr);
			switch(resourceType){
				case gltfLoader:{
					//gltfZip处理 modified by ls 20231101
					IGltfZipProcessor resourceFileProcessor = (IGltfZipProcessor)ContextUtil.getBean("gltfZipProcessor");
					resourceFileProcessor.setDBSession(getDBSession());
					
					String gltfFileName = resourceJson.getString("gltfFile");
					String binFileName = resourceJson.getString("binFile");
					String assistFileName = resourceJson.getString("assistFile");

					if(gltfFileName != null && gltfFileName.length() > 0){
						String gltfFilePath = resourceFileProcessor.getGltfFilePath(gltfFileName);
						String toGltfFilePath = exportDir + "/" + gltfFileName;
						fo.copyFile(gltfFilePath, toGltfFilePath);
					}
					if(binFileName != null && binFileName.length() > 0){
						String binFilePath = resourceFileProcessor.getBinFilePath(binFileName);
						String toBinFilePath = exportDir + "/" + binFileName;
						fo.copyFile(binFilePath, toBinFilePath);
					}	

					//辅助点文件 added by ls 20230418
					if(assistFileName != null && assistFileName.length() > 0){
						String assistFilePath = resourceFileProcessor.getAssistFilePath(assistFileName);
						String toAssistFilePath = exportDir + "/" + assistFileName;
						fo.copyFile(assistFilePath, toAssistFilePath);
					}	
					break;
				}
				default:{
					throw new Exception("不支持的导出类型: " + resourceTypeStr);
				}
			}
		}
		if(geoContentJson.containsKey("children")){
			JSONArray childJsons = geoContentJson.getJSONArray("children");
			for(int i = 0; i < childJsons.size(); i++){
				JSONObject childJson = childJsons.getJSONObject(i);
				this.exportGltfFile(exportDir, childJson, fo);
			}
		}
	}
	
	private void zipDirToFile(String dirPath, String filePath) throws IOException
    {
        // the file path need to compress
        File file = new File (dirPath) ;
        ZipOutputStream zos = null;
        try{
	        zos = new ZipOutputStream (new FileOutputStream(filePath)) ; 
	        String dirName = file.getName(); 
	        this.zipSubDir(zos, dirName, file);
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
	
	private void zipSubDir(ZipOutputStream zos, String parentFilePath, File dir) throws IOException{
		File[] subFiles = dir.listFiles();
		for(int i = 0; i < subFiles.length; i++){
			File subFile = subFiles[i];
			if(subFile.isDirectory()){
				String subParentFilePath = parentFilePath + File.separator + subFile.getName();
				this.zipSubDir(zos, subParentFilePath, subFile);
			}
			else{
	            BufferedInputStream bis = null;
	            try{
	            	bis = new BufferedInputStream(new FileInputStream(subFiles[i])); 
		            zos.putNextEntry(new ZipEntry(parentFilePath + File.separator + subFiles[i].getName()));
		            while(true){
		                byte[] b = new byte[100];
		                int len = bis.read(b);
		                if(len == -1){
		                    break ;
		                }
		                zos.write(b, 0, len);
		            }	
	            }
	            catch(Exception ex){
	            	throw ex;
	            }
	            finally{
	            	if(bis != null){
	            		bis.close();
	            	}
	            }
			}
		}		
	}
 
	private List<DataRow> getCategoryPropertyRows(INcpSession session, String categoryId) throws Exception{ 
		
		String sql = "select t.id as id, "
			+ " t.name as name, "
			+ " t.paramtype as paramtype, "
			+ " t.isnullable as isnullable, "
			+ " t.iseditable as iseditable, "
			+ " t.isgeo as isgeo, "
			+ " t.defaultvalue as defaultvalue, "
			+ " t.minimumvalue as minimumvalue, "
			+ " t.maximumvalue as maximumvalue, "
			+ " t.exp as exp, "
			+ " t.listvalues as listvalues, "
			+ " t.groupname as groupname "
			+ " from cat_categoryproperty t "
			+ " where t.parentid = " + SysConfig.getParamPrefix() + "parentid and t.isdeleted = 'N'"
			+ " order by t.groupname asc, t.name asc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("parentid", categoryId); 
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("paramtype");
		alias.add("isnullable");
		alias.add("iseditable");
		alias.add("isgeo");
		alias.add("defaultvalue");
		alias.add("minimumvalue");
		alias.add("maximumvalue");
		alias.add("exp");
		alias.add("listvalues");
		alias.add("groupname");
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		fieldValueTypes.put("paramtype", ValueType.String);
		fieldValueTypes.put("isnullable", ValueType.Boolean);	
		fieldValueTypes.put("iseditable", ValueType.Boolean);	
		fieldValueTypes.put("isgeo", ValueType.Boolean);	
		fieldValueTypes.put("defaultvalue", ValueType.String);	
		fieldValueTypes.put("minimumvalue", ValueType.String);	
		fieldValueTypes.put("maximumvalue", ValueType.String);	
		fieldValueTypes.put("exp", ValueType.String);	
		fieldValueTypes.put("listvalues", ValueType.String);	
		fieldValueTypes.put("groupname", ValueType.String);	 	
		DataTable dt = this.getDBParserAccess().selectList(dbSession, sql, p2vs, alias, fieldValueTypes);
		
		List<DataRow> rows = dt.getRows();
		return rows;
	}

	//获取类型的属性列表 added by ls 20210824
	@Override
	public JSONArray getCategoryProperties(INcpSession session, String categoryId) throws Exception{ 
		List<DataRow> rows = this.getCategoryPropertyRows(session, categoryId);
		JSONArray propertyJsonArray = new JSONArray(); 
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i); 
			JSONObject propertyJson = new JSONObject();
			propertyJson.put("name", CommonFunction.encode(row.getStringValue("name")));
			propertyJson.put("paramType", row.getStringValue("paramtype"));
			propertyJson.put("isNullable", row.getBooleanValue("isnullable"));
			propertyJson.put("isEditable",row.getBooleanValue("iseditable"));
			propertyJson.put("isGeo", row.getBooleanValue("isgeo"));
			propertyJson.put("defaultValue", CommonFunction.encode(row.getStringValue("defaultvalue")));
			propertyJson.put("minimumValue", CommonFunction.encode(row.getStringValue("minimumvalue")));
			propertyJson.put("maximumValue", CommonFunction.encode(row.getStringValue("maximumvalue")));
			propertyJson.put("exp", CommonFunction.encode(row.getStringValue("exp")));
			propertyJson.put("listValues", CommonFunction.encode(row.getStringValue("listvalues")));
			propertyJson.put("groupName", CommonFunction.encode(row.getStringValue("groupname")));			
			propertyJsonArray.add(propertyJson);
		} 
		return propertyJsonArray;
	}

	@Override
	public JSONArray getMdlStatisticIndexList(INcpSession session, JSONObject requestObj) throws Exception {
		HashMap<String,Object> resultMap = new HashMap<String,Object>();//查询最终返回的数据对象集合
		HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
		List<String> alias = new ArrayList<String>();//查询参数2
		HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3

		alias.add("id");
		alias.add("code");
		alias.add("name");
		alias.add("paramtype");
		alias.add("unit");
		fieldTypes.put("id",ValueType.String);
		fieldTypes.put("code",ValueType.String);
		fieldTypes.put("name",ValueType.String);
		fieldTypes.put("paramtype",ValueType.String);
		fieldTypes.put("unit",ValueType.String);

		String sql=" select t.id as id , t.code as code, t.name as name,t.paramtype as paramtype,t.unit as unit from mdl_statistic_index t where t.isdeleted='N'";
		//统计查询时不传递is_statistic参数
		if(!requestObj.containsKey("getAllIndex")) {
			sql += "and t.is_statistic='Y'";
		}

		DataTable dt = this.getDBParserAccess().selectList(this.getDBSession(), sql, p2vs, alias, fieldTypes);

		List<DataRow> rows = dt.getRows();
		JSONArray indexJsonArray = new JSONArray();
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			JSONObject indexJson = new JSONObject();
			indexJson.put("id", row.getStringValue("id"));
			indexJson.put("code", CommonFunction.encode(row.getStringValue("code")));
			indexJson.put("name", CommonFunction.encode(row.getStringValue("name")));
			indexJson.put("paramtype",row.getStringValue("paramtype"));
			indexJson.put("unit",row.getStringValue("unit"));
			indexJsonArray.add(indexJson);
		}
		return indexJsonArray;
	}

	@Override
	public JSONArray getCategoryTree(INcpSession session, String mdlType) throws Exception {
		List<DataRow> rows = this.getCategoryTreeRows(session, mdlType); 
		JSONArray rootJsons = this.getCategoryChildJson(session, null, rows);
		if(rootJsons.size() > 0){  
			return rootJsons;
		}
		else{
			throw new Exception("None root node. (mdlType = " + mdlType + ")");
		}	
	}

	@Override
	public JSONArray getCategoryTree(INcpSession session, String[] mdlTypes) throws Exception {
		List<DataRow> rows = this.getCategoryTreeRows(session, mdlTypes);
		JSONArray rootJsons = this.getCategoryChildJson(session, null, rows);
		if(rootJsons.size() > 0){
			return rootJsons;
		}
		else{
			throw new Exception("None root node. (mdlType = " + CommonFunction.listToString(mdlTypes, ", ") + ")");
		}
	}
	
	private JSONArray getCategoryChildJson(INcpSession session, String id, List<DataRow> rows) throws UnsupportedEncodingException{
		JSONArray jsonArray = new JSONArray();
		for(int j = 0; j < rows.size(); j++){
			DataRow row = rows.get(j); 
			String parentId = row.getStringValue("parentid");
			if((id == null && (parentId == null || parentId.length() == 0)) || (id != null && id.equals(parentId))){
				String childId = row.getStringValue("id"); 
				JSONObject childNodeJson = new JSONObject();
				childNodeJson.put("id", childId); 
				childNodeJson.put("code", CommonFunction.encode(row.getStringValue("code")));
				childNodeJson.put("name", CommonFunction.encode(row.getStringValue("name"))); 
				childNodeJson.put("description", CommonFunction.encode(row.getStringValue("description"))); 
				JSONArray childJsonArray = this.getCategoryChildJson(session, childId, rows);
				if(childJsonArray.size() > 0){
					childNodeJson.put("children", childJsonArray);
				}
				jsonArray.add(childNodeJson);
			}
		}
		return jsonArray;
	}
	
	private List<DataRow> getCategoryTreeRows(INcpSession session, String mdlType) throws Exception{		
		//增加全部获取的方法 modified by ls 202202
		String sql = "select t.id as id,"
			+ " t.code as code,"
			+ " t.name as name,"
			+ " t.description as description,"
			+ " t.parentid as parentid,"
			+ " t.createtime as createtime,"
			+ " t.modifytime as modifytime"
			+ " from cat_category t"
			+ " where t.isdeleted = " + SysConfig.getParamPrefix() + "isdeleted"			
			+ (mdlType.equals("all") ? "" : (" and t.mdltype = " + SysConfig.getParamPrefix() + "mdltype"))
			+ " order by t.code asc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("isdeleted", "N");
		if(!mdlType.equals("all")){
			p2vs.put("mdltype", mdlType);			
		}

		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("description", ValueType.String);
		valueTypes.put("parentid", ValueType.String);
		valueTypes.put("createtime", ValueType.Time);
		valueTypes.put("modifytime", ValueType.Time);
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		alias.add("name");
		alias.add("description");
		alias.add("parentid");
		alias.add("createtime");
		alias.add("modifytime");

		DataTable dt = this.getDBParserAccess().selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();
		if(rows.size() == 0){
			throw new Exception("None category rows.");
		}
		else{
			return rows;
		}
	}
	
	//根据mdlType获取当前用户的模型列表  added by ls 20230518
	@Override
	public JSONArray queryUserComponents(INcpSession session, String mdlType, int rowCount) throws Exception {
		String userId = session.getUserId();
		List<DataRow> rows = this.queryUserComponentRows(session, mdlType, userId, rowCount);
		
		JSONArray jsonArray = new JSONArray();
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			JSONObject componentJson = new JSONObject();
			componentJson.put("id", row.getStringValue("id"));
			componentJson.put("name", CommonFunction.encode(row.getStringValue("name")));
			componentJson.put("code", CommonFunction.encode(row.getStringValue("code")));
			componentJson.put("versionNum", row.getStringValue("versionnum"));
			componentJson.put("categoryId", row.getStringValue("categoryid"));
			componentJson.put("categoryCode", CommonFunction.encode(row.getStringValue("categorycode")));
			componentJson.put("categoryName", CommonFunction.encode(row.getStringValue("categoryname")));
			componentJson.put("createTime", ValueConverter.convertToString(row.getDateTimeValue("createtime"), ValueType.Time));
			componentJson.put("modifyTime", ValueConverter.convertToString(row.getDateTimeValue("modifytime"), ValueType.Time));
			componentJson.put("createUserName", CommonFunction.encode(row.getStringValue("createusername")));
			componentJson.put("snapshotId", row.getStringValue("snapshotid"));			
			jsonArray.add(componentJson);
		}
		return jsonArray;
	} 	
	
	//已发布的模型  added by ls 20230518
	@Override
	public JSONArray queryPublishedComponents(INcpSession session, String mdlType, int rowCount) throws Exception {
		String userId = session.getUserId();
		List<DataRow> rows = this.queryPublishedComponentRows(session, mdlType, userId, rowCount);
		
		JSONArray jsonArray = new JSONArray();
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			JSONObject componentJson = new JSONObject();
			componentJson.put("id", row.getStringValue("id"));
			componentJson.put("name", CommonFunction.encode(row.getStringValue("name")));
			componentJson.put("code", CommonFunction.encode(row.getStringValue("code")));
			componentJson.put("versionNum", row.getStringValue("versionnum"));
			componentJson.put("categoryId", row.getStringValue("categoryid"));
			componentJson.put("categoryCode", CommonFunction.encode(row.getStringValue("categorycode")));
			componentJson.put("categoryName", CommonFunction.encode(row.getStringValue("categoryname")));
			componentJson.put("createTime", ValueConverter.convertToString(row.getDateTimeValue("createtime"), ValueType.Time));
			componentJson.put("modifyTime", ValueConverter.convertToString(row.getDateTimeValue("modifytime"), ValueType.Time));
			componentJson.put("createUserName", CommonFunction.encode(row.getStringValue("createusername")));
			componentJson.put("imgId", row.getStringValue("imgid"));			
			jsonArray.add(componentJson);
		}
		return jsonArray;
	} 	
	
	private List<DataRow> queryUserComponentRows(INcpSession session, String mdlType, String userId, int rowCount) throws SQLException {		 
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("versionnum", ValueType.String);
		valueTypes.put("categoryid", ValueType.String);
		valueTypes.put("categorycode", ValueType.String);
		valueTypes.put("categoryname", ValueType.String);
		valueTypes.put("createtime", ValueType.Time);
		valueTypes.put("modifytime", ValueType.Time);
		valueTypes.put("createusername", ValueType.String);
		valueTypes.put("snapshotid", ValueType.String);
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("code");
		alias.add("versionnum");
		alias.add("categoryid");
		alias.add("categorycode");
		alias.add("categoryname");
		alias.add("createtime");
		alias.add("modifytime");
		alias.add("createusername");
		alias.add("snapshotid");
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", userId);
		String sql = "select t.id as id,"
			+ " t.name as name,"
			+ " t.code as code,"
			+ " t.versionnum as versionnum,"
			+ " t.categoryid as categoryid,"
			+ " cat.code as categorycode,"
			+ " cat.name as categoryname,"
			+ " t.createtime as createtime,"
			+ " t.modifytime as modifytime,"
			+ " u.name as createusername,"
			+ " t.snapshotid as snapshotid"
			+ " from mdl_component t"
			+ " left outer join cat_category cat on cat.id = t.categoryid"
			+ " left outer join d_user u on t.createuser_xid = u.id"
			+ " where t.isdeleted = 'N' and t.createuser_xid = " + SysConfig.getParamPrefix() + "userid";
		if(mdlType != null){
			sql += (" and t.mdltype = " + SysConfig.getParamPrefix() + "mdltype");
			p2vs.put("mdltype", mdlType);
		}
		sql += " order by t.modifytime desc";		 

		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(dbSession, sql, p2vs, alias, valueTypes, 0, rowCount);
		return dt.getRows();
	} 
	
	private List<DataRow> queryPublishedComponentRows(INcpSession session, String mdlType, String userId, int rowCount) throws SQLException {		 
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("versionnum", ValueType.String);
		valueTypes.put("categoryid", ValueType.String);
		valueTypes.put("categorycode", ValueType.String);
		valueTypes.put("categoryname", ValueType.String);
		valueTypes.put("createtime", ValueType.Time);
		valueTypes.put("modifytime", ValueType.Time);
		valueTypes.put("createusername", ValueType.String);
		valueTypes.put("imgid", ValueType.String);
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("code");
		alias.add("versionnum");
		alias.add("categoryid");
		alias.add("categorycode");
		alias.add("categoryname");
		alias.add("createtime");
		alias.add("modifytime");
		alias.add("createusername");
		alias.add("imgid");
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", userId);
		String sql = "select t.id as id,"
			+ " t.name as name,"
			+ " t.code as code,"
			+ " t.versionnum as versionnum,"
			+ " t.categoryid as categoryid,"
			+ " cat.code as categorycode,"
			+ " cat.name as categoryname,"
			+ " t.createtime as createtime,"
			+ " t.modifytime as modifytime,"
			+ " u.name as createusername,"
			+ " t.imgid as imgid"
			+ " from mdl_component t"
			+ " left outer join cat_category cat on cat.id = t.categoryid"
			+ " left outer join d_user u on t.createuser_xid = u.id"
			+ " where t.isdeleted = 'N' and t.createuser_xid = " + SysConfig.getParamPrefix() + "userid"
			+ " and t.ispublished = 'Y'";
		if(mdlType != null){
			sql += (" and t.mdltype = " + SysConfig.getParamPrefix() + "mdltype");
			p2vs.put("mdltype", mdlType);
		}
		sql += " order by t.modifytime desc";		 

		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(dbSession, sql, p2vs, alias, valueTypes, 0, rowCount);
		return dt.getRows();
	}

	private List<DataRow> getCategoryTreeRows(INcpSession session, String[] mdlTypes) throws Exception{
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("isdeleted", "N");
		String sql = "select t.id as id,"
				+ " t.code as code,"
				+ " t.name as name,"
				+ " t.description as description,"
				+ " t.parentid as parentid,"
				+ " t.createtime as createtime,"
				+ " t.modifytime as modifytime"
				+ " from cat_category t"
				+ " where t.isdeleted = " + SysConfig.getParamPrefix() + "isdeleted"
				+ " and (";
		for(int i = 0; i < mdlTypes.length; i++){
			if(i > 0){
				sql += " or ";
			}
			sql += ("t.mdltype = " + SysConfig.getParamPrefix() + "mdltype" + i);
			p2vs.put("mdltype" + i, mdlTypes[i]);
		}
		sql += ") order by t.code asc";

		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("description", ValueType.String);
		valueTypes.put("parentid", ValueType.String);
		valueTypes.put("createtime", ValueType.Time);
		valueTypes.put("modifytime", ValueType.Time);

		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		alias.add("name");
		alias.add("description");
		alias.add("parentid");
		alias.add("createtime");
		alias.add("modifytime");

		DataTable dt = this.getDBParserAccess().selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();
		if(rows.size() == 0){
			throw new Exception("None category rows.");
		}
		else{
			return rows;
		}
	}
}