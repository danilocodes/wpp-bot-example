const options = {
    headless: true,
    sessionId: process.env.SESSION_ID,
    disableSpins: true,
    skipUpdateCheck: true,
    useChrome: true,
    waitForRipeSession: true,
    cacheEnabled: false,
    cachedPatch: true,
    multiDevice: true,
    qrTimeout: 0,
    ignoreNuke: true,
};

export default options;
