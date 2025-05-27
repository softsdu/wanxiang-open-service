package com.zlp.mdl.expression.run;
 
import com.zlp.platform.dao.sys.IDocumentBaseDao;

public interface IDocumentAccess{
	IDocumentBaseDao getDocumentDao(String documentName);
}
