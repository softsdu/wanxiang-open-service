package com.zlp.s3d.service;

public interface IS3dModelService {

	String getCategoryTree();

	String queryComponents();

	String getComponentFileByCode();

	String getComponentFilesByCodes();

    String createModel();

    String copyModel();

    String saveModel();

    String getModel();

    String getLastModels();

    String getMaterialConfigText();
}
