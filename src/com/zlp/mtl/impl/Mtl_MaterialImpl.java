package com.zlp.mtl.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.dao.sys.DataBaseDao;
import com.zlp.s3d.impl.IS3d_ComponentLocalImpl;

public class Mtl_MaterialImpl extends DataBaseDao implements IMtl_MaterialImpl {
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
