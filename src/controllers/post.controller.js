const {
  createPostService,
  updatePostService,
  getPostService,
  deletePostService,
  getAllPostsService,
} = require("../services/posts.services");

const createPost = async (req, res) => {
  try {
    const post = await createPostService(req.body, req.user.id);
    res.status(201).json({ message: "Post Created", data: post });
  } catch (error) {
    res.status(201).json({ message: "Post Created", data: post });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await updatePostService(postId, req.body, req.user.id);
    res.status(200).json({ message: "Post updated successfully", data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await getPostService(postId);
    res.json({ message: "Post", data: post });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await deletePostService(postId, req.user.id);
    res.status(200).json({ message: "Post deleted", data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await getAllPostsService();
    res.status(200).json({ message: "All posts", data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createPost,
  updatePost,
  getPost,
  deletePost,
  getAllPosts,
};
