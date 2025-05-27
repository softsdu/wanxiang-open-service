package com.zlp.cms.processor;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;

import org.hibernate.Session;

import com.alibaba.fastjson.JSONArray;
import com.zlp.platform.common.NcpSession; 

public interface IAudioProcessor {

	void setDBSession(Session dbSession);

	JSONArray getAudioList(NcpSession session, String audioName) throws UnsupportedEncodingException, SQLException;

	void importAudio(NcpSession session, String[] ids) throws Exception;

	String getAudioPath(String accessoryId) throws Exception;

	String getAudioPathByName(String name) throws Exception;

}
