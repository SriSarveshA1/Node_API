const express = require("express");
const {
    getPosts,
    createPost,
    postsByUser,
    postById,
    isPoster,
    updatePost,
    deletePost
} = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { createPostValidator } = require("../validator");

const router = express.Router();//express.Router() is a class and the variable router is an object that

router.get("/posts", getPosts);//this particular route can be accessed if and only if we have the required JWT that contains the secret key     
router.post(
    "/post/new/:userId",
    requireSignin,
    createPost,
    createPostValidator
);
router.get("/posts/by/:userId", requireSignin, postsByUser);//this particular route can be accessed if and only if we have the required JWT that contains the secret key 
router.put("/post/:postId", requireSignin, isPoster, updatePost);//so for the new update of the post with the given post id in the url we update the post and the authenticated user should be the same who created it
router.delete("/post/:postId", requireSignin, isPoster, deletePost);//so here the user who is trying to delete the post should be logged in and should be the same person who created the post and then we call deletpost

// any route containing :userId, our app will first execute userById()
router.param("userId", userById);
// any route containing :postId, our app will first execute postById()
router.param("postId", postById);

module.exports = router;
