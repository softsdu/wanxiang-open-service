package com.zlp.mdl.expression.run; 
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DownList;
import com.zlp.platform.model.sysmodel.ParamWin;
import com.zlp.platform.model.sysmodel.Sheet;
import com.zlp.platform.model.sysmodel.Tree;
import com.zlp.platform.model.sysmodel.View;

public interface ISystemModelAccess {
	Data getData(String name);
	Sheet getSheet(String name);
	View getView(String name);
	Tree getTree(String name);
	DownList getDownList(String name);
	ParamWin getParamWin(String name); 
}
