package com.zlp.cms.page;

import java.util.Date;
import java.util.HashMap;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.SysConfig; 
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.sys.DataBaseDao;  

public class Cms_ImageImpl extends DataBaseDao {
	 
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	
	@Override
	protected HashMap<String, Object> deleteCore(INcpSession session, JSONObject requestObj) throws Exception{ 
		if(requestObj.containsKey("deleteRows")) {
			JSONObject rowIdToIdValues = requestObj.getJSONObject("deleteRows");     
			for(Object idObj : rowIdToIdValues.values().toArray()){
				String id = (String)idObj;
				String updateJobSql = "update cms_image set isdeleted = 'Y' where id = " + SysConfig.getParamPrefix() + "id";
				HashMap<String, Object> p2vs = new HashMap<String, Object>();
				p2vs.put("id", id);
				this.dBParserAccess.update(this.getDBSession(), updateJobSql, p2vs);
			}
		}
			
	    HashMap<String, Object> resultHash=new HashMap<String, Object>();
	    return resultHash;
	}

	@Override
	protected void beforeSelect(INcpSession session, JSONObject requestObj) throws Exception{
		super.beforeSelect(session, requestObj);
		JSONArray sysWhere = requestObj.containsKey("sysWhere") ? requestObj.getJSONArray("sysWhere") : new JSONArray();
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("parttype", "field");
		jsonObject.put("field", "createuser_xid");
		jsonObject.put("operator", "=");
		jsonObject.put("value", session.getUserId());
		sysWhere.add(jsonObject);
		requestObj.put("sysWhere", sysWhere);
	}
}
