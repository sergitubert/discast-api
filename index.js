const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser"); // parse cookie header
const cookieSession = require("cookie-session");

require('./config/passport-setup');
const keys = require("./config/keys");

const app = express();

const PORT = 4000;
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

app.use(
    cookieSession({
        name: "session",
        keys: [keys.COOKIE_KEY],
        maxAge: 24 * 60 * 60 * 100
    })
);

app.use(cookieParser());

// initalize passport
app.use(passport.initialize());
app.use(passport.session());

// set up cors to allow us to accept requests from our client
app.use(
    cors({
        origin: CLIENT_HOME_PAGE_URL, // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    })
);

// set up routes
// when login is successful, retrieve user info
app.get("/auth/login/success", (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    }
});

// when login failed, send failed msg
app.get("/auth/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate."
    });
});

// When logout, redirect to client
app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with twitter
app.get("/auth/spotify", passport.authenticate("spotify"));

// redirect to home page after successfully login via twitter
app.get(
    "/auth/spotify/redirect",
    passport.authenticate("spotify", {
        successRedirect: CLIENT_HOME_PAGE_URL,
        failureRedirect: "/auth/login/failed"
    })
);

const authCheck = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            authenticated: false,
            message: "user has not been authenticated"
        });
    } else {
        next();
    }
};

app.get("/", authCheck, (req, res) => {
    res.status(200).json({
        authenticated: true,
        message: "user successfully authenticated",
        user: req.user,
        cookies: req.cookies
    });
});

// connect react to nodejs express server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`));