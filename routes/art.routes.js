const Art = require("../models/Art.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

const router = require("express").Router();

//MiddleWare to check if user is logged in
const isLoggedIn = require("../middleware/isLoggedIn");  //help to check if user is logged in
const { populate } = require("../models/User.model");
const fileUploader = require('../config/cloudinary.config');

//It helps create a form to create a new art

router.get("/create-art", isLoggedIn, (req, res, next) => {
    res.render("art/create-art")
});

//POST to save into the database a new art piece
///create-art" -> Help as create the Art and load it to the database
//fileUploader.single('art-image') --> Help us upload the image file to cloudinary
router.post("/create-art", fileUploader.single('art-image'), isLoggedIn, (req, res, next) => {
    const { title, description, price } = req.body;
    const author = req.session.user._id;

   //It help us save the information of the art piece into the database 
    Art.create({
        title,
        description,
        price,
        author,
        imageUrl: req.file.path,
    })
        .then((art) => {
            // console.log(art);
            articleID = art._id
            //Help us to know the user has a new art piece
            return User.findByIdAndUpdate(author, { $push: { art: art._id } });
        })
        .then(artTwo => {
            //Help us Load the Art Piece page how it looks like.
            res.redirect(`/arts/art/${articleID}`);
        })
        .catch(error => {
            console.log(error);
        })
});

//This route help us to display all the art pieces
router.get("/", (req, res, next) => {
    Art.find()
        .then(arts => {
            // console.log(arts);
            res.render("art/view-art", { arts: arts });
        }).catch(err => {
            next(err);
        })
});




//This route helps use to find an art piece by id, the comments related to the Art 
//and the users who made the comment
router.get("/art/:artId", (req, res, next) => {
    //Get a specific art from the database and show info
    const { artId } = req.params;
    // console.log(artId);

    Art.findById(artId)
        .populate("comments")
        .populate({
            path: "comments",
            populate: {
                path: "author",
                model: "User",
            }
        })
        .then(art => {
            console.log(art.comments);
            res.render("art/view-artDetails", { art: art, comments: art.comments });
        })
        .catch(err => {
            next(err);
        })
});

//It helps us to create a new comment for an art piece
router.post("/art/:artId/comment", isLoggedIn, (req, res, next) => {
    const artId = req.params;
    // console.log(artId);
    ArtId = artId.artId;
    const { content } = req.body;
    const author = req.session.user._id;

    Comment.create({
        content,
        author
    })
        .then((comment) => {
            // console.log(art);
            console.log(comment);
            return Art.findByIdAndUpdate(ArtId, { $push: { comments: comment._id } });
        })
        .then(art => {
            console.log(art);
            res.redirect(`/arts/art/${ArtId}`);
        })
        .catch(err => {
            next(err);
        }
        );

});

module.exports = router;