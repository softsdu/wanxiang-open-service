package com.zlp.mdl.service;

public interface IMdlPublishService {

	String beginPublishFile();

	String generateUnitFile();

	String endPublishFile();

	String getPublishFile();

	String getUnitFile();

	//获取发布设置  added by ls 20220606
	String getPublishSetting();

	//保存发布设置  added by ls 20220606
	String savePublishSetting();

	//导出PIM文件 added by ls 202203
	String exportPim();

	//导出蓝图文件 added by ls 202203
	String exportBlueprint();
}
