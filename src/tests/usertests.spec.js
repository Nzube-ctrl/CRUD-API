const {
  registerUserService,
  getPostsService,
  loginUserService,
} = require("../services/user.services.js");

const User = require("../models/user.model.js");
const Post = require("../models/post.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mocking User Model
jest.mock("../models/user.model.js", () => ({
  findOne: jest.fn(),
  save: jest.fn(),
}));

// Mocking Post Model
jest.mock("../models/post.model.js", () => ({
  find: jest.fn(),
}));

// Mocking bcrypt
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

// Mocking jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("UserService", () => {
  describe("registerUserService", () => {
    const mockedUserData = {
      name: "Test User",
      email: "test@example.com",
      password: "testpassword",
    };

    it("should register a new user", async () => {
      const mockedUser = new User(mockedUserData);
      User.findOne.mockResolvedValue(null);
      User.prototype.save.mockResolvedValue(mockedUser);

      const result = await registerUserService(
        mockedUserData.name,
        mockedUserData.email,
        mockedUserData.password
      );

      expect(result).toEqual(expect.objectContaining(mockedUserData));
    });

    it("should throw an error if the user already exists", async () => {
      User.findOne.mockResolvedValue({ email: mockedUserData.email });

      await expect(
        registerUserService(
          mockedUserData.name,
          mockedUserData.email,
          mockedUserData.password
        )
      ).rejects.toThrow("User already exists");
    });
  });
});

describe("PostService", () => {
  describe("getPostsService", () => {
    it("should return all posts with user details", async () => {
      const mockedPosts = [
        {
          _id: "post1",
          title: "Test Post 1",
          body: "This is a test post 1",
          user: {
            _id: "user1",
            name: "Test User 1",
            email: "user1@example.com",
            updatedAt: new Date(),
            createdAt: new Date(),
          },
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ];

      Post.find.mockResolvedValue(mockedPosts);

      const result = await getPostsService();

      expect(result).toEqual(
        mockedPosts.map((post) => ({
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
        }))
      );
    });
  });
});

describe("AuthService", () => {
  describe("loginUserService", () => {
    const mockedUserData = {
      _id: "user1",
      name: "Test User",
      email: "test@example.com",
      password: "$2b$10$54A.rHRfKEq3cWEmQRuyl.V5lRR1x2iMecbFz9ahmtMAHDSVHoVyG", // hashed password for "testpassword"
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    it("should login a user and return JWT token and user details", async () => {
      User.findOne.mockResolvedValue(mockedUserData);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("jwt_token");

      const result = await loginUserService(
        mockedUserData.email,
        "testpassword"
      );

      expect(result).toEqual({
        accessToken: "jwt_token",
        user: {
          id: mockedUserData._id,
          name: mockedUserData.name,
          email: mockedUserData.email,
          updatedAt: mockedUserData.updatedAt,
          createdAt: mockedUserData.createdAt,
        },
      });
    });

    it("should throw an error if user does not exist", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        loginUserService("test@example.com", "testpassword")
      ).rejects.toThrow("Invalid Credentials");
    });

    it("should throw an error if password is incorrect", async () => {
      User.findOne.mockResolvedValue(mockedUserData);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        loginUserService("test@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid Credentials");
    });
  });
});
