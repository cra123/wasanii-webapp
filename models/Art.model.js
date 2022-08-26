const { Schema, model } = require("mongoose");

const artSchema = new Schema({
    title: { type: String, required: true },  
    description: { type: String, required: true }, 
    price: { type: Number, required: true }, 
    author: { type: Schema.Types.ObjectId, ref: "User" }, 
    imageUrl: String, 
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }] 

});

const Art = model("Art", artSchema);

module.exports = Art;