package com.finorbit;

public class Constants {

    public static final String UAT_BASE_URL = "https://uat.erb.ai/";
    public static final String PRO_BASE_URL = "https://erb.ai/";

    public static final String UAT_SERVER_TIME = UAT_BASE_URL+"corporate_tool/Apis/dialerapi/servertime.php";
    public static final String PRO_SERVER_TIME = PRO_BASE_URL+"finpro/appapi/dialerapi/servertime.php";

    /**
     * return main Url
     * @param isProduction
     * @return
     */
    public static String getMainUrl(boolean isProduction){
        return isProduction ? PRO_BASE_URL : UAT_BASE_URL;
    }
}
