package com.zlp.s3d.service;

import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
import com.zlp.platform.common.*;
import com.zlp.s3d.processor.IS3dImageProcessor;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import java.sql.SQLException;
import java.util.HashMap;

public class S3dImageService extends NcpActionSupport implements IS3dImageService{

    private static final Logger logger=Logger.getLogger(com.zlp.s3d.service.S3dImageService.class);

    private HibernateTransactionManager transactionManager;
    public void setTransactionManager(HibernateTransactionManager transactionManager) {
        this.transactionManager = transactionManager;
    }

    protected Session openDBSession() throws SQLException {
        return this.transactionManager.getSessionFactory().openSession();
    }

    private IS3dImageProcessor s3dImageProcessor = null;
    public void setS3dImageProcessor(IS3dImageProcessor s3dImageProcessor){
        this.s3dImageProcessor = s3dImageProcessor;
    }
    protected IS3dImageProcessor getS3dImageProcessor(){
        return this.s3dImageProcessor;
    }

    @Override
    public String generateAppImagesAndConfig() {
        Session dbSession = null;
        try
        {
            logger.info(requestParam);
            JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

            dbSession = this.openDBSession();
            IS3dImageProcessor s3dImageProcessor = this.getS3dImageProcessor();
            s3dImageProcessor.setDBSession(dbSession);
            INcpSession session = new NcpSession(this.getHttpCookies(), true);
            String appKey = requestObj.getString("appKey");

            s3dImageProcessor.generateAppImagesAndConfig(session, appKey, session.getUserId());

            HashMap<String, Object> resultHash = new HashMap<String, Object>();
            String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
            this.addResponse(resultString);
        }
        catch(Exception ex) {
            ex.printStackTrace();
            NcpException ncpEx = new NcpException("generateAppImagesAndConfig", "提示: "+ ex.getMessage(), ex);
            this.addResponse(ncpEx.toJsonString());
        }
        finally{
            if(dbSession != null){
                dbSession.close();
            }
        }
        return ActionSupport.SUCCESS;
    }

    @Override
    public String checkAppImagesAndConfig() {
        Session dbSession = null;
        try
        {
            logger.info(requestParam);
            JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

            dbSession = this.openDBSession();
            IS3dImageProcessor s3dImageProcessor = this.getS3dImageProcessor();
            s3dImageProcessor.setDBSession(dbSession);
            INcpSession session = new NcpSession(this.getHttpCookies(), true);
            String appKey = requestObj.getString("appKey");
            boolean autoGenerate = requestObj.getBoolean("autoGenerate");

            boolean exist = s3dImageProcessor.checkAppImagesAndConfig(session, appKey, session.getUserId());
            if(!exist){
                s3dImageProcessor.generateAppImagesAndConfig(session, appKey, session.getUserId());
            }

            HashMap<String, Object> resultHash = new HashMap<String, Object>();
            String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
            this.addResponse(resultString);
        }
        catch(Exception ex) {
            ex.printStackTrace();
            NcpException ncpEx = new NcpException("checkAppImagesAndConfig", "提示: "+ ex.getMessage(), ex);
            this.addResponse(ncpEx.toJsonString());
        }
        finally{
            if(dbSession != null){
                dbSession.close();
            }
        }
        return ActionSupport.SUCCESS;
    }

    @Override
    public String removeImage() {
        Session dbSession = null;
        try
        {
            logger.info(requestParam);
            JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

            dbSession = this.openDBSession();
            IS3dImageProcessor s3dImageProcessor = this.getS3dImageProcessor();
            s3dImageProcessor.setDBSession(dbSession);
            INcpSession session = new NcpSession(this.getHttpCookies(), true);
            String appKey = requestObj.getString("appKey");
            String imageName = requestObj.getString("imageName");

            s3dImageProcessor.removeImage(session, appKey, imageName);

            HashMap<String, Object> resultHash = new HashMap<String, Object>();
            String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
            this.addResponse(resultString);
        }
        catch(Exception ex) {
            ex.printStackTrace();
            NcpException ncpEx = new NcpException("removeImage", "提示: "+ ex.getMessage(), ex);
            this.addResponse(ncpEx.toJsonString());
        }
        finally{
            if(dbSession != null){
                dbSession.close();
            }
        }
        return ActionSupport.SUCCESS;
    }
}
