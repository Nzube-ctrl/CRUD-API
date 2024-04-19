const express = require("express");
const postController = require("../controllers/post.controller.js");
const authMiddleware = require("../middlewares/authmiddleware.js");

const postRoute = express.Router();
postRoute.post("/", authMiddleware, postController.createPost);
postRoute.patch("/:postId", authMiddleware, postController.updatePost);
postRoute.get("/", authMiddleware, postController.getAllPosts);
postRoute.get("/:postId", authMiddleware, postController.getPost);
postRoute.delete("/:postId", authMiddleware, postController.deletePost);
module.exports = postRoute;
