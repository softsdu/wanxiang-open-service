package com.zlp.mdl.expression.definition;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map; 
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.beans.factory.InitializingBean;

import com.zlp.platform.common.FileOperate;
import com.zlp.platform.common.util.CommonFunction;
import com.zlp.platform.constants.ZlpState; 
import com.zlp.platform.dao.sys.ContextUtil;

public class Environment implements InitializingBean, IEnvironment{ 
	public static final String EXPRESSIONENVIRONMENT_FILE = "expressionEnvironment.xml";

	//根据名称获取类型描述
	private static Map<String, ValueTypeDes> nameToValueTypeDeses = null;
	public ValueTypeDes getValueTypeDes(String name){
		return nameToValueTypeDeses.get(name);
	}
	//根据名称获取函数
	private static Map<String, Category> nameToCategories = null;
	public Category getCategory(String name){
		return nameToCategories.get(name);
	}
	
	//根据名称获取函数
	private static Map<String, Function> nameToFunctions = null;
	public Function getFunction(String name){
		return nameToFunctions.get(name.toLowerCase());
	}

	//根据名称获取操作符
	private static Map<String, Operator> nameToOperators = null;
	public Operator getOperator(String name){
		return nameToOperators.get(name.toLowerCase());
	}

	//根据名称获保留字
	private static Map<String, KeyWord> nameToKeyWords = null;
	public KeyWord getKeyWord(String name){
		return nameToKeyWords.get(name.toLowerCase());
	} 

	//从文件中读取配置
	public static void initFromFile() throws Exception{
		InputStream is = null;
		try
		{
			is = Environment.class.getClassLoader().getResourceAsStream(EXPRESSIONENVIRONMENT_FILE);
			SAXReader saxReadr = new SAXReader();// 得到SAXReader对象
			Document xmlDoc = saxReadr.read(is);
			Element root = xmlDoc.getRootElement();

			List<Element> allValueTypeDesesElement = root.element("AllValueTypeDeses").elements();
			List<ValueTypeDes> allValueTypeDeses = new ArrayList<ValueTypeDes>(); 
			for(int i=0;i< allValueTypeDesesElement.size();i++){
				Element element = allValueTypeDesesElement.get(i);
				ValueTypeDes vtd= new ValueTypeDes();
				vtd.setName(element.attributeValue("Name"));
				vtd.setDescription(element.attributeValue("Description")); 
				allValueTypeDeses.add(vtd);
			}
			
			List<Element> allCategoriesElement = root.element("AllCategories").elements();
			List<Category> allCategories = new ArrayList<Category>(); 
			for(int i=0;i< allCategoriesElement.size();i++){
				Element element = allCategoriesElement.get(i);
				Category c = new Category();
				c.setName(element.attributeValue("Name"));
				c.setDescription(element.attributeValue("Description")); 
				allCategories.add(c);
			}
			 
			List<Element> allFunctionsElement = root.element("AllFunctions").elements();
			List<Function> allFunctions = new ArrayList<Function>(); 
			for(int i=0;i<allFunctionsElement.size();i++){
				Element element = allFunctionsElement.get(i);
				Function func = new Function();
				func.setName(element.attributeValue("Name"));
				func.setDescription(element.attributeValue("Description")); 
				func.setBeanName(element.attributeValue("BeanName")); 
				func.setMethodName(element.attributeValue("MethodName")); 
				func.setCategory(element.attributeValue("Category")); 
				func.setRunAt((RunAt)Enum.valueOf(RunAt.class, element.attributeValue("RunAt"))); 
				allFunctions.add(func);
				
				List<Element> allFunctionSettingElements = element.elements();
				List<FunctionSetting> allFunctionSettings = new ArrayList<FunctionSetting>();
				func.setAllFunctionSettings(allFunctionSettings);
				for(int j=0;j<allFunctionSettingElements.size();j++){
					Element settingElement = allFunctionSettingElements.get(j);
					FunctionSetting  funcSetting = new FunctionSetting();
					funcSetting.setDescription(settingElement.attributeValue("Description"));
					funcSetting.setResultType(settingElement.attributeValue("ResultType"));
					allFunctionSettings.add(funcSetting); 
					
					List<Element> allParameterElements = settingElement.elements();
					List<Parameter> allParameters = new ArrayList<Parameter>();
					funcSetting.setAllParameters(allParameters);
					for(int k=0;k<allParameterElements.size();k++){
						Element parameterElement = allParameterElements.get(k);
						Parameter param = new Parameter();
						param.setName(parameterElement.attributeValue("Name"));
						param.setDescription(parameterElement.attributeValue("Description"));
						param.setValueType(parameterElement.attributeValue("ValueType"));	 
						param.setRepeatable(Boolean.parseBoolean(parameterElement.attributeValue("Repeatable", "false")));		
						allParameters.add(param); 
					}					
				}
			}
			
			List<Element> allOperatorElements = root.element("AllOperators").elements();
			List<Operator> allOperators = new ArrayList<Operator>();
			for(int i=0;i<allOperatorElements.size();i++){
				Element element = allOperatorElements.get(i);
				Operator op = new Operator();
				op.setName(element.attributeValue("Name"));
				op.setDescription(element.attributeValue("Description"));
				op.setFunctionName(element.attributeValue("FunctionName"));
				op.setLevel(Integer.parseInt(element.attributeValue("Level")));
				allOperators.add(op);
			}
			
			List<Element> allKeyWordsElement = root.element("AllKeyWords").elements();
			List<KeyWord> allKeyWords = new ArrayList<KeyWord>(); 
			for(int i=0;i<allKeyWordsElement.size();i++){
				Element element = allKeyWordsElement.get(i);
				KeyWord w = new KeyWord();
				w.setName(element.attributeValue("Name"));
				w.setDescription(element.attributeValue("Description")); 
				allKeyWords.add(w);
			}
			
			initToMemory(allValueTypeDeses, allCategories, allFunctions, allOperators, allKeyWords);
			
			//generateFunctionListJsFile();
		}
		catch(Exception ex){
			throw new RuntimeException("Can not load Custom Function Definition file. URL = " + EXPRESSIONENVIRONMENT_FILE, ex);
		}
		finally{
			if(is != null){
				is.close();
				is = null;
			}
		}
	} 
 
