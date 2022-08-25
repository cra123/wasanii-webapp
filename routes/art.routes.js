const Art = require("../models/Art.model");
const User = require("../models/User.model");

const router = require("express").Router();


//Get to create a form

router.get("/create-art", (req, res, next) => {
    res.render("art/create-art")
});

//POST to create a new art piece
router.post("/create-art", (req, res, next) => {
    const { title, description, price, author } = req.body;
    Art.create({
        title,
        description,
        price,
    })
        .then(art => {
            // console.log(art);
            res.render("art/view-artDetails", { art });
        })
        .catch(error => {
            console.log(error);
        })
});

//Show all the Art
router.get("/", (req, res, next) => {
    Art.find()
        .then(arts => {
            // console.log(arts);
            res.render("art/view-art", { arts: arts });
        }).catch(err => {
            next(err);
        })
});


//GET to view Art Details

//Get to See the user details.
router.get("/art/:artId", (req, res, next) => {
    //Get a specific art from the database and show info
    const { artId } = req.params;
    // console.log(ar);

    Art.findById(artId)
        .then(art => {
            // console.log(user);
            res.render("art/view-artDetails", { art: art })
        })
        .catch(err => {
            next(err);
        })
});

module.exports = router;