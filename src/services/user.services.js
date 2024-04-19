const User = require("../models/user.model.js");
const Post = require("../models/post.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUserService = async (name, email, password) => {
  try {
    let user = await User.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashedPassword });
    await user.save();
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
  } catch (error) {
    throw error;
  }
};

const getPostsService = async () => {
  try {
    const posts = await Post.find().populate("user", [
      "id",
      "name",
      "email",
      "updatedAt",
      "createdAt",
    ]);
    return posts.map((post) => ({
      id: post._id,
      title: post.title,
      body: post.body,
      user: {
        id: post.user._id,
        name: post.user.name,
        email: post.user.email,
        updatedAt: post.user.updatedAt,
        createdAt: post.user.createdAt,
      },
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
    }));
  } catch (error) {
    throw error;
  }
};

const loginUserService = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }
    const payload = {
      user: {
        id: user._id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    return {
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  registerUserService,
  loginUserService,
  getPostsService,
};
