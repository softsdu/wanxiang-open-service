package com.zlp.s3d.processor;

import com.zlp.external.resource.fbxZip.processor.IFbxZipProcessor;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.dao.sys.IAccessoryDao;
import org.hibernate.Session;

public class S3dComponentProcessor implements IS3dComponentProcessor {
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

    private IS3dSystemProcessor s3dSystemProcessor = null;
    public void setS3dSystemProcessor(IS3dSystemProcessor s3dSystemProcessor) {
        this.s3dSystemProcessor = s3dSystemProcessor;
    }
    public IS3dSystemProcessor getS3dSystemProcessor(){
        return this.s3dSystemProcessor;
    }

    private IFbxZipProcessor fbxZipProcessor;
    public IFbxZipProcessor getFbxZipProcessor() {
        return fbxZipProcessor;
    }
    public void setFbxZipProcessor(IFbxZipProcessor fbxZipProcessor) {
        this.fbxZipProcessor = fbxZipProcessor;
    }

    private IAccessoryDao accessoryDao;
    public IAccessoryDao getAccessoryDao() {
        return accessoryDao;
    }
    public void setAccessoryDao(IAccessoryDao accessoryDao) {
        this.accessoryDao = accessoryDao;
    }


    @Override
    public void generateAppComponentsAndConfig(INcpSession session, String appKey, String userId) throws Exception {
        IFbxZipProcessor fbxZipProcessor = this.getFbxZipProcessor();
        fbxZipProcessor.setDBSession(this.getDBSession());
        fbxZipProcessor.copyComponentsToResourceFolder(session);
        fbxZipProcessor.generateComponentListConfigFile(session);
    }

    @Override
    public boolean checkAppComponentsAndConfig(INcpSession session, String appKey, String userId) throws Exception {
        IFbxZipProcessor fbxZipProcessor = this.getFbxZipProcessor();
        fbxZipProcessor.setDBSession(this.getDBSession());
        return fbxZipProcessor.checkComponentsInResourceFolder(session);
    }
}