	//将配置保存在服务器内存中
	private static void initToMemory(List<ValueTypeDes> allValueTypeDeses, List<Category> allCategories, List<Function> allFunctions, List<Operator> allOperators, List<KeyWord> allKeyWords){		
		nameToValueTypeDeses = new HashMap<String,ValueTypeDes>();
		for(int i=0;i<allValueTypeDeses.size();i++){
			ValueTypeDes vtd = allValueTypeDeses.get(i);
			String name = vtd.getName().toLowerCase();
			if(!nameToValueTypeDeses.containsKey(name)){
				nameToValueTypeDeses.put(name, vtd);
			}
			else{
				throw new RuntimeException("错误, 类型描述重名，不区分大小写. ValueTypeName = " + vtd.getName());
			}
		}				
		
		nameToCategories = new HashMap<String,Category>();
		for(int i=0;i<allCategories.size();i++){
			Category c = allCategories.get(i);
			String name = c.getName().toLowerCase();
			if(!nameToCategories.containsKey(name)){
				nameToCategories.put(name, c);
			}
			else{
				throw new RuntimeException("错误, 函数类型重名，不区分大小写. CategoryName = " + c.getName());
			}
		}			
		
		nameToFunctions = new HashMap<String,Function>();
		for(int i=0;i<allFunctions.size();i++){
			Function func = allFunctions.get(i);
			String name = func.getName().toLowerCase();
			if(!nameToFunctions.containsKey(name)){
				nameToFunctions.put(name, func);
			}
			else{
				throw new RuntimeException("错误, 自定义函数重名，不区分大小写. FunctionName = " + func.getName());
			}
		}	
		
		nameToOperators = new HashMap<String,Operator>();
		for(int i=0;i<allOperators.size();i++){
			Operator op = allOperators.get(i);
			if(!nameToOperators.containsKey(op.getName())){
				nameToOperators.put(op.getName(), op);
			}
			else{
				throw new RuntimeException("错误, 重复定义了操作符. OperatorName = " + op.getName());
			}
		}	
		
		nameToKeyWords = new HashMap<String, KeyWord>();
		for(int i=0;i<allKeyWords.size();i++){
			KeyWord w = allKeyWords.get(i);
			if(!nameToKeyWords.containsKey(w.getName())){
				nameToKeyWords.put(w.getName(), w);
			}
			else{
				throw new RuntimeException("错误, 重复定义了保留字. KeyWordName = " + w.getName());
			}
		}		
	}
	
