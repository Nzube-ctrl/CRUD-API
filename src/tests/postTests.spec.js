const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Post = require("../models/post.model");
const {
  createPostService,
  updatePostService,
  getPostService,
  deletePostService,
  getAllPostsService,
} = require("../services/posts.services.js");

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Post Service", () => {
  let userId;
  let postId;

  beforeEach(async () => {
    const userData = {
      username: "testUser",
      email: "test@example.com",
      password: "testpassword",
    };
    const user = await User.create(userData);
    userId = user._id;

    const postData = { title: "Test Post", body: "This is a test post" };
    const post = await Post.create({ ...postData, user: userId });
    postId = post._id;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  test("Create Post", async () => {
    const postData = { title: "New Post", body: "This is a new post" };
    const createdPost = await createPostService(postData, userId);
    expect(createdPost.title).toBe(postData.title);
    expect(createdPost.body).toBe(postData.body);
    expect(createdPost.user.toString()).toBe(userId.toString());
  });

  test("Update Post", async () => {
    const updatedTitle = "Updated Title";
    const updatedBody = "This is the updated body";
    const updatedPostData = { title: updatedTitle, body: updatedBody };
    const updatedPost = await updatePostService(
      postId,
      updatedPostData,
      userId
    );
    expect(updatedPost.title).toBe(updatedTitle);
    expect(updatedPost.body).toBe(updatedBody);
  });

  test("Get Post", async () => {
    const retrievedPost = await getPostService(postId);
    expect(retrievedPost).toBeDefined();
    expect(retrievedPost.title).toBe("Test Post");
  });

  test("Delete Post", async () => {
    await deletePostService(postId, userId);
    const deletedPost = await Post.findById(postId);
    expect(deletedPost).toBeNull();
  });

  test("Get All Posts", async () => {
    const allPosts = await getAllPostsService();
    expect(allPosts).toHaveLength(1);
  });
});
