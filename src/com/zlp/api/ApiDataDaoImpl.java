package com.zlp.api;

import com.zlp.api.Constant;
import com.zlp.platform.common.SysConfig;
import com.zlp.platform.dao.db.*;
import com.zlp.platform.workflow.definition.OperateType;
import com.nova.frame.utils.StringUtils;
import org.hibernate.Session;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ApiDataDaoImpl {

    //通用数据操作
    private IDBParserAccess dBParserAccess;

    public void setDBParserAccess(IDBParserAccess dBParserAccess) {
        this.dBParserAccess = dBParserAccess;
    }

    private IDBParserAccess getDBParserAccess() {
        return this.dBParserAccess;
    }

    //apiKey 校验
    public ApiEntity check(Session dbSession, String apiKey, String apiname) throws Exception{
        ApiEntity apiEntity = new ApiEntity();
        //apiKey 判断存在
        DataTable byApiKey = getByApiKey(dbSession, apiKey);
        String id = byApiKey.getRows().get(0).getStringValue("id");
        String org_xid = byApiKey.getRows().get(0).getStringValue("org_xid");
        //判断接口 apiname
        DataTable nameByParentId = getNameByParentId(dbSession, id, apiname);

        apiEntity.setApikey(apiKey);
        apiEntity.setOrg_xid(org_xid);
        return apiEntity;
    }
    private DataTable getByApiKey(Session dbSession, String apiKey) throws Exception{
        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        String sql="SELECT t.id as id ,t.keycode as keycode,t.isactive as isactive,t.org_xid as org_xid FROM bsp_api_key t ";
        String where=" where t.keycode ="+ SysConfig.getParamPrefix()+"keycode ";

        p2vs.put("keycode",apiKey);

        alias.add("id");
        alias.add("keycode");
        alias.add("isactive");
        alias.add("org_xid");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("keycode", ValueType.String);
        fieldTypes.put("isactive", ValueType.String);
        fieldTypes.put("org_xid", ValueType.String);

        DataTable dataTable=null;
        try {
            dataTable = this.getDBParserAccess().selectList(dbSession, sql + where, p2vs, alias, fieldTypes);
        }catch (Exception ex){
            throw ApiR.error("查询ApiKey出错!");
        }
        if (dataTable.getRows().size()<1) {
            throw ApiR.error("001", Constant.CODE_001);
        }
        if ("N".equals(dataTable.getRows().get(0).getStringValue("isactive"))) {
            throw ApiR.error("002", Constant.CODE_002);
        }
        if (StringUtils.isNullOrEmpty(dataTable.getRows().get(0).getStringValue("org_xid"))) {
            throw ApiR.error("003", Constant.CODE_003);
        }

        return  dataTable;
    }
    private DataTable getNameByParentId(Session dbSession, String parentid, String apiname) throws Exception{
        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        String sql="SELECT t.id as id ,t.apiname as apiname,t.isactive as isactive ,t.parent_id as parent_id FROM bsp_api_key_name t ";
        String where=" where t.parent_id ="+ SysConfig.getParamPrefix()+"parent_id and t.apiname="+SysConfig.getParamPrefix()+"apiname";

        p2vs.put("parent_id",parentid);
        p2vs.put("apiname",apiname);

        alias.add("id");
        alias.add("apiname");
        alias.add("isactive");
        alias.add("parent_id");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("apiname", ValueType.String);
        fieldTypes.put("isactive", ValueType.String);
        fieldTypes.put("parent_id", ValueType.String);

        DataTable dataTable=null;
        try {
            dataTable = this.getDBParserAccess().selectList(dbSession, sql + where, p2vs, alias, fieldTypes);
        }catch (Exception ex){
            throw ApiR.error("查询ApiKeyName出错!");
        }
        if (dataTable.getRows().size()<1) {
            throw ApiR.error("005", Constant.CODE_005);
        }
        if ("N".equals(dataTable.getRows().get(0).getStringValue("isactive"))) {
            throw ApiR.error("006", Constant.CODE_006);
        }

        return  dataTable;
    }
    //apiKey 校验结束

    //通用查询表 别名 t
    private  static final String inWhere=" t.createtime>="+ SysConfig.getParamPrefix()+"timeStr and t.createtime<"+SysConfig.getParamPrefix()+"greatMonth";
    private  static final String upWhere=" t.modifytime>="+ SysConfig.getParamPrefix()+"timeStr and t.modifytime<"+SysConfig.getParamPrefix()+"greatMonth";
    private  static final String wfUpWhere=" inst.lastoperatetime>="+ SysConfig.getParamPrefix()+"timeStr and inst.lastoperatetime<"+SysConfig.getParamPrefix()+"greatMonth";
    //通用关联workflow  和 关联后的upWhere
    private  String getWfInWhere(String docTypeName,String org_xid){
        return " LEFT OUTER JOIN wf_instance inst ON t.id = inst.docdataid  LEFT outer join wf_doctype doc on inst.doctypeid=doc.id  WHERE inst.isdeleted = 'N' and doc.name='"+docTypeName+"' and t.org_xid='"+org_xid+"' and "+inWhere;
    }
    private  String getWfUpWhere(String docTypeId,String org_xid){
        return " LEFT OUTER JOIN wf_instance inst ON t.id = inst.docdataid AND inst.doctypeid = '"+docTypeId+"' WHERE inst.isdeleted = 'N' and t.org_xid='"+org_xid+"' and "+wfUpWhere;
    }
    //获取日志
    private  DataTable getLogTable(IDBParserAccess dBParserAccess, Session dbSession, String instanceid) throws SQLException {
        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        String sql=" SELECT instlog.id AS id, instlog.userid AS userid, u.NAME AS username, instlog.note AS note,date_format(instlog.processtime, '%Y-%m-%d %T') AS processtime, node.NAME AS nodename, instlog.operatetype AS operatetype FROM wf_instancelog instlog LEFT OUTER JOIN d_user u ON u.id = instlog.userid LEFT OUTER JOIN wf_node node ON node.id = instlog.nodeid " +
                " WHERE  instlog.instanceid ="+SysConfig.getParamPrefix()+"instanceid ORDER BY instlog.processtime DESC  ";

        p2vs.put("instanceid",instanceid);

        alias.add("id");
        alias.add("userid");
        alias.add("username");
        alias.add("note");
        alias.add("processtime");
        alias.add("nodename");
        alias.add("operatetype");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("userid", ValueType.String);
        fieldTypes.put("username", ValueType.String);
        fieldTypes.put("note", ValueType.String);
        fieldTypes.put("processtime", ValueType.String);
        fieldTypes.put("nodename", ValueType.String);
        fieldTypes.put("operatetype", ValueType.String);

        DataTable logTable = dBParserAccess.selectList(dbSession,sql,p2vs,alias, fieldTypes);

        for(int a=0;a<logTable.getRows().size();a++){
           String operateName="";
            OperateType operateType = Enum.valueOf(OperateType.class, logTable.getRows().get(a).getStringValue("operatetype"));

            switch(operateType){
                case drive:{
                    operateName = "审批";
                }
                break;
                case sendBack:{
                    operateName = "退回";
                }
                break;
                case getBack:{
                    operateName = "取回";
                }
                break;
                case submit:{
                    operateName = "提交";
                }
                break;
                case delete:{
                    operateName = "删除";
                }
                break;
                case autoDrive:{
                    operateName = "自动处理";
                }
                break;
            }
            logTable.getRows().get(a).setValue("operatetype", operateName);
        }
        return logTable;
    }

    private  DataTable getLogTable(DataTable dataTable,IDBParserAccess dBParserAccess, Session dbSession) throws SQLException {
        if(dataTable.getRows().size()>0){
            for(int i=0;i<dataTable.getRows().size();i++){
                DataRow dataRow = dataTable.getRows().get(i);
                String instanceid = dataRow.getStringValue("instanceid");
                DataTable logTable = getLogTable(dBParserAccess, dbSession, instanceid);
                dataTable.getRows().get(i).setValue("checkinfo",logTable);
            }
        }
        return dataTable;
    }

    //字典接口开始
    public HashMap<String,Object> getProjectList(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr) throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        String sql=" SELECT t.id as id,t.code as code ,t.name as name,t.isdeleted as isdeleted,date_format(t.createtime,'%Y-%m-%d %T') as createtime,date_format(t.modifytime,'%Y-%m-%d %T') as modifytime from bsp_project t ";
        //String sql=" SELECT t.id as id,t.code as code ,t.name as name,t.isdeleted as isdeleted,date_format(t.createtime,'%Y-%m-%d %T') as createtime,modifytime as modifytime from bsp_project t ";
        String where=" where "+inWhere;

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("code");
        alias.add("name");
        alias.add("isdeleted");
        alias.add("createtime");
        alias.add("modifytime");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("code", ValueType.String);
        fieldTypes.put("name", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);

        DataTable inList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        resultHash.put("inList",inList);

        where=" where "+upWhere;

//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable upList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        resultHash.put("upList",upList);

        return resultHash;
    }

    public HashMap<String,Object> getSupplierList(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr) throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        String sql="SELECT t.id AS id, t.company_code AS code, t.company_name AS name, '0' as supplierclass,t.isdeleted as isdeleted, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime FROM bsp_company t ";

        String where=" WHERE t.org_xid='"+ap.getOrg_xid()+"' and t.is_gys='Y'  " ;
        where+=" and "+inWhere;

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("code");
        alias.add("name");
        alias.add("supplierclass");
        alias.add("isdeleted");
        alias.add("createtime");
        alias.add("modifytime");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("code", ValueType.String);
        fieldTypes.put("name", ValueType.String);
        fieldTypes.put("supplierclass", ValueType.Decimal);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);

        DataTable inList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        resultHash.put("inList",inList);

        where=" where t.org_xid='"+ap.getOrg_xid()+"' and t.is_gys='Y' ";
        where+=" and "+upWhere;
