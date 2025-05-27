package com.zlp.external.resource.fbxZip.service;

import com.zlp.external.processor.IResourceFileProcessor;
import com.zlp.external.resource.fbxZip.processor.IFbxZipProcessor;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.dao.sys.ContextUtil;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.sql.SQLException;

public class GetFbx extends HttpServlet{

	protected Session openDBSession() throws SQLException{ 
		HibernateTransactionManager transactionManager = (HibernateTransactionManager)ContextUtil.getBean("transactionManager"); 
		return transactionManager.getSessionFactory().openSession(); 
	}	
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
           
        request.setCharacterEncoding("UTF-8");    
        IFbxZipProcessor resourceFileProcessor = null;
        Session dbSession = null;
        try { 
    		NcpSession session = new NcpSession(request.getCookies(), false); 
    		resourceFileProcessor = (IFbxZipProcessor)ContextUtil.getBean("fbxZipProcessor");
    		dbSession = this.openDBSession();
    		resourceFileProcessor.setDBSession(dbSession);

            String fbxName = this.getParameterValue(request, "fbxName");
			String resFbxName = this.getParameterValue(request, "resFbxName");
			if(resFbxName == null){
				String resFbxId = this.getParameterValue(request, "resFbxId");
				byte[] data = this.getResDataById(resourceFileProcessor, resFbxId, fbxName);
				this.writeResponse(resourceFileProcessor, response, data);
			}
			else {
                byte[] data = this.getResDataByName(resourceFileProcessor, resFbxName, fbxName);
                this.writeResponse(resourceFileProcessor, response, data);
			}
        }
        catch (Exception e) { 
			e.printStackTrace();  
        	throw new IOException(e.getMessage()); 
		}     
		finally{
			if(dbSession != null){ 
				dbSession.close();  
			}
		}   
    } 
    
    private void writeResponse(IResourceFileProcessor resourceFileProcessor, HttpServletResponse response, byte[] data) throws Exception{
        OutputStream out = null;
        try { 
            out = response.getOutputStream();           
            out.write(data);
            out.flush();
        }
        catch (Exception e) { 
			throw e; 
		}   
		finally{ 
			if(out != null){
	            out.close();
			}
		}       
    }

	private byte[] getResDataByName(IFbxZipProcessor resourceFileProcessor, String resFbxName, String imgName) throws Exception{
		FileInputStream fis = null;
		try {
			String imgFilePath = resourceFileProcessor.getFbxFilePathByName(resFbxName, imgName);

			File file = new File(imgFilePath);
			fis = new FileInputStream(file);

			long size = file.length();
			byte[] temp = new byte[(int) size];
			fis.read(temp, 0, (int) size);
			byte[] data = temp;
			return data;
		}
		catch (Exception e) {
			throw e;
		}
		finally{
			if(fis != null){
				fis.close();
			}
		}
	}

	private byte[] getResDataById(IFbxZipProcessor resourceFileProcessor, String resFbxId, String imgName) throws Exception{
		FileInputStream fis = null;
		try {
			String imgFilePath = resourceFileProcessor.getFbxFilePathById(resFbxId, imgName);

			File file = new File(imgFilePath);
			fis = new FileInputStream(file);

			long size = file.length();
			byte[] temp = new byte[(int) size];
			fis.read(temp, 0, (int) size);
			byte[] data = temp;
			return data;
		}
		catch (Exception e) {
			throw e;
		}
		finally{
			if(fis != null){
				fis.close();
			}
		}
	}
    
    private String getParameterValue(HttpServletRequest request, String parameterName) throws UnsupportedEncodingException{
    	String paramValue = "";
    	switch(request.getMethod()){
			case "POST": {
				paramValue = request.getParameter(parameterName);  
				break;
			}
			case "GET":
			default:{
				paramValue = request.getParameter(parameterName);   
				break;
			}
    	} 
    	return paramValue;
    }
 
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {   
        doGet(req, resp);    
    }  
}
