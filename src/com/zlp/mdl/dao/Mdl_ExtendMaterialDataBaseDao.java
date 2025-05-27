package com.zlp.mdl.dao;

import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.HttpGetRequest;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.common.util.CommonFunction;
import com.zlp.platform.constants.ZlpState;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.platform.dao.db.DataTable;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.db.SelectSqlParser;
import com.zlp.platform.dao.sys.DataBaseDao;
import com.zlp.platform.model.sysmodel.Data;
import com.zlp.platform.model.sysmodel.DataCollection;

import java.util.HashMap;

/**
 * 部品库增加数据权限过滤 created by liyh 20220406
 * sharetype：全体-公共可见/公司-本公司可见/个人；
 * @author yuay
 *
 */
public class Mdl_ExtendMaterialDataBaseDao extends DataBaseDao {
	
	private IDBParserAccess dBParserAccess;

	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}

	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	}

	//查询修改为接口查询 构造返回类型
	@Override
	protected HashMap<String, Object> selectCore(INcpSession session, JSONObject requestObj) throws Exception {
//		super.selectCore(session, requestObj)
//		System.out.println(requestObj.toString());
		HashMap<String, Object> res=new HashMap<>();
		//接口url修改为配置文件
		String integrate_mdm_base_url = com.zlp.platform.core.ConfigContext.getConfigMap().get(ZlpState.INTEGRATE_MDM_BASE_URL)==null?"":com.zlp.platform.core.ConfigContext.getConfigMap().get(ZlpState.INTEGRATE_MDM_BASE_URL);
		String url=integrate_mdm_base_url+"/getextendmaterial";
		String param="pageNo="+requestObj.getIntValue("currentPage")+"&pageSize="+requestObj.getIntValue("pageSize")+"&names=";
		for (Object where : requestObj.getJSONArray("where")) {
			JSONObject wh=(JSONObject)where;
			if(wh.containsKey("field")){
				if("name".equals(wh.getString("field"))){
					for (Object value : wh.getJSONArray("value")) {
						JSONObject va=(JSONObject)value;
						if("m_900".equals(va.getString("field"))){
							String valu=va.getString("value");
							param+=CommonFunction.encode(valu.replace("%",""));;
						}
					}

				}
			}
		}
		String s = HttpGetRequest.doGet(url, param);
//		System.out.println(s);
		//{"code":"0","action":"/getextendmaterial","msg":"succeed","data":{"totalRecords":9651,"data":[{"sGoodsMid":"90-16.36.01.01:400(Ф19)"。。。。}],"offset":0,"pageNo":1,"totalPages":483,"pageSize":20}}
		JSONObject apiRes = JSONObject.parseObject(s);
		String code=apiRes.getString("code");
		Integer totalRecords=0;
		DataTable dt = new DataTable();
		Data mdl_extendmaterial = DataCollection.getData("mdl_extendmaterial");
		SelectSqlParser dsSqlParser = mdl_extendmaterial.getDsSqlParser();
		for (String f : dsSqlParser.getSelectAlias()) {
			dt.setField(f, dsSqlParser.getFieldTypeMaps().get(f));
		}
		if("0".equals(code)){
			JSONObject data = apiRes.getJSONObject("data");
			totalRecords=data.getIntValue("totalRecords");
			for (Object oneObj : data.getJSONArray("data")) {
				JSONObject one=(JSONObject)oneObj;
				DataRow row = new DataRow();
				for (String fieldName : dsSqlParser.getSelectAlias()) {
					String key=fieldName;
					if(key.startsWith("_")) key=key.substring(1);
					Object v=null;
					if(one.containsKey(key)){
						v=one.get(key);
						if("enablestate".equals(fieldName)){
							if("1".equals(v.toString())){
								v="启用";
							}else if("0".equals(v.toString())){
								v="停用";
							}
						}else if("modifyid".equals(fieldName)){
							if("1".equals(v.toString())){
								v="变更";
							}else if("0".equals(v.toString())){
								v="未变更";
							}
						}
					}
					row.setValue(fieldName,v );
				}
				dt.addRow(row);
			}
		}

		res.put("rowCount",totalRecords);
		res.put("table",dt.toHashMap());
		return res;
	}



}