//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable upList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        resultHash.put("upList",upList);

        return resultHash;
    }

    public HashMap<String, Object> getCustomerList(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr) throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        String sql="SELECT t.id AS id, t.company_code AS code, t.company_name AS name, '0' as customerclass,t.isdeleted as isdeleted, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime FROM bsp_company t ";
        String where=" WHERE t.org_xid='"+ap.getOrg_xid()+"' and t.is_kh='Y' ";
        where+=" and "+inWhere;

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("code");
        alias.add("name");
        alias.add("customerclass");
        alias.add("isdeleted");
        alias.add("createtime");
        alias.add("modifytime");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("code", ValueType.String);
        fieldTypes.put("name", ValueType.String);
        fieldTypes.put("customerclass", ValueType.Decimal);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);

        DataTable inList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        resultHash.put("inList",inList);

        where=" where t.org_xid='"+ap.getOrg_xid()+"' ";
        where+=" and "+ upWhere;

//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable upList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        resultHash.put("upList",upList);

        return resultHash;
    }

    public HashMap<String, Object> getMaterialList(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr) throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        String sqlA=" SELECT t.id AS id, t.CODE AS code, t.NAME AS name, un.name AS unit_code, un.name AS unit, '1' AS taxam, t.spec AS spec, type.name AS mc_type, '01' AS type_code, t.isdeleted AS isdeleted, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime FROM bsp_material t LEFT JOIN bsp_material_type_org type ON type.id = t.type_xid LEFT JOIN bsp_material_type gb ON type.gb_type_xid = gb.id LEFT JOIN sys_inputhelpline un ON gb.unit_xid = un.id ";
        String whereA=" where  t.createtime>='"+beginTimeStr+"' and t.createtime<'"+endTimeStr+"'";

        String sqlB=" SELECT t.id AS id, t.CODE AS code, t.NAME AS name, un.name AS unit_code, un.description AS unit, '1' AS taxam, t.spec AS spec, ty.name AS mc_type,'02' as type_code, t.isdeleted AS isdeleted, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime FROM bsp_comproduct_org t LEFT JOIN bsp_comptype_org ty on t.comptype_org_xid=ty.id LEFT JOIN sys_inputhelpline un on un.id=ty.unit_xid   ";
        String whereB=" where t.createtime>='"+beginTimeStr+"' and t.createtime<'"+endTimeStr+"'";

        String sql=sqlA+whereA +" union ( "+ sqlB + whereB +" )";


       // p2vs.put("timeStr",beginTimeStr);
       // p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("code");
        alias.add("name");
        alias.add("unit_code");
        alias.add("unit");
        alias.add("taxam");
        alias.add("spec");
        alias.add("mc_type");
        alias.add("type_code");
        alias.add("isdeleted");
        alias.add("createtime");
        alias.add("modifytime");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("code", ValueType.String);
        fieldTypes.put("name", ValueType.String);
        fieldTypes.put("unit_code", ValueType.String);
        fieldTypes.put("unit", ValueType.String);
        fieldTypes.put("taxam", ValueType.Decimal);
        fieldTypes.put("spec", ValueType.String);
        fieldTypes.put("mc_type", ValueType.String);
        fieldTypes.put("type_code", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);

        DataTable inList = this.getDBParserAccess().selectList(dbSession,sql,p2vs,alias, fieldTypes);
        resultHash.put("inList",inList);

         whereA=" where  t.modifytime>='"+ beginTimeStr+"' and t.modifytime<'"+endTimeStr+"'";
         whereB=" where  t.modifytime>='"+ beginTimeStr+"' and t.modifytime<'"+endTimeStr+"'";
         sql=sqlA+whereA +" union ( "+ sqlB + whereB +" )";
//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable upList = this.getDBParserAccess().selectList(dbSession,sql,p2vs,alias, fieldTypes);
        resultHash.put("upList",upList);

        return resultHash;
    }

    //业务接口开始
    // 采购计划
    public HashMap<String,Object> getPurchasePlans(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr) throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        //获取主表 主表 insert update
        String sql=" SELECT t.id AS id, t.plan_no AS plan_no,date_format(t.plan_date, '%Y-%m-%d') AS plan_date, t.project_xid AS project_xid, project.NAME AS project , date_format(t.createtime, '%Y-%m-%d %T') AS createtime , date_format(t.modifytime, '%Y-%m-%d %T') AS modifytime , t.isdeleted AS isdeleted ,t.createuser_xid as createuser_xid,u.name as createuser,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend FROM bsp_material_total_plan t LEFT JOIN bsp_project project ON project.id = t.project_xid LEFT JOIN d_user u on u.id=t.createuser_xid ";
        String where= getWfInWhere(Constant.WF_bsp_material_total_plan,ap.getOrg_xid());
        //String where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("plan_no");
        alias.add("plan_date");
        alias.add("project_xid");
        alias.add("project");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");
        alias.add("createuser_xid");
        alias.add("createuser");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("plan_no", ValueType.String);
        fieldTypes.put("plan_date", ValueType.String);
        fieldTypes.put("project_xid", ValueType.String);
        fieldTypes.put("project", ValueType.String);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createuser_xid", ValueType.String);
        fieldTypes.put("createuser", ValueType.String);


        alias.add("instanceid");
        fieldTypes.put("instanceid", ValueType.String);
        alias.add("currentstatus");
        fieldTypes.put("currentstatus", ValueType.String);
        alias.add("isbegin");
        fieldTypes.put("isbegin", ValueType.String);
        alias.add("isend");
        fieldTypes.put("isend", ValueType.String);
        alias.add("checkinfo");
        fieldTypes.put("checkinfo", ValueType.Object);

        HashMap<String,Object> mainTable=new HashMap<>();
        DataTable mInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mInList = getLogTable(mInList, this.getDBParserAccess(), dbSession);

        mainTable.put("inList",mInList);

        where= getWfUpWhere(Constant.WF_bsp_material_total_plan,ap.getOrg_xid());
        //where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;

