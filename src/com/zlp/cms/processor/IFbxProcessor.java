package com.zlp.cms.processor;

import com.alibaba.fastjson.JSONArray;
import com.zlp.platform.common.NcpSession;
import org.hibernate.Session;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;

public interface IFbxProcessor {

	void setDBSession(Session dbSession);

	void importFbx(NcpSession session, String[] ids) throws Exception;

	String getFbxPathByName(String fbxName) throws Exception;

	JSONArray getFbxList(NcpSession session, String fbxName) throws UnsupportedEncodingException, SQLException;
}
