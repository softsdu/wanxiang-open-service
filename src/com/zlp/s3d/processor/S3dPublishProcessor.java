package com.zlp.s3d.processor;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.FileOperate;
import com.zlp.platform.common.INcpSession;
import com.zlp.platform.dao.db.DataRow;
import com.zlp.platform.dao.db.IDBParserAccess;
import com.zlp.platform.dao.sys.ContextUtil;
import org.hibernate.Session;

import java.io.*;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class S3dPublishProcessor implements IS3dPublishProcessor {

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

	private IS3dSystemProcessor s3dSystemProcessor = null;
	public void setS3dSystemProcessor(IS3dSystemProcessor s3dSystemProcessor){
		this.s3dSystemProcessor = s3dSystemProcessor;
	}
	protected IS3dSystemProcessor getS3dSystemProcessor(){
		return this.s3dSystemProcessor;
	}

	private IS3dImageProcessor s3dImageProcessor = null;
	public void setS3dImageProcessor(IS3dImageProcessor s3dImageProcessor){
		this.s3dImageProcessor = s3dImageProcessor;
	}
	protected IS3dImageProcessor getS3dImageProcessor(){
		return this.s3dImageProcessor;
	}

	private IS3dModelProcessor s3dModelProcessor = null;
	public void setS3dModelProcessor(IS3dModelProcessor s3dModelProcessor){
		this.s3dModelProcessor = s3dModelProcessor;
	}
	protected IS3dModelProcessor getS3dModelProcessor(){
		return this.s3dModelProcessor;
	}

	private IS3dSkyProcessor s3dSkyProcessor = null;
	public void setS3dSkyProcessor(IS3dSkyProcessor s3dSkyProcessor){
		this.s3dSkyProcessor = s3dSkyProcessor;
	}
	protected IS3dSkyProcessor getS3dSkyProcessor(){
		return this.s3dSkyProcessor;
	}

	private IS3dContent2DProcessor s3dContent2DProcessor = null;
	public void setS3dContent2DProcessor(IS3dContent2DProcessor s3dContent2DProcessor){
		this.s3dContent2DProcessor = s3dContent2DProcessor;
	}
	protected IS3dContent2DProcessor getS3dContent2DProcessor(){
		return this.s3dContent2DProcessor;
	}

	private String getPublishUserModelDir(INcpSession session, String modelId){
		String userId = session.getUserId();
		String dir = ContextUtil.getAbsolutePath() + "/web/design/s3d/publish/appResources/user/" + userId + "/" + modelId + "/";
		return dir;
	}

	private String getPublishModuleDir(){
		String dir = ContextUtil.getAbsolutePath() + "/web/design/s3d/publish/module/";
		return dir;
	}

	private String getPublishTempDir(){
		String dir = ContextUtil.getAbsolutePath() + "/web/design/s3d/publish/temp/";
		return dir;
	}

	private String getPublishRootDir(){
		String dir = ContextUtil.getAbsolutePath() + "/web/design/s3d/publish/";
		return dir;
	}

	@Override
	public void publishModel(INcpSession session, String modelId) throws Exception {
		IS3dModelProcessor s3dModelProcessor = this.getS3dModelProcessor();
		s3dModelProcessor.setDBSession(this.getDBSession());
		DataRow modelRow = s3dModelProcessor.getModelRow(session, modelId);
		String modelCreateUserId = modelRow.getStringValue("createuser_xid");
		String userId = session.getUserId();
		if(userId.equals(modelCreateUserId)) {
			String accessoryId = modelRow.getStringValue("accessoryid");
			String modelText = s3dModelProcessor.getModelAccessoryText(session, accessoryId);
			JSONObject modelJson = JSONObject.parseObject(modelText);

			FileOperate fo = new FileOperate();

			//发布目录publishDir
			String publishDir = this.getPublishUserModelDir(session, modelId);
			File dir = new File(publishDir);
			if(dir.exists()) {
				fo.delFolder(publishDir);
			}
			fo.createFolderRecursion(dir);

			//输出的config目录
			String configDir = publishDir + "config/";
			fo.createFolder(configDir);

			//生成使用到的componentList.js
			JSONArray componentJArray = this.publishComponentListConfigFile(session, modelJson, configDir);

			//生成使用到的materialList.js
			List<String> materialImageNames = this.publishMaterialListConfigFile(session, userId, modelJson, configDir);

			//生成使用到的materialList.js
			List<String> skyImageNames = this.getSkyImages(session, modelJson);

			List<List<String>> allImageLists = new ArrayList<>();
			allImageLists.add(materialImageNames);
			allImageLists.add(skyImageNames);

			List<String> imageNames = this.mergeImageNames(allImageLists);

			//生成使用到的imageList.js
			this.publishImageListConfigFile(session, imageNames, configDir);

			//生成使用到的skyMap.js
			List<String> skyNames = this.publishSkyMapConfigFile(session, modelJson, configDir);

			//生成使用到的content2D
			JSONObject content2DConfigJson = this.publishContent2DConfigFile(session, modelJson, configDir);

			//拷贝模型s3dc文件到发布目录
			this.publishS3dcFile(session, modelJson, configDir);

			//拷贝所有的component模型文件到发布目录
			this.publishComponentFiles(session, userId, componentJArray, publishDir);

			//拷贝所有的图片文件到发布目录
			this.publishImageFiles(session, userId, imageNames, publishDir);

			//拷贝天空盒文件到发布目录
			this.publishSkyFiles(session, skyNames, publishDir);

			//暂不实现，拷贝Content2D文件到发布目录
			//this.publishContent2DFiles(session, content2DConfigJson, publishDir);
		}
		else{
			throw new Exception("当前用户非项目创建人, 不允许发布.");
		}
	}

	@Override
	public String generatePublishZipFile(INcpSession session, String modelId) throws Exception {
		String destZipDirPath = this.getPublishTempDir() + session.getUserId() + "/";
		FileOperate fo = new FileOperate();
		fo.createFolder(destZipDirPath);
		String relativeZipFilePath =  session.getUserId() + "/" + modelId + ".zip";
		String destZipFilePath = this.getPublishTempDir() + relativeZipFilePath;
		String publishRootPath = this.getPublishRootDir();

		ZipOutputStream zos = null;
		try{
			zos = new ZipOutputStream (new FileOutputStream(destZipFilePath)) ;

			//当前模型的资源文件
			String userModelResourceDirPath = this.getPublishUserModelDir(session, modelId);
			File userModelResourceDir = new File (userModelResourceDirPath);
			String userModelResourceDirName = userModelResourceDirPath.substring(publishRootPath.length(), userModelResourceDirPath.length() - 1);
			this.zipSubDir(zos, userModelResourceDirName, userModelResourceDir);

			//拷贝程序运行所需的代码文件
			String moduleDirPath = this.getPublishModuleDir();
			File moduleDir = new File (moduleDirPath) ;
			String moduleDirName = moduleDirPath.substring(publishRootPath.length(), moduleDirPath.length() - 1);
			this.zipSubDir(zos, moduleDirName, moduleDir);
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(zos != null){
				zos.close();
			}
		}
		return relativeZipFilePath;
	}

	private void zipSubDir(ZipOutputStream zos, String parentFilePath, File dir) throws IOException{
		File[] subFiles = dir.listFiles();
		for(int i = 0; i < subFiles.length; i++){
			File subFile = subFiles[i];
			if(subFile.isDirectory()){
				String subParentFilePath = parentFilePath + File.separator + subFile.getName();
				this.zipSubDir(zos, subParentFilePath, subFile);
			}
			else{
				BufferedInputStream bis = null;
				try{
					bis = new BufferedInputStream(new FileInputStream(subFiles[i]));
					zos.putNextEntry(new ZipEntry(parentFilePath + File.separator + subFiles[i].getName()));
					while(true){
						byte[] b = new byte[100];
						int len = bis.read(b);
						if(len == -1){
							break ;
						}
						zos.write(b, 0, len);
					}
				}
				catch(Exception ex){
					throw ex;
				}
				finally{
					if(bis != null){
						bis.close();
					}
				}
			}
		}
	}

	private List<String> mergeImageNames(List<List<String>> allImageLists){
		HashMap<String, Boolean> imageNameMap = new HashMap<>();
		List<String> imageNames = new ArrayList<>();
		for(int i = 0; i < allImageLists.size(); i++){
			List<String> imageList = allImageLists.get(i);
			for(int j = 0; j < imageList.size(); j++){
				String imageName = imageList.get(j);
				if(!imageNameMap.containsKey(imageName)){
					imageNameMap.put(imageName, true);
					imageNames.add(imageName);
				}
			}
		}
		return imageNames;
	}

	private JSONArray publishComponentListConfigFile(INcpSession session, JSONObject modelJson, String publishDir) throws Exception {
		JSONArray componentJArray = new JSONArray();
		JSONArray componentLocalJArray = new JSONArray();
		JSONArray componentServerJArray = new JSONArray();
		JSONObject objectMap = modelJson.getJSONObject("objectMap");
		for(String objectId : objectMap.keySet()){
			JSONObject objectJson = objectMap.getJSONObject(objectId);
			boolean isLocal = objectJson.containsKey("isLocal") ? objectJson.getBoolean("isLocal") : false;
			boolean isServer = objectJson.containsKey("isServer") ? objectJson.getBoolean("isServer") : false;
			if(isLocal || isServer){
				String code = objectJson.getString("code");
				String versionNum = objectJson.getString("versionNum");
				JSONObject componentJson = new JSONObject();
				componentJson.put("code", code);
				componentJson.put("versionNum", versionNum);
				componentJArray.add(componentJson);

				if(isLocal){
					JSONObject componentLocalJson = new JSONObject();
					componentLocalJson.put("code", code);
					componentLocalJson.put("versionNum", versionNum);
					componentLocalJArray.add(componentLocalJson);
				}
				if(isServer){
					JSONObject componentServerJson = new JSONObject();
					componentServerJson.put("code", code);
					componentServerJson.put("versionNum", versionNum);
					componentServerJArray.add(componentServerJson);
				}
			}
		}

		IS3dSystemProcessor systemProcessor = this.getS3dSystemProcessor();
		systemProcessor.setDBSession(this.getDBSession());
		JSONArray componentListJArray = systemProcessor.generateComponentConfigJArray(session, componentLocalJArray, componentServerJArray);
		String materialConfigText = "export const componentList = "
				+ componentListJArray.toJSONString()
				+ ";";
		String filePath = publishDir + "componentList.js";
		FileOperate fo = new FileOperate();
		fo.createFile(filePath, materialConfigText, FileOperate.DefaultEncoding);

		return componentListJArray;
	}

	private List<String> publishMaterialListConfigFile(INcpSession session, String userId, JSONObject modelJson, String publishDir) throws Exception {
		String[] imageFieldNames = new String[]{"imageName", "normalImageName", "opacityImageName", "metalnessImageName", "roughnessImageName"};
		HashMap<String, Boolean> imageNameMap = new HashMap<>();
		List<String> imageNames = new ArrayList<>();

		HashMap<String, Boolean> userMaterialMap = new HashMap<>();
		JSONArray userMaterialJArray = modelJson.getJSONArray("materials");
		for(int i = 0; i < userMaterialJArray.size(); i++){
			JSONObject userMaterialJson = userMaterialJArray.getJSONObject(i);
			String code = userMaterialJson.getString("code");
			userMaterialMap.put(code, true);

			for(String fieldName : imageFieldNames){
				String imageName = userMaterialJson.getString(fieldName);
				if(imageName != null && !imageName.isEmpty() && !imageNameMap.containsKey(imageName)){
					imageNameMap.put(imageName, true);
					imageNames.add(imageName);
				}
			}
		}

		HashMap<String, Boolean> serverMaterialMap = new HashMap<>();
		JSONArray serverMaterialJArray = new JSONArray();
		List<String> materialCodes = new ArrayList<>();
		JSONObject objectMap = modelJson.getJSONObject("objectMap");
		for(String objectId : objectMap.keySet()){
			JSONObject objectJson = objectMap.getJSONObject(objectId);
			boolean isLocal = objectJson.containsKey("isLocal") ? objectJson.getBoolean("isLocal") : false;
			boolean isServer = objectJson.containsKey("isServer") ? objectJson.getBoolean("isServer") : false;
			if(isLocal || isServer){
				JSONObject objectMaterialMap = objectJson.getJSONObject("materials");
				for(String key : objectMaterialMap.keySet()) {
					String code = objectMaterialMap.getJSONObject(key).getString("name");
					if(code != null
							&& !userMaterialMap.containsKey(code)
							&& !serverMaterialMap.containsKey(code)){
						serverMaterialMap.put(code, true);
						materialCodes.add(code);
					}
				}
			}
		}

		IS3dSystemProcessor systemProcessor = this.getS3dSystemProcessor();
		systemProcessor.setDBSession(this.getDBSession());
		JSONArray materialConfigArray = systemProcessor.getMaterialConfigArray(userId, materialCodes);
		String materialConfigText = "export const materialList = "
				+ materialConfigArray.toJSONString()
				+ ";";
		String filePath = publishDir + "materialList.js";
		FileOperate fo = new FileOperate();
		fo.createFile(filePath, materialConfigText, FileOperate.DefaultEncoding);

		for(int i = 0; i < materialConfigArray.size(); i++){
			JSONObject materialConfigJson = materialConfigArray.getJSONObject(i);
			for(String fieldName : imageFieldNames){
				String imageName = materialConfigJson.getString(fieldName);
				if(imageName != null && !imageName.isEmpty() && !imageNameMap.containsKey(imageName)){
					imageNameMap.put(imageName, true);
					imageNames.add(imageName);
				}
			}
		}
		return imageNames;
	}


	private List<String> getSkyImages(INcpSession session, JSONObject modelJson) throws Exception {
		HashMap<String, Boolean> imageNameMap = new HashMap<>();
		List<String> imageNames = new ArrayList<>();

		List<JSONObject> skyJsons = new ArrayList<>();
		//默认sky
		skyJsons.add(modelJson.getJSONObject("scene").getJSONObject("sky"));

		//2D页面里定义的sky
		JSONObject content2DJson = modelJson.getJSONObject("content2D");
		if(content2DJson != null){
			JSONArray pageJsons = content2DJson.getJSONArray("pageList");
			if(pageJsons != null){
				for(int i = 0; i < pageJsons.size(); i++){
					JSONObject pageJson = pageJsons.getJSONObject(i);
					JSONObject skyJson = pageJson.getJSONObject("sky");
					if(skyJson != null){
						skyJsons.add(skyJson);
					}
				}
			}
		}
		for(int i = 0; i < skyJsons.size(); i++){
			JSONObject skyJson = skyJsons.get(i);
			String imageName = skyJson.getString("backgroundImage");
			if(imageName != null && imageName.length() > 0 && !imageNameMap.containsKey(imageName)){
				imageNameMap.put(imageName, true);
				imageNames.add(imageName);
			}
		}
		return imageNames;
	}

	private void publishImageListConfigFile(INcpSession session, List<String> imageNames, String publishDir) throws Exception {
		IS3dImageProcessor imageProcessor = this.getS3dImageProcessor();
		imageProcessor.setDBSession(this.getDBSession());

		JSONArray imageListJArray = new JSONArray();
		for(int i = 0; i < imageNames.size(); i++){
			String imageName = imageNames.get(i);
			JSONObject imageJson = new JSONObject();
			imageJson.put("code", imageName);
			imageJson.put("name", imageName);
			imageJson.put("url", imageName);
			imageListJArray.add(imageJson);
		}

		String imageConfigText = "export const imageList = "
				+ imageListJArray.toJSONString()
				+ ";";
		String filePath = publishDir + "imageList.js";
		FileOperate fo = new FileOperate();
		fo.createFile(filePath, imageConfigText, FileOperate.DefaultEncoding);
	}

	private List<String> publishSkyMapConfigFile(INcpSession session, JSONObject modelJson, String configDir) throws Exception {
		HashMap<String, Boolean> skyNameMap = new HashMap<>();
		List<String> skyNames = new ArrayList<>();

		String defaultSkyName = modelJson.getJSONObject("scene").getJSONObject("sky").getString("name");
		skyNameMap.put(defaultSkyName, true);

		//2D页面里定义的sky
		JSONObject content2DJson = modelJson.getJSONObject("content2D");
		if(content2DJson != null){
			JSONArray pageJsons = content2DJson.getJSONArray("pageList");
			if(pageJsons != null){
				for(int i = 0; i < pageJsons.size(); i++){
					JSONObject pageJson = pageJsons.getJSONObject(i);
					JSONObject skyJson = pageJson.getJSONObject("sky");
					if(skyJson != null){
						String skyName = skyJson.getString("name");
						if(!skyNameMap.containsKey(skyName)) {
							skyNameMap.put(skyName, true);
						}
					}
				}
			}
		}

		IS3dSkyProcessor skyProcessor = this.getS3dSkyProcessor();
		skyProcessor.setDBSession(this.getDBSession());
		JSONObject skyConfigJson = new JSONObject();
		for(String skyName : skyNameMap.keySet()) {
			JSONObject skyJson = skyProcessor.getSkyJson(session, skyName);
			skyConfigJson.put(skyName, skyJson);
			skyNames.add(skyName);
		}
		String skyConfigText = "export const skyMap = " + skyConfigJson.toJSONString() + ";";
		String filePath = configDir + "skyMap.js";
		FileOperate fo = new FileOperate();
		fo.createFile(filePath, skyConfigText, FileOperate.DefaultEncoding);
		return skyNames;
	}

	private JSONObject publishContent2DConfigFile(INcpSession session, JSONObject modelJson, String configDir) throws Exception {
		JSONObject content2DJson = modelJson.getJSONObject("content2D");
		String navigatorCode = content2DJson.getString("navigatorCode");
		JSONArray pageJsons = content2DJson.getJSONArray("pageList");
		HashMap<String, JSONObject> themeModuleMap = new HashMap<>();
		for(int i = 0; i < pageJsons.size(); i++){
			JSONObject pageJson = pageJsons.getJSONObject(i);
			String themeCode = pageJson.getString("themeCode");
			String moduleCode = pageJson.getString("moduleCode");
			String key = themeCode + "_" + moduleCode;
			if(!themeModuleMap.containsKey(key)){
				JSONObject moduleJson = new JSONObject();
				moduleJson.put("themeCode",themeCode);
				moduleJson.put("moduleCode",moduleCode);
				themeModuleMap.put(key, moduleJson);
			}
		}

		IS3dContent2DProcessor content2DProcessor = this.getS3dContent2DProcessor();
		content2DProcessor.setDBSession(this.getDBSession());
		JSONObject content2DConfigJson = content2DProcessor.getContent2DJson(session, navigatorCode, themeModuleMap);
		String skyConfigText = "export const content2D = " + content2DConfigJson.toJSONString() + ";";
		String filePath = configDir + "content2D.js";
		FileOperate fo = new FileOperate();
		fo.createFile(filePath, skyConfigText, FileOperate.DefaultEncoding);
		return content2DConfigJson;
	}

	private void publishComponentFiles(INcpSession session, String userId, JSONArray componentJArray, String publishDir) throws Exception {
		JSONArray componentJsons = componentJArray.getJSONObject(0).getJSONArray("components");
		IS3dSystemProcessor systemProcessor = this.getS3dSystemProcessor();
		String sourceDir = systemProcessor.getUserComponentFolder(userId);
		FileOperate fo = new FileOperate();
		String toComponentDirPath = publishDir + "files/";
		fo.createFolder(toComponentDirPath);
		for(int i = 0; i < componentJsons.size(); i++){
			JSONObject componentJson = componentJsons.getJSONObject(i);
			JSONObject fileInfo = componentJson.getJSONObject("fileInfo");
			String dirName = fileInfo.getString("directory");
			String fromDirPath = sourceDir + dirName + "/";
			String toDirPath = toComponentDirPath + dirName + "/";
			fo.createFolder(toDirPath);
			fo.copyDir(fromDirPath, toDirPath);
		}
	}

	private void publishImageFiles(INcpSession session, String userId, List<String> imageNames, String publishDir) throws Exception {
		IS3dSystemProcessor systemProcessor = this.getS3dSystemProcessor();
		FileOperate fo = new FileOperate();
		String splitter = "://";
		for(int i = 0; i < imageNames.size(); i++){
			String imageName = imageNames.get(i);
			int splitterIndex = imageName.indexOf(splitter);
			String imageFileName = imageName;
			boolean isLocalImage = false;
			boolean isSystemImage = false;
			if(splitterIndex >= 0){
				String prefixStr = imageName.substring(0, splitterIndex).toLowerCase();
				if(prefixStr.equals("local")){
					isLocalImage = true;
					imageFileName = imageName.substring(splitterIndex + splitter.length());
				}
				else if(prefixStr.equals("system")){
					isSystemImage = true;
					imageFileName = imageName.substring(splitterIndex + splitter.length());
				}
			}
			else{
				isLocalImage = true;
			}

			String sourceDir = "";
			String toImageDirPath = "";
			if(isLocalImage) {
				sourceDir = systemProcessor.getUserImageFolder(userId);
				toImageDirPath = publishDir + "images/user/";
				String fromFilePath = sourceDir + imageFileName;
				String toFilePath = toImageDirPath + imageFileName;
				File toImageDir = new File(toImageDirPath);
				fo.createFolderRecursion(toImageDir);
				fo.copyFile(fromFilePath, toFilePath);
			}
			else if(isSystemImage){
				sourceDir = systemProcessor.getSystemImageFolder();
				toImageDirPath = publishDir + "images/system/";
				String fromFilePath = sourceDir + imageFileName + ".jpg";
				String toFilePath = toImageDirPath + imageFileName + ".jpg";
				File toImageDir = new File(toImageDirPath);
				fo.createFolderRecursion(toImageDir);
				fo.copyFile(fromFilePath, toFilePath);
			}
		}
	}

	private void publishSkyFiles(INcpSession session, List<String> skyNames, String publishDir) throws Exception {
		IS3dSkyProcessor skyProcessor = this.getS3dSkyProcessor();
		String sourceDir =  ContextUtil.getAbsolutePath() + "/" + skyProcessor.getS3dResourcesRelativeFolder();
		FileOperate fo = new FileOperate();
		String toSkyDirPath = publishDir + "skies/";
		fo.createFolder(toSkyDirPath);
		for(int i = 0; i < skyNames.size(); i++) {
			String skyName = skyNames.get(i);
			if(!skyName.equals("None")) {
				String fromDirPath = sourceDir + skyName;
				String toDirPath = toSkyDirPath + skyName;
				fo.createFolder(toDirPath);
				fo.copyDir(fromDirPath, toDirPath);
			}
		}
	}

	private void publishContent2DFiles(INcpSession session, JSONObject content2DConfigJson, String publishDir) throws Exception {
		IS3dContent2DProcessor content2DProcessor = this.getS3dContent2DProcessor();
		String sourceDir =  ContextUtil.getAbsolutePath() + "/" + content2DProcessor.getS3dResourcesRelativeFolder();
		FileOperate fo = new FileOperate();
		String content2DDirPath = publishDir + "content2D/";
		fo.createFolder(content2DDirPath);

		String toNavigatorDirPath = content2DDirPath + "navigator/";
		JSONArray navigatorJsons = content2DConfigJson.getJSONArray("navigators");
		for(int i = 0; i < navigatorJsons.size(); i++){
			JSONObject navigatorJson = navigatorJsons.getJSONObject(i);
			String navigatorCode = navigatorJson.getString("code");
			String navigatorSourceDirPath = sourceDir + "navigator/" + navigatorCode + "/";
			String navigatorToDirPath = toNavigatorDirPath + navigatorCode + "/";
			fo.copyDir(navigatorSourceDirPath, navigatorToDirPath);
		}

		String toThemeDirPath = content2DDirPath + "theme/";
		JSONArray themeJsons = content2DConfigJson.getJSONArray("themes");
		for(int i = 0; i < themeJsons.size(); i++){
			JSONObject themeJson = themeJsons.getJSONObject(i);
			String themeCode = themeJson.getString("code");
			String themeSourceDirPath = sourceDir + "theme/" + themeCode + "/";
			String themeToDirPath = toThemeDirPath + themeCode + "/";
			File themeToDir = new File(themeToDirPath);
			fo.createFolderRecursion(themeToDir);
			fo.copyDir(themeSourceDirPath, themeToDirPath);
		}
	}

	private void publishS3dcFile(INcpSession session, JSONObject modelJson, String publishDir) throws Exception {
		String modelText = modelJson.toJSONString();
		FileOperate fo = new FileOperate();
		String filePath = publishDir + "model.s3dc";
		fo.createFile(filePath, modelText, FileOperate.DefaultEncoding);
	}

}
