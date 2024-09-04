// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserService = require('../services/user.service');
const dotenv = require('dotenv');

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8000/v1/user/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Kiểm tra nếu người dùng đã tồn tại dựa trên GOOGLE_ID
        let user = await UserService.findUserByGoogleId(profile.id);

        if (user) {
          // Người dùng đã tồn tại, trả về người dùng này
          return done(null, user);
        } else {
          // Người dùng chưa tồn tại, tạo tài khoản mới
          const newUser = {
            USERNAME: profile.emails[0].value,
            FULL_NAME: profile.displayName,
            EMAIL_USER: profile.emails[0].value,
            GOOGLE_ID: profile.id,
            GENDER_USER: profile.gender,
            AVT_URL: profile.photos[0].value,
          };
          user = await UserService.registerGoogleUser(newUser);
          return done(null, user);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserService.findUserByGoogleId(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;