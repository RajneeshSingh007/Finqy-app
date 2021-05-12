import React from 'react';

export default React.createContext({
    callListerner:() =>{},
    dialerCallback:(screenName,customerData, isWhatsapp,videocall) =>{}
})