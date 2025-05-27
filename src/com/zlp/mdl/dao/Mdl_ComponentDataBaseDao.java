package com.zlp.mdl.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.sys.DataBaseDao;

/**
 * 部品库增加数据权限过滤 created by liyh 20220406
 * sharetype：全体-公共可见/公司-本公司可见/个人；
 * @author yuay
 *
 */
public class Mdl_ComponentDataBaseDao extends DataBaseDao {
	
	private IDBParserAccess dBParserAccess;

	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}

	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	}

	@Override
	protected void beforeSelect(INcpSession session, JSONObject requestObj) throws Exception {
		super.beforeSelect(session, requestObj);
		JSONArray sysWhere = requestObj.containsKey("sysWhere")? requestObj.getJSONArray("sysWhere"):new JSONArray();

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("parttype", "clause");
		jsonObject.put("clause", "(t.sharetype='全体' or (t.companyid = '"+session.getCompanyId()+"' and t.sharetype='公司') or  t.createuser_xid =  '"+session.getUserId()+"')");
		sysWhere.add(jsonObject);
		requestObj.put("sysWhere", sysWhere);
	}

}
