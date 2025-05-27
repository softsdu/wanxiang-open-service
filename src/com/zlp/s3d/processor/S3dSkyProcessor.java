package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.FileOperate;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.platform.dao.db.DataTable;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.sys.ContextUtil;
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection;
import org.hibernate.Session;

import java.util.List;

public class S3dSkyProcessor implements IS3dSkyProcessor {

	private IDBParserAccess dBParserAccess;
	public void setDBParserAccess(IDBParserAccess dBParserAccess){ 
		this.dBParserAccess = dBParserAccess;
	}	
	public IDBParserAccess getDBParserAccess(){ 
		return this.dBParserAccess;
	}

	private Session dbSession = null;
	protected Session getDBSession(){ 
		if(this.dbSession == null){
			throw new RuntimeException("none db session.");
		}
		return this.dbSession;
	} 
	public void setDBSession(Session dbSession){
		this.dbSession = dbSession;
	}

	private String s3dResourcesRelativeFolder = "";
	public void setS3dResourcesRelativeFolder(String s3dResourcesRelativeFolder){
		this.s3dResourcesRelativeFolder = s3dResourcesRelativeFolder;
	}
	@Override
	public String getS3dResourcesRelativeFolder(){
		return this.s3dResourcesRelativeFolder;
	}

	private String getConfigFilePath() {
		return ContextUtil.getAbsolutePath() + "/" + this.getS3dResourcesRelativeFolder() + "skyMap.js";
	}

	private List<DataRow> getAllSkyRows(){
		Data data = DataCollection.getData("res_Sky");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDt(this.getDBSession(), data);
		List<DataRow> rows = dt.getRows();
		return rows;
	}

	private DataRow getSkyRowByName(String skyName){
		Data data = DataCollection.getData("res_Sky");
		IDBParserAccess dbAccess = this.getDBParserAccess();
		DataTable dt = dbAccess.getDtByFieldValue(this.getDBSession(), data, "name", "=", skyName);
		List<DataRow> rows = dt.getRows();
		return rows.size() == 0 ? null : rows.get(0);
	}

	private JSONObject getSkyJson(DataRow row){
		String name = row.getStringValue("name");
		String hdrName = row.getStringValue("hdrname");
		String imageName = row.getStringValue("imagename");
		String type = row.getStringValue("skytype");
		JSONObject json = new JSONObject();
		json.put("name", name);
		json.put("hdrName", hdrName);
		json.put("imageName", imageName);
		json.put("type", type);
		return json;
	}

	@Override
	public void generateSkyConfigFile(INcpSession session) throws Exception {
		List<DataRow> rows = this.getAllSkyRows();
		JSONObject skyConfigJson = new JSONObject();
		for(DataRow row : rows){
			JSONObject skyJson = this.getSkyJson(row);
			String name = row.getStringValue("name");
			skyConfigJson.put(name, skyJson);
		}
	    String skyConfigText = "export const skyMap = " + skyConfigJson.toJSONString() + ";";
		String filePath = this.getConfigFilePath();
		FileOperate fo = new FileOperate();
		fo.createFile(filePath, skyConfigText, FileOperate.DefaultEncoding);
	}

	@Override
	public JSONObject getSkyJson(INcpSession session, String skyName) {
		DataRow row = this.getSkyRowByName(skyName);
		return this.getSkyJson(row);
	}

}
