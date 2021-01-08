package com.finorbit.floatingcall;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.PixelFormat;
import android.graphics.Point;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.finorbit.BuildConfig;
import com.finorbit.MainActivity;
import com.finorbit.R;

public class FloatingWidgetService extends Service implements View.OnClickListener {

    public static final String FLOATING_WIDGET_ID = BuildConfig.APPLICATION_ID+ ".FloatingWidgetService";

    public static final int FLOATING_WIDGET_NOTIFICATION_ID = 100;
    public static final String CHANNEL_ID = "FINPRO_APP";
    public static final String CHANNEL_NAME ="FINPRO";

    private WindowManager mWindowManager;
    private View mFloatingWidgetView,removeFloatingWidgetView;
    private ImageView removeIcon, callerIcon;
    private Point szWindow = new Point();
    private boolean isLeft = true;
    private int x_init_cord, y_init_cord, x_init_margin, y_init_margin;

    public FloatingWidgetService() {
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startForeground(FLOATING_WIDGET_NOTIFICATION_ID, getCompatNotification());
        return START_STICKY;
    }

    private Notification getCompatNotification() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            NotificationChannel channel = new  NotificationChannel(CHANNEL_ID,CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription("Finpro Caller Active");
            channel.setName(CHANNEL_NAME);
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
        mWindowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        getWindowManagerDefaultDisplay();
        LayoutInflater inflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);

