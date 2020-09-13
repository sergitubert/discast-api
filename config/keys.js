const SPOTIFY_TOKENS = {
    SPOTIFY_CLIENT_ID: '1d6a3a3b35164a46a8fe30ecc1e6d800',
    SPOTIFY_CLIENT_SECRET: '647b896d55384c4f813e8cbe73ea8532',
};

// const DB_USER = "SOME USER";
// const DB_PASSWORD = "SOME PASSWPORD";
// const MONGODB = {
//     MONGODB_URI: `mongodb://${DB_USER}:${DB_PASSWORD}@ds<SOME_DOMAIN>.mlab.com:<PORT>/<PROJECT_NAME>`
// };

const SESSION = {
    COOKIE_KEY: "thisappisawesome"
};

const KEYS = {
    ...SPOTIFY_TOKENS,
    // ...MONGODB,
    ...SESSION
};

module.exports = KEYS;