//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable mUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mUpList = getLogTable(mUpList, this.getDBParserAccess(), dbSession);

        mainTable.put("upList",mUpList);

        resultHash.put("mainTable",mainTable);

        //获取子表 子表
         p2vs.clear();alias.clear();fieldTypes.clear();
         sql=" SELECT t.id AS id, t.parent_id AS parent_id, t.mc_xid AS mc_xid, mc.NAME AS mc_name, mc.code as mc_code, mo.NAME AS mc_type,mc.spec AS mc_spec, un.name as mc_unit_code, un.description AS mc_unit, t.amount AS amount, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted FROM bsp_material_total_plan_detail t LEFT JOIN bsp_material_total_plan pa ON t.parent_id = pa.id LEFT JOIN bsp_material mc ON mc.id = t.mc_xid LEFT JOIN bsp_material_type_org mo ON mo.id = mc.type_xid LEFT JOIN bsp_material_type gb ON mo.gb_type_xid = gb.id LEFT JOIN sys_inputhelpline un ON gb.unit_xid = un.id ";
         where=" where pa.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;


        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("parent_id");
        alias.add("mc_xid");
        alias.add("mc_name");
        alias.add("mc_code");
        alias.add("mc_type");
        alias.add("mc_spec");
        alias.add("mc_unit_code");
        alias.add("mc_unit");
        alias.add("amount");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("parent_id", ValueType.String);
        fieldTypes.put("mc_xid", ValueType.String);
        fieldTypes.put("mc_name", ValueType.String);
        fieldTypes.put("mc_code", ValueType.String);
        fieldTypes.put("mc_type", ValueType.String);
        fieldTypes.put("mc_spec", ValueType.String);
        fieldTypes.put("mc_unit_code", ValueType.String);
        fieldTypes.put("mc_unit", ValueType.String);
        fieldTypes.put("amount", ValueType.Decimal);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);

        HashMap<String,Object> subATable=new HashMap<>();
        DataTable subAInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("inList",subAInList);

        where=" where pa.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;

//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable subAUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("upList",subAUpList);

        resultHash.put("subATable",subATable);

        return resultHash;

    }
    //采购订单
    public HashMap<String,Object> getBuyContracts(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr) throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        //获取主表
        //String sql=" SELECT t.id AS id, t.contract_no AS contract_no, t.contract_name AS contract_name, date_format( t.contract_start_date, '%Y-%m-%d' ) AS contract_start_date, date_format( t.contract_end_date, '%Y-%m-%d' ) AS contract_end_date, t.party_b_xid AS supplier_xid, partyb.company_name AS supplier_name, date_format( t.sign_date, '%Y-%m-%d' ) AS sign_date, tax.description AS taxdesc, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted,t.createuser_xid as createuser_xid,u.name as createuser,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend   FROM bsp_material_buy_contract_register t LEFT JOIN sys_inputhelpline tax ON tax.id = t.tax_xid LEFT JOIN bsp_company partyb ON partyb.id = t.party_b_xid LEFT JOIN d_user u on u.id=t.createuser_xid ";
        String sql=" SELECT t.id AS id, t.contract_no AS contract_no, t.contract_name AS contract_name, t.party_b_xid AS supplier_xid, partyb.company_name AS supplier_name, date_format( t.sign_date, '%Y-%m-%d' ) AS sign_date, tax.field1 AS taxdesc, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted,t.createuser_xid as createuser_xid,u.name as createuser,u.department_xid as department_xid,part.name as department,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend   FROM bsp_material_buy_contract_register t LEFT JOIN sys_inputhelpline tax ON tax.id = t.tax_xid LEFT JOIN bsp_company partyb ON partyb.id = t.party_b_xid LEFT JOIN d_user u on u.id=t.createuser_xid  LEFT JOIN d_department part on part.id=u.department_xid";
        String where= getWfInWhere(Constant.WF_bsp_material_buy_contract_register,ap.getOrg_xid());

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("contract_no");
        alias.add("contract_name");
//        alias.add("contract_start_date");
//        alias.add("contract_end_date");
        alias.add("supper_xid");
        alias.add("supplier_name");
        alias.add("sign_date");
        alias.add("taxdesc");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");
        alias.add("createuser_xid");
        alias.add("createuser");
        alias.add("department_xid");
        alias.add("department");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("contract_no", ValueType.String);
        fieldTypes.put("contract_name", ValueType.String);
//        fieldTypes.put("contract_start_date", ValueType.String);
//        fieldTypes.put("contract_end_date", ValueType.String);
        fieldTypes.put("supper_xid", ValueType.String);
        fieldTypes.put("supplier_name", ValueType.String);
        fieldTypes.put("sign_date", ValueType.String);
        fieldTypes.put("taxdesc", ValueType.Decimal);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createuser_xid", ValueType.String);
        fieldTypes.put("createuser", ValueType.String);
        fieldTypes.put("department_xid", ValueType.String);
        fieldTypes.put("department", ValueType.String);

        alias.add("instanceid");
        fieldTypes.put("instanceid", ValueType.String);
        alias.add("currentstatus");
        fieldTypes.put("currentstatus", ValueType.String);
        alias.add("isbegin");
        fieldTypes.put("isbegin", ValueType.String);
        alias.add("isend");
        fieldTypes.put("isend", ValueType.String);
        alias.add("checkinfo");
        fieldTypes.put("checkinfo", ValueType.Object);

        HashMap<String,Object> mainTable=new HashMap<>();
        DataTable mInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mInList = getLogTable(mInList, this.getDBParserAccess(), dbSession);
        mainTable.put("inList",mInList);

       // where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;
        where= getWfUpWhere(Constant.WF_bsp_material_buy_contract_register,ap.getOrg_xid());
//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable mUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mUpList = getLogTable(mUpList, this.getDBParserAccess(), dbSession);
        mainTable.put("upList",mUpList);

        resultHash.put("mainTable",mainTable);

        //获取子表 子表A
        p2vs.clear();alias.clear();fieldTypes.clear();
        sql=" SELECT t.id AS id, t.parent_id AS parent_id, t.mc_xid AS mc_xid, mc.NAME AS mc_name,mc.code as mc_code, mo.NAME AS mc_type,mc.spec AS mc_spec,  un.name as mc_unit_code,un.description AS mc_unit,  t.act_num AS act_num, t.act_price AS act_price, ta.field1 AS taxdesc, round( act_price /( 1 + ta.field1 ), 8 ) AS tax_price, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted FROM bsp_material_buy_detail t LEFT JOIN bsp_material_buy_contract_register pa ON pa.id = t.parent_id LEFT JOIN sys_inputhelpline ta ON pa.tax_xid = ta.id LEFT JOIN bsp_material mc ON mc.id = t.mc_xid LEFT JOIN bsp_material_type_org mo ON mo.id = mc.type_xid LEFT JOIN bsp_material_type gb ON mo.gb_type_xid = gb.id LEFT JOIN sys_inputhelpline un ON gb.unit_xid = un.id  ";
        where=" where pa.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("parent_id");
        alias.add("mc_xid");
        alias.add("mc_name");
        alias.add("mc_code");
        alias.add("mc_type");
        alias.add("mc_spec");
        alias.add("mc_unit_code");
        alias.add("mc_unit");
        alias.add("act_num");
        alias.add("act_price");
        alias.add("taxdesc");
        alias.add("tax_price");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("parent_id", ValueType.String);
        fieldTypes.put("mc_xid", ValueType.String);
        fieldTypes.put("mc_name", ValueType.String);
        fieldTypes.put("mc_code", ValueType.String);
        fieldTypes.put("mc_type", ValueType.String);
        fieldTypes.put("mc_spec", ValueType.String);
        fieldTypes.put("mc_unit_code", ValueType.String);
        fieldTypes.put("mc_unit", ValueType.String);
        fieldTypes.put("act_num", ValueType.Decimal);
        fieldTypes.put("act_price", ValueType.Decimal);
        fieldTypes.put("taxdesc", ValueType.Decimal);
        fieldTypes.put("tax_price", ValueType.Decimal);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);

        HashMap<String,Object> subATable=new HashMap<>();
        DataTable subAInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("inList",subAInList);

        where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;

