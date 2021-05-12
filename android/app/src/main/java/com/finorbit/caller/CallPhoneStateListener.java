package com.finorbit.caller;

import android.telephony.PhoneStateListener;

public class CallPhoneStateListener extends PhoneStateListener {

    private CallPhoneListerner callPhoneListerner;

    public CallPhoneStateListener(CallPhoneListerner callPhoneListerner) {
        this.callPhoneListerner = callPhoneListerner;
    }

    @Override
    public void onCallStateChanged(int state, String phoneNumber) {
        super.onCallStateChanged(state, phoneNumber);
        callPhoneListerner.callStateChanged(state, phoneNumber);
    }

    @Override
    public void onUserMobileDataStateChanged(boolean enabled) {
        super.onUserMobileDataStateChanged(enabled);
    }
}
