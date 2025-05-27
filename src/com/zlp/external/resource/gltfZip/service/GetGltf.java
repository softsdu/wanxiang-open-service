package com.zlp.external.resource.gltfZip.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zlp.external.resource.gltfZip.processor.IGltfZipProcessor;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.zlp.platform.common.NcpSession;
import com.zlp.platform.dao.sys.ContextUtil; 

public class GetGltf extends HttpServlet{
	
	private static final long serialVersionUID = -3932194619207838777L;

	protected Session openDBSession() throws SQLException{ 
		HibernateTransactionManager transactionManager = (HibernateTransactionManager)ContextUtil.getBean("transactionManager"); 
		return transactionManager.getSessionFactory().openSession(); 
	}	
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
           
        request.setCharacterEncoding("UTF-8");    
        IGltfZipProcessor resourceFileProcessor = null;
        Session dbSession = null;
        try { 
    		NcpSession session = new NcpSession(request.getCookies(), false); 
    		resourceFileProcessor = (IGltfZipProcessor)ContextUtil.getBean("gltfZipProcessor");    
    		dbSession = this.openDBSession();
    		resourceFileProcessor.setDBSession(dbSession); 
            String gltfName = this.getParameterValue(request, "name");
            byte[] data = this.getResData(resourceFileProcessor, gltfName);
            this.writeResponse(resourceFileProcessor, response, data); 
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
    
    private void writeResponse(IGltfZipProcessor resourceFileProcessor, HttpServletResponse response, byte[] data) throws Exception{
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
    
    private byte[] getResData(IGltfZipProcessor resourceFileProcessor, String fileName) throws Exception{
        FileInputStream fis = null;
        try {
	        String accessoryFilePath = resourceFileProcessor.getGltfFilePath(fileName);
	        
	        File file = new File(accessoryFilePath);
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