	private static void generateFunctionListJsFile() throws Exception{
		
		String noneCatetoryName = "未归类";
		String jsFilePath = ContextUtil.getAbsolutePath() + ZlpState.PLATFORM_STYLE_PATH + "expression\\functionList.js";
		List<String> sortedAllCategoryNames = CommonFunction.sort( nameToCategories.keySet());
		sortedAllCategoryNames.add(noneCatetoryName);
		Map<String, List<String>> categoryToFuncLists = new HashMap<String, List<String>>();
		for(int i=0;i<sortedAllCategoryNames.size();i++){
			categoryToFuncLists.put(sortedAllCategoryNames.get(i), new ArrayList());
		}

		List<String> sortedAllFunctionNames = CommonFunction.sort( nameToFunctions.keySet());
		for(int i=0;i<sortedAllFunctionNames.size();i++){
			String functionName = sortedAllFunctionNames.get(i);
			Function func = nameToFunctions.get(functionName);
			List<String> funcStrList = null;
			String categoryName = func.getCategory().toLowerCase();
			if(nameToCategories.containsKey(categoryName)){
				funcStrList = categoryToFuncLists.get(categoryName);
			}
			else{
				funcStrList = categoryToFuncLists.get(noneCatetoryName);
			} 
			
			StringBuilder ss = new StringBuilder();
			ss.append("    \"" + func.getName() + "\":{\r\n");
			ss.append("      name:\"" + func.getName() + "\", ");
			ss.append("description:\"" + CommonFunction.generateInnerStr(func.getDescription()) + "\","); 
			ss.append("runAt:\"" + func.getRunAt().toString() + "\",\r\n");  
			ss.append("      settings:[\r\n");  
			List<FunctionSetting> allFunctionSettings = func.getAllFunctionSettings();
			if(allFunctionSettings != null){
				for(int j=0;j<allFunctionSettings.size();j++){
					FunctionSetting setting = allFunctionSettings.get(j);
					ss.append("        {\r\n");
					ss.append("          description:\"" + CommonFunction.generateInnerStr(setting.getDescription()) + "\",\r\n");
					ss.append("          valueType:\"" + setting.getResultType().toString().toLowerCase() + "\",\r\n");
					ss.append("          valueTypeDes:\"" + CommonFunction.generateInnerStr( nameToValueTypeDeses.containsKey(setting.getResultType().toLowerCase()) ? nameToValueTypeDeses.get(setting.getResultType().toLowerCase()).getDescription() : setting.getResultType() )+ "\",\r\n");
					ss.append("          parameters:[\r\n");
					List<Parameter> allParameters = setting.getAllParameters();
					if(allParameters != null){
						for(int k=0;k<allParameters.size();k++){
							Parameter p = allParameters.get(k);
							ss.append("            {name:\"" + CommonFunction.generateInnerStr(p.getName()) + "\", ");
							ss.append("valueType:\"" + p.getValueType().toString().toLowerCase() + "\", ");
							ss.append("valueTypeDes:\"" + CommonFunction.generateInnerStr( nameToValueTypeDeses.containsKey(p.getValueType().toLowerCase()) ? nameToValueTypeDeses.get(p.getValueType().toLowerCase()).getDescription() : p.getValueType() )+ "\", ");
							ss.append("description:\"" + CommonFunction.generateInnerStr(p.getDescription()) + "\"}");
							ss.append(k == allParameters.size()-1 ? "\r\n":",\r\n");
						}
					}
					ss.append("          ]\r\n");
					ss.append("        }" + (j == allFunctionSettings.size()-1 ? "\r\n" : ",\r\n"));
				}
			}

			ss.append("      ]\r\n");
			ss.append("    }");
			funcStrList.add(ss.toString());
		} 
		
		StringBuilder fullS= new StringBuilder();
		fullS.append("var expFunctions = {\r\n");
		for(int i=0;i<sortedAllCategoryNames.size();i++){
			String categoryName = sortedAllCategoryNames.get(i);
			List<String> funcStrList = categoryToFuncLists.get(categoryName);
			Category category = nameToCategories.get(categoryName);
			fullS.append("  \"" + CommonFunction.generateInnerStr(category == null ? categoryName : category.getDescription()) + "\":{\r\n");
			//fullS.append("  \"" + CommonFunction.generateInnerStr(categoryName) + "\":{\r\n");
			for(int j=0;j<funcStrList.size();j++){
				String funcS =  funcStrList.get(j);
				fullS.append(funcS + (j == funcStrList.size()-1 ? "\r\n" : ",\r\n"));
			}
			fullS.append("  }" +(i == sortedAllCategoryNames.size()-1?"\r\n":",\r\n"));
		}
		fullS.append("  }");
		
		FileOperate fileOperate = new FileOperate();
		fileOperate.createFile(jsFilePath, fullS.toString());
		
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		// TODO Auto-generated method stub
		initFromFile();
	}

}
