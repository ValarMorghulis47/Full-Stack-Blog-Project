import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String,
        required: true
    },
    imagePublicId: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

export const Post = mongoose.model("Post", PostSchema)