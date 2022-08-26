// const router = require("express").Router();
// const isLoggedIn = require("../middleware/isLoggedIn");

// const Art = require("../models/art");
// const User = require("../models/user");


// // POST a comment on a new piece of art

// router.post("/art/:artId/comment", isLoggedIn, (req, res, next) => {
//     const { artId } = req.params;
//     const { comment } = req.body;
//     const author = req.session.user._id;

//     Comment.create({
//         comment,
//         author
//     })
//         .then(comment => {
//             return Art.findByIdAndUpdate(artId, { $push: { comments: comment._id } });
//         })
//         .then(art => {
//             res.redirect(`/arts/art/${artId}`);
//         })
//         .catch(err => {
//             next(err);
//         }
//     );

// });
