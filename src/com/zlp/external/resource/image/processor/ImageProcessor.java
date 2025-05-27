package com.zlp.external.resource.image.processor;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.FileOperate;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.SysConfig;
import com.zlp.platform.common.util.CommonFunction;
import com.zlp.platform.dao.db.*;
import com.zlp.platform.dao.sys.DataBaseDao;
import com.zlp.platform.dao.sys.IAccessoryDao;
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection;
import com.zlp.s3d.processor.IS3dSystemProcessor;
import org.apache.log4j.Logger;
import org.hibernate.Session;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

public class ImageProcessor implements IImageProcessor {
  	private static Logger userLogger=Logger.getLogger(ImageProcessor.class);

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
	@Override
	public void setDBSession(Session dbSession){
		this.dbSession = dbSession;
	}

	private String defaultFilterType;
	@Override
	public String getDefaultFilterType() {
		return defaultFilterType;
	}
	public void setDefaultFilterType(String defaultFilterType) {
		this.defaultFilterType = defaultFilterType;
	}

	private ISequenceGenerator sequenceGenerator;
	public ISequenceGenerator getSequenceGenerator(){
		return this.sequenceGenerator;
	}
	public void setSequenceGenerator(ISequenceGenerator sequenceGenerator){
		this.sequenceGenerator = sequenceGenerator;
	}
	
	//附件处理接口
	private IAccessoryDao accessoryDao;
	public IAccessoryDao getAccessoryDao() {
		return accessoryDao;
	}
	public void setAccessoryDao(IAccessoryDao accessoryDao) {
		this.accessoryDao = accessoryDao;
	}  

	private int onePageImageCount = 20;
	public int getOnePageImageCount(){
		return this.onePageImageCount;
	}
	public void setOnePageImageCount(int onePageImageCount){
		this.onePageImageCount = onePageImageCount;
	}

	private String getImageAbsoluteFilePath(INcpSession session, String userImageFolder, String imageName) throws SQLException {
		return userImageFolder + imageName;
	}

	private IS3dSystemProcessor s3dSystemProessor;
	public void setS3dSystemProcessor(IS3dSystemProcessor s3dSystemProessor){
		this.s3dSystemProessor = s3dSystemProessor;
	}
	public IS3dSystemProcessor getS3dSystemProcessor(){
		return this.s3dSystemProessor;
	}

	@Override
	public void importImage(INcpSession session, String[] accessoryIds) throws Exception {
		String userId = session.getUserId();
		this.createResImageRows(session, accessoryIds, userId);
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());

		//复制图片
		String userImageFolder = s3dSystemProcessor.getUserImageFolder(userId);
		this.copyImagesToResourceFolder(session, userImageFolder);

