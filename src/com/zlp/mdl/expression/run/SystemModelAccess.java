package com.zlp.mdl.expression.run; 
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection;
import com.zlp.platform.model.sysmodel.DownList;
import com.zlp.platform.model.sysmodel.DownListCollection;
import com.zlp.platform.model.sysmodel.ParamWin;
import com.zlp.platform.model.sysmodel.ParamWinCollection;
import com.zlp.platform.model.sysmodel.Sheet;
import com.zlp.platform.model.sysmodel.SheetCollection;
import com.zlp.platform.model.sysmodel.Tree;
import com.zlp.platform.model.sysmodel.TreeCollection;
import com.zlp.platform.model.sysmodel.View;
import com.zlp.platform.model.sysmodel.ViewCollection;

public class SystemModelAccess implements ISystemModelAccess {
	public Data getData(String name){
		return DataCollection.getData(name);
	}
	public Sheet getSheet(String name){
		return SheetCollection.getSheet(name);
	}
	public View getView(String name){
		return ViewCollection.getView(name);
	}
	public Tree getTree(String name){
		return TreeCollection.getTree(name);
	}
	public DownList getDownList(String name){
		return DownListCollection.getDownList(name);
	}
	public ParamWin getParamWin(String name){
		return ParamWinCollection.getParamWin(name);
	}
}