//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable subAUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("upList",subAUpList);

        resultHash.put("subATable",subATable);

        //获取子表 子表B
        p2vs.clear();alias.clear();fieldTypes.clear();
        sql=" SELECT t.id AS id, t.parent_id AS parent_id, t.amount_name AS amount_name, t.amount_unit AS amount_unit, t.price AS price, t.num AS num, t.amount AS amount, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted FROM bsp_material_buy_other t LEFT JOIN bsp_material_buy_contract_register pa ON pa.id = t.parent_id ";
        where=" where pa.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("parent_id");
        alias.add("amount_name");
        alias.add("amount_unit");
        alias.add("price");
        alias.add("num");
        alias.add("amount");

        alias.add("isdeleted");
        alias.add("createtime");
        alias.add("modifytime");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("parent_id", ValueType.String);
        fieldTypes.put("amount_name", ValueType.String);
        fieldTypes.put("amount_unit", ValueType.String);
        fieldTypes.put("price", ValueType.Decimal);
        fieldTypes.put("num", ValueType.Decimal);
        fieldTypes.put("amount", ValueType.Decimal);

        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);

        HashMap<String,Object> subBTable=new HashMap<>();
        DataTable subBInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subBTable.put("inList",subBInList);

        where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;

//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable subBUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subBTable.put("upList",subBUpList);

        resultHash.put("subBTable",subBTable);

        return resultHash;
    }
    //材料入库
    public HashMap<String,Object> getMaterialInStore(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr) throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        //获取主表 主表 insert update
        String sql=" SELECT t.id AS id, t.billcode AS billcode, date_format( t.in_date, '%Y-%m-%d' ) AS in_date, t.gys_xid AS supplier_xid, gys.company_name AS supplier_name, tax.description AS taxdesc,buycont.contract_no as contract_no, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted,t.createuser_xid as createuser_xid,u.name as createuser,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend  FROM bsp_material_in_store t LEFT JOIN bsp_warehouse house ON house.id = t.warehouse_xid LEFT JOIN bsp_company gys ON gys.id = t.gys_xid LEFT JOIN bsp_material_buy_contract_register buycont ON buycont.id = t.buy_contract_xid LEFT JOIN sys_inputhelpline tax ON buycont.tax_xid = tax.id LEFT JOIN d_user u on u.id=t.createuser_xid ";
        //String where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;
        String where= getWfInWhere(Constant.WF_bsp_material_in_store,ap.getOrg_xid());

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("billcode");
        alias.add("in_date");
        alias.add("supplier_xid");
        alias.add("supplier_name");
        alias.add("taxdesc");
        alias.add("contract_no");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");
        alias.add("createuser_xid");
        alias.add("createuser");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("billcode", ValueType.String);
        fieldTypes.put("in_date", ValueType.String);
        fieldTypes.put("supplier_xid", ValueType.String);
        fieldTypes.put("supplier_name", ValueType.String);
        fieldTypes.put("taxdesc", ValueType.Decimal);
        fieldTypes.put("contract_no", ValueType.String);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createuser_xid", ValueType.String);
        fieldTypes.put("createuser", ValueType.String);

        alias.add("instanceid");
        fieldTypes.put("instanceid", ValueType.String);
        alias.add("currentstatus");
        fieldTypes.put("currentstatus", ValueType.String);
        alias.add("isbegin");
        fieldTypes.put("isbegin", ValueType.String);
        alias.add("isend");
        fieldTypes.put("isend", ValueType.String);
        alias.add("checkinfo");
        fieldTypes.put("checkinfo", ValueType.Object);

        HashMap<String,Object> mainTable=new HashMap<>();
        DataTable mInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mInList = getLogTable(mInList, this.getDBParserAccess(), dbSession);
        mainTable.put("inList",mInList);

       // where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;
        where= getWfUpWhere(Constant.WF_bsp_material_in_store,ap.getOrg_xid());
//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable mUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mUpList = getLogTable(mUpList, this.getDBParserAccess(), dbSession);
        mainTable.put("upList",mUpList);

        resultHash.put("mainTable",mainTable);

        //获取子表 子表
        p2vs.clear();alias.clear();fieldTypes.clear();
        sql=" SELECT t.id AS id, t.parent_id AS parent_id, t.mc_xid AS mc_xid, t.mc_name AS mc_name, t.mc_code AS mc_code, t.mc_type AS mc_type, t.spec AS mc_spec,t.mc_unit_code AS mc_unit_code, t.mc_unit AS mc_unit, ta.description as tasdesc, t.warehouse_xid AS warehouse_xid,wa.code AS warehouse_code, wa.warehouse_name AS warehouse, t.in_store_num AS in_store_num, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted FROM bsp_material_in_store_detail t LEFT JOIN bsp_material_in_store pa on pa.id=t.parent_id LEFT JOIN bsp_material_buy_contract_register buycon on buycon.id=pa.buy_contract_xid LEFT JOIN sys_inputhelpline ta on buycon.tax_xid=ta.id LEFT JOIN bsp_warehouse wa ON wa.id = t.warehouse_xid ";
        where=" where pa.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("parent_id");
        alias.add("mc_xid");
        alias.add("mc_name");
        alias.add("mc_code");
        alias.add("mc_type");
        alias.add("mc_spec");
        alias.add("mc_unit_code");
        alias.add("mc_unit");
        alias.add("tasdesc");
        alias.add("warehouse_xid");
        alias.add("warehouse_code");
        alias.add("warehouse");
        alias.add("in_store_num");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("parent_id", ValueType.String);
        fieldTypes.put("mc_xid", ValueType.String);
        fieldTypes.put("mc_name", ValueType.String);
        fieldTypes.put("mc_code", ValueType.String);
        fieldTypes.put("mc_type", ValueType.String);
        fieldTypes.put("mc_spec", ValueType.String);
        fieldTypes.put("mc_unit_code", ValueType.String);
        fieldTypes.put("mc_unit", ValueType.String);
        fieldTypes.put("tasdesc", ValueType.Decimal);
        fieldTypes.put("warehouse_xid", ValueType.String);
        fieldTypes.put("warehouse_code", ValueType.String);
        fieldTypes.put("warehouse", ValueType.String);
        fieldTypes.put("in_store_num", ValueType.Decimal);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);

        HashMap<String,Object> subATable=new HashMap<>();
        DataTable subAInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("inList",subAInList);

        where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;

