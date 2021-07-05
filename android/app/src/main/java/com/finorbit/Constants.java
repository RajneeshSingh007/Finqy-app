package com.finorbit;

public class Constants {

    private static final boolean isProduction = true;
    public static final String UAT_BASE_URL = "https://uat.erb.ai/";
    public static final String PRO_BASE_URL = "https://finqy.ai/";

    public static final String UAT_SERVER_TIME = UAT_BASE_URL+"corporate_tool/Apis/dialerapi/servertime.php";
    public static final String PRO_SERVER_TIME = PRO_BASE_URL+"partner/appapi/dialerapi/servertime.php";

    public static final String FIRESTORE_COLLECTION_UAT = "checkincheckout";
    public static final String FIRESTORE_COLLECTION_PRO = "live_checkincheckout";

    public static final int SERVICES_NOTIFICATION_ID = 124;


    /**
     * return main Url
     * @return
     */
    public static String getMainUrl(){
        return isProduction ? PRO_BASE_URL : UAT_BASE_URL;
    }

    /**
     * return firestoreCollection Url
     * @return
     */
    public static String getFirestoreCollection(){
        return isProduction ? FIRESTORE_COLLECTION_PRO : FIRESTORE_COLLECTION_UAT;
    }
}
