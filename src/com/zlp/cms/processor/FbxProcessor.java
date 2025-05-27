package com.zlp.cms.processor;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.SysConfig;
import com.zlp.platform.common.util.CommonFunction;
import com.zlp.platform.dao.db.*;
import com.zlp.platform.dao.sys.DataBaseDao;
import com.zlp.platform.dao.sys.IAccessoryDao;
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

public class FbxProcessor implements IFbxProcessor{
  	private static Logger userLogger=Logger.getLogger(FbxProcessor.class);
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

	private int onePageFbxCount = 20;
	public int getOnePageFbxCount(){
		return this.onePageFbxCount;
	}
	public void setOnePageFbxCount(int onePageFbxCount){
		this.onePageFbxCount = onePageFbxCount;
	}  

	@Override
	public void importFbx(NcpSession session, String[] ids) throws Exception {
		String userId = session.getUserId();
		Date currentTime = new Date();
		List<String> idList = new ArrayList<>();
		for(int i = 0; i < ids.length; i++){
			idList.add(ids[i]);
		}
		Data accessoryData = DataCollection.getData("d_Accessory");
		Data fbxData = DataCollection.getData("cms_Fbx");
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
				 this.dBParserAccess.insertByData(dbSession, fbxData, p2vs);
			 }
		}
	}
	public String getFbxPath(String accessoryId) throws Exception {
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		String filePath = accessoryDao.getFilePathById(accessoryId);
		return filePath;
	}
	@Override
	public String getFbxPathByName(String fbxName) throws Exception {
		List<DataRow> rows = this.getFbxRowsByName(fbxName);
		if(rows.size() == 0){
			throw new Exception("None fbx named " + fbxName);
		}
		else{
			DataRow row = rows.get(0);
			String accessoryId = row.getStringValue("accessoryid");
			return this.getFbxPath(accessoryId);
		}
	}

	@Override
	public JSONArray getFbxList(NcpSession session, String fbxName) throws UnsupportedEncodingException, SQLException {
		String userId = session.getUserId();
		List<DataRow> rows = this.getFbxList(userId, fbxName);
		JSONArray fbxArray = new JSONArray();
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			JSONObject rowObj = new JSONObject();
			rowObj.put("accessoryId", row.getStringValue("accessoryid"));
			rowObj.put("name", CommonFunction.encode(row.getStringValue("name")));  
			fbxArray.add(rowObj);
		}
		return fbxArray;
	}
	
	private List<DataRow> getFbxList(String userId, String fbxName) throws SQLException{
		String sql = "select t.accessoryid as accessoryid, "
				+ " t.name as name from cms_fbx t where t.createuser_xid = " + SysConfig.getParamPrefix() + "userid"
				+ " and t.name like " + SysConfig.getParamPrefix() + "fbxname "
				+ " and t.isdeleted = 'N'"
				+ " order by t.name asc";
		Session dbSession = this.getDBSession();
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", userId);
		p2vs.put("fbxname", fbxName + "%");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("accessoryid", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		
		List<String> alias = new ArrayList<String>();
		alias.add("accessoryid");
		alias.add("name");
		
		DataTable dt = this.dBParserAccess.selectList(dbSession, sql, p2vs, alias, fieldValueTypes, 0, this.getOnePageFbxCount());
		return dt.getRows();
	}  
	
	private List<DataRow> getFbxRowsByName(String fbxName) throws SQLException{
		String sql = "select t.accessoryid as accessoryid, "
				+ " t.name as name from cms_fbx t where t.name = " + SysConfig.getParamPrefix() + "fbxname "
				+ " and t.isdeleted = 'N'"
				+ " order by t.createtime desc";
		Session dbSession = this.getDBSession();
		HashMap<String, Object> p2vs = new HashMap<String, Object>(); 
		p2vs.put("fbxname", fbxName);
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("accessoryid", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		
		List<String> alias = new ArrayList<String>();
		alias.add("accessoryid");
		alias.add("name");
		
		DataTable dt = this.dBParserAccess.selectList(dbSession, sql, p2vs, alias, fieldValueTypes, 0, this.getOnePageFbxCount());
		return dt.getRows();
	}  
}
