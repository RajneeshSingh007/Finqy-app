package com.finorbit.floatingcall;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.PixelFormat;
import android.graphics.Point;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.finorbit.BuildConfig;
import com.finorbit.MainActivity;
import com.finorbit.R;

public class FloatingWidgetService extends Service {

    public static final String FLOATING_WIDGET_ID = BuildConfig.APPLICATION_ID + ".FloatingWidgetService";

    public static final int FLOATING_WIDGET_NOTIFICATION_ID = 100;
    public static final String CHANNEL_ID = "exampleServiceChannel";
    public static final String CHANNEL_NAME = "Example Service Channel";

    private WindowManager mWindowManager;
    int lastAction;
    int initialX;
    int initialY;
    float initialTouchX;
    float initialTouchY;
    private View mFloatingWidgetView;
    private WindowManager.LayoutParams params;
    private ImageView actionClick;
    private int mWidth;


    public FloatingWidgetService() {
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    private Notification getCompatNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, importance);
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID);
        builder.setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher))
                .setContentTitle(getString(R.string.app_name))
                .setContentText("Caller Active")
                .setTicker("Floating Caller")
                .setWhen(System.currentTimeMillis());
        Intent startIntent = new Intent(getApplicationContext(), MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 1000, startIntent, 0);
        builder.setContentIntent(contentIntent);
        return builder.build();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        startForeground(FLOATING_WIDGET_NOTIFICATION_ID, getCompatNotification());
        mWindowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        LayoutInflater inflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);
        addFloatingWidgetView(inflater);
        implementTouchListenerToFloatingWidgetView();
    }


    private void addFloatingWidgetView(LayoutInflater inflater) {
        if(mFloatingWidgetView == null){
            mFloatingWidgetView = inflater.inflate(R.layout.floating_caller, null);
        }
        actionClick = mFloatingWidgetView.findViewById(R.id.actionClick);
        actionClick.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                gotoInsideApp();
            }
        });
        params = setViewManagerParams();
        params.gravity = Gravity.TOP | Gravity.LEFT;
        params.x = 0;
        params.y = 100;
        mWindowManager.addView(mFloatingWidgetView, params);
        Display display = mWindowManager.getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);

        final RelativeLayout layout = (RelativeLayout) mFloatingWidgetView.findViewById(R.id.rootContainer);
        ViewTreeObserver vto = layout.getViewTreeObserver();
        vto.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                layout.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                int width = layout.getMeasuredWidth();
                mWidth = size.x - width;
            }
        });
    }

    private WindowManager.LayoutParams setViewManagerParams() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    WindowManager.LayoutParams.TYPE_PHONE,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                    PixelFormat.TRANSLUCENT);
            return params;
        } else {
            WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                    PixelFormat.TRANSLUCENT);
            return params;
        }
    }

    private void implementTouchListenerToFloatingWidgetView() {
        mFloatingWidgetView.findViewById(R.id.rootContainer).setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = params.x;
                        initialY = params.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        lastAction = event.getAction();
                        return true;
                    case MotionEvent.ACTION_UP:
//                        params.x = initialX + (int) (event.getRawX() - initialTouchX);
//                        params.y = initialY + (int) (event.getRawY() - initialTouchY);
//                        mWindowManager.updateViewLayout(mFloatingWidgetView, params);
//                        lastAction = event.getAction();
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        //Calculate the X and Y coordinates of the view.
                        params.x = initialX + (int) (event.getRawX() - initialTouchX);
                        params.y = initialY + (int) (event.getRawY() - initialTouchY);
                        mWindowManager.updateViewLayout(mFloatingWidgetView, params);
                        lastAction = event.getAction();
                        return true;
                }

                return false;
            }
        });
    }


    public void gotoInsideApp() {
        ReactApplicationContext reactContext = FinproCallModule.getReactContext();
        try {
            Intent activityIntent = createSingleInstanceIntent();
            if (activityIntent != null) {
                reactContext.startActivity(activityIntent);
            }
            Intent service = new Intent(getApplicationContext(), ServiceHandler.class);
            Bundle bundle = new Bundle();
            bundle.putBoolean("outside", true);
            service.putExtras(bundle);
            getApplicationContext().startService(service);
            stopCurrentService();
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }
    }


    public Intent createSingleInstanceIntent() {

        Intent activityIntent = null;
        try {
            ReactApplicationContext reactContext = FinproCallModule.getReactContext();
            String packageName = reactContext.getPackageName();
            Intent launchIntent = reactContext.getPackageManager().getLaunchIntentForPackage(packageName);
            String className = launchIntent.getComponent().getClassName();

            Class<?> activityClass = Class.forName(className);

            activityIntent = new Intent(reactContext, activityClass);

            activityIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        } catch (Exception e) {
            stopCurrentService();

        }
        return activityIntent;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (mFloatingWidgetView != null)
            mWindowManager.removeView(mFloatingWidgetView);
    }


    private void stopCurrentService() {
        stopSelf();
    }
}
