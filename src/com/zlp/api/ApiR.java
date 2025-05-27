package com.zlp.api;

import com.alibaba.fastjson.JSONObject;
import com.zlp.platform.common.SysConfig;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class ApiR implements Serializable{
    private static final long serialVersionUID = 1L;

    //抛出异常 try中用
    public static Exception error(String code,String msg){ 
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code",code);
        jsonObject.put("msg",msg);
        return new Exception(jsonObject.toString());
    }

    public static Exception error(){
        return error("500","未知错误,请联系管理员");
    }
    public static Exception error(String msg){
        return error("500",msg);
    }

    //过滤异常 catch中用
    public static String  error(Exception ex){
        String message = ex.getMessage();
        if(message.indexOf("code")<0){
             message = error(message).getMessage();
        }
        JSONObject jsonObject = JSONObject.parseObject(message);
        return jsonObject.toString();
    }


    //正确结果
    public static String ok(String msg){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code","000");
        jsonObject.put("msg",msg);
        return jsonObject.toString();
    }
    public static String ok(){
        return ok("success");
    }

    public static String ok(String msg,Map<String ,Object> map){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code","000");
        jsonObject.put("msg",msg);
        JSONObject dataJson = new JSONObject();
        for(String key : map.keySet()){
        	dataJson.put(key, map.get(key));
        }
        jsonObject.put("data", dataJson);
        return jsonObject.toString();
    }
    public static String ok(Map<String ,Object> map){
        return ok("success",map);
    }


    //日期异常
    public static Date convertToTime(String str, String format) throws Exception {
        if (str != null && !str.isEmpty()) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat(format != null && !format.isEmpty() ? format : SysConfig.getTimeFormat());
                Date date = sdf.parse(str);
                return date;
            } catch (Exception var4) {
                throw ApiR.error("数据转换为时间类型失败, 值为'" + str + "'。");
            }
        } else {
            return null;
        }
    }
    public static void convertToTime(String beginTimeStr, String endTimeStr, String s) throws Exception{
        Date begin = convertToTime(beginTimeStr, s);
        Date end = convertToTime(endTimeStr, s);
        //超过1个月 报错
        long l = end.getTime() - begin.getTime();
        if(l<0||l>31 * 24 * 60 * 60 * 1000L){
            throw ApiR.error("015",Constant.CODE_015);
        }

    }
    //获取下一个月字符串
    public static String greatMonthStr(String timeStr) throws Exception {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = sdf.parse(timeStr);
            Calendar instance = Calendar.getInstance();
            instance.setTime(date);
            instance.add(Calendar.MONTH,1);
            return sdf.format(instance.getTime());
        } catch (Exception var4) {
            throw ApiR.error("数据转换为时间类型失败, 值为'" + timeStr + "'。");
        }
    }



}
