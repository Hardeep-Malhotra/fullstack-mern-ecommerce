
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Check if user already exists with this googleId
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // 2. Check if user exists with the same email (Account Linking)
                const email = profile.emails[0].value;
                user = await User.findOne({ email });

                if (user) {
                    // Link googleId to existing user
                    user.googleId = profile.id;
                    user.provider = "google";
                    if (!user.avatar.url) {
                        user.avatar.url = profile.photos[0]?.value || "";
                    }
                    await user.save();
                    return done(null, user);
                }

                // 3. New User Registration via Google
                user = await User.create({
                    name: profile.displayName,
                    email: email,
                    googleId: profile.id,
                    provider: "google",
                    avatar: {
                        public_id: "",
                        url: profile.photos[0]?.value || "",
                    },
                    isEmailVerified: true,
                });

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        },
    ),
);

export default passport;
