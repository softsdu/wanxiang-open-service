package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import org.hibernate.Session;

public interface IS3dPublishProcessor {

	void setDBSession(Session dbSession);

    void publishModel(INcpSession session, String modelId) throws Exception;

    String generatePublishZipFile(INcpSession session, String modelId) throws Exception;
}
