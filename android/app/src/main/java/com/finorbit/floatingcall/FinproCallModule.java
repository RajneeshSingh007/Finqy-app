package com.finorbit.floatingcall;

import android.Manifest;
import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Build;
import android.provider.CallLog;
import android.provider.ContactsContract;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.PermissionChecker;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.finorbit.Constants;
import com.finorbit.caller.CallerService;
import com.finorbit.idle.IdleService;

import org.json.JSONArray;
import org.json.JSONException;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.annotation.Nullable;

public class FinproCallModule extends ReactContextBaseJavaModule {

    private static final String error = "Permission was not granted";
    public static ReactApplicationContext mReactContext;
    public static int DRAW_OVER_OTHER_APP_PERMISSION_REQUEST_CODE = 1122;
    public static int IGNORE_BATTERY_OPTIMIZATION_REQUEST = 1123;
    private Promise mPromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            super.onActivityResult(activity, requestCode, resultCode, data);
            if (requestCode == DRAW_OVER_OTHER_APP_PERMISSION_REQUEST_CODE) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (Settings.canDrawOverlays(activity.getApplicationContext())) {
                        mPromise.resolve(true);
                    } else {
                        mPromise.reject(new Throwable(error));
                    }
                } else {
                    mPromise.resolve(true);
                }
            }
        }
    };

    public FinproCallModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mReactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "FinproCallModule";
    }

    @ReactMethod
    public void stopService(Promise promise) {
        try {
            Intent intent = new Intent(FloatingWidgetService.FLOATING_WIDGET_ID);
            intent.setClass(this.getReactApplicationContext(), FloatingWidgetService.class);
            this.getReactApplicationContext().stopService(intent);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
        promise.resolve(true);
    }

    @ReactMethod
    public void startService(Promise promise) {
        try {
            Intent intent = new Intent(FloatingWidgetService.FLOATING_WIDGET_ID);
            intent.setClass(this.getReactApplicationContext(), FloatingWidgetService.class);
            getReactApplicationContext().startService(intent);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
        promise.resolve(true);
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @ReactMethod
    public void askPermission(Promise promise) {
        mPromise = promise;
        if (!Settings.canDrawOverlays(mReactContext)) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + mReactContext.getPackageName()));
            mReactContext.startActivityForResult(intent, DRAW_OVER_OTHER_APP_PERMISSION_REQUEST_CODE, null);
        } else {
            promise.resolve(true);
        }
    }

    public static ReactApplicationContext getReactContext() {
        return mReactContext;
    }

    @ReactMethod
    public void requestCallsPermission(Promise promise) {
        int readPhoneState = ContextCompat.checkSelfPermission(mReactContext, Manifest.permission.READ_PHONE_STATE);
        int read_call_log = ContextCompat.checkSelfPermission(mReactContext, Manifest.permission.READ_CALL_LOG);
        //int processOutgoingCalls = ContextCompat.checkSelfPermission(mReactContext, Manifest.permission.PROCESS_OUTGOING_CALLS);
        String permissions = "";
        if (readPhoneState != PackageManager.PERMISSION_GRANTED) {
            permissions = Manifest.permission.READ_PHONE_STATE;
        }
        if (read_call_log != PackageManager.PERMISSION_GRANTED) {
            permissions = Manifest.permission.READ_CALL_LOG;
        }
//        if (processOutgoingCalls != PackageManager.PERMISSION_GRANTED) {
//            permissions = Manifest.permission.PROCESS_OUTGOING_CALLS;
//        }
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            int answerCall = ContextCompat.checkSelfPermission(mReactContext, Manifest.permission.ANSWER_PHONE_CALLS);
//            if (answerCall != PackageManager.PERMISSION_GRANTED) {
//                permissions = Manifest.permission.ANSWER_PHONE_CALLS;
//            }
//        }
        if (!TextUtils.isEmpty(permissions)) {
            promise.resolve(permissions);
            return;
        }
        promise.resolve("success");
    }

    ////////////////idle services////////////////////////////////////////////

    @ReactMethod
    public void startIdleService(ReadableMap readableMap, Promise promise){
        String date = readableMap.getString("date");
        if(TextUtils.isEmpty(date)){
            promise.reject("Date empty");
        }else{
            try {
                Intent intent = new Intent(IdleService.IDLE_SERVICE_ID);
                intent.setClass(this.getReactApplicationContext(), IdleService.class);
                intent.setAction("datesupplied");
                intent.putExtra("date", date);
                getReactApplicationContext().startService(intent);
            } catch (Exception e) {
                promise.reject(e);
                return;
            }
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void stopIdleService(Promise promise){
        try {
            Intent intent = new Intent(IdleService.IDLE_SERVICE_ID);
            intent.setClass(this.getReactApplicationContext(), IdleService.class);
            this.getReactApplicationContext().stopService(intent);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
        promise.resolve(true);
    }

    ////////////////idle services end////////////////////////////////////////////

    @ReactMethod
    public void whatsappCall(ReadableMap options,final Promise promise){
        boolean checkPermissions = PermissionChecker.checkSelfPermission(mReactContext, Manifest.permission.READ_CONTACTS) == PermissionChecker.PERMISSION_GRANTED && PermissionChecker.checkSelfPermission(mReactContext, Manifest.permission.WRITE_CONTACTS) == PermissionChecker.PERMISSION_GRANTED;
        if(checkPermissions) {
            String contactName = getContactName(options.getString("phone"));
            if (!TextUtils.isEmpty(contactName)) {
                int contactID = getContactIDWhatsapp(contactName, options.getBoolean("isvideo"));
                if (contactID > 0) {
                    Intent intent = new Intent();
                    intent.setAction(Intent.ACTION_VIEW);
                    if (options.getBoolean("isvideo")) {
                        intent.setDataAndType(Uri.parse("content://com.android.contacts/data/" + contactID),
                                "vnd.android.cursor.item/vnd.com.whatsapp.video.call");
                    } else {
                        intent.setDataAndType(Uri.parse("content://com.android.contacts/data/" + contactID),
                                "vnd.android.cursor.item/vnd.com.whatsapp.voip.call");
                    }
                    intent.setPackage("com.whatsapp");
                    if (intent.resolveActivity(mReactContext.getPackageManager()) != null) {
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        mReactContext.startActivity(intent);
                        promise.resolve("success");
                    } else {
                        promise.resolve("failed to find whatsapp app");
                    }
                } else {
                    promise.resolve("failed to find user on whatsapp");
                }
            } else {
                promise.resolve("failed to find contact name");
            }
        }else{
            promise.resolve("no permission granted");
        }
    }

    private String getContactName(final String phoneNumber) {
        Uri uri=Uri.withAppendedPath(ContactsContract.PhoneLookup.CONTENT_FILTER_URI,Uri.encode(phoneNumber));
        String[] projection = new String[]{ContactsContract.PhoneLookup.DISPLAY_NAME};
        String contactName="";
        Cursor cursor= mReactContext.getContentResolver().query(uri,projection,null,null,null);
        if (cursor != null) {
            if(cursor.moveToFirst()) {
                contactName=cursor.getString(0);
            }
            cursor.close();
        }
        return contactName;
    }

    private  int getContactIDWhatsapp(String name, boolean isVideo) {
        String selecArgs[] = new String[] {name,"vnd.android.cursor.item/vnd.com.whatsapp.voip.call"};
        if(isVideo){
            selecArgs = new String[] {name,"vnd.android.cursor.item/vnd.com.whatsapp.video.call"};
        }
        Cursor cursor = mReactContext.getContentResolver().query(
                ContactsContract.Data.CONTENT_URI,
                new String[]{ContactsContract.Data._ID},
                ContactsContract.Data.DISPLAY_NAME + "=? and "+ContactsContract.Data.MIMETYPE+ "=?",
                selecArgs,
                ContactsContract.Contacts.DISPLAY_NAME);
        if (cursor != null && cursor.getCount()>0) {
            cursor.moveToNext();
            int phoneContactID=  cursor.getInt(cursor.getColumnIndex(ContactsContract.Data._ID));
            cursor.close();
            return phoneContactID;
        } else{
            return 0;
        }
    }


    ////////////////phone call ////////////////////////////////////////////

    @ReactMethod()
    public void phoneCall(String phoneNumberString) {
        if(mReactContext == null){
            return;
        }
            Intent sendIntent = new Intent(Intent.ACTION_CALL, Uri.parse("tel:" + phoneNumberString.replaceAll("#", "%23").trim()));
            sendIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            Intent dialIntent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + phoneNumberString.trim()));
            dialIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            try {
                //Check that an app exists to receive the intent
                if (sendIntent.resolveActivity(mReactContext.getPackageManager()) != null) {
                    try {
                            mReactContext.startActivity(sendIntent);

                    } catch (SecurityException ex) {
                        if (dialIntent.resolveActivity(mReactContext.getPackageManager()) != null) {
                            mReactContext.startActivity(dialIntent);
                        }
                    }
                }
            } catch (IllegalStateException e) {
                if (dialIntent.resolveActivity(mReactContext.getPackageManager()) != null) {
                    mReactContext.startActivity(dialIntent);
                }
            }
    }

    @ReactMethod
    public void disableBatteryOff(){
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + mReactContext.getPackageName()));
                if (intent.resolveActivity(mReactContext.getPackageManager()) != null) {
                    mReactContext.startActivityForResult(intent, IGNORE_BATTERY_OPTIMIZATION_REQUEST, null);
                }
        }
    }

    ////////////////calling services ////////////////////////////////////////////

    /**
     * call listerner
     */
    @ReactMethod
    public void stopCalling(){
        try {
            Intent intent = new Intent(CallerService.CALLER_SERVICE_ID);
            intent.setClass(this.getReactApplicationContext(), CallerService.class);
            this.getReactApplicationContext().stopService(intent);
        } catch (Exception e) {
        }
    }

    /**
     * start Calling
     */
    @ReactMethod
    public void startCalling(){
        Intent intent = new Intent(CallerService.CALLER_SERVICE_ID);
        intent.setClass(this.getReactApplicationContext(), CallerService.class);
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void whatsAppCallMode(final Promise promise){
        AudioManager manager = (AudioManager) mReactContext.getSystemService(Context.AUDIO_SERVICE);
        Log.e("FinproCallModule", "whatsAppCallMode: "+manager.getMode());
        if(manager.getMode() == AudioManager.MODE_IN_COMMUNICATION){
            promise.resolve("Voip");
        }else if(manager.getMode() == AudioManager.MODE_IN_CALL){
            promise.resolve("Offhook");
        }else if(manager.getMode() == AudioManager.MODE_RINGTONE){
            promise.resolve("Ringing");
        }else{
            promise.resolve("idle");
        }
    }

    @ReactMethod
    public void killAllServices(){
        try{

            //caller service
            Intent callService = new Intent(getReactApplicationContext(), CallerService.class);
            getReactApplicationContext().stopService(callService);

            //idle service
            Intent idleService = new Intent(getReactApplicationContext(),IdleService.class);
            getReactApplicationContext().stopService(idleService);


            //bubble service
            Intent bubbleService = new Intent(getReactApplicationContext(),FloatingWidgetService.class);
            getReactApplicationContext().stopService(bubbleService);

            NotificationManager notification = (NotificationManager) getReactApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
            notification.cancel(Constants.SERVICES_NOTIFICATION_ID);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    ////////////// CALL LOGS ///////////////////////////////

    @ReactMethod()
    public void loadAll(Promise promise) {
        load(-1, promise);
    }

    @ReactMethod()
    public void load(int limit, Promise promise) {
        loadWithFilter(limit, null, promise);
    }

    @ReactMethod()
    public void loadWithFilter(int limit, @Nullable ReadableMap filter, Promise promise) {
        try {
            if (ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.READ_CALL_LOG) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
            Cursor cursor = getReactApplicationContext().getContentResolver().query(CallLog.Calls.CONTENT_URI, null, null, null, CallLog.Calls.DATE + " DESC");

            WritableArray result = Arguments.createArray();

            if (cursor == null) {
                promise.resolve(result);
                return;
            }

            boolean nullFilter = filter == null;
            String minTimestamp = !nullFilter && filter.hasKey("minTimestamp") ? filter.getString("minTimestamp") : "0";
            String maxTimestamp = !nullFilter && filter.hasKey("maxTimestamp") ? filter.getString("maxTimestamp") : "-1";
            String phoneNumbers = !nullFilter && filter.hasKey("phoneNumbers") ? filter.getString("phoneNumbers") : "[]";
            JSONArray phoneNumbersArray= new JSONArray(phoneNumbers);

            Set<String> phoneNumberSet = new HashSet<>(Arrays.asList(toStringArray(phoneNumbersArray)));

            int callLogCount = 0;

            final int NUMBER_COLUMN_INDEX = cursor.getColumnIndex(CallLog.Calls.NUMBER);
            final int TYPE_COLUMN_INDEX = cursor.getColumnIndex(CallLog.Calls.TYPE);
            final int DATE_COLUMN_INDEX = cursor.getColumnIndex(CallLog.Calls.DATE);
            final int DURATION_COLUMN_INDEX = cursor.getColumnIndex(CallLog.Calls.DURATION);
            final int NAME_COLUMN_INDEX = cursor.getColumnIndex(CallLog.Calls.CACHED_NAME);

            boolean minTimestampDefined = minTimestamp != null && !minTimestamp.equals("0");
            boolean minTimestampReached = false;

            while (cursor.moveToNext() && this.shouldContinue(limit, callLogCount) && !minTimestampReached) {
                String phoneNumber = cursor.getString(NUMBER_COLUMN_INDEX);
                int duration = cursor.getInt(DURATION_COLUMN_INDEX);
                String name = cursor.getString(NAME_COLUMN_INDEX);

                String timestampStr = cursor.getString(DATE_COLUMN_INDEX);
                minTimestampReached = minTimestampDefined && Long.parseLong(timestampStr) <= Long.parseLong(minTimestamp);

                DateFormat df = SimpleDateFormat.getDateTimeInstance(SimpleDateFormat.MEDIUM, SimpleDateFormat.MEDIUM);
                //DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String dateTime = df.format(new Date(Long.valueOf(timestampStr)));

                String type = this.resolveCallType(cursor.getInt(TYPE_COLUMN_INDEX));

                boolean passesPhoneFilter = phoneNumberSet == null || phoneNumberSet.isEmpty() || phoneNumberSet.contains(phoneNumber);
                boolean passesMinTimestampFilter = minTimestamp == null || minTimestamp.equals("0") || Long.parseLong(timestampStr) >= Long.parseLong(minTimestamp);
                boolean passesMaxTimestampFilter = maxTimestamp == null || maxTimestamp.equals("-1") || Long.parseLong(timestampStr) <= Long.parseLong(maxTimestamp);
                boolean passesFilter = passesPhoneFilter&& passesMinTimestampFilter && passesMaxTimestampFilter;

                if (passesFilter) {
                    WritableMap callLog = Arguments.createMap();
                    callLog.putString("phoneNumber", phoneNumber);
                    callLog.putInt("duration", duration);
                    callLog.putString("name", name);
                    callLog.putString("timestamp", timestampStr);
                    callLog.putString("dateTime", dateTime);
                    callLog.putString("type", type);
                    callLog.putInt("rawType", cursor.getInt(TYPE_COLUMN_INDEX));
                    result.pushMap(callLog);
                    callLogCount++;
                }
            }

            cursor.close();

            promise.resolve(result);
        } catch (JSONException e) {
            promise.reject(e);
        }
    }

    public static String[] toStringArray(JSONArray array) {
        if(array==null)
            return null;

        String[] arr=new String[array.length()];
        for(int i=0; i<arr.length; i++) {
            arr[i]=array.optString(i);
        }
        return arr;
    }

    private String resolveCallType(int callTypeCode) {
        switch (callTypeCode) {
            case CallLog.Calls.OUTGOING_TYPE:
                return "OUTGOING";
            case CallLog.Calls.INCOMING_TYPE:
                return "INCOMING";
            case CallLog.Calls.MISSED_TYPE:
                return "MISSED";
            default:
                return "UNKNOWN";
        }
    }

    private boolean shouldContinue(int limit, int count) {
        return limit < 0 || count < limit;
    }
}
