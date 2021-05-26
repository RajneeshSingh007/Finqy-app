package com.finorbit.caller;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.finorbit.BuildConfig;
import com.finorbit.MainActivity;
import com.finorbit.R;

public class CallerService extends Service implements CallPhoneListerner{

    public static final String CALLER_SERVICE_ID = BuildConfig.APPLICATION_ID + ".CallerService";

    private static final String TAG = CallerService.class.getSimpleName();

    public static final int FLOATING_WIDGET_NOTIFICATION_ID = 100;
    public static final String CHANNEL_ID = "FinqyServiceChannel";
    public static final String CHANNEL_NAME = "Finqy Service Channel";

    private TelephonyManager telephonyManager;
    private CallPhoneStateListener callPhoneStateListener;
    private int lastState = TelephonyManager.CALL_STATE_IDLE;

    @Override
    public void onCreate() {
        super.onCreate();
        startForeground(FLOATING_WIDGET_NOTIFICATION_ID, getCompatNotification());
        callPhoneStateListener = new CallPhoneStateListener(this);
        telephonyManager = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
        telephonyManager.listen(callPhoneStateListener, PhoneStateListener.LISTEN_CALL_STATE);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
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
                .setContentText(getString(R.string.caller_active))
                .setTicker("Floating Caller")
                .setWhen(System.currentTimeMillis());
        Intent startIntent = new Intent(getApplicationContext(), MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 1000, startIntent, 0);
        builder.setContentIntent(contentIntent);
        return builder.build();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        stopForeground(true);
        if(telephonyManager != null){
            if(callPhoneStateListener != null){
                telephonyManager.listen(callPhoneStateListener, PhoneStateListener.LISTEN_NONE);
            }
            telephonyManager = null;
        }
        callPhoneStateListener = null;
    }

    @Override
    public void callStateChanged(int state, String incomingNumber) {
        switch (state) {
            case TelephonyManager.CALL_STATE_IDLE:
                Log.e(TAG, "callStateChanged: Idle");
                if(lastState == TelephonyManager.CALL_STATE_RINGING){
                    sendCallData(incomingNumber,  "Missed");
                }else if(lastState == state){
                    sendCallData(incomingNumber,  "Idle");
                }else {
                    sendCallData(incomingNumber,  "Disconnected");
                }
                break;
            case TelephonyManager.CALL_STATE_OFFHOOK:
                Log.e(TAG, "callStateChanged: Offhook");
                if (lastState != TelephonyManager.CALL_STATE_RINGING) {
                    sendCallData(incomingNumber, "Offhook");
                }
                break;
            case TelephonyManager.CALL_STATE_RINGING:
                Log.e(TAG, "callStateChanged: Ringing");
                sendCallData(incomingNumber,  "Ringing");
                break;
        }
        lastState = state;
        Log.e(TAG, "callStateChanged: "+lastState +" phoneNumber"+incomingNumber);
    }

    public void sendCallData(String phoneNumber, String state) {
        try {
            Intent service = new Intent(getApplicationContext(), CallerServiceHandler.class);
            Bundle bundle = new Bundle();
            bundle.putString("state", state);
            bundle.putString("phoneNumber", phoneNumber);
            service.putExtras(bundle);
            getApplicationContext().startService(service);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
