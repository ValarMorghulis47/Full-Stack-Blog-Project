import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Post } from "../models/post.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { DeleteFileCloudinary } from "../utils/DeleteFileCloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { sendmail } from "../utils/SendEmail.js"
import { ObjectId} from "bson"
const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        // user.refreshToken = refreshToken; // adding refresh token in the user database
        // await user.save({ ValidateBeforeSave: false }) //dont validate. we just want save the referesh token in the database
        return { accessToken, refreshToken };
    } catch (err) {
        const error = new ApiError(500, "Something went wrong while making the tokens")
        return res.status(error.statusCode).json(error.toResponse());
    }

}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const { fullname, username, email, password } = req.body;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{5,}$/;
    if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
        const error = new ApiError(400, "All Fields Are Required");
        return res.status(error.statusCode).json(error.toResponse());
    }
    // if (!passwordRegex.test(password)){
    //     const error = new ApiError(400, "Password must be at least 5 characters long and contain at least one number, one uppercase letter and one lowercase letter");
    // }
    if (!email?.includes('@')) {
        const error = new ApiError(400, "@sign is missing in the email field");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        const error = new ApiError(408, "Username or Email Already Exists");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverimage?.[0]?.path;

    if (!avatarLocalPath) {
        const error = new ApiError(408, "Avatar File Is Required");
        return res.status(error.statusCode).json(error.toResponse());
    }

    if (!coverImageLocalPath) {
        const error = new ApiError(408, "Cover Image File Is Required");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const avatarFolder = "avatar";
    const coverimageFolder = "coverimage";
    const [avatar, coverimage] = await Promise.all([
        uploadOnCloudinary(avatarLocalPath, avatarFolder),
        uploadOnCloudinary(coverImageLocalPath, coverimageFolder)
    ]);

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage.url,
        email,
        username,
        password,
        avatarPublicId: avatar.public_id,
        coverimagePublicId: coverimage.public_id
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )
    if (!createdUser) {
        const error = new ApiError(500, "Something went wrong while registring the user");
        return res.status(error.statusCode).json(error.toResponse());
    }
    return res.status(200).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if ([email, password].some((field) => field?.trim() === "")) {
        const error = new ApiError(400, "All Fields Are Required");
        return res.status(error.statusCode).json(error.toResponse());
    }
    if (!email) {
        const error = new ApiError(400, "Email is required");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const user = await User.findOne({ email })
    if (!user) {
        const error = new ApiError(408, "Invalid Email Or Password");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        const error = new ApiError(404, "Invalid Password")
        return res.status(error.statusCode).json(error.toResponse());
    }
    const { accessToken, refreshToken } = await generateTokens(user._id);
    const loggedinuser = await User.findById(user._id).select("-password");  //we made another call to database beacuse the user we got above did not had the refresh token because it was null.
    const options = {
        httpOnly: true,
        path: '/',
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedinuser, accessToken, refreshToken
            }, "User Logged In Successfully")
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User Logged Out Successfully")
        )
})

const refereshAccessToken = asyncHandler(async (req, res) => {
    const incomingrefreshtoken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingrefreshtoken) {
        const error = new ApiError(400, "Refresh Token is required");
        return res.status(error.statusCode).json(error.toResponse());
    }
    try {
        const decodedToken = jwt.verify(
            incomingrefreshtoken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            const error = new ApiError(400, "Invalid Refresh Token");
            return res.status(error.statusCode).json(error.toResponse());
        }
        if (incomingrefreshtoken !== user?.refreshToken) {
            const error = new ApiError(404, "Refresh Token Is Expired");
            return res.status(error.statusCode).json(error.toResponse());
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newrefreshToken } = await generateTokens(user._id);
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(200, {
                    accessToken, refreshToken: newrefreshToken
                }, "Refresh Token Refreshed")
            )
    } catch (er) {
        const error = new ApiError(405, er?.message || "Invalid Refresh Token");
        return res.status(error.statusCode).json(error.toResponse());
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmpassword } = req.body;
    if (newPassword !== confirmpassword) {
        const error = new ApiError(406, "Passwords Do Not Match");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const user = await User.findById(req.user?._id);
    if (!user) {
        const error = new ApiError(400, "User Does Not Exist");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        const error = new ApiError(404, "Invalid Old Password")
        return res.status(error.statusCode).json(error.toResponse());
    }
    user.password = newPassword;
    await user.save({ ValidateBeforeSave: false });
    return res.status(200).json(
        new ApiResponse(200, {}, "Password Changed Successfully")
    )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    // const user = await User.findById(req.user?._id);
    // if (!user) {
    //     const error = new ApiError(400, "User Does Not Exist");
    // }
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current User Retrieved Successfully")
    )
})

