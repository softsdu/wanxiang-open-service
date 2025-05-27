package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import org.hibernate.Session;

public class S3dUserProcessor implements IS3dUserProcessor {
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

    @Override
    public JSONObject getUser(INcpSession session, String appKey) throws Exception {
        JSONObject userJson = new JSONObject();
        userJson.put("id", session.getUserId());
        userJson.put("code", session.getUserName());
        userJson.put("name", session.getUserName());
        return userJson;
    }
}
