
package com.zlp.mdl.service;

import java.sql.SQLException;
import java.util.HashMap;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.zlp.mdl.processor.IMaterialProcessor;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.NcpActionSupport;
import com.zlp.platform.common.NcpException;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.ServiceResultProcessor;
import com.opensymphony.xwork2.ActionSupport;
   
public class MaterialService extends NcpActionSupport implements IMaterialService {

	private static final long serialVersionUID = -8733772050588653247L;
	
	//事务管理器
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	
	//数据库Session
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	} 
 
	private IMaterialProcessor materialProcessor = null;
	public void setMaterialProcessor(IMaterialProcessor materialProcessor){
		this.materialProcessor = materialProcessor;
	}
	protected IMaterialProcessor getMaterialProcessor(){
		return this.materialProcessor;
	}

	@Override
	public String generateStandardMaterialFile(){ 
		Session dbSession = null;
		try
		{
			dbSession = this.openDBSession();
			IMaterialProcessor materialProcessor = this.getMaterialProcessor();
			materialProcessor.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpCookies(), false);   
			
			materialProcessor.generateStandardMaterialFile(session);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();	 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("generateStandardMaterialFile", "提示: "+ ex.getMessage(), ex);
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