//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable subAUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("upList",subAUpList);

        resultHash.put("subATable",subATable);

        return resultHash;
    }
    //材料检验
    public HashMap<String,Object> getCheckToStore(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr)  throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        //获取主表 主表 insert update
        //String sql=" SELECT t.id AS id, t.check_code AS check_code, t.mc_xid AS mc_xid, m.NAME AS mc_name, m.CODE AS mc_code, m.spec AS mc_spec, tyo.NAME AS mc_type, un.description AS mc_unit, t.mc_amount AS mc_amount, date_format( t.mc_checkdate, '%Y-%m-%d' ) AS mc_checkdate, instore.billcode AS billcode, buy.contract_no as contract_no, wa.warehouse_name AS warehouse, t.warehouse_xid AS warehouse_xid, date_format( t.in_date, '%Y-%m-%d' ) AS in_date, t.ispassed AS ispassed, t.note AS note, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted, t.createuser_xid AS createuser_xid, u.NAME AS createuser,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend  FROM bsp_material_check t LEFT JOIN bsp_company g ON t.mc_gys_id = g.id LEFT JOIN bsp_company s ON t.mc_scs_id = s.id LEFT JOIN bsp_material_in_store_detail instored ON instored.id = t.instore_d_xid LEFT JOIN bsp_material_in_store instore ON instored.parent_id = instore.id LEFT JOIN bsp_material_buy_contract_register buy on buy.id=instore.buy_contract_xid LEFT JOIN bsp_material m ON t.mc_xid = m.id LEFT JOIN bsp_material_type_org tyo ON tyo.id = m.type_xid LEFT JOIN bsp_material_type ty ON ty.id = tyo.gb_type_xid LEFT JOIN sys_inputhelpline un ON ty.unit_xid = un.id LEFT JOIN bsp_warehouse wa ON wa.id = t.warehouse_xid LEFT JOIN bsp_location lo ON lo.id = t.location_xid LEFT JOIN d_user che ON che.id = t.checker_xid LEFT JOIN d_user u ON u.id = t.createuser_xid  ";
        String sql=" SELECT t.id AS id, t.check_code AS check_code, t.mc_xid AS mc_xid, m.NAME AS mc_name, m.CODE AS mc_code, m.spec AS mc_spec, tyo.NAME AS mc_type, un.description AS mc_unit, un.name AS mc_unit_code, t.mc_amount AS mc_amount, date_format( t.mc_checkdate, '%Y-%m-%d' ) AS mc_checkdate, instore.billcode AS billcode, buy.id AS contract_xid, buy.contract_no AS contract_no, buy_d.id AS contract_d_xid, t.warehouse_xid AS warehouse_xid, wa.warehouse_name AS warehouse, wa.CODE AS warehouse_code, t.location_xid AS location_xid, lo.location_name AS location, t.mc_gys_id AS supplier_xid, g.company_name AS supplier, date_format( t.in_date, '%Y-%m-%d' ) AS in_date, t.ispassed AS ispassed, t.note AS note, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted, t.createuser_xid AS createuser_xid, u.NAME AS createuser, inst.id AS instanceid, inst.currentstatus AS currentstatus, inst.isbegin AS isbegin, inst.isend AS isend FROM bsp_material_check t LEFT JOIN bsp_company g ON t.mc_gys_id = g.id LEFT JOIN bsp_company s ON t.mc_scs_id = s.id LEFT JOIN bsp_material_in_store_detail instored ON instored.id = t.instore_d_xid LEFT JOIN bsp_material_in_store instore ON instored.parent_id = instore.id LEFT JOIN bsp_material_buy_contract_register buy ON buy.id = instore.buy_contract_xid LEFT JOIN bsp_material_buy_detail buy_d ON buy_d.id = instored.con_buy_xid LEFT JOIN bsp_material m ON t.mc_xid = m.id LEFT JOIN bsp_material_type_org tyo ON tyo.id = m.type_xid LEFT JOIN bsp_material_type ty ON ty.id = tyo.gb_type_xid LEFT JOIN sys_inputhelpline un ON ty.unit_xid = un.id LEFT JOIN bsp_warehouse wa ON wa.id = t.warehouse_xid LEFT JOIN bsp_location lo ON lo.id = t.location_xid LEFT JOIN d_user che ON che.id = t.checker_xid LEFT JOIN d_user u ON u.id = t.createuser_xid ";
        //String where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;
        String where= getWfInWhere(Constant.WF_bsp_material_check,ap.getOrg_xid());

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("check_code");
        alias.add("mc_xid");
        alias.add("mc_name");
        alias.add("mc_code");
        alias.add("mc_spec");
        alias.add("mc_type");
        alias.add("mc_unit");
        alias.add("mc_unit_code");
        alias.add("mc_amount");
        alias.add("mc_checkdate");

        alias.add("billcode");
        alias.add("contract_xid");
        alias.add("contract_no");
        alias.add("contract_d_xid");
        alias.add("warehouse_xid");
        alias.add("warehouse");
        alias.add("warehouse_code");
        alias.add("location_xid");
        alias.add("location");
        alias.add("supplier_xid");
        alias.add("supplier");
        alias.add("in_date");
        alias.add("ispassed");
        alias.add("note");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");
        alias.add("createuser_xid");
        alias.add("createuser");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("check_code", ValueType.String);
        fieldTypes.put("mc_xid", ValueType.String);
        fieldTypes.put("mc_name", ValueType.String);
        fieldTypes.put("mc_code", ValueType.String);
        fieldTypes.put("mc_spec", ValueType.Decimal);
        fieldTypes.put("mc_type", ValueType.String);
        fieldTypes.put("mc_unit", ValueType.String);
        fieldTypes.put("mc_unit_code", ValueType.String);
        fieldTypes.put("mc_amount", ValueType.Decimal);
        fieldTypes.put("mc_checkdate", ValueType.String);
        fieldTypes.put("billcode", ValueType.String);
        fieldTypes.put("contract_xid", ValueType.String);
        fieldTypes.put("contract_no", ValueType.String);
        fieldTypes.put("contract_d_xid", ValueType.String);
        fieldTypes.put("warehouse_xid", ValueType.String);
        fieldTypes.put("warehouse", ValueType.String);
        fieldTypes.put("warehouse_code", ValueType.String);
        fieldTypes.put("location_xid", ValueType.String);
        fieldTypes.put("location", ValueType.String);
        fieldTypes.put("supplier_xid", ValueType.String);
        fieldTypes.put("supplier", ValueType.String);
        fieldTypes.put("in_date", ValueType.String);
        fieldTypes.put("ispassed", ValueType.String);
        fieldTypes.put("note", ValueType.String);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createuser_xid", ValueType.String);
        fieldTypes.put("createuser", ValueType.String);


        alias.add("instanceid");
        fieldTypes.put("instanceid", ValueType.String);
        alias.add("currentstatus");
        fieldTypes.put("currentstatus", ValueType.String);
        alias.add("isbegin");
        fieldTypes.put("isbegin", ValueType.String);
        alias.add("isend");
        fieldTypes.put("isend", ValueType.String);
        alias.add("checkinfo");
        fieldTypes.put("checkinfo", ValueType.Object);

        HashMap<String,Object> mainTable=new HashMap<>();
        DataTable mInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mInList = getLogTable(mInList, this.getDBParserAccess(), dbSession);
        mainTable.put("inList",mInList);

        // where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;
        where= getWfUpWhere(Constant.WF_bsp_material_in_store,ap.getOrg_xid());
//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable mUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mUpList = getLogTable(mUpList, this.getDBParserAccess(), dbSession);
        mainTable.put("upList",mUpList);

        resultHash.put("mainTable",mainTable);

        return resultHash;

    }
    //材料出库
    public HashMap<String, Object> getMaterialOutStore(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr) throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        //获取主表 主表 insert update
        //String sql=" SELECT t.id AS id, t.billcode AS billcode, date_format( t.out_date, '%Y-%m-%d' ) AS out_date, t.warehouse_xid AS warehouse_xid,house.code as warehouse_code,house.warehouse_name AS warehouse, t.department AS department, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted,t.createuser_xid as createuser_xid,u.name as createuser,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend  FROM bsp_material_out_store t LEFT JOIN bsp_warehouse house ON house.id = t.warehouse_xid LEFT JOIN d_user u on u.id=t.createuser_xid ";
        String sql=" SELECT t.id AS id, t.billcode AS billcode, date_format( t.out_date, '%Y-%m-%d' ) AS out_date, t.warehouse_xid AS warehouse_xid, house.CODE AS warehouse_code, house.warehouse_name AS warehouse, t.department_xid AS department_xid, part.name AS department,t.mc_use as mc_use, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted, t.createuser_xid AS createuser_xid, u.NAME AS createuser,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend FROM bsp_material_out_store t LEFT JOIN bsp_warehouse house ON house.id = t.warehouse_xid LEFT JOIN d_user u ON u.id = t.createuser_xid LEFT JOIN d_department part on part.id=t.department_xid ";
        //String where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;
        String where= getWfInWhere(Constant.WF_bsp_material_out_store,ap.getOrg_xid());

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("billcode");
        alias.add("out_date");
        alias.add("warehouse_xid");
        alias.add("warehouse_code");
        alias.add("warehouse");
        alias.add("department_xid");
        alias.add("department");
        alias.add("mc_use");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");
        alias.add("createuser_xid");
        alias.add("createuser");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("billcode", ValueType.String);
        fieldTypes.put("out_date", ValueType.String);
        fieldTypes.put("warehouse_xid", ValueType.String);
        fieldTypes.put("warehouse_code", ValueType.String);
        fieldTypes.put("warehouse", ValueType.String);
        fieldTypes.put("department_xid", ValueType.String);
        fieldTypes.put("department", ValueType.String);
        fieldTypes.put("mc_use", ValueType.String);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createuser_xid", ValueType.String);
        fieldTypes.put("createuser", ValueType.String);

        alias.add("instanceid");
        fieldTypes.put("instanceid", ValueType.String);
        alias.add("currentstatus");
        fieldTypes.put("currentstatus", ValueType.String);
        alias.add("isbegin");
        fieldTypes.put("isbegin", ValueType.String);
        alias.add("isend");
        fieldTypes.put("isend", ValueType.String);
        alias.add("checkinfo");
        fieldTypes.put("checkinfo", ValueType.Object);

        HashMap<String,Object> mainTable=new HashMap<>();
        DataTable mInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mInList = getLogTable(mInList, this.getDBParserAccess(), dbSession);
        mainTable.put("inList",mInList);

        //where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;
        where= getWfUpWhere(Constant.WF_bsp_material_out_store,ap.getOrg_xid());
