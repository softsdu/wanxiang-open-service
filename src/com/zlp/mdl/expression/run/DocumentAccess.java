package com.zlp.mdl.expression.run;
 
import com.zlp.platform.dao.sys.ContextUtil;
import com.zlp.platform.dao.sys.IDocumentBaseDao;

public class DocumentAccess implements IDocumentAccess {
	public IDocumentBaseDao getDocumentDao(String sheetName){
		IDocumentBaseDao documentDao = ContextUtil.containsBean(sheetName) ? (IDocumentBaseDao)ContextUtil.getBean(sheetName) :  (IDocumentBaseDao)ContextUtil.getBean("documentBaseDao");		 
		return documentDao;
	}
}
