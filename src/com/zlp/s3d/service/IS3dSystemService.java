package com.zlp.s3d.service;

public interface IS3dSystemService {

	String refreshAppKeysCache();

    //生成组件配置json added by ls 20240621
    String generateComponentConfigJsons();

    //生成材质配置json
    String generateMaterialConfigFile();

    String checkAppMaterialConfig();
}
