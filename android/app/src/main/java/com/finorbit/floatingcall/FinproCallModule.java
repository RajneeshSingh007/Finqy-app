package com.finorbit.floatingcall;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.finorbit.MainActivity;

public class FinproCallModule extends ReactContextBaseJavaModule {

    private static final String ACTIVITY_DOES_NOT_EXIST = "ACTIVITY_DOES_NOT_EXIST";
    private static final String E_PERMISSION_DENIED = "E_PERMISSION_DENIED";
    public static ReactApplicationContext mReactContext;


    public FinproCallModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "FinproCallModule";
    }

    @ReactMethod
    public void stopService(Promise promise) {
        String result = "Success";
        try {
            Intent intent = new Intent(FloatingWidgetService.FLOATING_WIDGET_ID);
            intent.setClass(this.getReactApplicationContext(), FloatingWidgetService.class);
            this.getReactApplicationContext().stopService(intent);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
        promise.resolve(result);
    }

    @ReactMethod
    public void startService(Promise promise) {
        String result = "Success";
        Activity activity = getCurrentActivity();
        if (activity != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(getReactApplicationContext())) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getCurrentActivity().getPackageName()));
                getCurrentActivity().startActivityForResult(intent, MainActivity.DRAW_OVER_OTHER_APP_PERMISSION_REQUEST_CODE);
            }
        }
        try {
            Intent intent = new Intent(FloatingWidgetService.FLOATING_WIDGET_ID);
            intent.setClass(this.getReactApplicationContext(), FloatingWidgetService.class);
            getReactApplicationContext().startService(intent);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
        promise.resolve(result);
    }


    public static ReactApplicationContext getReactContext() {
        return mReactContext;
    }

}
