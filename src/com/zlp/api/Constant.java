package com.zlp.api;

public class Constant {

    //TODO 1 企业ID获取   2 往来单位 接口 (1内部0外部)
    // 3 物料接口 税额 ''

    //返回错误码维护: 数字步长为 5
    public final static String CODE_001="密钥不存在!";
    public final static String CODE_002="密钥未启用!";
    public final static String CODE_003="请求企业ID错误!";

    public final static String CODE_005="请求接口未授权!";
    public final static String CODE_006="请求接口未启用!";



    public final static String CODE_010="请求用户未授权!";
    public final static String CODE_011="请求用户未启用!";



    public final static String CODE_015="结束时间超出规定范围,请修改开始时间或结束时间!";


    public final static String CODE_000="success";
    public final static String CODE_500="其他错误";


    //工作流 单据类型ID 维护:
    // SELECT * FROM wf_doctype dt WHERE name='材料计划'
    public final static String WF_bsp_material_total_plan="材料计划";
    // SELECT * FROM wf_doctype dt WHERE name='采购合同'
    public final static String WF_bsp_material_buy_contract_register="采购合同";
    // SELECT * FROM wf_doctype dt WHERE name='材料入库'
    public final static String WF_bsp_material_in_store="材料入库";
    // SELECT * FROM wf_doctype dt WHERE name='原材料检验'
    public final static String WF_bsp_material_check="原材料检验";
    // SELECT * FROM wf_doctype dt WHERE name='材料出库'
    public final static String WF_bsp_material_out_store="材料出库";
    // SELECT * FROM wf_doctype dt WHERE name='入库信息'
    public final static String WF_bsp_component_in_store="入库信息";
    // SELECT * FROM wf_doctype dt WHERE name='销售合同'
    public final static String WF_bsp_component_sale_contract_register="销售合同";
    // SELECT * FROM wf_doctype dt WHERE name='运输信息'
    public final static String WF_bsp_component_transport="运输信息";



}
