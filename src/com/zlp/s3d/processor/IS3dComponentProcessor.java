package com.zlp.s3d.processor;

import com.zlp.platform.common.INcpSession;
import org.hibernate.Session;

public interface IS3dComponentProcessor {
    void setDBSession(Session dbSession);

    void generateAppComponentsAndConfig(INcpSession session, String appKey, String userId) throws Exception;

    boolean checkAppComponentsAndConfig(INcpSession session, String appKey, String userId) throws Exception;
}
