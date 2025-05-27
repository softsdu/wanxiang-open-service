package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import org.hibernate.Session;

import java.sql.SQLException;
import java.util.HashMap;

public interface IS3dContent2DProcessor {

	void setDBSession(Session dbSession);

    String getS3dResourcesRelativeFolder();

    void generateContent2DConfigFile(INcpSession session) throws Exception;

    JSONObject getContent2DJson(INcpSession session, String navigatorCode, HashMap<String, JSONObject> moduleMap) throws SQLException;
}
