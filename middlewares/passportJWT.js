const passport = require("passport");
const config = require("../config/index");
const User = require("../models/user");
// const Patient = require("../models/patient");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET;
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (!user) {
        return done(new Error("Not Found User"), null);
      }
      return done(null, user);
      // if (jwt_payload.line_uid) {
      //   const patient = await Patient.find({
      //     patient_tel: jwt_payload.patient_tel,
      //     // ByPass
      //     line_uid: jwt_payload.line_uid,
      //   });

      //   if (!patient) {
      //     return done(new Error("Line Process Not Found Patient"), null);
      //   }

      //   done(null, patient);
      // } else {
      //   const user = await User.findById(jwt_payload.id);
      //   if (!user) {
      //     return done(new Error("Not Found User"), null);
      //   }
      //   return done(null, user);
      // }
    } catch (err) {
      done(err);
    }
  })
);

module.exports.isLogin = passport.authenticate("jwt", { session: false });
