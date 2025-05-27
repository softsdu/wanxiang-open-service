package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.s3d.service.S3dModelService;
import org.apache.commons.fileupload.FileItem;
import org.hibernate.Session;

import java.io.IOException;
import java.util.List;

public interface IS3dModelProcessor {

	void setDBSession(Session dbSession);

	JSONObject getMaterialJsons(JSONObject offJson) throws Exception;

	void saveModel(INcpSession session, String modelId, String modelName, String modelText, String imageBase64) throws Exception;

	JSONObject getModel(INcpSession session, String modelId) throws Exception;

	String createModel(INcpSession session, String appName, String modelName, String moduleCode) throws Exception;

	String copyModel(INcpSession session, String appName, String newModelName, String sourceModelId) throws Exception;

	String getModelAccessoryText(INcpSession session, String accessoryId) throws Exception;

	DataRow getModelRow(INcpSession session, String modelId);

	JSONObject getModelInfoJson(INcpSession session, String modelId);

	JSONArray getLastModels(INcpSession session, String appName, int rowCount) throws Exception;
}
