package com.zlp.cms.service; 

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
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
 
import com.zlp.cms.processor.VideoProcessor;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.dao.sys.ContextUtil; 

public class GetVideo extends HttpServlet{    
	protected Session openDBSession() throws SQLException{ 
		HibernateTransactionManager transactionManager = (HibernateTransactionManager)ContextUtil.getBean("transactionManager"); 
		return transactionManager.getSessionFactory().openSession(); 
	}	
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  

        request.setCharacterEncoding("UTF-8");    
        VideoProcessor videoProcessor = null;
        Session dbSession = null;
        try { 
    		NcpSession session = new NcpSession(request.getCookies(), false); 
    		videoProcessor = (VideoProcessor)ContextUtil.getBean("cmsVideoProcessor");    
    		dbSession = this.openDBSession();
    		videoProcessor.setDBSession(dbSession);

            String accessoryId = this.getParameterValue(request, "id");  
            
            
            byte[] data = this.getVideoData(videoProcessor, accessoryId);
            
            String range = request.getHeader("range");
			String diskfilename = "v.mp4";
			response.setContentType("video/mp4"); 
			response.setHeader("Content-Disposition", "attachment; filename=\"" + diskfilename + "\"");
			System.out.println("data.length " + data.length);
			response.setContentLength(data.length);
			response.setHeader("Content-Range", range + Integer.valueOf(data.length - 1));
			response.setHeader("Accept-Ranges", "bytes");
			response.setHeader("Etag", "W/\"9767057-1323779115364\"");
			byte[] content = new byte[1024];
			BufferedInputStream is = new BufferedInputStream(new ByteArrayInputStream(data));
			OutputStream os = response.getOutputStream();
			while (is.read(content) != -1) { 
				try{
					os.write(content);
				}
				catch(Exception ex){
					//输出流出错，尚未解决此问题
					throw new Exception("输出流出错，尚未解决此问题", ex.getCause());
				}
			}
			is.close(); 
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
    
    private byte[] getVideoData(VideoProcessor kgProcessor, String accessoryId) throws Exception{
        FileInputStream fis = null;
        try {
	        String videoFilePath = kgProcessor.getVideoPath(accessoryId);
	        
	        File file = new File(videoFilePath);
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
