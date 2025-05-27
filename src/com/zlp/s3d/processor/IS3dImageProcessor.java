package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.NcpSession;
import org.hibernate.Session;

import java.io.InputStream;
import java.sql.SQLException;
import java.util.List;

public interface IS3dImageProcessor {
    void setDBSession(Session dbSession);

    JSONObject uploadImage(INcpSession session, InputStream inputStream, String fileName, String appKey) throws Exception;

    void generateAppImagesAndConfig(INcpSession session, String appKey, String userId) throws Exception;

    JSONArray getImageConfigArray(INcpSession session, List<String> imageAccessoryIds) throws Exception;

    boolean checkAppImagesAndConfig(INcpSession session, String appKey, String userId) throws Exception;

    void removeImage(INcpSession session, String appKey, String imageName) throws Exception;
}
