package com.zlp.s3d.service;

import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
import com.zlp.platform.common.*;
import com.zlp.s3d.processor.IS3dComponentLocalProcessor;
import com.zlp.s3d.processor.IS3dComponentProcessor;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import java.sql.SQLException;
import java.util.HashMap;

public class S3dComponentService extends NcpActionSupport implements IS3dComponentService{

    private static final Logger logger=Logger.getLogger(S3dComponentService.class);

    private HibernateTransactionManager transactionManager;
    public void setTransactionManager(HibernateTransactionManager transactionManager) {
        this.transactionManager = transactionManager;
    }

    protected Session openDBSession() throws SQLException {
        return this.transactionManager.getSessionFactory().openSession();
    }

    private IS3dComponentProcessor s3dComponentProcessor = null;
    public void setS3dComponentProcessor(IS3dComponentProcessor s3dComponentProcessor){
        this.s3dComponentProcessor = s3dComponentProcessor;
    }
    protected IS3dComponentProcessor getS3dComponentProcessor(){
        return this.s3dComponentProcessor;
    }

    private IS3dComponentLocalProcessor s3dComponentLocalProcessor = null;
    public void setS3dComponentLocalProcessor(IS3dComponentLocalProcessor s3dComponentLocalProcessor){
        this.s3dComponentLocalProcessor = s3dComponentLocalProcessor;
    }
    protected IS3dComponentLocalProcessor getS3dComponentLocalProcessor(){
        return this.s3dComponentLocalProcessor;
    }

    @Override
    public String generateAppComponentsAndConfig() {
        Session dbSession = null;
        try
        {
            logger.info(requestParam);
            JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

            dbSession = this.openDBSession();
            IS3dComponentProcessor s3dComponentProcessor = this.getS3dComponentProcessor();
            s3dComponentProcessor.setDBSession(dbSession);
            INcpSession session = new NcpSession(this.getHttpCookies(), true);
            String appKey = requestObj.getString("appKey");

            s3dComponentProcessor.generateAppComponentsAndConfig(session, appKey, session.getUserId());

            HashMap<String, Object> resultHash = new HashMap<String, Object>();
            String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
            this.addResponse(resultString);
        }
        catch(Exception ex) {
            ex.printStackTrace();
            NcpException ncpEx = new NcpException("generateAppComponentsAndConfig", "提示: "+ ex.getMessage(), ex);
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
    public String checkAppComponentsAndConfig() {
        Session dbSession = null;
        try
        {
            logger.info(requestParam);
            JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

            dbSession = this.openDBSession();
            IS3dComponentProcessor s3dComponentProcessor = this.getS3dComponentProcessor();
            s3dComponentProcessor.setDBSession(dbSession);
            INcpSession session = new NcpSession(this.getHttpCookies(), true);
            String appKey = requestObj.getString("appKey");
            boolean autoGenerate = requestObj.getBoolean("autoGenerate");

            boolean exist = s3dComponentProcessor.checkAppComponentsAndConfig(session, appKey, session.getUserId());
            if(!exist){
                s3dComponentProcessor.generateAppComponentsAndConfig(session, appKey, session.getUserId());
            }

            HashMap<String, Object> resultHash = new HashMap<String, Object>();
            String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
            this.addResponse(resultString);
        }
        catch(Exception ex) {
            ex.printStackTrace();
            NcpException ncpEx = new NcpException("checkAppComponentsAndConfig", "提示: "+ ex.getMessage(), ex);
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
    public String removeComponentLocal() {
        Session dbSession = null;
        try
        {
            logger.info(requestParam);
            JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

            dbSession = this.openDBSession();
            IS3dComponentLocalProcessor s3dComponentLocalProcessor = this.getS3dComponentLocalProcessor();
            s3dComponentLocalProcessor.setDBSession(dbSession);

            IS3dComponentProcessor s3dComponentProcessor = this.getS3dComponentProcessor();
            s3dComponentProcessor.setDBSession(dbSession);

            INcpSession session = new NcpSession(this.getHttpCookies(), true);
            String appKey = requestObj.getString("appKey");
            String componentCode = requestObj.getString("componentCode");
            String versionNum = requestObj.getString("versionNum");

            s3dComponentLocalProcessor.removeComponentLocal(session, appKey, componentCode, versionNum);
            s3dComponentProcessor.generateAppComponentsAndConfig(session, appKey, session.getUserId());

            HashMap<String, Object> resultHash = new HashMap<String, Object>();
            String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
            this.addResponse(resultString);
        }
        catch(Exception ex) {
            ex.printStackTrace();
            NcpException ncpEx = new NcpException("removeComponentLocal", "提示: "+ ex.getMessage(), ex);
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
