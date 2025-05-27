package com.zlp.cms.processor;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

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

public class AudioProcessor implements IAudioProcessor {
  	private static Logger userLogger=Logger.getLogger(AudioProcessor.class);  
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

	private int onePageAudioCount = 20;
	public int getOnePageAudioCount(){
		return this.onePageAudioCount;
	}
	public void setOnePageAudioCount(int onePageAudioCount){
		this.onePageAudioCount = onePageAudioCount;
	}  
	    
	public void importAudio(NcpSession session, String[] ids) throws Exception {
		String userId = session.getUserId();
		Date currentTime = new Date();
		List<String> idList = new ArrayList<>();
		for(int i = 0; i < ids.length; i++){
			idList.add(ids[i]);
		}
		Data accessoryData = DataCollection.getData("d_Accessory");
		Data bjAudioData = DataCollection.getData("cms_Audio");
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
				 this.dBParserAccess.insertByData(dbSession, bjAudioData, p2vs);
			 }
		}
	}
	public String getAudioPath(String accessoryId) throws java.lang.Exception {
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(dbSession);
		String filePath = accessoryDao.getFilePathById(accessoryId);
		return filePath;
	}
	public JSONArray getAudioList(NcpSession session, String audioName) throws UnsupportedEncodingException, SQLException { 
		String userId = session.getUserId();
		List<DataRow> rows = this.getAudioList(userId, audioName);
		JSONArray audioArray = new JSONArray();
		for(int i = 0; i < rows.size(); i++){
			DataRow row = rows.get(i);
			JSONObject rowObj = new JSONObject();
			rowObj.put("accessoryId", row.getStringValue("accessoryid"));
			rowObj.put("name", CommonFunction.encode(row.getStringValue("name")));  
			audioArray.add(rowObj);
		}
		return audioArray;
	}

	private List<DataRow> getAudioList(String userId, String audioName) throws SQLException{
		String sql = "select t.accessoryid as accessoryid, "
				+ " t.name as name from cms_audio t where t.createuser_xid = " + SysConfig.getParamPrefix() + "userid"
				+ " and t.name like " + SysConfig.getParamPrefix() + "audioname "
				+ " and t.isdeleted = 'N'"
				+ " order by t.name asc";
		Session dbSession = this.getDBSession();
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", userId);
		p2vs.put("audioname", audioName + "%");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("accessoryid", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		
		List<String> alias = new ArrayList<String>();
		alias.add("accessoryid");
		alias.add("name");
		
		DataTable dt = this.dBParserAccess.selectList(dbSession, sql, p2vs, alias, fieldValueTypes, 0, this.getOnePageAudioCount());
		return dt.getRows();
	}
	
	private DataRow getAudioRow(String audioName) throws SQLException{
		String sql = "select t.accessoryid as accessoryid, "
				+ " t.name as name from cms_audio t where t.name = " + SysConfig.getParamPrefix() + "audioname "
				+ " and t.isdeleted = 'N'"
				+ " order by t.name asc";
		Session dbSession = this.getDBSession();
		HashMap<String, Object> p2vs = new HashMap<String, Object>(); 
		p2vs.put("audioname", audioName);
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("accessoryid", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		
		List<String> alias = new ArrayList<String>();
		alias.add("accessoryid");
		alias.add("name");
		
		DataTable dt = this.dBParserAccess.selectList(dbSession, sql, p2vs, alias, fieldValueTypes, 0, this.getOnePageAudioCount());
		List<DataRow> rows = dt.getRows();
		if(rows.size() == 0){
			return null;
		}
		else{
			return rows.get(0);
		}
	}
	public String getAudioPathByName(String audioName) throws Exception {
		DataRow row = this.getAudioRow(audioName);
		if(row == null){
			throw new Exception("None audio named " + audioName);
		}
		else{
			String accessoryId = row.getStringValue("accessoryid");
			return this.getAudioPath(accessoryId);
		} 
	}  
}
