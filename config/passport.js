// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserService = require('../services/user.service');
const dotenv = require('dotenv');

dotenv.config();
function splitFullName(fullName) {
  const nameParts = fullName.split(' ');
  const first_name = nameParts[0];
  const last_name = nameParts[nameParts.length - 1];
  const middle_name = nameParts.slice(1, -1).join(' ');

  return { first_name, middle_name, last_name };
}

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: 'http://localhost:8000/v1/user/auth/google/callback',
//       scope: ['profile', 'email'],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Kiểm tra nếu người dùng đã tồn tại dựa trên GOOGLE_ID
//         let user = await UserService.findUserByGoogleId(profile.id);

//         if (user) {
//           // Người dùng đã tồn tại, trả về người dùng này
//           return done(null, user);
//         } else {
//           // Người dùng chưa tồn tại, tạo tài khoản mới
//           const newUser = {
//             USERNAME: profile.emails[0].value,
//             FULL_NAME: profile.displayName,
//             EMAIL_USER: profile.emails[0].value,
//             GOOGLE_ID: profile.id,
//             GENDER_USER: profile.gender || null,
//             AVT_URL: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null, // Kiểm tra nếu có URL avatar
//           };
//           user = await UserService.registerGoogleUser(newUser);
//           return done(null, user);
//         }
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );

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
          // Người dùng chưa tồn tại, tách tên từ displayName
          const fullName = profile.displayName;
          const { first_name, middle_name, last_name } = splitFullName(fullName);

          // Tạo tài khoản mới với các thông tin đã tách
          const newUser = {
            USERNAME: profile.emails[0].value,
            FIRST_NAME: first_name,
            MIDDLE_NAME: middle_name,
            LAST_NAME: last_name,
            FULL_NAME: profile.displayName,
            EMAIL_USER: profile.emails[0].value,
            GOOGLE_ID: profile.id,
            GENDER_USER: profile.gender || null,
            AVT_URL: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null, // Kiểm tra nếu có URL avatar
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
    const user = await UserService.findUserById(id); //  lấy User theo id
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await UserService.findUserByGoogleId(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

module.exports = passport;