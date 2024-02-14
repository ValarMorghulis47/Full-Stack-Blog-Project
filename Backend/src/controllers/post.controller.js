import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Post } from "../models/post.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { DeleteFileCloudinary } from "../utils/DeleteFileCloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"

const createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        const error = new ApiError(410, "Title or Content Is Missing");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const postimgLocalPath = req.file?.path;
    if (!postimgLocalPath) {
        const error = new ApiError(408, "Post Image Is Required");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const postimgFolder = "post";
    const postimg = await uploadOnCloudinary(postimgLocalPath, postimgFolder);
    if (!postimg) {
        const error = new ApiError(508, "Error while uploading post image file on cloudinary");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const post = await Post.create({
        title,
        content,
        author: req.user?._id,
        image: postimg.url,
        imagePublicId: postimg.public_id
    })
    if (!post) {
        const error = new ApiError(503, "Error while creating post");
        return res.status(error.statusCode).json(error.toResponse());
    }
    return res.status(200).json(
        new ApiResponse(200, post, "Post Created Successfully")
    )
})

const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        const error = new ApiError(410, "Post Id Is Missing");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const { title, content } = req.body;
    const postimgLocalPath = req.file?.path;
    const existedpost = await Post.findById({ _id: postId });
    if (!existedpost) {
        const error = new ApiError(404, "Post Not Found");
        return res.status(error.statusCode).json(error.toResponse());
    }
    if (!(title || content || postimgLocalPath)) {
        const error = new ApiError(410, "Atleast One Field Is Required To Update The Post");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const existedpostimg = existedpost.imagePublicId;
    if (postimgLocalPath) {
        const postimgFolder = "post";
        const post = await uploadOnCloudinary(postimgLocalPath, postimgFolder);
        if (!post) {
            const error = new ApiError(408, "Error while uploading post file on cloudinary");
            return res.status(error.statusCode).json(error.toResponse());
        }
        await Post.findByIdAndUpdate(postId, {
            $set: {
                image: post.url,
                imagePublicId: post.public_id
            }
        }, {
            new: true
        }).select("-password")
        if (existedpostimg) {
            await DeleteFileCloudinary(existedpostimg, postimgFolder);
        }
    }
    const updatedPost = await Post.findByIdAndUpdate(postId, {
        $set: {
            title,
            content
        }
    }, {
        new: true
    })
    if (!updatedPost) {
        const error = new ApiError(503, "Error while updating post");
        return res.status(error.statusCode).json(error.toResponse());
    }
    return res.status(200).json(
        new ApiResponse(200, updatedPost, "Post Updated Successfully")
    )
})

const getSinglePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        const error = new ApiError(410, "Post Id Is Missing");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const post = await Post.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(postId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    authorDetails: {
                        $first: "$authorDetails"
                    }
                }
            },
            {
                $project: {
                    title: 1,
                    authorDetails: 1,
                    createdAt: 1,
                    content: 1,
                    image: 1
                }
            }
        ]
    )
    if (!post?.length) {
        const error = new ApiError(410, "No Posts Found")
        return res.status(error.statusCode).json(error.toResponse());
    }
    return res.status(200).json(
        new ApiResponse(200, post[0], "Post Found Successfully")
    )
})

const getAllPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType } = req.query;

    // Start with a base query
    let query = {};

    // Add sorting based on sortBy and sortType
    let sort = {};
    if (sortBy && sortType) {
        sort[sortBy] = sortType.toLowerCase() === 'desc' ? -1 : 1;
    } else {
        // Default sorting by createdAt in ascending order if sortBy and sortType are not provided
        sort.createdAt = 1;
    }

    // Calculate total posts
    const totalPosts = await Post.countDocuments(query);

    // Execute the query with pagination
    const Posts = await Post.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

    if (!Posts.length) {
        const error = new ApiError(404, "No Posts Found")
        return res.status(error.statusCode).json(error.toResponse());
    }

    // Return the result to the client
    return res.status(200).json(
        new ApiResponse(200, { posts: Posts, totalPosts }, "Posts Fetched Successfully")
    );
});

const getUserPosts = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userPosts = await Post.aggregate(
        [
            {
                $match: {
                    author: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $project: {
                    title: 1,
                    image: 1
                }
            }
        ]
        )
    if (!userPosts?.length) {
        const error = new ApiError(410, "No Posts For This User")
        return res.status(error.statusCode).json(error.toResponse());
    }
    return res.status(200).json(
        new ApiResponse(200, userPosts, "Posts Fetched Successfully")
    );
})

const deletePost = asyncHandler(async (req, res)=>{
    const { postId } = req.params;
    if (!postId) {
        const error = new ApiError(410, "Post Id Is Missing");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const existedpost = await Post.findById({ _id: postId }).select("imagePublicId");
    const postimgFolder = "post";
    await DeleteFileCloudinary(existedpost.imagePublicId, postimgFolder)
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
        const error = new ApiError(404, "Post Not Found");
        return res.status(error.statusCode).json(error.toResponse());
    }
    return res.status(200).json(
        new ApiResponse(200, {}, "Post Deleted Successfully")
    )
})

export {
    createPost,
    updatePost,
    getSinglePost,
    getAllPosts,
    getUserPosts,
    deletePost
}