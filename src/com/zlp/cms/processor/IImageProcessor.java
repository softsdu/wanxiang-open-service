package com.zlp.cms.processor;

import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.NcpSession;
import org.hibernate.Session;

public interface IImageProcessor {

	void setDBSession(Session dbSession);

    void importImage(INcpSession session, String[] ids) throws Exception;

    String getImagePathByName(String imageName) throws Exception;

}