//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable mUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mUpList = getLogTable(mUpList, this.getDBParserAccess(), dbSession);
        mainTable.put("upList",mUpList);

        resultHash.put("mainTable",mainTable);

        //获取子表 子表
        p2vs.clear();alias.clear();fieldTypes.clear();
        sql=" SELECT t.id AS id, t.parent_id AS parent_id, t.mc_xid AS mc_xid, mc.NAME AS mc_name, mc.code AS mc_code, mo.NAME AS mc_type, mc.spec AS mc_spec, un.name AS mc_unit_code, un.description AS mc_unit, t.out_price AS out_price, t.out_store_num AS out_store_num,t.product_xid AS productname_xid,duct.NAME AS productname, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted FROM bsp_material_out_store_detail t LEFT JOIN bsp_material_out_store pa ON pa.id = t.parent_id LEFT JOIN bsp_material mc ON mc.id = t.mc_xid LEFT JOIN bsp_material_type_org mo ON mo.id = mc.type_xid LEFT JOIN bsp_material_type gb ON mo.gb_type_xid = gb.id LEFT JOIN sys_inputhelpline un ON gb.unit_xid = un.id LEFT JOIN bsp_comproduct_org duct ON duct.id = t.product_xid ";

        where=" where pa.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("parent_id");
        alias.add("mc_xid");
        alias.add("mc_name");
        alias.add("mc_code");
        alias.add("mc_type");
        alias.add("mc_spec");
        alias.add("mc_unit_code");
        alias.add("mc_unit");
        alias.add("out_price");
        alias.add("out_store_num");
        alias.add("productname_xid");
        alias.add("productname");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("parent_id", ValueType.String);
        fieldTypes.put("mc_xid", ValueType.String);
        fieldTypes.put("mc_name", ValueType.String);
        fieldTypes.put("mc_code", ValueType.String);
        fieldTypes.put("mc_type", ValueType.String);
        fieldTypes.put("mc_spec", ValueType.String);
        fieldTypes.put("mc_unit_code", ValueType.String);
        fieldTypes.put("mc_unit", ValueType.String);
        fieldTypes.put("out_price", ValueType.Decimal);
        fieldTypes.put("out_store_num", ValueType.Decimal);
        fieldTypes.put("productname_xid", ValueType.String);
        fieldTypes.put("productname", ValueType.String);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);



        HashMap<String,Object> subATable=new HashMap<>();
        DataTable subAInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("inList",subAInList);

        where=" where pa.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;

//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable subAUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("upList",subAUpList);

        resultHash.put("subATable",subATable);

        return resultHash;
    }
    //成品入库
    public HashMap<String,Object> getComponentInStore(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr) throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

//        String sql=" SELECT t.id AS id, date_format( t.in_store_time, '%Y-%m-%d' ) AS in_store_time, t.rfidnum_xid AS rfidnum_xid, bc.rfidnum AS rfidnum, bc.project_xid AS project_xid, bp.NAME AS project, bup.id AS unitproject_xid, bup.NAME AS unitproject, bc.floor AS floor, prodic.id AS productname_xid, prodic.CODE AS product_code, prodic.NAME AS productname, prodic.spec AS specifications, bc.volume AS volume, t.warehouse_xid AS warehouse_xid, dic1.CODE AS warehouse_code, dic1.warehouse_name AS warehouse, t.location_xid AS location_xid, dic2.location_name AS location, t.ischeckpass AS ischeckpass, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted, t.createuser_xid AS createuser_xid, u.NAME AS createuser,u.department_xid AS department_xid,part.NAME AS department,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend  FROM bsp_component_in_store t LEFT JOIN bsp_component bc ON bc.id = t.rfidnum_xid LEFT JOIN bsp_project bp ON bp.id = bc.project_xid LEFT JOIN bsp_unitproject bup ON bup.id = bc.unitproject_xid LEFT JOIN bsp_warehouse dic1 ON dic1.id = t.warehouse_xid LEFT JOIN bsp_location dic2 ON dic2.id = t.location_xid LEFT JOIN bsp_construcotion_person bcp1 ON bcp1.id = t.header_xid LEFT JOIN bsp_comproduct_org prodic ON prodic.id = bc.productname_xid LEFT JOIN d_user u ON u.id = t.createuser_xid LEFT JOIN d_department part ON part.id = u.department_xid  ";
        String sql=" SELECT t.id AS id, date_format( t.in_store_time, '%Y-%m-%d' ) AS in_store_time, t.rfidnum_xid AS rfidnum_xid, bc.rfidnum AS rfidnum, bc.project_xid AS project_xid, bp.NAME AS project, bup.id AS unitproject_xid, bup.NAME AS unitproject, bc.floor AS floor, prodic.id AS productname_xid, prodic.CODE AS product_code, prodic.NAME AS productname, prodic.spec AS specifications, bc.volume AS volume, t.warehouse_xid AS warehouse_xid, dic1.CODE AS warehouse_code, dic1.warehouse_name AS warehouse, t.location_xid AS location_xid, dic2.location_name AS location, t.workshop_xid AS workshop_xid, t.team_xid AS team_xid, t.productline_xid AS productline_xid, wo.workshop_name AS workshop, te.team_name AS team, line.NAME AS productline, t.ischeckpass AS ischeckpass, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted, t.createuser_xid AS createuser_xid, u.NAME AS createuser, u.department_xid AS department_xid, part.NAME AS department,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend FROM bsp_component_in_store t LEFT JOIN bsp_component bc ON bc.id = t.rfidnum_xid LEFT JOIN bsp_project bp ON bp.id = bc.project_xid LEFT JOIN bsp_unitproject bup ON bup.id = bc.unitproject_xid LEFT JOIN bsp_warehouse dic1 ON dic1.id = t.warehouse_xid LEFT JOIN bsp_location dic2 ON dic2.id = t.location_xid LEFT JOIN bsp_workshop wo ON wo.id = t.workshop_xid LEFT JOIN bsp_team te ON te.id = t.team_xid LEFT JOIN bsp_productline line ON line.id = t.productline_xid LEFT JOIN bsp_construcotion_person bcp1 ON bcp1.id = t.header_xid LEFT JOIN bsp_comproduct_org prodic ON prodic.id = bc.productname_xid LEFT JOIN d_user u ON u.id = t.createuser_xid LEFT JOIN d_department part ON part.id = u.department_xid  ";
       // String where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;
        String where= getWfInWhere(Constant.WF_bsp_component_in_store,ap.getOrg_xid());

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("in_store_time");
        alias.add("rfidnum_xid");
        alias.add("rfidnum");
        alias.add("project_xid");
        alias.add("project");
        alias.add("unitproject_xid");
        alias.add("unitproject");
        alias.add("floor");
        alias.add("productname_xid");
        alias.add("product_code");
        alias.add("productname");
        alias.add("specifications");
        alias.add("volume");
        alias.add("warehouse_xid");
        alias.add("warehouse_code");
        alias.add("warehouse");
        alias.add("location_xid");
        alias.add("location");
        alias.add("workshop_xid");
        alias.add("team_xid");
        alias.add("productline_xid");
        alias.add("workshop");
        alias.add("team");
        alias.add("productline");
        alias.add("ischeckpass");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");
        alias.add("createuser_xid");
        alias.add("createuser");
        alias.add("department_xid");
        alias.add("department");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("in_store_time", ValueType.String);
        fieldTypes.put("rfidnum_xid", ValueType.String);
        fieldTypes.put("rfidnum", ValueType.String);
        fieldTypes.put("project_xid", ValueType.String);
        fieldTypes.put("project", ValueType.String);
        fieldTypes.put("unitproject_xid", ValueType.String);
        fieldTypes.put("unitproject", ValueType.String);
        fieldTypes.put("floor", ValueType.String);
        fieldTypes.put("productname_xid", ValueType.String);
        fieldTypes.put("product_code", ValueType.String);
        fieldTypes.put("productname", ValueType.String);
        fieldTypes.put("specifications", ValueType.String);
        fieldTypes.put("volume", ValueType.String);
        fieldTypes.put("warehouse_xid", ValueType.String);
        fieldTypes.put("warehouse_code", ValueType.String);
        fieldTypes.put("warehouse", ValueType.String);
        fieldTypes.put("location_xid", ValueType.String);
        fieldTypes.put("location", ValueType.String);
        fieldTypes.put("workshop_xid", ValueType.String);
        fieldTypes.put("team_xid", ValueType.String);
        fieldTypes.put("productline_xid", ValueType.String);
        fieldTypes.put("workshop", ValueType.String);
        fieldTypes.put("team", ValueType.String);
        fieldTypes.put("productline", ValueType.String);
        fieldTypes.put("ischeckpass", ValueType.String);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createuser_xid", ValueType.String);
        fieldTypes.put("createuser", ValueType.String);
        fieldTypes.put("department_xid", ValueType.String);
        fieldTypes.put("department", ValueType.String);

        alias.add("instanceid");
        fieldTypes.put("instanceid", ValueType.String);
        alias.add("currentstatus");
        fieldTypes.put("currentstatus", ValueType.String);
        alias.add("isbegin");
        fieldTypes.put("isbegin", ValueType.String);
        alias.add("isend");
        fieldTypes.put("isend", ValueType.String);
        alias.add("checkinfo");
        fieldTypes.put("checkinfo", ValueType.Object);

        DataTable inList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        inList = getLogTable(inList, this.getDBParserAccess(), dbSession);
        resultHash.put("inList",inList);

       // where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;
        where= getWfUpWhere(Constant.WF_bsp_component_in_store,ap.getOrg_xid());
