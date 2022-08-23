const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//Get to See all users.
router.get("/users", (req, res, next) => {
  res.render("users/view-users")
});

//Get to See the user details.
router.get("/users-viewDetails", (req, res, next) => {
  res.render("users/view-userDetails")
});

//Get to create a form

router.get("/create-art", (req, res, next) => {
  res.render("art/create-art")
});

//GET to view Art

router.get("/view-art", (req, res, next) => {
  res.render("art/view-art")
});

//GET to view Art Details

router.get("/view-artDetails", (req, res, next) => {
  res.render("art/view-artDetails")
});



module.exports = router;
