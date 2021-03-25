package com.finorbit;

import retrofit2.Call;
import retrofit2.http.GET;

public interface ApiCallback {

    @GET(Constants.UAT_SERVER_TIME)
    Call<String> getServerTime();
}
