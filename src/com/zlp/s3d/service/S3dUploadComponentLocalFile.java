package com.zlp.s3d.service;

import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.NcpException;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.common.ServiceResultProcessor;
import com.zlp.platform.dao.sys.ContextUtil;
import com.zlp.s3d.processor.IS3dComponentLocalProcessor;
import com.zlp.s3d.processor.IS3dComponentProcessor;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class S3dUploadComponentLocalFile extends HttpServlet {

    public S3dUploadComponentLocalFile() {
    }

    protected Session openDBSession() throws SQLException {
        HibernateTransactionManager transactionManager = (HibernateTransactionManager) ContextUtil.getBean("transactionManager");
        return transactionManager.getSessionFactory().openSession();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        Session dbSession = null;

        try {
            NcpException ncpEx;
            try {
                HashMap<String, Object> resultHash = new HashMap();
                List<String> ids = new ArrayList();
                DiskFileItemFactory fac = new DiskFileItemFactory();
                ServletFileUpload upload = new ServletFileUpload(fac);
                upload.setHeaderEncoding("UTF-8");
                List<FileItem> fileList = upload.parseRequest(request);
                String appKey = request.getParameter("appKey");
                String comTypeCode = request.getParameter("comTypeCode");
                IS3dComponentLocalProcessor componentLocalProcessor = (IS3dComponentLocalProcessor)ContextUtil.getBean("s3dComponentLocalProcessor");
                IS3dComponentProcessor componentProcessor = (IS3dComponentProcessor)ContextUtil.getBean("s3dComponentProcessor");
                dbSession = this.openDBSession();
                componentLocalProcessor.setDBSession(dbSession);
                componentProcessor.setDBSession(dbSession);
                INcpSession session = new NcpSession(request.getCookies(), true);
                JSONObject componentJson = componentLocalProcessor.createComponentLocal(session, fileList, appKey, comTypeCode);
                componentProcessor.generateAppComponentsAndConfig(session, "", session.getUserId());
                resultHash.put("component", componentJson);
                String returnStr = ServiceResultProcessor.createJsonResultStr(resultHash);
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write(returnStr);
            } catch (FileUploadException var23) {
                var23.printStackTrace();
                ncpEx = new NcpException("UploadComponentLocalFile", "上传模型失败", var23);
                response.getWriter().write(ncpEx.toJsonString());
            } catch (Exception var24) {
                var24.printStackTrace();
                ncpEx = new NcpException("UploadComponentLocalFile", "上传模型失败", var24);
                response.getWriter().write(ncpEx.toJsonString());
            }
        } finally {
            if (dbSession != null) {
                dbSession.close();
            }

        }

    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        this.doGet(req, resp);
    }
}
