package com.zlp.cms.processor;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;

import org.hibernate.Session;

import com.alibaba.fastjson.JSONArray;
import com.zlp.platform.common.NcpSession; 

public interface IVideoProcessor {

	void setDBSession(Session dbSession);

	void importVideo(NcpSession session, String[] ids) throws Exception;

	JSONArray getVideoList(NcpSession session, String videoName) throws UnsupportedEncodingException, SQLException;

}