        addRemoveView(inflater);
        addFloatingWidgetView(inflater);
        implementTouchListenerToFloatingWidgetView();
        resetPosition(szWindow.x / 2-2);
    }


    private void addRemoveView(LayoutInflater inflater) {
        removeFloatingWidgetView = inflater.inflate(R.layout.floating_remove, null);

        WindowManager.LayoutParams paramRemove = setViewManagerParams();
        paramRemove.gravity = Gravity.BOTTOM | Gravity.CENTER;

        removeFloatingWidgetView.setVisibility(View.GONE);

        removeIcon = (ImageView) removeFloatingWidgetView.findViewById(R.id.removeIcon);
        removeIcon.setOnClickListener(this);

        mWindowManager.addView(removeFloatingWidgetView, paramRemove);
    }

    private void addFloatingWidgetView(LayoutInflater inflater) {
        mFloatingWidgetView = inflater.inflate(R.layout.floating_caller, null);

        WindowManager.LayoutParams params = setViewManagerParams();
        params.gravity = Gravity.TOP | Gravity.LEFT;

        callerIcon = (ImageView) removeFloatingWidgetView.findViewById(R.id.appIcon);
        callerIcon.setOnClickListener(this);

        mWindowManager.addView(mFloatingWidgetView, params);
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
    

    private void getWindowManagerDefaultDisplay() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            mWindowManager.getDefaultDisplay().getSize(szWindow);
        else {
            int w = mWindowManager.getDefaultDisplay().getWidth();
            int h = mWindowManager.getDefaultDisplay().getHeight();
            szWindow.set(w, h);
        }
    }

    private void implementTouchListenerToFloatingWidgetView() {
        mFloatingWidgetView.findViewById(R.id.rootContainer).setOnTouchListener(new View.OnTouchListener() {
            long time_start = 0, time_end = 0;
            boolean isLongClick = false;
            boolean inBounded = false;
            int remove_img_width = 0, remove_img_height = 0;
            Handler handlerLongClick = new Handler();
            Runnable runnable_longClick = new Runnable() {
                @Override
                public void run() {
                    isLongClick = true;
                    removeFloatingWidgetView.setVisibility(View.VISIBLE);
                    onFloatingWidgetLongClick();
                }
            };
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                WindowManager.LayoutParams layoutParams = (WindowManager.LayoutParams) mFloatingWidgetView.getLayoutParams();

                //get the touch location coordinates
                int x_cord = (int) event.getRawX();
                int y_cord = (int) event.getRawY();

                int x_cord_Destination, y_cord_Destination;

                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        Log.i("SOMELOGG", "HERE YOU ARE");
                        time_start = System.currentTimeMillis();
                        handlerLongClick.postDelayed(runnable_longClick, 300);
                        remove_img_width = removeIcon.getLayoutParams().width;
                        remove_img_height = removeIcon.getLayoutParams().height;
                        x_init_cord = x_cord;
                        y_init_cord = y_cord;
                        //remember the initial position.
                        x_init_margin = layoutParams.x;
                        y_init_margin = layoutParams.y;
                        return true;
                    case MotionEvent.ACTION_UP:
                        isLongClick = false;
                        removeFloatingWidgetView.setVisibility(View.GONE);
                        removeIcon.getLayoutParams().height = remove_img_height;
                        removeIcon.getLayoutParams().width = remove_img_width;
                        handlerLongClick.removeCallbacks(runnable_longClick);
                        if (inBounded) {
                            stopCurrentService();
                            inBounded = false;
                            break;
                        }
                        //Get the difference between initial coordinate and current coordinate
                        int x_diff = x_cord - x_init_cord;
                        int y_diff = y_cord - y_init_cord;
                        //The check for x_diff <5 && y_diff< 5 because sometime elements moves a little while clicking.
                        //So that is click event.
                        if (Math.abs(x_diff) < 5 && Math.abs(y_diff) < 5) {
                            time_end = System.currentTimeMillis();
                            //Also check the difference between start time and end time should be less than 300ms
                            if ((time_end - time_start) < 300)
                                onFloatingWidgetClick();

                        }
                        y_cord_Destination = y_init_margin + y_diff;
                        int barHeight = getStatusBarHeight();
                        if (y_cord_Destination < 0) {
                            y_cord_Destination = 0;
                        } else if (y_cord_Destination + (mFloatingWidgetView.getHeight() + barHeight) > szWindow.y) {
                            y_cord_Destination = szWindow.y - (mFloatingWidgetView.getHeight() + barHeight);
                        }
                        layoutParams.y = y_cord_Destination;
                        inBounded = false;
                        resetPosition(x_cord);
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        int x_diff_move = x_cord - x_init_cord;
                        int y_diff_move = y_cord - y_init_cord;

                        x_cord_Destination = x_init_margin + x_diff_move;
                        y_cord_Destination = y_init_margin + y_diff_move;

                        //If user long click the floating view, update remove view
                        if (isLongClick) {

                            int y_bound_top = szWindow.y - (int) (remove_img_height * 2);

                            //If Floating view comes under Remove View update Window Manager
                            if (y_cord >= y_bound_top) {
                                inBounded = true;

                                int x_cord_remove = (int) ((szWindow.x - (remove_img_height * 1.5)) / 2);
                                int y_cord_remove = (int) (szWindow.y - ((remove_img_width * 1.5) + getStatusBarHeight()));

                                if (removeIcon.getLayoutParams().height == remove_img_height) {
                                    removeIcon.getLayoutParams().height = (int) (remove_img_height * 1.5);
                                    removeIcon.getLayoutParams().width = (int) (remove_img_width * 1.5);

                                    WindowManager.LayoutParams param_remove = (WindowManager.LayoutParams) removeFloatingWidgetView.getLayoutParams();
                                    param_remove.x = x_cord_remove;
                                    param_remove.y = y_cord_remove;

                                    mWindowManager.updateViewLayout(removeFloatingWidgetView, param_remove);
                                }

                                layoutParams.x = x_cord_remove + (Math.abs(removeFloatingWidgetView.getWidth() - mFloatingWidgetView.getWidth())) / 2;
                                layoutParams.y = y_cord_remove + (Math.abs(removeFloatingWidgetView.getHeight() - mFloatingWidgetView.getHeight())) / 2;

                                //Update the layout with new X & Y coordinate
                                mWindowManager.updateViewLayout(mFloatingWidgetView, layoutParams);
                                break;
                            } else {
                                //If Floating window gets out of the Remove view update Remove view again
                                inBounded = false;
                                removeIcon.getLayoutParams().height = remove_img_height;
                                removeIcon.getLayoutParams().width = remove_img_width;
                                onFloatingWidgetClick();
                            }

                        }


                        layoutParams.x = x_cord_Destination;
                        layoutParams.y = y_cord_Destination;

                        //Update the layout with new X & Y coordinate
                        mWindowManager.updateViewLayout(mFloatingWidgetView, layoutParams);
                        return true;
                }
                return false;
            }
        });
    }


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.appIcon:
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
                    return;
                }
                break;
            case R.id.removeIcon:
                stopCurrentService();
                break;
        }
    }


    private void onFloatingWidgetLongClick() {
        WindowManager.LayoutParams removeParams = (WindowManager.LayoutParams) removeFloatingWidgetView.getLayoutParams();
        //get x and y coordinates of remove view
        int x_cord = (szWindow.x - removeFloatingWidgetView.getWidth()) / 2;
        int y_cord = szWindow.y - (removeFloatingWidgetView.getHeight() + getStatusBarHeight());
        removeParams.x = x_cord;
        removeParams.y = y_cord;
        //Update Remove view params
        mWindowManager.updateViewLayout(removeFloatingWidgetView, removeParams);
    }


    private void resetPosition(int x_cord_now) {
        if (x_cord_now <= szWindow.x / 2) {
            isLeft = true;
            moveToLeft(x_cord_now);
        } else {
            isLeft = false;
            moveToRight(x_cord_now);
        }

    }


    private void moveToLeft(final int current_x_cord) {
        final int x = szWindow.x - current_x_cord;

        new CountDownTimer(500, 5) {
            //get params of Floating Widget view
            WindowManager.LayoutParams mParams = (WindowManager.LayoutParams) mFloatingWidgetView.getLayoutParams();

            public void onTick(long t) {
                long step = (500 - t) / 5;

                mParams.x = 0 - (int) (current_x_cord * current_x_cord * step);

                //If you want bounce effect uncomment below line and comment above line
                mParams.x = 0 - (int) (double) bounceValue(step, x);

                mWindowManager.updateViewLayout(mFloatingWidgetView, mParams);
            }

            public void onFinish() {
                mParams.x = 0;

                mWindowManager.updateViewLayout(mFloatingWidgetView, mParams);
            }
        }.start();
    }

    private void moveToRight(final int current_x_cord) {

        new CountDownTimer(500, 5) {
            WindowManager.LayoutParams mParams = (WindowManager.LayoutParams) mFloatingWidgetView.getLayoutParams();

            public void onTick(long t) {
                long step = (500 - t) / 5;

                mParams.x = (int) (szWindow.x + (current_x_cord * current_x_cord * step) - mFloatingWidgetView.getWidth());

                //If you want bounce effect uncomment below line and comment above line
                mParams.x = szWindow.x + (int) (double) bounceValue(step, current_x_cord) - mFloatingWidgetView.getWidth();

                mWindowManager.updateViewLayout(mFloatingWidgetView, mParams);
            }

            public void onFinish() {
                mParams.x = szWindow.x - mFloatingWidgetView.getWidth();

                //Update window manager for Floating Widget
                mWindowManager.updateViewLayout(mFloatingWidgetView, mParams);
            }
        }.start();
    }

    private double bounceValue(long step, long scale) {
        double value = scale * Math.exp(-0.055 * step) * Math.cos(0.08 * step);
        return value;
    }


    private boolean isViewCollapsed() {
        return mFloatingWidgetView == null || mFloatingWidgetView.findViewById(R.id.appIcon).getVisibility() == View.VISIBLE;
    }


    private int getStatusBarHeight() {
        return (int) Math.ceil(25 * getApplicationContext().getResources().getDisplayMetrics().density);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);

        getWindowManagerDefaultDisplay();

        WindowManager.LayoutParams layoutParams = (WindowManager.LayoutParams) mFloatingWidgetView.getLayoutParams();

        if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {


            if (layoutParams.y + (mFloatingWidgetView.getHeight() + getStatusBarHeight()) > szWindow.y) {
                layoutParams.y = szWindow.y - (mFloatingWidgetView.getHeight() + getStatusBarHeight());
                mWindowManager.updateViewLayout(mFloatingWidgetView, layoutParams);
            }

            if (layoutParams.x != 0 && layoutParams.x < szWindow.x) {
                resetPosition(szWindow.x);
            }

        } else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT) {

            if (layoutParams.x > szWindow.x) {
                resetPosition(szWindow.x);
            }

        }

    }

    private void onFloatingWidgetClick() {
        if (isViewCollapsed()) {
            //When user clicks on the image view of the collapsed layout,
            //visibility of the collapsed layout will be changed to "View.GONE"
            //and expanded view will become visible.
//            collapsedView.setVisibility(View.GONE);
//            expandedView.setVisibility(View.VISIBLE);

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
            Log.e("POIFOIWEGBF", "Class not found", e);

        }
        return activityIntent;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (mFloatingWidgetView != null)
            mWindowManager.removeView(mFloatingWidgetView);
        if (removeFloatingWidgetView != null)
            mWindowManager.removeView(removeFloatingWidgetView);
    }


    private void stopCurrentService() {
        stopSelf();
    }
}
