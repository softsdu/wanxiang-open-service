package com.zlp.mdl.service;

import java.io.IOException;
import java.io.OutputStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import com.zlp.mdl.processor.IPictureProcessor;
import com.zlp.platform.dao.sys.ContextUtil;
import com.zlp.platform.dao.sys.IAccessoryDao;

public class GetPicture extends HttpServlet{
	
	private static final long serialVersionUID = -4067074834801029950L;

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {           
        request.setCharacterEncoding("UTF-8");    
        IAccessoryDao accessoryDao = null;
        Session dbSession = null;
        try {
            String imgFileName = this.getParameterValue(request, "img"); 
            double width = Double.parseDouble(this.getParameterValue(request, "w")); 
            double height = Double.parseDouble(this.getParameterValue(request, "h")); 
            double x1 = Double.parseDouble(this.getParameterValue(request, "x1")); 
            double x2 = Double.parseDouble(this.getParameterValue(request, "x2")); 
            double y1 = Double.parseDouble(this.getParameterValue(request, "y1")); 
            double y2 = Double.parseDouble(this.getParameterValue(request, "y2")); 
            
            byte[] data = this.getImageData(imgFileName, width, height, x1, x2, y1, y2);
            this.writeResponse(accessoryDao, response, data);
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
    
    private void writeResponse(IAccessoryDao accessoryDao, HttpServletResponse response, byte[] data) throws Exception{  
        OutputStream out = null;
        try { 
            out = response.getOutputStream();
            response.setContentType("image/jpg"); 
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
    
    private byte[] getImageData(String imgFileName, double width, double height, double x1, double x2, double y1, double y2) throws Exception{ 
        try {        	
    	    IPictureProcessor pictureProcessor = (IPictureProcessor)ContextUtil.getBean("pictureProcessor"); 
    	    byte[] data = pictureProcessor.getImageData(imgFileName, width, height, x1, x2, y1, y2); 
			return data;  
        }
        catch (Exception e) { 
			throw e;
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