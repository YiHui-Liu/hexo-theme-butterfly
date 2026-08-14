(async () => {
    if ('serviceWorker' in navigator) {
        console.log('FOW_SW is uninstalling.');
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
               if(registration.active.scriptURL.includes("/cw.js")){ 
                    registration.unregister();
                }
            }
        });
    } else {
        console.log("FOW_SW is not supported.");
    }
})();
