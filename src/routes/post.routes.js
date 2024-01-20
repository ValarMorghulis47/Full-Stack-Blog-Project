import { Router } from 'express';
import {
    createPost, updatePost , getSinglePost, getAllPosts, getUserPosts, deletePost
} from "../controllers/post.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get(getAllPosts)
router.route("/").post(
    upload.single("image"),
    createPost
);
router.route("/:postId").get(getSinglePost)
router.route("/user/:userId").get(getUserPosts)
router.route("/:postId").delete(deletePost)
router.route("/:postId").patch(upload.single("image"), updatePost);

// router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router