		//生成imageList.js
		String configFilePath = this.getUserImageConfigFilePath(userId);
		this.generateImageListConfigFile(session, configFilePath);
	}

	private String getUserImageConfigFilePath(String userId){
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());
		String configFilePath = s3dSystemProcessor.getUserConfigFilePath(userId, "imageList.js");
		return configFilePath;
	}

	private void createResImageRows(INcpSession session, String[] accessoryIds, String userId) throws Exception {
		Date currentTime = new Date();
		List<String> idList = new ArrayList<>();
		for(int i = 0; i < accessoryIds.length; i++){
			idList.add(accessoryIds[i]);
		}
		Data accessoryData = DataCollection.getData("d_Accessory");
		Data bjImageData = DataCollection.getData("res_Image");
		DataTable accessoryDt = this.dBParserAccess.getDtByIds(dbSession, accessoryData, idList);
		List<DataRow> accessoryRows = accessoryDt.getRows();
		for(int i = 0; i < accessoryRows.size(); i++) {
			DataRow accessoryRow = accessoryRows.get(i);
			String uploadUserId = accessoryRow.getStringValue("uploaduserid");
			String fileName = accessoryRow.getStringValue("name");
			String imageName = this.getNewName(session, fileName);
			if (uploadUserId.equals(userId)) {
				HashMap<String, Object> p2vs = new HashMap<String, Object>();
				p2vs.put("name", imageName);
				p2vs.put("accessoryid", accessoryRow.getStringValue("id"));
				p2vs.put("createuser_xid", userId);
				p2vs.put("createtime", currentTime);
				p2vs.put("companyid", session.getCompanyId());
				p2vs.put("deletetime", DataBaseDao.getDefaultDeleteTime());
				p2vs.put("isdeleted", "N");
				this.dBParserAccess.insertByData(dbSession, bjImageData, p2vs);
			}
		}
	}
	public String getImagePath(String accessoryId) throws Exception {
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		String filePath = accessoryDao.getFilePathById(accessoryId);
		return filePath;
	}

	@Override
	public String getImagePathByName(String userId, String imageName) throws Exception {
		List<DataRow> rows = this.getImageRowsByName(userId, imageName);
		if(rows.size() == 0){
			throw new Exception("None image named " + imageName);
		}
		else{
			DataRow row = rows.get(0);
			String accessoryId = row.getStringValue("accessoryid");
			return this.getImagePath(accessoryId);
		}
	}
	public JSONArray getImageList(NcpSession session, String imageName) throws UnsupportedEncodingException, SQLException { 
		String userId = session.getUserId();
		List<DataRow> rows = this.getImageList(userId, imageName);
		JSONArray imageArray = new JSONArray();
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			JSONObject rowObj = new JSONObject();
			rowObj.put("accessoryId", row.getStringValue("accessoryid"));
			rowObj.put("name", CommonFunction.encode(row.getStringValue("name")));  
			imageArray.add(rowObj);
		}
		return imageArray;
	}
	
	private List<DataRow> getImageList(String userId, String imageName) throws SQLException{
		String sql = "select t.accessoryid as accessoryid, "
				+ " t.name as name "
				+ " from res_image t "
				+ " where (t.createuser_xid = " + SysConfig.getParamPrefix() + "userid or t.ispublic='Y')"
				+ " and t.name like " + SysConfig.getParamPrefix() + "imagename "
				+ " and t.isdeleted = 'N'"
				+ " order by t.name asc";
		Session dbSession = this.getDBSession();
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", userId);
		p2vs.put("imagename", imageName + "%");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("accessoryid", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		
		List<String> alias = new ArrayList<String>();
		alias.add("accessoryid");
		alias.add("name");
		
		DataTable dt = this.dBParserAccess.selectList(dbSession, sql, p2vs, alias, fieldValueTypes, 0, this.getOnePageImageCount());
		return dt.getRows();
	}

	private List<DataRow> getImageRowsByName(String userId, String imageName) throws SQLException{
		String sql = "select t.id as id, "
				+ " t.accessoryid as accessoryid, "
				+ " t.name as name from res_image t "
				+ " where t.name = " + SysConfig.getParamPrefix() + "imagename "
				+ " and (t.createuser_xid = " + SysConfig.getParamPrefix() + "userid or t.ispublic='Y')"
				+ " and t.isdeleted = 'N'"
				+ " order by t.createtime desc";
		Session dbSession = this.getDBSession();
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("imagename", imageName);
		p2vs.put("userid", userId);

		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("accessoryid", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);

		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("accessoryid");
		alias.add("name");

		DataTable dt = this.dBParserAccess.selectList(dbSession, sql, p2vs, alias, fieldValueTypes, 0, this.getOnePageImageCount());
		return dt.getRows();
	}

	private DataRow getImageAccessoryRow(String accessoryId) throws SQLException{
		String sql = "select t.id as id, "
				+ " t.name as name"
				+ " from d_accessory t "
				+ " where t.id = " + SysConfig.getParamPrefix() + "accessoryid "
				+ " and t.isdeleted = 'N'";
		Session dbSession = this.getDBSession();
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("accessoryid", accessoryId);

		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);

		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");

		DataTable dt = this.dBParserAccess.selectList(dbSession, sql, p2vs, alias, fieldValueTypes);
		List<DataRow> rows = dt.getRows();
		return rows.size() == 0 ? null : rows.get(0);
	}

	@Override
	public void copyImagesToResourceFolder(INcpSession session) throws Exception {
		String userId = session.getUserId();
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());
		String userImageFolder = s3dSystemProcessor.getUserImageFolder(userId);
		this.copyImagesToResourceFolder(session, userImageFolder);
	}

	private void copyImagesToResourceFolder(INcpSession session, String userImageFolder) throws Exception {
		String userId = session.getUserId();
		List<DataRow> imageRows = this.getAllImageRows(session, session.getUserId());
		JSONArray imageListJArray = new JSONArray();
		for(int i = 0; i < imageRows.size(); i++){
			DataRow imageRow = imageRows.get(i);
			String name = imageRow.getStringValue("name");
			String accessoryId = imageRow.getStringValue("accessoryid");
			this.copyImageToResourceFolder(session, userImageFolder, accessoryId, name);
		}
	}

	@Override
	public boolean checkImagesInResourceFolder(INcpSession session) throws Exception {
		String userId = session.getUserId();
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());
		String userImageFolder = s3dSystemProcessor.getUserImageFolder(userId);
		String configFilePath = this.getUserImageConfigFilePath(userId);
		return this.checkImagesInResourceFolder(session, userImageFolder, configFilePath);
	}

	private boolean checkImagesInResourceFolder(INcpSession session, String userImageFolder, String configFilePath) throws Exception {
		List<DataRow> imageRows = this.getAllImageRows(session, session.getUserId());
		JSONArray imageListJArray = new JSONArray();
		for(int i = 0; i < imageRows.size(); i++){
			DataRow imageRow = imageRows.get(i);
			String name = imageRow.getStringValue("name");
			if(!this.checkExistImageFile(session, userImageFolder, name)){
				return false;
			}
		}

		FileOperate fo = new FileOperate();
		return fo.exists(configFilePath);
	}

	private boolean checkExistImageFile(INcpSession session, String userImageFolder, String imageName) throws Exception {
		String destFilePath = this.getImageAbsoluteFilePath(session, userImageFolder, imageName);
		FileOperate fo = new FileOperate();
		return fo.exists(destFilePath);
	}

	@Override
	public void copyImageToResourceFolder(INcpSession session, String accessoryId, String imageName) throws Exception {
		String userId = session.getUserId();
		IS3dSystemProcessor s3dSystemProcessor = this.getS3dSystemProcessor();
		s3dSystemProcessor.setDBSession(this.getDBSession());
		String userImageFolder = s3dSystemProcessor.getUserImageFolder(userId);
		this.copyImageToResourceFolder(session, userImageFolder, accessoryId, imageName);
	}

	private void copyImageToResourceFolder(INcpSession session, String userImageFolder, String accessoryId, String imageName) throws Exception {
		String destFilePath = this.getImageAbsoluteFilePath(session, userImageFolder, imageName);
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(this.getDBSession());
		String sourceFilePath = accessoryDao.getFilePathById(accessoryId);
		FileOperate fo = new FileOperate();
		File file = new File(destFilePath);
		File dir = file.getParentFile();
		fo.createFolderRecursion(dir);
		fo.copyFile(sourceFilePath, destFilePath);
	}

	@Override
	public void generateImageListConfigFile(INcpSession session) throws Exception {
		String userId = session.getUserId();
		String configFilePath = this.getUserImageConfigFilePath(userId);
		this.generateImageListConfigFile(session, configFilePath);
	}

	@Override
	public JSONArray getImageConfigArray(INcpSession session, List<String> imageAccessoryIds) throws Exception {
		JSONArray imageListJArray = new JSONArray();
		for(int i = 0; i < imageAccessoryIds.size(); i++){
			String imageAccessoryId = imageAccessoryIds.get(i);
			DataRow imageRow = this.getImageAccessoryRow(imageAccessoryId);
			String name = imageRow.getStringValue("name");
			JSONObject imageJson = new JSONObject();
			imageJson.put("code", name);
			imageJson.put("name", name);
			imageJson.put("url", name);
			imageListJArray.add(imageJson);
		}
		return imageListJArray;
	}

	private void generateImageListConfigFile(INcpSession session, String configFilePath) throws Exception {
		String userId = session.getUserId();
		List<DataRow> imageRows = this.getAllImageRows(session, session.getUserId());
		JSONArray imageListJArray = new JSONArray();
		for(int i = 0; i < imageRows.size(); i++){
			DataRow imageRow = imageRows.get(i);
			String name = imageRow.getStringValue("name");
			JSONObject imageJson = new JSONObject();
			imageJson.put("code", name);
			imageJson.put("name", name);
			imageJson.put("url", name);
			imageListJArray.add(imageJson);
		}
		StringBuilder fileStr = new StringBuilder("export const imageList = ");
		fileStr.append(imageListJArray.toString());
		fileStr.append(";");

		FileOperate fo = new FileOperate();
		File file = new File(configFilePath);
		fo.createFolderRecursion(file.getParentFile());

		fo.createFile(configFilePath, fileStr.toString(), FileOperate.DefaultEncoding);
	}

	private String getAppImageFolder(INcpSession session, String appFolder) throws SQLException {
		return appFolder + "resources/images/";
	}

	private List<DataRow> getAllImageRows(INcpSession session, String userId) throws SQLException {
		String sql = "select t.id as id, "
				+ " t.name as name, "
				+ " t.accessoryid as accessoryid "
				+ " from res_image t "
				+ " left outer join d_accessory accessory on accessory.id = t.accessoryid"
				+ " where (t.createuser_xid = " + SysConfig.getParamPrefix() + "userid or t.ispublic='Y') "
				+ " and t.isdeleted = 'N' "
				+ " order by t.name asc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", userId);
		List<String> alias = new ArrayList<>();
		alias.add("id");
		alias.add("name");
		alias.add("accessoryid");
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("accessoryid", ValueType.String);
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.selectList(this.getDBSession(), sql, p2vs, alias, valueTypes);
		return dt.getRows();
	}

	private int getImageCountByName(INcpSession session, String name) throws SQLException {
		String userId = session.getUserId();
		String checkSql = "select count(1) as rowcount "
				+ " from res_image t "
				+ " where t.name = " + SysConfig.getParamPrefix() +"name "
				+ " and (t.createuser_xid = " + SysConfig.getParamPrefix() + "userid or t.ispublic='Y') "
				+ " and t.isdeleted = 'N'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("name", name);
		p2vs.put("userid", userId);
		int rowCount = ((BigInteger)this.getDBParserAccess().selectOne(getDBSession(), checkSql, p2vs)).intValue();
		return rowCount;
	}

	private boolean checkExistSameNameImage(INcpSession session, String fileName) throws SQLException {
		int rowCount = this.getImageCountByName(session, fileName);
		return rowCount != 0;
	}

	@Override
	public String getNewName(INcpSession session, String fileName) throws SQLException {
		int dotIndex = fileName.lastIndexOf(".");
		String name = fileName.substring(0, dotIndex);
		String postfix = fileName.substring(dotIndex);
		int index = 0;
		String newName = fileName;
		while(this.checkExistSameNameImage(session, newName)){
			index++;
			newName = name + "_" + index + postfix;
		}
		return newName;
	}

	@Override
	public void removeImage(INcpSession session, String imageName) throws Exception {
		String userId = session.getUserId();
		Data resImageData = DataCollection.getData("res_Image");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		List<DataRow> rows = this.getImageRowsByName(userId, imageName);
		HashMap<String, Object> p2vs = new HashMap<>();
		p2vs.put("isdeleted", "Y");
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			String id = row.getStringValue("id");
			dbAccess.updateByData(this.getDBSession(), resImageData, p2vs, id);
		}

		this.generateImageListConfigFile(session);
	}
}
