package com.zlp.mdl.processor;
  
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException; 
import javax.imageio.ImageIO;
import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGEncodeParam;
import com.sun.image.codec.jpeg.JPEGImageEncoder;  

public class PictureProcessor implements IPictureProcessor{
	  
	//图片目录
	private String pictureDirPath = ""; 
	public void setPictureDirPath(String pictureDirPath) {
		 this.pictureDirPath = pictureDirPath;
	} 
	protected String getPictureDirPath() {
		return pictureDirPath;
	}    
	 
	protected String getPictureFilePath(String pictureFileName){
		return this.getPictureDirPath() + "/" + pictureFileName;
	}

	@Override
	public byte[] getImageData(String imageFileName, double width, double height, double x1, double x2, double y1, double y2) throws Exception{
		String imageFilePath = this.getPictureFilePath(imageFileName);
		String partImageName = imageFileName + "_parts" + "/" + width+ "_" + height + "_" + x1 + "_" + x2 + "_" + y1 + "_" + y2 + ".jpg"; 
		String partImageFilePath = this.getPictureFilePath(partImageName);
		File partFile = new File(partImageFilePath);
		if(!partFile.exists()){
			String dirPath = partFile.getParent();
			File dir = new File(dirPath);
			if(!dir.exists()){
				dir.mkdir();
			}
			this.generatePartImageFile(imageFilePath, partImageFilePath, width, height, x1, x2, y1, y2);
		}
		return this.getImageData(partImageFilePath);
	}
	

    private byte[] getImageData(String imageFilePath) throws Exception{
        FileInputStream fis = null;
        try { 
	        File file = new File(imageFilePath);
	        fis = new FileInputStream(file);
	
	        long size = file.length();
	        byte[] temp = new byte[(int) size];
	        fis.read(temp, 0, (int) size); 
	        byte[] data = temp;
			return data;  
        }
        catch (Exception e) { 
			throw e;
		}   
		finally{
			if(fis != null){
				fis.close();
			} 
		}     
    }
	
	private void generatePartImageFile(String imageFilePath, String partImageFilePath, double width, double height, double x1, double x2, double y1, double y2) throws FileNotFoundException, IOException{
		File pictureFile = new File(imageFilePath);		
		
		BufferedImage sourceImage = ImageIO.read(new FileInputStream(pictureFile));
		int pixWidth = sourceImage.getWidth();
		int pixHeight = sourceImage.getHeight();
		int pixX1 = (int) Math.ceil((pixWidth / width) * x1);
		int pixX2 = (int) Math.floor((pixWidth / width) * x2);
		int pixY1 = (int) Math.ceil((pixHeight / height) * y1);
		int pixY2 = (int) Math.floor((pixHeight / height) * y2);

		
		BufferedImage partImage = sourceImage.getSubimage(pixX1, pixY1, pixX2 - pixX1, pixY2 - pixY1); 
	 	FileOutputStream fos = null;
	 	try{
	 		fos = new FileOutputStream(partImageFilePath); 
		 	JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(fos); 
		 	JPEGEncodeParam param = encoder.getDefaultJPEGEncodeParam(partImage);		 	
		 	param.setQuality(1, false);
		 	encoder.encode(partImage);  
	 	}
	 	catch(Exception ex){
	 		throw ex;
	 	}
	 	finally{
	 		if(fos != null){
	 			fos.close();
	 		}
	 	}
	} 
}