package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.external.resource.image.processor.IImageProcessor;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.dao.sys.IAccessoryDao;
import org.hibernate.Session;
import java.io.InputStream;
import java.util.List;

public class S3dImageProcessor implements IS3dImageProcessor {
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

    private IImageProcessor imageProcessor;
    public IImageProcessor getImageProcessor() {
        return imageProcessor;
    }
    public void setImageProcessor(IImageProcessor imageProcessor) {
        this.imageProcessor = imageProcessor;
    }

    private IAccessoryDao accessoryDao;
    public IAccessoryDao getAccessoryDao() {
        return accessoryDao;
    }
    public void setAccessoryDao(IAccessoryDao accessoryDao) {
        this.accessoryDao = accessoryDao;
    }

    @Override
    public JSONObject uploadImage(INcpSession session, InputStream inputStream, String fileName, String appKey) throws Exception {
        IAccessoryDao accessoryDao = this.getAccessoryDao();
        accessoryDao.setDBSession(this.getDBSession());
        IImageProcessor imageProcessor = this.getImageProcessor();
        imageProcessor.setDBSession(this.getDBSession());
        String imageName = imageProcessor.getNewName(session, fileName);
        String accessoryId = accessoryDao.saveAccessory(session, inputStream, imageName, imageProcessor.getDefaultFilterType(), appKey);
        imageProcessor.importImage(session, new String[]{ accessoryId });
        JSONObject imageJson = new JSONObject();
        imageJson.put("code", imageName);
        imageJson.put("name", imageName);
        imageJson.put("url", imageName);

        imageProcessor.copyImageToResourceFolder(session, accessoryId, imageName);
        imageProcessor.generateImageListConfigFile(session);

        return imageJson;
    }

    @Override
    public void generateAppImagesAndConfig(INcpSession session, String appKey, String userId) throws Exception {
        IImageProcessor imageProcessor = this.getImageProcessor();
        imageProcessor.setDBSession(this.getDBSession());
        imageProcessor.copyImagesToResourceFolder(session);
        imageProcessor.generateImageListConfigFile(session);
    }

    @Override
    public JSONArray getImageConfigArray(INcpSession session, List<String> imageAccessoryIds) throws Exception {
        IImageProcessor imageProcessor = this.getImageProcessor();
        imageProcessor.setDBSession(this.getDBSession());
        return imageProcessor.getImageConfigArray(session, imageAccessoryIds);
    }

    @Override
    public boolean checkAppImagesAndConfig(INcpSession session, String appKey, String userId) throws Exception {
        IImageProcessor imageProcessor = this.getImageProcessor();
        imageProcessor.setDBSession(this.getDBSession());
        return imageProcessor.checkImagesInResourceFolder(session);
    }

    @Override
    public void removeImage(INcpSession session, String appKey, String imageName) throws Exception {
        IImageProcessor imageProcessor = this.getImageProcessor();
        imageProcessor.setDBSession(this.getDBSession());
        imageProcessor.removeImage(session, imageName);
    }
}
