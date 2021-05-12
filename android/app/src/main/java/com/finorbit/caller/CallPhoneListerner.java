package com.finorbit.caller;

public interface CallPhoneListerner {
    void callStateChanged(int state, String incomingNumber);
}
