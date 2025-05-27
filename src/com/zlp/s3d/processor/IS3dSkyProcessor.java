package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import org.hibernate.Session;

public interface IS3dSkyProcessor {

	void setDBSession(Session dbSession);

    String getS3dResourcesRelativeFolder();

    void generateSkyConfigFile(INcpSession session) throws Exception;

    JSONObject getSkyJson(INcpSession session, String skyName);
}
