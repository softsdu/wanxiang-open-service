package com.zlp.cms.service; 

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.zlp.cms.processor.ImageProcessor;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.dao.sys.ContextUtil; 

public class GetImage extends HttpServlet{    
	protected Session openDBSession() throws SQLException{ 
		HibernateTransactionManager transactionManager = (HibernateTransactionManager)ContextUtil.getBean("transactionManager"); 
		return transactionManager.getSessionFactory().openSession(); 
	}	
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
           
        request.setCharacterEncoding("UTF-8");    
        ImageProcessor imgProcessor = null;
        Session dbSession = null;
        try { 
    		NcpSession session = new NcpSession(request.getCookies(), false); 
    		imgProcessor = (ImageProcessor)ContextUtil.getBean("cmsImageProcessor");    
    		dbSession = this.openDBSession();
    		imgProcessor.setDBSession(dbSession);

            String accessoryId = this.getParameterValue(request, "id");   
            if(accessoryId != null){
                byte[] data = this.getImageDataByAccessoryId(imgProcessor, accessoryId);
                this.writeResponse(imgProcessor, response, data);
            }
            else{
                String name = this.getParameterValue(request, "name");   
                byte[] data = this.getImageDataByName(imgProcessor, name);
                this.writeResponse(imgProcessor, response, data);
            }
        }
        catch (Exception e) { 
			e.printStackTrace(); 
            try {
            	byte[] data = this.getImageDataByAccessoryId(imgProcessor, null);
				this.writeResponse(imgProcessor, response, data);
			} 
            catch (Exception e1) {
            	throw new IOException(e.getMessage());
			}
		}     
		finally{
			if(dbSession != null){ 
				dbSession.close();  
			}
		}   
    } 
    
    private void writeResponse(ImageProcessor imgProcessor, HttpServletResponse response, byte[] data) throws Exception{  
        OutputStream out = null;
        try { 
            out = response.getOutputStream();
            response.setContentType("image/png"); 
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
    
    private byte[] getImageDataByName(ImageProcessor kgProcessor, String imageName) throws Exception{
        String imageFilePath = kgProcessor.getImagePathByName(imageName);
    	return this.getImageDataByFilePath(kgProcessor, imageFilePath);
    }
    
    private byte[] getImageDataByAccessoryId(ImageProcessor kgProcessor, String accessoryId) throws Exception{
        String imageFilePath = kgProcessor.getImagePath(accessoryId);
    	return this.getImageDataByFilePath(kgProcessor, imageFilePath);
    }
    
    private byte[] getImageDataByFilePath(ImageProcessor kgProcessor, String imageFilePath) throws Exception{
        FileInputStream fis = null;
        try {
	        
	        File file = new File(imageFilePath);
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
    
    private String getParameterValue(HttpServletRequest request, String parameterName){
    	switch(request.getMethod()){
		case "POST": 
	    	return request.getParameter(parameterName);  
		case "GET":
		default:
	    	return request.getParameter(parameterName);   
    	}
    }
 
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {   
        doGet(req, resp);    
    }  
}