const upDateUserDetails = asyncHandler(async (req, res) => {
    const { fullname, email, username } = req.body;
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverimage?.[0]?.path;
    if (!(fullname || email || username || avatarLocalPath || coverImageLocalPath)) {
        const error = new ApiError(410, "Atleast One Field Is Required To Update The Account");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const currentUser = await User.findById(req.user._id);
    if (username && username !== currentUser.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            const error = new ApiError(408, "Username Already Exists");
            return res.status(error.statusCode).json(error.toResponse());
        }
    }

    if (email && email !== currentUser.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new ApiError(408, "Email Already Exists");
            return res.status(error.statusCode).json(error.toResponse());
        }
    }
    if (avatarLocalPath) {
        const avatarFolder = "avatar";
        const avatar = await uploadOnCloudinary(avatarLocalPath, avatarFolder);
        if (!avatar) {
            const error = new ApiError(408, "Error while uploading avatar file on cloudinary");
            return res.status(error.statusCode).json(error.toResponse());
        }
        const previousPublicId = currentUser.avatarPublicId;
        await User.findByIdAndUpdate(req.user?._id, {
            $set: {
                avatar: avatar.url,
                avatarPublicId: avatar.public_id,
            }
        }, {
            new: true
        }).select("-password")
        if (previousPublicId) {
            await DeleteFileCloudinary(previousPublicId, avatarFolder);
        }
    }
    if (coverImageLocalPath) {
        const coverimageFolder = "coverimage";
        const coverimage = await uploadOnCloudinary(coverImageLocalPath, coverimageFolder);
        if (!coverimage) {
            const error = new ApiError(408, "Error while uploading cover image file on cloudinary");
            return res.status(error.statusCode).json(error.toResponse());
        }
        const previousPublicId = currentUser.coverimagePublicId;
        await User.findByIdAndUpdate(req.user?._id, {
            $set: {
                coverimage: coverimage.url,
                coverimagePublicId: coverimage.public_id
            }
        },
            {
                new: true
            }).select("-password")
        if (previousPublicId) {
            await DeleteFileCloudinary(previousPublicId, coverimageFolder);
        }
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullname,   /*or we can write it as fullname: fullname, email: email, username: username */
            email,
            username
        }
    }, {
        new: true
    }).select("-password");
    return res.status(200).json(
        new ApiResponse(200, user, "User Updated Successfully")
    )
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        const error = new ApiError(408, "Avatar File Is Required");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const avatarFolder = "avatar";
    const avatar = await uploadOnCloudinary(avatarLocalPath, avatarFolder);
    if (!avatar) {
        const error = new ApiError(408, "Error while uploading avatar file on cloudinary");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const user = await User.findById(req.user?._id).select("avatar");
    const previousPublicId = user.avatarPublicId;
    const updateduser = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    }, {
        new: true
    }).select("-password");
    if (previousPublicId) {
        await DeleteFileCloudinary(previousPublicId, avatarFolder);
    }
    return res.status(200).json(
        new ApiResponse(200, updateduser, "Avatar Updated Successfully")
    )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        const error = new ApiError(408, "Cover Image File Is Required");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const coverimageFolder = "coverimage";
    const coverimage = await uploadOnCloudinary(coverImageLocalPath, coverimageFolder);
    if (!coverimage) {
        const error = new ApiError(408, "Error while uploading cover image file on cloudinary");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const user = await User.findById(req.user?._id).select("coverimage");
    const previousPublicId = user.coverimagePublicId;
    const updateduser = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            coverimage: coverimage.url
        }
    },
        {
            new: true
        }).select("-password")
    if (previousPublicId) {
        await DeleteFileCloudinary(previousPublicId, coverimageFolder);
    }
    return res.status(200).json(
        new ApiResponse(200, updateduser, "Cover Image Updated Successfully")
    )
})

const getUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        const error = new ApiError(410, "UserId Is Missing");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const Profile = await User.aggregate([
        {
            $match: {
                _id: new ObjectId(userId)
            },
        },
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "author",
                as: "userDetails"
            }
        },
        {
            $addFields: {
                TotalPosts: {
                    $size: "$userDetails"
                }
            }
        },
        {
            $project: {
                TotalPosts: 1,
                fullname: 1,
                avatar: 1,
                coverimage: 1,
                username: 1,
                email: 1,
                password: 1,
            }
        }
    ])
    if (!Profile?.length) {
        const error = new ApiError(404, "Profile Not Found");
        return res.status(error.statusCode).json(error.toResponse());
    }
    return res.status(200).json(
        new ApiResponse(200, Profile[0], "Profile Retrieved Successfully")
    )
})

const deleteUserAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        const error = new ApiError(400, "User Does Not Exist");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const previousAvatarPublicId = user.avatarPublicId;
    const avatarFolder = "avatar";
    if (previousAvatarPublicId) {
        await DeleteFileCloudinary(previousAvatarPublicId, avatarFolder);
    }
    const previousCoverImagePublicId = user.coverimagePublicId
    const coverimageFolder = "coverimage";
    if (previousCoverImagePublicId) {
        await DeleteFileCloudinary(previousCoverImagePublicId, coverimageFolder);
    }
    // Delete user's posts and their images
    const posts = await Post.find({ author: req.user?._id });
    if (posts?.length) {
        posts.forEach(async (post) => {
            const postImagePublicId = post.imagePublicId;
            const postImageFolder = "post";
            if (postImagePublicId) {
                await DeleteFileCloudinary(postImagePublicId, postImageFolder);
            }
        });
    }
    // The method written below is also correct but we dont need async because for of loop does not gives us callback functions. THe loops that gives us callback functions we need to use the async keyword.
    // const posts = await Post.find({ author: req.user?._id });
    // if (posts?.length) {
    // for (const post of posts) {
    //     const postImagePublicId = post.imagePublicId;
    //     const postImageFolder = "post";
    //     if (postImagePublicId) {
    //         await DeleteFileCloudinary(postImagePublicId, postImageFolder);
    //     }
    // }
    // }
    await Post.deleteMany({ author: req.user?._id });

    await User.findByIdAndDelete(req.user?._id);
    return res.status(200).json(
        new ApiResponse(200, {}, "User Deleted Successfully")
    )
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        const error = new ApiError(410, "Email Is Missing");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const user = await User.findOne({ email });
    if (!user) {
        const error = new ApiError(400, "User Does Not Exist");
        return res.status(error.statusCode).json(error.toResponse());
    }
    const resetPassWordToken = await user.generatePasswordRefreshToken();
    await user.save({ ValidateBeforeSave: false })
    // const resetPasswordUrl = `${req.protocol}://${req.get(
    //     'host'
    // )}/api/v1/users/reset-password/${resetPassWordToken}`;
    const resetUrl = `http://localhost/reset-password`;

    const subject = 'Password Reset Request';
    //     const text = `
    //     // Hello,

    //     // We received a request to reset your password.Your Reset Password Token Is ${resetPassWordToken} Click the link below to choose a new password:

    //     // ${resetUrl}

    //     // If you did not request this change, you can safely ignore this email. The link will expire in 1 hour.

    //     // Best,
    //     // Your Website Team
    //   `;
    const message = `Your Password Reset Token: ${resetPassWordToken}\n\n and the link is ${resetUrl}If you have not requested to reset your password, please ignore this email. Have a nice day!`;
    // const message = `Your Password Reset Token: ${resetPassWordToken}\n\nIf you have not requested to reset your password, please ignore this email. Have a nice day!`;
    try {
        await sendmail({
            email: user.email,
            subject,
            message
        });
        return res.status(200).json(
            new ApiResponse(200, {}, "Email Sent Successfully")
        );
    } catch (err) {
        user.passwordRefreshToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false });
        const error = new ApiError(500, "There was an error in sending the mail");
        return res.status(error.statusCode).json(error.toResponse());
    }
})

const verifyPasswordResetToken = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        passwordRefreshToken: req.params.token,
        passwordResetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
        const error = new ApiError(408, "User Does not exists or the token is expired")
        return res.status(error.statusCode).json(error.toResponse());
    }
    await user.save({ ValidateBeforeSave: false });
    return res.status(200).json(
        new ApiResponse(200, {}, "Token Verified Successfully")
    )
})

const resetPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        passwordRefreshToken: req.params.token,
        passwordResetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
        const error = new ApiError(400, "User Does Not Exist");
        return res.status(error.statusCode).json(error.toResponse());
    }
    if (req.body.password !== req.body.confirmpassword) {
        const error = new ApiError(408, "Passwords Do not match")
        return res.status(error.statusCode).json(error.toResponse());
    }

    user.password = req.body.password;
    user.passwordRefreshToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();
    return res.status(200).json(
        new ApiResponse(200, {}, "Password Updated Successfully")
    )
});

export { registerUser, loginUser, logoutUser, refereshAccessToken, changeCurrentPassword, getCurrentUser, upDateUserDetails, updateUserAvatar, updateUserCoverImage, getUserProfile, deleteUserAccount, forgotPassword, resetPassword, verifyPasswordResetToken };