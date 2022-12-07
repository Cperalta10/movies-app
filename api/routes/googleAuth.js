const router = require("express").Router();
const GoogleUser = require("../models/GoogleUser");
const passport = require("passport");
const findOrCreate = require("mongoose-findorcreate");
require("dotenv").config();
// const cookieSession = require("cookie-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// router.use(
//   cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [process.env.COOKIE_SECRET],
//   })
// );

router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/google/auth/redirect",
    },
    function (accessToken, refreshToken, profile, cb) {
      GoogleUser.findOrCreate(
        { googleId: profile.id, userName: profile.displayName },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  GoogleUser.findById(id).then((user) => {
    done(null, user);
  });
});

router.get("/", (req, res) => {
  res.send("welcome");
});

// router.get(
//   "/auth",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account",
//   })
// );

// router.get(
//   "/auth/redirect",
//   passport.authenticate("google"),
//   function (req, res) {
//     res.send(req.user);
//   }
// );

router.get("/auth", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/auth/redirect",
  passport.authenticate("google", { failureRedirect: "/auth" }),
  function (req, res) {
    // Successful authentication, redirect home.
    // res.send(req.user);
    res.redirect("/google/auth");
  }
);

router.get("/auth/logout", (req, res) => {
  req.logout();
  req.session = null;

  res.send(req.user);
});

module.exports = router;