package com.zlp.cms.page;
 
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.sys.DataBaseDao; 

public class Cms_TextImageImpl extends DataBaseDao {
	 
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}   
}
