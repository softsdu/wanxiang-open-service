package com.zlp.s3d.service;

public interface IS3dComponentService {
	String generateAppComponentsAndConfig();

    String checkAppComponentsAndConfig();

    String removeComponentLocal();
}
