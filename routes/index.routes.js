const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if(req.session.user) {
    SessionUser = req.session.user
    res.render("index", {SessionUser}); 
  } else {
    res.render("index");
  }
});

module.exports = router;
