const { Schema, model } = require("mongoose");


const commentSchema = new Schema(
    {
        content: { type: String, required: true }, //-> content of the comment
        author: { type: Schema.Types.ObjectId, ref: "User" }, //-> It help us to link the comment to the user who made it
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
