const {
  registerUserService,
  loginUserService,
  getPostsService,
} = require("../services/user.services.js");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userData = await registerUserService(name, email, password);
    res
      .status(201)
      .json({ message: "User registered successfully", data: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const postsData = await getPostsService();
    res.status(200).json({ message: "All posts", data: postsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authData = await loginUserService(email, password);
    res.status(200).json({ message: "Login successful", data: authData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {
  loginUser,
  getPosts,
  registerUser,
};
