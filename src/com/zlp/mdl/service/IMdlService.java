package com.zlp.mdl.service; 

public interface IMdlService{ 
	String getModelFile();

	String createModel();

	String saveModel();

	String deleteModel();

	String saveAsModel();

	String getComponentFile();

	String getComponentFilesByCode();

	String getComponentFileByKey();

	String getModelFiles(); 

	//废弃的接口 deleted by ls 20230628
	/*
	String getModelComponentTree();

	String getComponentProperties();
	*/
}
