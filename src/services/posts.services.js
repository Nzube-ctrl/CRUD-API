const Post = require("../models/post.model.js");

const createPostService = async (postData, userId) => {
  const { title, body } = postData;
  const post = new Post({ title, body, user: userId });
  await post.save();
  return post;
};

const updatePostService = async (postId, postData, userId) => {
  const { title, body } = postData;
  let post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  if (post.user.toString() !== userId) {
    throw new Error("Not authorized to update this post");
  }
  post.title = title || post.title;
  post.body = body || post.body;
  post.updatedAt = Date.now();
  await post.save();
  return post;
};

const getPostService = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

const deletePostService = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  if (post.user.toString() !== userId) {
    throw new Error("Not authorized to delete this post");
  }
  await post.remove();
  return post;
};

const getAllPostsService = async () => {
  const posts = await Post.find();
  return posts;
};

module.exports = {
  createPostService,
  updatePostService,
  getPostService,
  deletePostService,
  getAllPostsService,
};
