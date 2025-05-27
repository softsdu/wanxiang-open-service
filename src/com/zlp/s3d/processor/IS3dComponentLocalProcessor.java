package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.INcpSession;
import org.apache.commons.fileupload.FileItem;
import org.hibernate.Session;

import java.util.List;

public interface IS3dComponentLocalProcessor {

	void setDBSession(Session dbSession);

	JSONObject createComponentLocal(INcpSession session, List<FileItem> fileList, String appKey, String comTypeCode) throws Exception;

	JSONObject createComponentLocal(INcpSession session, String resId, String fileInfoType, String comTypeId) throws Exception;

	void removeComponentLocal(INcpSession session, String appKey, String componentCode, String versionNum) throws Exception;
}
