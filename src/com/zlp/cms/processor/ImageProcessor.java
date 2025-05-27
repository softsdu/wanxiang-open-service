package com.zlp.cms.processor;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.zlp.platform.common.INcpSession;
import org.apache.log4j.Logger;
import org.hibernate.Session;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.SysConfig;
import com.zlp.platform.common.util.CommonFunction;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.platform.dao.db.DataTable;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.db.ISequenceGenerator;
import com.zlp.platform.dao.db.ValueType;
import com.zlp.platform.dao.sys.DataBaseDao;
import com.zlp.platform.dao.sys.IAccessoryDao;
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection; 

public class ImageProcessor implements IImageProcessor{
  	private static Logger userLogger=Logger.getLogger(ImageProcessor.class);  
	private IDBParserAccess dBParserAccess;
	public void setDBParserAccess(IDBParserAccess dBParserAccess){ 
		this.dBParserAccess = dBParserAccess;
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

	@Override
	public void importImage(INcpSession session, String[] ids) throws Exception {
		String userId = session.getUserId();
		Date currentTime = new Date();
		List<String> idList = new ArrayList<>();
		for(int i = 0; i < ids.length; i++){
			idList.add(ids[i]);
		}
		Data accessoryData = DataCollection.getData("d_Accessory");
		Data bjImageData = DataCollection.getData("cms_Image");
		DataTable accessoryDt = this.dBParserAccess.getDtByIds(dbSession, accessoryData, idList);
		List<DataRow> accessoryRows = accessoryDt.getRows();
		for(int i = 0; i < accessoryRows.size(); i++){
			 DataRow accessoryRow = accessoryRows.get(i);
			 String uploadUserId = accessoryRow.getStringValue("uploaduserid");
			 if(uploadUserId.equals(userId)){
				 HashMap<String, Object> p2vs = new HashMap<String, Object>();
				 p2vs.put("name", accessoryRow.getStringValue("name"));
				 p2vs.put("accessoryid", accessoryRow.getStringValue("id"));
				 p2vs.put("createuser_xid",userId);
				 p2vs.put("createtime", currentTime);
				 p2vs.put("companyid", session.getCompanyId());
				 p2vs.put("deletetime", DataBaseDao.getDefaultDeleteTime());				 
				 p2vs.put("isdeleted", "N");
				 this.dBParserAccess.insertByData(dbSession, bjImageData, p2vs);
			 }
		}
	}
	public String getImagePath(String accessoryId) throws java.lang.Exception {
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		String filePath = accessoryDao.getFilePathById(accessoryId);
		return filePath;
	}
	@Override
	public String getImagePathByName(String imageName) throws java.lang.Exception {
		List<DataRow> rows = this.getImageRowsByName(imageName);
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
				+ " t.name as name from cms_image t where t.createuser_xid = " + SysConfig.getParamPrefix() + "userid"
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
	
	private List<DataRow> getImageRowsByName(String imageName) throws SQLException{
		String sql = "select t.accessoryid as accessoryid, "
				+ " t.name as name from cms_image t where t.name = " + SysConfig.getParamPrefix() + "imagename "
				+ " and t.isdeleted = 'N'"
				+ " order by t.createtime desc";
		Session dbSession = this.getDBSession();
		HashMap<String, Object> p2vs = new HashMap<String, Object>(); 
		p2vs.put("imagename", imageName);
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("accessoryid", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		
		List<String> alias = new ArrayList<String>();
		alias.add("accessoryid");
		alias.add("name");
		
		DataTable dt = this.dBParserAccess.selectList(dbSession, sql, p2vs, alias, fieldValueTypes, 0, this.getOnePageImageCount());
		return dt.getRows();
	}  
}
