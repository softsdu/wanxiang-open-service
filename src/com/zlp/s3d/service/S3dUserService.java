package com.zlp.s3d.service;

import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.ActionSupport;
import com.zlp.platform.common.*;
import com.zlp.s3d.processor.IS3dImageProcessor;
import com.zlp.s3d.processor.IS3dUserProcessor;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import java.sql.SQLException;
import java.util.HashMap;

public class S3dUserService extends NcpActionSupport implements IS3dUserService{

    private static final Logger logger=Logger.getLogger(S3dUserService.class);

    private HibernateTransactionManager transactionManager;
    public void setTransactionManager(HibernateTransactionManager transactionManager) {
        this.transactionManager = transactionManager;
    }

    protected Session openDBSession() throws SQLException {
        return this.transactionManager.getSessionFactory().openSession();
    }

    private IS3dUserProcessor s3dUserProcessor = null;
    public void setS3dUserProcessor(IS3dUserProcessor s3dUserProcessor){
        this.s3dUserProcessor = s3dUserProcessor;
    }
    protected IS3dUserProcessor getS3dUserProcessor(){
        return this.s3dUserProcessor;
    }

    @Override
    public String getUser() {
        Session dbSession = null;
        try
        {
            logger.info(requestParam);
            JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

            dbSession = this.openDBSession();
            IS3dUserProcessor s3dUserProcessor = this.getS3dUserProcessor();
            s3dUserProcessor.setDBSession(dbSession);
            INcpSession session = new NcpSession(this.getHttpCookies(), true);
            String appKey = requestObj.getString("appKey");

            JSONObject userJson = s3dUserProcessor.getUser(session, appKey);

            HashMap<String, Object> resultHash = new HashMap<String, Object>();
            resultHash.put("userInfo", userJson);
            String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
            this.addResponse(resultString);
        }
        catch(Exception ex) {
            ex.printStackTrace();
            NcpException ncpEx = new NcpException("getUser", "提示: "+ ex.getMessage(), ex);
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
