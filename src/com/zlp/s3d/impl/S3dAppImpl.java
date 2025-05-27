package com.zlp.s3d.impl;

import java.util.UUID;

import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.dao.sys.DataBaseDao;

public class S3dAppImpl extends DataBaseDao implements IS3dApp {
	@Override
	protected void beforeSave(INcpSession session, JSONObject requestObj) throws Exception{
	    JSONObject insertRowsObj = requestObj.getJSONObject("insert");
	    int insertRowCount = insertRowsObj.size();
	    Object[] insertRowIds = insertRowsObj.keySet().toArray();
	    for(int i = 0;i < insertRowCount; i++){	    	
	    	String insertRowId = (String)insertRowIds[i];
	    	JSONObject insertRowObj = insertRowsObj.getJSONObject(insertRowId); 
	    	String guid = UUID.randomUUID().toString();
	    	insertRowObj.put("appkey", guid);
	    }
	}	
}
