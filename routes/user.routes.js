const router = require("express").Router();

//Import the User Model
const User = require("../models/User.model");

//Import the isLoggedIn middleware
const isLoggedIn = require("../middleware/isLoggedIn");

//Get to See all users.
router.get("/", (req, res, next) => {
    //Get all the data from the database for the users.
    User.find()
        .then(users => {
            // console.log(users);
            res.render("users/view-users", { users: users });
        }).catch(err => {
            next(err);
        })
});

//Get to See the user details.
router.get("/user/:userId", isLoggedIn,  (req, res, next) => {
    //Get a specific user from the database and show info
    const { userId } = req.params;
    // console.log(userId);

    User.findById(userId)
    .populate("art")
        .then(user => {
            console.log(user.art);
            res.render("users/view-userDetails", { user: user })
        })
        .catch(err => {
            next(err);
        })
});



module.exports = router;