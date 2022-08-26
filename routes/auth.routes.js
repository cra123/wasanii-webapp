const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Defince the number of times the bycrypt algorithm will run
const saltRounds = 10;

// Import the user model
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut"); //Check if user is logged out
const isLoggedIn = require("../middleware/isLoggedIn"); //Check if user is logged in

router.get("/signup", isLoggedOut, (req, res) => { 
  res.render("auth/signup"); //Assit us to render the signup page
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { name, email, phone, address, password } = req.body;


  // Search the database for a user with the username submitted in the form
  User.findOne({ email }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Email already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          name,
          email,
          phone,
          address,
          password: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        // req.session.user = user;
        // SessionUser = req.session.user;
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
  res.render("auth/login"); //Assit us to render the login page
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!email) { //Check if the email field is empty or not
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your Email." });
  }

  User.findOne({ email })
    .then((user) => {
      //it help us check if the user exist in the database or not
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }

      // If user is found ,it check if the provided password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }

        // If the password matches, login the user and redirect to the home page
        req.session.user = user;
        SessionUser = req.session.user;
        // console.log(SessionUser);
        return res.redirect("/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("auth/login", { errorMessage: err.message });
    });
});

router.get("/logout", isLoggedIn, (req, res) => { //Assit us to logout the user
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
