package com.zlp.s3d.processor;

import java.sql.SQLException;
import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.dao.db.DataRow;
import org.hibernate.Session;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.redis.RedisException;

public interface IS3dSystemProcessor {

	String getSystemImageRelativeFolder();

	String getUserConfigFilePath(String userId, String fileName);

	String getUserImageFolder(String userId) throws SQLException;

	String getSystemImageFolder() throws SQLException;

	String getUserComponentFolder(String userId) throws SQLException;

	void setDBSession(Session dbSession);

	void refreshAppKeysCache(INcpSession session) throws SQLException, RedisException; 

	AppKeyStatus getAppKeyStatus(String checkKey, String checkUrl) throws Exception;

	//生成组件配置json added by ls 20240621
	JSONArray generateComponentConfigJsons(INcpSession session, String appId) throws SQLException;

	//获取材质配置文件
	String getMaterialConfigText(INcpSession session) throws Exception;

	//获取材质配置文件
	void generateMaterialConfigFile(INcpSession session) throws Exception;

	//获取材质配置JSON
	JSONArray getMaterialConfigArray(String userId, List<String> materialCodes) throws Exception;

	//生成组件配置文件
	String generateComponentConfigString(INcpSession session, String userId) throws Exception;

	//生成组件配置文件
	JSONArray generateComponentConfigJArray(INcpSession session, JSONArray componentLocalJArray, JSONArray componentServerJArray) throws Exception;

	JSONObject getComponentServerJson(DataRow row);

	JSONObject getComponentLocalJson(DataRow row);

    DataRow getAppRowByKey(INcpSession ncpSession, String appKey) throws SQLException;

	String getComTypeRootId();

	String getComTypeRootCode();

	DataRow getComTypeRowByCode(String userId, String comTypeCode) throws SQLException;

	List<DataRow> getComponentLocalRows(INcpSession ncpSession, String userId) throws SQLException;

	List<DataRow> getComponentLocalRows(INcpSession ncpSession, JSONArray componentLocalJsons) throws SQLException;

	List<DataRow> getComponentServerRows(INcpSession ncpSession, String userId) throws SQLException;

	List<DataRow> getComponentServerRows(INcpSession ncpSession, JSONArray componentServerJsons) throws SQLException;

	boolean checkAppMaterialConfig(INcpSession session) throws Exception;
}
