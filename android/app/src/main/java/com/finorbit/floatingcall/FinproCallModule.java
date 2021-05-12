package com.finorbit.floatingcall;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Build;
import android.provider.ContactsContract;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;
import androidx.core.content.PermissionChecker;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.finorbit.caller.CallerService;
import com.finorbit.idle.IdleService;

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
}
