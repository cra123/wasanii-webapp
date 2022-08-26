const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");


const saltRounds = 10;


const User = require("../models/User.model");


const isLoggedOut = require("../middleware/isLoggedOut"); 
const isLoggedIn = require("../middleware/isLoggedIn"); 

router.get("/signup", isLoggedOut, (req, res) => { 
  res.render("auth/signup"); 
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { name, email, phone, address, password } = req.body;



  User.findOne({ email }).then((found) => {
 
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Email already taken." });
    }


    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {

        return User.create({
          name,
          email,
          phone,
          address,
          password: hashedPassword,
        });
      })
      .then((user) => {

        return res.redirect("/auth/login");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: "Email need to be unique. The Email you chose is already in use." });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!email) { 
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your Email." });
  }

  User.findOne({ email })
    .then((user) => {
  
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }


      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }


        req.session.user = user;
        SessionUser = req.session.user;
        // console.log(SessionUser);
        return res.redirect("/");
      });
    })

    .catch((err) => {

      next(err);

    });
});

router.get("/logout", isLoggedIn, (req, res) => { 
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }

    res.redirect("/");
  });
});

module.exports = router;
