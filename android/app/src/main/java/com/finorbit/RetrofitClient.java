package com.finorbit;

import okhttp3.Cache;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.scalars.ScalarsConverterFactory;

public class RetrofitClient {


    private static Retrofit retrofit;

    /**
     * retrofit Instance
     * @return
     */
    public static Retrofit getInstance(){
        if(retrofit == null){
            HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
            interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
            OkHttpClient.Builder builder = new OkHttpClient.Builder();
            builder.addInterceptor(interceptor);
            retrofit  = new Retrofit.Builder()
                    .baseUrl(Constants.getMainUrl())
                    .addConverterFactory(ScalarsConverterFactory.create())
                    .client(builder.build())
                    .build();
        }
        return retrofit;
    }
}
