package com.finorbit.floatingcall;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.text.TextUtils;

import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class FinproCallModule extends ReactContextBaseJavaModule {

    private static final String error = "Permission was not granted";
    public static ReactApplicationContext mReactContext;
    public static int DRAW_OVER_OTHER_APP_PERMISSION_REQUEST_CODE = 1122;
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
    public void  stopIdleService(Promise promise){
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
}
