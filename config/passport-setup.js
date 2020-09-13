const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const keys = require("./keys");

const users = {};

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {

    const user = users[id];

    if (!user) {
        return done(new Error("Failed to deserialize an user"));
    }
    return done(null, user);

    // User.findById(id)
    //     .then(user => {
    //         done(null, user);
    //     })
    //     .catch(e => {
    //         done(new Error("Failed to deserialize an user"));
    //     });
});

passport.use(
    new SpotifyStrategy(
        {
            clientID: keys.SPOTIFY_CLIENT_ID,
            clientSecret: keys.SPOTIFY_CLIENT_SECRET,
            callbackURL: '/auth/spotify/redirect'
        },
        async (accessToken, refreshToken, profile, done) => {
            // find current user in UserModel
            // const currentUser = await User.findOne({
            //     twitterId: profile._json.id_str
            // });
            console.log(profile)
            const currentUser = users[profile.id];

            // create new user if the database doesn't have this user
            if (!currentUser) {
                // const newUser = await new User({
                //     name: profile._json.name,
                //     screenName: profile._json.screen_name,
                //     twitterId: profile._json.id_str,
                //     profileImageUrl: profile._json.profile_image_url
                // }).save();
                const newUser = {
                    username: profile.username,
                    displayName: profile.displayName,
                    spotifyId: profile.id,
                    id: profile.id,
                };

                users[profile.id] = newUser;

                if (newUser) {
                    done(null, newUser);
                }
            }
            done(null, currentUser);
        }
    )
);