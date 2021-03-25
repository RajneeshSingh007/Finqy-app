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
import android.os.Handler;
import android.os.IBinder;
import android.text.TextUtils;
import android.util.Log;
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

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatButton;
import androidx.cardview.widget.CardView;
import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.finorbit.ApiCallback;
import com.finorbit.BuildConfig;
import com.finorbit.MainActivity;
import com.finorbit.R;
import com.finorbit.RetrofitClient;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.FirebaseApp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreSettings;
import com.google.firebase.firestore.SetOptions;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class IdleService extends Service implements Runnable {

    public static final String IDLE_SERVICE_ID = BuildConfig.APPLICATION_ID + ".IdleService";

    public static final int FLOATING_WIDGET_NOTIFICATION_ID = 110;
    public static final String CHANNEL_ID = "exampleServiceChannel";
    public static final String CHANNEL_NAME = "Example Service Channel";
    private static final int TIME = 60000; // 1 min
    private FirebaseFirestore firebaseFirestore;
    private Handler handler;
    private String docName = "",serverDatetime="";
    private ApiCallback apiCallback;

    public IdleService() {
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if(intent != null && !TextUtils.isEmpty(intent.getAction()) && intent.getAction().equalsIgnoreCase("datesupplied")){
            docName = intent.getStringExtra("date");
            Log.e("idleservice", docName);
            if(!TextUtils.isEmpty(docName)){
                handler.postDelayed(this, TIME);
               // handler.post(this);
            }
        }
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
                .setContentText("Dialer Active")
                .setTicker("Dialer Caller")
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
        apiCallback = RetrofitClient.getInstance().create(ApiCallback.class);
        handler = new Handler();
        firebaseFirestore = FirebaseFirestore.getInstance();
        startForeground(FLOATING_WIDGET_NOTIFICATION_ID, getCompatNotification());
    }


    public void serviceClosed() {
        ReactApplicationContext reactContext = FinproCallModule.getReactContext();
        try {
            Intent activityIntent = createSingleInstanceIntent();
            if (activityIntent != null) {
                reactContext.startActivity(activityIntent);
            }
            Intent service = new Intent(getApplicationContext(), IdleHandler.class);
            Bundle bundle = new Bundle();
            bundle.putBoolean("serviceclosed", true);
            service.putExtras(bundle);
            getApplicationContext().startService(service);
            stopCurrentService();
        } catch (Exception e) {
            e.printStackTrace();
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
        if(handler != null){
            handler.removeCallbacks(IdleService.this);
        }
        serviceClosed();
        stopForeground(true);
    }
    private void stopCurrentService() {
        stopSelf();
    }

    @Override
    public void run() {
        Call<String> serverCall = apiCallback.getServerTime();
        serverCall.enqueue(new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                if(response.isSuccessful() && response.body() != null){
                    serverDatetime = (String) response.body();
                    Log.e("idle Service", "onStartCommand: "+serverDatetime );
                    if(!TextUtils.isEmpty(serverDatetime)){
                        String split[] = serverDatetime.split(" ");
                        Map<String, ArrayList<String>> obj = new HashMap<>();
                        ArrayList<String> timeArray = new ArrayList<String>();
                        timeArray.add(split[1]);
                        obj.put("idle",timeArray);
                        DocumentReference reference = firebaseFirestore
                                .collection("checkincheckout")
                                .document(docName);

                        reference.get()
                                .addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                                    @Override
                                    public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                                        if(task.isSuccessful()){
                                            DocumentSnapshot documentSnapshot = task.getResult();
                                            if(documentSnapshot != null) {
                                                String checkIn = (String) documentSnapshot.get("checkin");
                                                String checkOut = (String) documentSnapshot.get("checkout");
                                                //checkin and checkout check
                                                if(!TextUtils.isEmpty(checkIn) && TextUtils.isEmpty(checkOut)) {
                                                    ArrayList<String> existingList = (ArrayList<String>) documentSnapshot.get("idle");
                                                    if (existingList != null && !existingList.isEmpty() && existingList.size() > 0) {
                                                        existingList.add(split[1]);
                                                        Map<String, ArrayList<String>> objex = new HashMap<>();
                                                        objex.put("idle", existingList);
                                                        reference.set(objex, SetOptions.merge());
                                                        handler.postDelayed(IdleService.this, TIME);
                                                    } else {
                                                        reference.set(obj, SetOptions.merge());
                                                        handler.postDelayed(IdleService.this, TIME);
                                                    }
                                                }
                                            }else{
                                                reference.set(obj, SetOptions.merge());
                                                handler.postDelayed(IdleService.this, TIME);
                                            }
                                        }else{
                                            reference.set(obj, SetOptions.merge());
                                            handler.postDelayed(IdleService.this, TIME);
                                        }
                                    }
                                });
                    }
                }
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {

            }
        });
    }
}
