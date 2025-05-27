package com.zlp.external.resource.fbxZip.processor;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import com.zlp.external.resource.fbxZip.IFbxZipBaseProcessor;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.NcpSession;
import com.zlp.platform.dao.db.DataRow;

public interface IFbxZipProcessor extends IFbxZipBaseProcessor {

	String getFbxFilePath(String fbxFileName) throws Exception;

	//辅助点文件 added by ls 20230418
	String getAssistFilePath(String assistFileName) throws Exception;

	//根据code获取fbxZip added by ls 20230828
	String getFbxZipFilePathByCode(String code) throws Exception; 

	//根据Id获取fbxZip added by ls 20230828
	String getFbxZipFilePathById(String id) throws Exception;

	String getDefaultFilterType();

	String importFbx(INcpSession session, String[] ids) throws Exception;

	//创建压缩文件 added by ls 20230828
	void zipFbxFile(String zipFilePath, String fbxName, String assistName, String assistFilePath) throws IOException;
	
	//完成导入fbx added by ls 20230828
	void endImportFbx(INcpSession session, String resFbxId, double sizeX, double sizeY, double sizeZ) throws Exception;

    //获取fbx尺寸 added by ls 20230829
	Double[] getFbxSize(String code) throws Exception;

	String getFbxImgFilePathByName(String resFbxName, String imgName) throws Exception;
	String getFbxImgFilePathById(String resFbxId, String imgName) throws Exception;

	String getFbxFilePathByName(String resFbxName, String fbxName) throws Exception;

	String getFbxFilePathById(String resFbxId, String fbxName) throws Exception;

    void copyComponentsToResourceFolder(INcpSession session) throws Exception;

	boolean checkComponentsInResourceFolder(INcpSession session) throws Exception;

	void copyComponentToResourceFolder(INcpSession session, String resId) throws Exception;

	void generateComponentListConfigFile(INcpSession session) throws Exception;

	DataRow getResRow(INcpSession session, String resId);
}
