package com.zlp.external.resource.image.processor;

import com.alibaba.fastjson.JSONArray;
import com.zlp.platform.common.INcpSession;
import org.hibernate.Session;

import java.sql.SQLException;
import java.util.List;

public interface IImageProcessor {

	void setDBSession(Session dbSession);

    String getDefaultFilterType();

    void importImage(INcpSession session, String[] ids) throws Exception;

    String getImagePathByName(String userId, String imageName) throws Exception;

    boolean checkImagesInResourceFolder(INcpSession session) throws Exception;

    void copyImagesToResourceFolder(INcpSession session) throws Exception;

    void copyImageToResourceFolder(INcpSession session, String accessoryId, String imageName) throws Exception;

    void generateImageListConfigFile(INcpSession session) throws Exception;

    JSONArray getImageConfigArray(INcpSession session, List<String> imageAccessoryIds) throws Exception;

    String getNewName(INcpSession session, String fileName) throws SQLException;

    void removeImage(INcpSession session, String imageName) throws Exception;
}
