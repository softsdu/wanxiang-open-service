package com.zlp.mdl.service;

public interface IMdlComponentService {

	String createComponent();

	String getComponentFile();

	String saveComponent();

	String deleteComponent();

	String getComponentFileByCode();

	String changeComponentProperty();

	//发布 added by ls 20230723
	String changePublishStatus();

	String exportLZW();

	//根据编码和版本号，获取组件信息 added by ls 20210820
	String getComponentInfoByCode();

	//复制组件 added by ls 20210823
	String copyComponent();

	//获取类型的属性列表 added by ls 20210824 
	String getCategoryProperties();

	String getCategoryTree();

	String queryComponents();

	//获取模型某个属性的值集合列表（自上而下嵌套解析-同属性只解析父节点，返回整个集合） added by liyh 20211117
	//输入：componentCode,versionNum, propertyName
	String getComponentPropertyValueList();

	//获取指定统计指标集合的模型数据统计值  added by liyh 20211126
	//requestParam={"componentCode":"仁恒项目模型","versionNum":"1.0","indexList":"人工CO2,机械CO2,材料CO2"}
	String getComponentValueByIndexList();

	//获取组件统计指标列表 added by liyh 20211130
	String getMdlStatisticIndexList();

    String getComponentFileByName();

    //获取多个component的基本信息 added by ls 202204
	String getComponentFilesByCodes();

	//创建component的内容文本（涉及返回模型文件20220714）  added by ls 20220705
	String createComponentText();

	/** adim 加密信息 访问页面 added by yay 20221215
	 * <p>请求路径: /mdlComponentNcpService/adimRequest.action</p>
	 * <p>请求参数: requestParam={"encrypt":"opnO2JYg/TxhMyThS8NNw3QDBNZ2to4pGIzeYi3e/DSAxI2V4AdAV7Prc5xH7tBiPqr659mDYQbkBCVCSAaZ+gm+oJC9MpAIq4ZCbyhijMU="}</p>
	 * <p>请求参数说明:
	 * encrypt： json格式 {userCode:developer,userPassword:a,timestamp:2022-2-2 11:11:11} AesUtils加密 然后 urlEncode
	 * <p>返回字段说明: </p>
	 * 授权登录
	 * */
	String adimRequest();

	//新建模型并自动实例化 added by liyh 20221229
	//传参参考：
	//	  requestParam=
	//		{
	//			"code":"test20221230",
	//			"name":"test20221230",
	//			"gbCode":"",
	//			"versionNum":"1.0",
	//			"shareType":"个人",
	//			"categoryId":"820ae387-8712-45ac-952e-f9fd4c79ffe4",
	//			"note":"",
	//			"mdlType":"assemble",
	//			"userId":"2",
	//			"companyId":"222",
	//			"unitSetting":{
	//				"code":"套装门参数化驱动",
	//				"versionNum":"1.0",
	//				"parameters":{
	//					"洞高":{
	//						"value":2300
	//					},
	//					"洞宽":{
	//						"value":1000
	//					},
	//					"洞厚":{
	//						"value":" 250"
	//					},
	//					"窗厚":{
	//						"value":" 50"
	//					},
	//					"进深":{
	//						"value":" 150"
	//					}
	//				}
	//			}
	//		}
	String createComponentWithUnitSetting();

	//根据mdlType获取当前用户的模型列表  added by ls 20230518
	String getUserComponents();

	//已发布的模型  added by ls 20230723
	String getPublishedComponents();

	String saveImage();
}
