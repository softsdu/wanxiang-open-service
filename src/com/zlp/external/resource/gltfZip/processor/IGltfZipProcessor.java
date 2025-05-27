package com.zlp.external.resource.gltfZip.processor;

import java.io.IOException;

import com.zlp.external.resource.gltfZip.IGltfZipBaseProcessor;
import com.zlp.platform.common.NcpSession;

public interface IGltfZipProcessor extends IGltfZipBaseProcessor {

	String getGltfFilePath(String gltfFileName) throws Exception;

	String getBinFilePath(String binFileName) throws Exception;

	//辅助点文件 added by ls 20230418
	String getAssistFilePath(String assistFileName) throws Exception;

	//根据code获取gltfZip added by ls 20230828
	String getGltfZipFilePathByCode(String code) throws Exception; 

	//根据Id获取gltfZip added by ls 20230828
	String getGltfZipFilePathById(String id) throws Exception; 

	String importGltf(NcpSession session, String[] ids) throws Exception;

	//创建压缩文件 added by ls 20230828
	void zipGltfFile(String gltfFilePath, String binFilePath, String assistFilePath, String zipFilePath, String gltfName, String binName, String assistName) throws IOException;
	
	//完成导入gltf added by ls 20230828
	void endImportGltf(NcpSession session, String resGltfId, double sizeX, double sizeY, double sizeZ) throws Exception;

    //获取gltf尺寸 added by ls 20230829
	Double[] getGltfSize(String code) throws Exception;
}
