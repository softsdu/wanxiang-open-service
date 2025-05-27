package com.zlp.s3d.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.FileOperate;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.dao.sys.DataBaseDao;
import com.zlp.platform.dao.sys.IAccessoryDao;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

public class S3d_ModelImpl extends DataBaseDao implements IS3d_Model {
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
