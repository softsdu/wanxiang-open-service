package com.zlp.mdl.processor;
   
import java.math.BigDecimal; 
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.*;
import com.zlp.platform.common.redis.RedisException;
import com.zlp.platform.common.redis.RedisSessionCacheClient;
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection;
import com.zlp.s3d.processor.AppKeyStatus;
import org.hibernate.Session;
import com.zlp.platform.constants.ZlpState;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.platform.dao.db.DataTable;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.db.ValueType;
import com.zlp.platform.dao.sys.ContextUtil; 
import com.zlp.platform.dao.sys.IAccessoryDao; 

public class MaterialProcessor implements IMaterialProcessor{
	 
	//附件处理接口
	private IAccessoryDao accessoryDao = null;
	public IAccessoryDao getAccessoryDao() {
		return accessoryDao;
	}
	public void setAccessoryDao(IAccessoryDao accessoryDao) {
		this.accessoryDao = accessoryDao;
	} 
	
	private Session dbSession = null;
	private Session getDBSession() {
		return dbSession;
	}

	//执行数据库操作的通用类
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	protected IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	}
	
	@Override
	public void setDBSession(Session dbSession) {
		this.dbSession = dbSession;
	} 
	
	private String standardFileModulePath = null;
	protected String getStandardFileModulePath(){
		return this.standardFileModulePath;
	}
	public void setStandardFileModulePath(String standardFileModulePath){
		this.standardFileModulePath = standardFileModulePath;
	}

	private String outputDirPath = null;
	protected String getOutputDirPath(){
		return this.outputDirPath;
	}
	public void setOutputDirPath(String outputDirPath){
		this.outputDirPath = outputDirPath;
	}
	
	private String imageDirPath = null;
	protected String getImageDirPath(){
		return this.imageDirPath;
	}
	public void setImageDirPath(String imageDirPath){
		this.imageDirPath = imageDirPath;
	}

	//material缓存名称
	private String materialCacheName = "materialCache";
	public String getMaterialCacheName() {
		return materialCacheName;
	}
	public void setMaterialCacheName(String materialCacheName) {
		this.materialCacheName = materialCacheName;
	}

	//redis缓存客户端 added by ls 20240109
	private RedisSessionCacheClient redisSessionCacheClient = null;
	public void setRedisSessionCacheClient(RedisSessionCacheClient redisSessionCacheClient){
		this.redisSessionCacheClient = redisSessionCacheClient;
	}
	public RedisSessionCacheClient getRedisSessionCacheClient(){
		return this.redisSessionCacheClient;
	}

	@Override
	public void generateStandardMaterialFile(INcpSession session) throws Exception{
		List<DataRow> materialRows = this.getAllMaterialRows();
		this.generateStandardMaterialFile(materialRows);
		this.refreshMaterialCache(materialRows);
	}
	@Override
	public void generateAllStandardMaterialFiles() throws Exception{
		RedisSessionCacheClient cacheClient = this.getRedisSessionCacheClient();
		cacheClient.invalidate(this.getMaterialCacheName());
		List<DataRow> materialRows = this.getAllMaterialRows();
		this.generateStandardMaterialFile(materialRows);
		this.refreshMaterialCache(materialRows);
	}

	private List<DataRow> getAllUserRows(){
		Data data = DataCollection.getData("d_User");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDt(this.getDBSession(), data);
		return dt.getRows();
	}

	//更新material缓存
	private void refreshMaterialCache(List<DataRow> materialRows) throws Exception{
		String[] materialKeys = new String[materialRows.size()];
		for(int i = 0; i < materialRows.size(); i++){
        	DataRow materialRow = materialRows.get(i);
			String materialCode = this.addMaterialCache(materialRow);
			materialKeys[i] = materialCode;
        }
		this.addMaterialKeyCache(materialKeys);
	}

	@Override
	//获取所有的材质
	public List<JSONObject> getAllMaterialJsons() throws RedisException {
		RedisSessionCacheClient cacheClient = this.getRedisSessionCacheClient();
		String keyArrayStr = cacheClient.getAttribute(this.getMaterialCacheName(), "allMaterialKeys");
		JSONArray keyArray = JSONArray.parseArray(keyArrayStr);
		List<JSONObject> allMaterialJsons = new ArrayList<>();
		for(Object materialKeyObj : keyArray){
			String materialKey = (String)materialKeyObj;
			String materialStr = cacheClient.getAttribute(this.getMaterialCacheName(), materialKey);
			JSONObject materialJson = JSONObject.parseObject(materialStr);
			allMaterialJsons.add(materialJson);
		}
		return allMaterialJsons;
	}

	private void addMaterialKeyCache(String[] materialKeys) throws RedisException {
		RedisSessionCacheClient cacheClient = this.getRedisSessionCacheClient();
		JSONArray keyArray = new JSONArray();
		for(String materialKey : materialKeys){
			keyArray.add(materialKey);
		}
		cacheClient.setAttribute(this.getMaterialCacheName(), "allMaterialKeys", keyArray.toString());
	}

	private String addMaterialCache(DataRow materialRow) throws RedisException {
		String materialId = materialRow.getStringValue("id");
		String materialCode = materialRow.getStringValue("code");
		String materialColor = materialRow.getStringValue("color");
		BigDecimal materialOpacity = materialRow.getBigDecimalValue("opacity");
		BigDecimal materialMetalness = materialRow.getBigDecimalValue("metalness");
		BigDecimal materialRoughness = materialRow.getBigDecimalValue("roughness");
		String imageAccessoryId = materialRow.getStringValue("imageaccessoryid");
		String imageName = imageAccessoryId == null || imageAccessoryId.isEmpty() ? "" : materialCode;
		String normalImageAccessoryId = materialRow.getStringValue("normalimageaccessoryid");
		String normalImageName = normalImageAccessoryId == null || normalImageAccessoryId.isEmpty() ? "" : (materialCode + "_normal");
		String opacityImageAccessoryId = materialRow.getStringValue("opacityimageaccessoryid");
		String opacityImageName = opacityImageAccessoryId == null || opacityImageAccessoryId.isEmpty() ? "" : (materialCode + "_opacity");
		String metalnessImageAccessoryId = materialRow.getStringValue("metalnessimageaccessoryid");
		String metalnessImageName = metalnessImageAccessoryId == null || metalnessImageAccessoryId.isEmpty() ? "" : (materialCode + "_metalness");
		String roughnessImageAccessoryId = materialRow.getStringValue("roughnessimageaccessoryid");
		String roughnessImageName = roughnessImageAccessoryId == null || roughnessImageAccessoryId.isEmpty() ? "" : (materialCode + "_roughness");
		BigDecimal materialScaleWidth = materialRow.getBigDecimalValue("scalewidth");
        BigDecimal materialScaleHeight = materialRow.getBigDecimalValue("scaleheight");
		BigDecimal materialRotation = materialRow.getBigDecimalValue("rotation");
		BigDecimal envMapIntensity = materialRow.getBigDecimalValue("envmapintensity");
		boolean isMirror = !materialRow.isNull("ismirror") && materialRow.getBooleanValue("ismirror");
		boolean isDoubleSide = !materialRow.isNull("isdoubleside") && materialRow.getBooleanValue("isdoubleside");
        String typeCode = materialRow.getStringValue("typecode");
		RedisSessionCacheClient cacheClient = this.getRedisSessionCacheClient();
		JSONObject json = new JSONObject();
		json.put("id", materialId);
		json.put("code", materialCode);
		json.put("color", materialColor);
		json.put("opacity", materialOpacity == null ? null : materialOpacity.doubleValue() / 100);
		json.put("metalness", materialMetalness == null ? null : materialMetalness.doubleValue() / 100);
		json.put("roughness", materialRoughness == null ? null : materialRoughness.doubleValue() / 100);
		json.put("imageId", imageAccessoryId);
		json.put("imageName", imageName);
		json.put("normalImageId", normalImageAccessoryId);
		json.put("normalImageName", normalImageName);
		json.put("opacityImageId", opacityImageAccessoryId);
		json.put("opacityImageName", opacityImageName);
		json.put("metalnessImageId", metalnessImageAccessoryId);
		json.put("metalnessImageName", metalnessImageName);
		json.put("roughnessImageId", roughnessImageAccessoryId);
		json.put("roughnessImageName", roughnessImageName);
		json.put("envMapIntensity", envMapIntensity == null ? null : envMapIntensity.doubleValue() / 100);
		json.put("scaleWidth", materialScaleWidth == null ? null : materialScaleWidth.doubleValue() / 100);
		json.put("scaleHeight", materialScaleHeight == null ? null : materialScaleHeight.doubleValue() / 100);
		json.put("rotation", materialRotation == null ? null : materialRotation.doubleValue());
		json.put("isMirror", isMirror);
		json.put("isDoubleSide", isDoubleSide);
		json.put("typeCode", typeCode);
		cacheClient.setAttribute(this.getMaterialCacheName(),materialCode, json.toString());
		return materialCode;
	}

	//获取材质JSON
	@Override
	public JSONObject getMaterialJson(String materialCode) throws Exception {
		RedisSessionCacheClient cacheClient = this.getRedisSessionCacheClient();
		String materialJsonStr = cacheClient.getAttribute(this.getMaterialCacheName(), materialCode);
		return materialJsonStr == null ? null : JSONProcessor.strToJSON(materialJsonStr);
	}

	//获取材质JSON
	@Override
	public JSONObject getMaterialJson(String userId, String materialCode) throws Exception {
		RedisSessionCacheClient cacheClient = this.getRedisSessionCacheClient();
		String materialJsonStr = cacheClient.getAttribute(this.getMaterialCacheName(), userId + materialCode);
		return materialJsonStr == null ? null : JSONProcessor.strToJSON(materialJsonStr);
	}

	private void generateStandardMaterialFile(List<DataRow> materialRows) throws Exception{
		FileOperate fo = new FileOperate();
		String text = fo.readTxt(this.getStandardFileModulePath());
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(getDBSession());
		StringBuilder lines = new StringBuilder();
		for(int i = 0; i < materialRows.size(); i++){
			DataRow materialRow = materialRows.get(i);
			String materialName = materialRow.getStringValue("code");
			String materialColor = materialRow.getStringValue("color");
			BigDecimal materialOpacity = materialRow.getBigDecimalValue("opacity");
			BigDecimal materialMetalness = materialRow.getBigDecimalValue("metalness");
			BigDecimal materialRoughness = materialRow.getBigDecimalValue("roughness");
			String imageAccessoryId = materialRow.getStringValue("imageaccessoryid");
			String normalImageAccessoryId = materialRow.getStringValue("normalimageaccessoryid");
			String opacityImageAccessoryId = materialRow.getStringValue("opacityimageaccessoryid");
			String metalnessImageAccessoryId = materialRow.getStringValue("metalnessimageaccessoryid");
			String roughnessImageAccessoryId = materialRow.getStringValue("roughnessimageaccessoryid");
			BigDecimal envMapIntensity = materialRow.getBigDecimalValue("envmapintensity");
			BigDecimal materialScaleWidth = materialRow.getBigDecimalValue("scalewidth");
            BigDecimal materialScaleHeight = materialRow.getBigDecimalValue("scaleheight");
			BigDecimal materialRotation = materialRow.getBigDecimalValue("rotation");
			boolean isMirror = !materialRow.isNull("ismirror") && materialRow.getBooleanValue("ismirror");
			boolean isDoubleSide = !materialRow.isNull("isdoubleside") && materialRow.getBooleanValue("isdoubleside");
			String typeCode = materialRow.getStringValue("typecode");
			lines.append("\t\tthatStandardMaterials.load(\"" + materialName + "\", "
					+ (materialColor == null || materialColor.isEmpty() ? "null" : ("0x" + materialColor)) + ", "
					+ "\"" + (imageAccessoryId == null || imageAccessoryId.isEmpty() ? "" : imageAccessoryId)  + "\", "
					+ "\""	+ (imageAccessoryId == null || imageAccessoryId.isEmpty() ? "" : materialName) + "\", "
					+ "\"" + (normalImageAccessoryId == null || normalImageAccessoryId.isEmpty() ? "" : normalImageAccessoryId)  + "\", "
					+ "\""	+ (normalImageAccessoryId == null || normalImageAccessoryId.isEmpty() ? "" : (materialName + "_normal")) + "\", "
					+ (materialOpacity == null ? "null" : materialOpacity.doubleValue() / 100) + ", "
					+ "\"" + (opacityImageAccessoryId == null || opacityImageAccessoryId.isEmpty() ? "" : opacityImageAccessoryId)  + "\", "
					+ "\""	+ (opacityImageAccessoryId == null || opacityImageAccessoryId.isEmpty() ? "" : (materialName + "_opacity")) + "\", "
					+ (materialMetalness == null ? "null" : materialMetalness.doubleValue() / 100) + ", "
					+ "\"" + (metalnessImageAccessoryId == null || metalnessImageAccessoryId.isEmpty() ? "" : metalnessImageAccessoryId)  + "\", "
					+ "\""	+ (metalnessImageAccessoryId == null || metalnessImageAccessoryId.isEmpty() ? "" : (materialName + "_metalness")) + "\", "
					+ (materialRoughness == null ? "null" : materialRoughness.doubleValue() / 100) + ", "
					+ "\"" + (roughnessImageAccessoryId == null || roughnessImageAccessoryId.isEmpty() ? "" : roughnessImageAccessoryId)  + "\", "
					+ "\""	+ (roughnessImageAccessoryId == null || roughnessImageAccessoryId.isEmpty() ? "" : (materialName + "_roughness")) + "\", "
					+ (envMapIntensity == null ? "0" : envMapIntensity.doubleValue() / 100) + ", "
					+ (materialScaleWidth == null ? "null" : materialScaleWidth.doubleValue() / 100) + ", "
                    + (materialScaleHeight == null ? "null" : materialScaleHeight.doubleValue() / 100) + ", "
					+ (materialRotation == null ? "null" : materialRotation.doubleValue()) + ", "
					+ (isMirror ? "true" : "false") + ", "
					+ (isDoubleSide ? "true" : "false") + ", "
					+ "\""	+ (typeCode == null || typeCode.isEmpty() ? "" : typeCode) + "\""
					+");");
			lines.append("\r\n");
			if(imageAccessoryId != null && !imageAccessoryId.isEmpty()){
				String imageFilePath = accessoryDao.getFilePathById(imageAccessoryId);
				String destImageFilePath = ContextUtil.getAbsolutePath() + ZlpState.PAGE_PATH + "/" + this.getImageDirPath() + materialName + ".jpg";
				fo.copyFile(imageFilePath, destImageFilePath);
			}
			if(normalImageAccessoryId != null && !normalImageAccessoryId.isEmpty()){
				String imageFilePath = accessoryDao.getFilePathById(normalImageAccessoryId);
				String destImageFilePath = ContextUtil.getAbsolutePath() + ZlpState.PAGE_PATH + "/" + this.getImageDirPath() + materialName + "_normal.jpg";
				fo.copyFile(imageFilePath, destImageFilePath);
			}
			if(opacityImageAccessoryId != null && !opacityImageAccessoryId.isEmpty()){
				String imageFilePath = accessoryDao.getFilePathById(opacityImageAccessoryId);
				String destImageFilePath = ContextUtil.getAbsolutePath() + ZlpState.PAGE_PATH + "/" + this.getImageDirPath() + materialName + "_opacity.jpg";
				fo.copyFile(imageFilePath, destImageFilePath);
			}
			if(metalnessImageAccessoryId != null && !metalnessImageAccessoryId.isEmpty()){
				String imageFilePath = accessoryDao.getFilePathById(metalnessImageAccessoryId);
				String destImageFilePath = ContextUtil.getAbsolutePath() + ZlpState.PAGE_PATH + "/" + this.getImageDirPath() + materialName + "_metalness.jpg";
				fo.copyFile(imageFilePath, destImageFilePath);
			}
			if(roughnessImageAccessoryId != null && !roughnessImageAccessoryId.isEmpty()){
				String imageFilePath = accessoryDao.getFilePathById(roughnessImageAccessoryId);
				String destImageFilePath = ContextUtil.getAbsolutePath() + ZlpState.PAGE_PATH + "/" + this.getImageDirPath() + materialName + "_roughness.jpg";
				fo.copyFile(imageFilePath, destImageFilePath);
			}
		}
		text = text.replaceAll("##standardMaterialLine##", lines.toString());

		String jsFilePath = ContextUtil.getAbsolutePath() + ZlpState.PAGE_PATH + "/" + this.getOutputDirPath() + "js3StandardMaterials.js";
		fo.createFile(jsFilePath, text, "utf-8");
	}

	private List<DataRow> getAllMaterialRows() throws SQLException{
		String querySql = "select t.id as id, "
			+ " t.code as code, "
			+ " t.name as name, "
			+ " t.color as color, "
			+ " t.opacity as opacity, "
			+ " t.metalness as metalness, "
			+ " t.roughness as roughness, "
			+ " t.imageaccessoryid as imageaccessoryid,"
			+ " t.normalimageaccessoryid as normalimageaccessoryid,"
			+ " t.opacityimageaccessoryid as opacityimageaccessoryid,"
			+ " t.metalnessimageaccessoryid as metalnessimageaccessoryid,"
			+ " t.roughnessimageaccessoryid as roughnessimageaccessoryid,"
			+ " t.envmapintensity as envmapintensity,"
			+ " t.scalewidth as scalewidth,"
            + " t.scaleheight as scaleheight,"
			+ " t.rotation as rotation,"
			+ " t.ismirror as ismirror,"
			+ " t.isdoubleside as isdoubleside,"
			+ " mt.code as typecode"
			+ " from mtl_material t "
			+ " left outer join mtl_materialtype mt on mt.id = t.typeid"
			+ " left outer join d_accessory ia on ia.id = t.imageaccessoryid"
			+ " left outer join d_accessory na on na.id = t.normalimageaccessoryid"
			+ " left outer join d_accessory oa on oa.id = t.opacityimageaccessoryid"
			+ " left outer join d_accessory ma on ma.id = t.metalnessimageaccessoryid"
			+ " left outer join d_accessory ra on ra.id = t.roughnessimageaccessoryid"
			+ " where t.isactive = 'Y' and t.isdeleted = 'N'"
			+ " order by t.code asc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		alias.add("name");
		alias.add("color");
		alias.add("opacity");
		alias.add("metalness");
		alias.add("roughness");
		alias.add("imageaccessoryid");
		alias.add("normalimageaccessoryid");
		alias.add("opacityimageaccessoryid");
		alias.add("metalnessimageaccessoryid");
		alias.add("roughnessimageaccessoryid");
		alias.add("envmapintensity");
		alias.add("scalewidth");
		alias.add("scaleheight");
		alias.add("rotation");
		alias.add("ismirror");
		alias.add("isdoubleside");
		alias.add("typecode");
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("color", ValueType.String);
		valueTypes.put("opacity", ValueType.Decimal);
		valueTypes.put("metalness", ValueType.Decimal);
		valueTypes.put("roughness", ValueType.Decimal);
		valueTypes.put("imageaccessoryid", ValueType.String);
		valueTypes.put("normalimageaccessoryid", ValueType.String);
		valueTypes.put("opacityimageaccessoryid", ValueType.String);
		valueTypes.put("metalnessimageaccessoryid", ValueType.String);
		valueTypes.put("roughnessimageaccessoryid", ValueType.String);
		valueTypes.put("envmapintensity", ValueType.Decimal);
		valueTypes.put("scalewidth", ValueType.Decimal);
        valueTypes.put("scaleheight", ValueType.Decimal);
		valueTypes.put("rotation", ValueType.Decimal);
		valueTypes.put("ismirror", ValueType.Boolean);
		valueTypes.put("isdoubleside", ValueType.Boolean);
		valueTypes.put("typecode", ValueType.String);
		DataTable dt = this.getDBParserAccess().selectList(getDBSession(), querySql, p2vs, alias, valueTypes);
		return dt.getRows();
	}

	//根据材质的名称，获取材质的信息（从数据库中获取） added by ls 202203
	@Override
	public DataRow getMaterialRow(INcpSession session, String materialName) throws SQLException{
		String querySql = "select t.id as id, "
				+ " t.code as code, "
				+ " t.name as name, "
				+ " t.color as color, "
				+ " t.opacity as opacity, "
				+ " t.metalness as metalness, "
				+ " t.roughness as roughness, "
				+ " t.imageaccessoryid as imageaccessoryid,"
				+ " t.normalimageaccessoryid as normalimageaccessoryid,"
				+ " t.opacityimageaccessoryid as opacityimageaccessoryid,"
				+ " t.metalnessimageaccessoryid as metalnessimageaccessoryid,"
				+ " t.roughnessimageaccessoryid as roughnessimageaccessoryid,"
				+ " t.envmapintensity as envmapintensity,"
				+ " t.scalewidth as scalewidth,"
				+ " t.scaleheight as scaleheight,"
				+ " t.rotation as rotation,"
				+ " t.ismirror as ismirror,"
				+ " t.isdoubleside as isdoubleside,"
				+ " mt.code as typecode"
				+ " from mtl_material t "
				+ " left outer join mtl_materialtype mt on mt.id = t.typeid"
				+ " where t.isactive = 'Y' and t.isdeleted = 'N' and t.name = " + SysConfig.getParamPrefix() + "name"
				+ " order by t.code asc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("name", materialName);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		alias.add("name");
		alias.add("color");
		alias.add("opacity");
		alias.add("metalness");
		alias.add("roughness");
		alias.add("imageaccessoryid");
		alias.add("normalimageaccessoryid");
		alias.add("opacityimageaccessoryid");
		alias.add("metalnessimageaccessoryid");
		alias.add("roughnessimageaccessoryid");
		alias.add("envmapintensity");
		alias.add("scalewidth");
		alias.add("scaleheight");
		alias.add("rotation");
		alias.add("ismirror");
		alias.add("isdoubleside");
		alias.add("typecode");
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("color", ValueType.String);
		valueTypes.put("opacity", ValueType.Decimal);
		valueTypes.put("metalness", ValueType.Decimal);
		valueTypes.put("roughness", ValueType.Decimal);
		valueTypes.put("imageaccessoryid", ValueType.String);
		valueTypes.put("normalimageaccessoryid", ValueType.String);
		valueTypes.put("opacityimageaccessoryid", ValueType.String);
		valueTypes.put("metalnessimageaccessoryid", ValueType.String);
		valueTypes.put("roughnessimageaccessoryid", ValueType.String);
		valueTypes.put("envmapintensity", ValueType.Decimal);
		valueTypes.put("scalewidth", ValueType.Decimal);
		valueTypes.put("scaleheight", ValueType.Decimal);
		valueTypes.put("rotation", ValueType.Decimal);
		valueTypes.put("ismirror", ValueType.Boolean);
		valueTypes.put("isdoubleside", ValueType.Boolean);
		valueTypes.put("typecode", ValueType.String);
		DataTable dt = this.getDBParserAccess().selectList(getDBSession(), querySql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();
		if(rows.isEmpty()){
			return null;
		}
		else{
			return rows.get(0);
		}
	}

	//根据材质的名称，获取材质的信息（从数据库中获取）
	@Override
	public DataRow getMaterialRow(String userId, String materialName) throws SQLException{
		String querySql = "select t.id as id, "
				+ " t.code as code, "
				+ " t.name as name, "
				+ " t.color as color, "
				+ " t.opacity as opacity, "
				+ " t.metalness as metalness, "
				+ " t.roughness as roughness, "
				+ " t.imageaccessoryid as imageaccessoryid,"
				+ " t.normalimageaccessoryid as normalimageaccessoryid,"
				+ " t.opacityimageaccessoryid as opacityimageaccessoryid,"
				+ " t.metalnessimageaccessoryid as metalnessimageaccessoryid,"
				+ " t.roughnessimageaccessoryid as roughnessimageaccessoryid,"
				+ " t.envmapintensity as envmapintensity,"
				+ " t.scalewidth as scalewidth,"
				+ " t.scaleheight as scaleheight,"
				+ " t.rotation as rotation,"
				+ " t.ismirror as ismirror,"
				+ " t.isdoubleside as isdoubleside,"
				+ " mt.code as typecode"
				+ " from mtl_material t "
				+ " left outer join mtl_materialtype mt on mt.id = t.typeid"
				+ " where t.isactive = 'Y' and t.isdeleted = 'N'"
				+ " and t.name = " + SysConfig.getParamPrefix() + "name"
				+ " and t.createuser_xid = " + SysConfig.getParamPrefix() + "userid"
				+ " order by t.code asc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("name", materialName);
		p2vs.put("userid", userId);
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		alias.add("name");
		alias.add("color");
		alias.add("opacity");
		alias.add("metalness");
		alias.add("roughness");
		alias.add("imageaccessoryid");
		alias.add("normalimageaccessoryid");
		alias.add("opacityimageaccessoryid");
		alias.add("metalnessimageaccessoryid");
		alias.add("roughnessimageaccessoryid");
		alias.add("envmapintensity");
		alias.add("scalewidth");
		alias.add("scaleheight");
		alias.add("rotation");
		alias.add("ismirror");
		alias.add("isdoubleside");
		alias.add("typecode");
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("color", ValueType.String);
		valueTypes.put("opacity", ValueType.Decimal);
		valueTypes.put("metalness", ValueType.Decimal);
		valueTypes.put("roughness", ValueType.Decimal);
		valueTypes.put("imageaccessoryid", ValueType.String);
		valueTypes.put("normalimageaccessoryid", ValueType.String);
		valueTypes.put("opacityimageaccessoryid", ValueType.String);
		valueTypes.put("metalnessimageaccessoryid", ValueType.String);
		valueTypes.put("roughnessimageaccessoryid", ValueType.String);
		valueTypes.put("envmapintensity", ValueType.Decimal);
		valueTypes.put("scalewidth", ValueType.Decimal);
		valueTypes.put("scaleheight", ValueType.Decimal);
		valueTypes.put("rotation", ValueType.Decimal);
		valueTypes.put("ismirror", ValueType.Boolean);
		valueTypes.put("isdoubleside", ValueType.Boolean);
		valueTypes.put("typecode", ValueType.String);
		DataTable dt = this.getDBParserAccess().selectList(getDBSession(), querySql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();
		if(rows.isEmpty()){
			return null;
		}
		else{
			return rows.get(0);
		}
	}
}