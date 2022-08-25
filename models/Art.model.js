const { Schema, model } = require("mongoose");

const artSchema = new Schema({
    title: { type: String, required: true },  // title of the art piece
    description: { type: String, required: true }, // description of the art piece
    price: { type: Number, required: true }, // price of the art piece
    author: { type: Schema.Types.ObjectId, ref: "User" }, // author of the art piece
    //Store an image in the database
    // image: {
    //     data: Buffer,
    //     contentType: String
    // },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]

});

const Art = model("Art", artSchema);

module.exports = Art;