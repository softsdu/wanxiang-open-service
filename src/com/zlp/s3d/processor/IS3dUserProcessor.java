package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import org.hibernate.Session;

public interface IS3dUserProcessor {
    void setDBSession(Session dbSession);

    JSONObject getUser(INcpSession session, String appKey) throws Exception;
}
