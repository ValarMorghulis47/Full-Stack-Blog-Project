import { Router } from "express";
import { changeCurrentPassword, deleteUserAccount, forgotPassword, getCurrentUser, getUserProfile, loginUser, logoutUser, refereshAccessToken, registerUser, resetPassword, upDateUserDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser);
//secured routes
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/refresh-token").post(refereshAccessToken);
router.route("/forgot-password").post(verifyJWT, forgotPassword);
router.route("/reset-password/:token").patch(verifyJWT, resetPassword);
router.route("/change-password").patch(verifyJWT, changeCurrentPassword)
router.route("/currentuser").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverimage",
        maxCount: 1
    }
]), upDateUserDetails)
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/update-coverimage").patch(verifyJWT, upload.single("coverimage"), updateUserCoverImage)
router.route("/profile/:userId").get(verifyJWT, getUserProfile)
router.route("/delete-account").get(verifyJWT, deleteUserAccount)


export default router;