//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable upList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        upList = getLogTable(upList, this.getDBParserAccess(), dbSession);
        resultHash.put("upList",upList);

        return resultHash;
    }
    //销售合同
    public HashMap<String, Object> getComponentSaleContracts(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr) throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        //获取主表
        String sql=" SELECT t.id AS id, t.contract_no AS contract_no, t.contract_code AS contract_code,t.contract_name AS contract_name, date_format( t.contract_start_date, '%Y-%m-%d' ) AS contract_start_date, date_format( t.contract_end_date, '%Y-%m-%d' ) AS contract_end_date, t.party_a_xid AS party_a_xid, partya.company_name AS party_a_name, t.party_b_xid AS party_b_xid, partyb.name AS party_b_name, date_format( t.sign_date, '%Y-%m-%d' ) AS sign_date,date_format( t.receivedate, '%Y-%m-%d' ) AS receive_date,date_format( t.send_date, '%Y-%m-%d' ) AS send_date, t.project_xid AS project_xid, proj.name AS project_name, t.agent_xid AS agent_xid, bcp.person_name AS agentname, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted,t.createuser_xid as createuser_xid,u.name as createuser,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend  FROM bsp_component_sale_contract_register t LEFT JOIN sys_inputhelpline tax ON tax.id = t.tax_xid LEFT JOIN bsp_company partya ON partya.id = t.party_a_xid LEFT JOIN d_org partyb ON partyb.id = t.party_b_xid LEFT JOIN bsp_project proj ON proj.id = t.project_xid LEFT JOIN bsp_construcotion_person bcp ON bcp.id = t.agent_xid LEFT JOIN d_user u on u.id=t.createuser_xid ";
        //String where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;
        String where= getWfInWhere(Constant.WF_bsp_component_sale_contract_register,ap.getOrg_xid());

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("contract_no");
        alias.add("contract_code");
        alias.add("contract_name");
        alias.add("contract_start_date");
        alias.add("contract_end_date");
        alias.add("party_a_xid");
        alias.add("party_a_name");
        alias.add("party_b_xid");
        alias.add("party_b_name");
        alias.add("sign_date");
        alias.add("receive_date");
        alias.add("send_date");
        alias.add("project_xid");
        alias.add("project_name");
        alias.add("agent_xid");
        alias.add("agentname");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");
        alias.add("createuser_xid");
        alias.add("createuser");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("contract_no", ValueType.String);
        fieldTypes.put("contract_code", ValueType.String);
        fieldTypes.put("contract_name", ValueType.String);
        fieldTypes.put("contract_start_date", ValueType.String);
        fieldTypes.put("contract_end_date", ValueType.String);
        fieldTypes.put("party_a_xid", ValueType.String);
        fieldTypes.put("party_a_name", ValueType.String);
        fieldTypes.put("party_b_xid", ValueType.String);
        fieldTypes.put("party_b_name", ValueType.String);
        fieldTypes.put("sign_date", ValueType.String);
        fieldTypes.put("receive_date", ValueType.String);
        fieldTypes.put("send_date", ValueType.String);
        fieldTypes.put("project_xid", ValueType.String);
        fieldTypes.put("project_name", ValueType.String);
        fieldTypes.put("agent_xid", ValueType.String);
        fieldTypes.put("agentname", ValueType.String);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createuser_xid", ValueType.String);
        fieldTypes.put("createuser", ValueType.String);

        alias.add("instanceid");
        fieldTypes.put("instanceid", ValueType.String);
        alias.add("currentstatus");
        fieldTypes.put("currentstatus", ValueType.String);
        alias.add("isbegin");
        fieldTypes.put("isbegin", ValueType.String);
        alias.add("isend");
        fieldTypes.put("isend", ValueType.String);
        alias.add("checkinfo");
        fieldTypes.put("checkinfo", ValueType.Object);

        HashMap<String,Object> mainTable=new HashMap<>();
        DataTable mInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mInList = getLogTable(mInList, this.getDBParserAccess(), dbSession);
        mainTable.put("inList",mInList);

        //where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;
        where= getWfUpWhere(Constant.WF_bsp_component_sale_contract_register,ap.getOrg_xid());
//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable mUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mUpList = getLogTable(mUpList, this.getDBParserAccess(), dbSession);
        mainTable.put("upList",mUpList);

        resultHash.put("mainTable",mainTable);

        //获取子表 子表A
        p2vs.clear();alias.clear();fieldTypes.clear();
        sql=" SELECT t.id AS id, t.parent_id AS parent_id, t.component_type_xid AS productname_xid, duct.NAME AS productname, t.tax_include_price AS tax_include_price, tax.field1 AS taxdesc, t.num AS num, unit.name AS unit_code, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted FROM bsp_component_buy_detail t LEFT JOIN bsp_component_sale_contract_register pa ON pa.id = t.parent_id LEFT JOIN bsp_comproduct_org duct ON duct.id = t.component_type_xid LEFT JOIN bsp_comptype_org type ON type.id = duct.comptype_org_xid LEFT JOIN sys_inputhelpline unit ON unit.id = type.unit_xid LEFT JOIN sys_inputhelpline tax ON tax.id = t.tax_xid ";
        where=" where pa.org_xid='"+ap.getOrg_xid()+"' and "+inWhere;

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("parent_id");
        alias.add("productname_xid");
        alias.add("productname");
        alias.add("tax_include_price");
        alias.add("taxdesc");
        alias.add("num");
        alias.add("unit_code");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("parent_id", ValueType.String);
        fieldTypes.put("productname_xid", ValueType.String);
        fieldTypes.put("productname", ValueType.String);
        fieldTypes.put("tax_include_price", ValueType.Decimal);
        fieldTypes.put("taxdesc", ValueType.Decimal);
        fieldTypes.put("num", ValueType.Decimal);
        fieldTypes.put("unit_code", ValueType.String);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);

        HashMap<String,Object> subATable=new HashMap<>();
        DataTable subAInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("inList",subAInList);

        where=" where pa.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;

//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable subAUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("upList",subAUpList);

        resultHash.put("subATable",subATable);

        return resultHash;
    }
    //运输信息
    public HashMap<String, Object> getComponentTransports(Session dbSession, ApiEntity ap, String beginTimeStr, String endTimeStr) throws Exception {
        HashMap<String,Object> resultHash=new HashMap<>();

        HashMap<String, Object> p2vs = new HashMap<String, Object>();//查询参数1
        List<String> alias = new ArrayList<String>();//查询参数2
        HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();//查询参数3;

        //获取主表
        //String sql=" SELECT t.id AS id, t.transportnumber AS transportnumber, t.project_xid AS project_xid, bp.NAME AS project, t.unitproject_xid AS unitproject_xid, bup.NAME AS unitproject, t.receiving_xid as order_customer_xid, rece.company_name as order_customer, sale.contract_no AS sale_contract, date_format( t.senderdate, '%Y-%m-%d' ) AS senderdate, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted, t.createuser_xid AS createuser_xid, u.NAME AS createuser,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend  FROM bsp_component_transport t LEFT JOIN bsp_project bp ON bp.id = t.project_xid LEFT JOIN bsp_unitproject bup ON bup.id = t.unitproject_xid LEFT JOIN bsp_company rece on rece.id=t.receiving_xid LEFT JOIN bsp_component_sale_contract_register sale ON sale.org_xid = t.org_xid AND sale.project_xid = t.project_xid LEFT JOIN d_user u ON u.id = t.createuser_xid ";
        String sql=" SELECT t.id AS id, t.transportnumber AS transportnumber, t.project_xid AS project_xid, bp.NAME AS project, t.unitproject_xid AS unitproject_xid, bup.NAME AS unitproject, t.receiving_xid as order_customer_xid, rece.company_name as order_customer,sale.id as contract_xid, sale.contract_no AS sale_contract, date_format( t.senderdate, '%Y-%m-%d' ) AS senderdate, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted, t.createuser_xid AS createuser_xid, u.NAME AS createuser,inst.id as instanceid ,inst.currentstatus as currentstatus,inst.isbegin as isbegin,inst.isend as isend  FROM bsp_component_transport t LEFT JOIN bsp_project bp ON bp.id = t.project_xid LEFT JOIN bsp_unitproject bup ON bup.id = t.unitproject_xid LEFT JOIN bsp_company rece on rece.id=t.receiving_xid LEFT JOIN bsp_component_sale_contract_register sale ON sale.org_xid = t.org_xid AND sale.project_xid = t.project_xid LEFT JOIN d_user u ON u.id = t.createuser_xid ";

        String where= getWfInWhere(Constant.WF_bsp_component_transport,ap.getOrg_xid());

        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("transportnumber");
        alias.add("project_xid");
        alias.add("project");
        alias.add("unitproject_xid");
        alias.add("unitproject");
        alias.add("order_customer_xid");
        alias.add("order_customer");
        alias.add("contract_xid");
        alias.add("sale_contract");
        alias.add("senderdate");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");
        alias.add("createuser_xid");
        alias.add("createuser");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("transportnumber", ValueType.String);
        fieldTypes.put("project_xid", ValueType.String);
        fieldTypes.put("project", ValueType.String);
        fieldTypes.put("unitproject_xid", ValueType.String);
        fieldTypes.put("unitproject", ValueType.String);
        fieldTypes.put("order_customer_xid", ValueType.String);
        fieldTypes.put("order_customer", ValueType.String);
        fieldTypes.put("contract_xid", ValueType.String);
        fieldTypes.put("sale_contract", ValueType.String);
        fieldTypes.put("senderdate", ValueType.String);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);
        fieldTypes.put("createuser_xid", ValueType.String);
        fieldTypes.put("createuser", ValueType.String);

        alias.add("instanceid");
        fieldTypes.put("instanceid", ValueType.String);
        alias.add("currentstatus");
        fieldTypes.put("currentstatus", ValueType.String);
        alias.add("isbegin");
        fieldTypes.put("isbegin", ValueType.String);
        alias.add("isend");
        fieldTypes.put("isend", ValueType.String);
        alias.add("checkinfo");
        fieldTypes.put("checkinfo", ValueType.Object);

        HashMap<String,Object> mainTable=new HashMap<>();
        DataTable mInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mInList = getLogTable(mInList, this.getDBParserAccess(), dbSession);
        mainTable.put("inList",mInList);

      //  where=" where t.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;
        where= getWfUpWhere(Constant.WF_bsp_component_transport,ap.getOrg_xid());
//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable mUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        mUpList = getLogTable(mUpList, this.getDBParserAccess(), dbSession);
        mainTable.put("upList",mUpList);

        resultHash.put("mainTable",mainTable);

        //获取子表 子表A
        p2vs.clear();alias.clear();fieldTypes.clear();
        sql=" SELECT t.id AS id, t.parentid AS parent_id, t.rfidnum_xid AS rfidnum_xid, t.rfidnum AS rfidnum, bc.productname_xid AS productname_xid, duct.name AS productname, duct.spec AS specifications, un.description AS unit, un.name AS unit_code, date_format( t.createtime, '%Y-%m-%d %T' ) AS createtime, date_format( t.modifytime, '%Y-%m-%d %T' ) AS modifytime, t.isdeleted AS isdeleted FROM bsp_component_transport_detail t LEFT JOIN bsp_component_transport pa ON pa.id = t.parentid LEFT JOIN bsp_component bc ON bc.id = t.rfidnum_xid LEFT JOIN bsp_comproduct_org duct on duct.id=bc.productname_xid LEFT JOIN bsp_comptype_org typ on typ.id=duct.comptype_org_xid LEFT JOIN sys_inputhelpline un on un.id=typ.unit_xid ";
        where=" where pa.org_xid='"+ap.getOrg_xid()+"' and "+inWhere +" GROUP BY t.id ";


        p2vs.put("timeStr",beginTimeStr);
        p2vs.put("greatMonth", endTimeStr);

        alias.add("id");
        alias.add("parent_id");
        alias.add("rfidnum_xid");
        alias.add("rfidnum");
        alias.add("productname_xid");
        alias.add("productname");
        alias.add("specifications");
        alias.add("unit");
        alias.add("unit_code");
      //  alias.add("conversion_rate");

        alias.add("createtime");
        alias.add("modifytime");
        alias.add("isdeleted");

        fieldTypes.put("id", ValueType.String);
        fieldTypes.put("parent_id", ValueType.String);
        fieldTypes.put("rfidnum_xid", ValueType.String);
        fieldTypes.put("rfidnum", ValueType.String);
        fieldTypes.put("productname_xid", ValueType.String);
        fieldTypes.put("productname", ValueType.String);
        fieldTypes.put("specifications", ValueType.String);
        fieldTypes.put("unit", ValueType.String);
        fieldTypes.put("unit_code", ValueType.String);
       // fieldTypes.put("conversion_rate", ValueType.String);

        fieldTypes.put("createtime", ValueType.String);
        fieldTypes.put("modifytime", ValueType.String);
        fieldTypes.put("isdeleted", ValueType.String);

        HashMap<String,Object> subATable=new HashMap<>();
        DataTable subAInList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("inList",subAInList);

        where=" where pa.org_xid='"+ap.getOrg_xid()+"' and "+upWhere;

//        p2vs.put("timeStr",endTimeStr);
//        p2vs.put("greatMonth", ApiR.greatMonthStr(endTimeStr));

        DataTable subAUpList = this.getDBParserAccess().selectList(dbSession,sql+where,p2vs,alias, fieldTypes);
        subATable.put("upList",subAUpList);

        resultHash.put("subATable",subATable);

        return resultHash;
    }


}
