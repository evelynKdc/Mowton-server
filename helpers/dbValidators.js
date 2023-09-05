const Comment = require("../model/Comment");
const Post = require("../model/Post");
const User = require("../model/User");

//verifying duplicated email
const duplicatedEmailValidator = async (email = "") => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error("Email ya registrado");
  }
};
//verifying if user id exists
const isUserIdExist = async (id = "") => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User does not exist");
  }
};
//verifying if user id is active
const isUserIdActive = async (id = "") => {
  const user = await User.findById(id);
  if (!user.estatus) {
    throw new Error("User is not active");
  }
};

//verifying if post id exists
const isPostIdExist = async (id = "") => {
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post does not exist");
  }
};
//verifying if post id is active
const isPostIdActive = async (id = "") => {
  const post = await Post.findById(id);
  if (!post.status) {
    throw new Error("Post is not active");
  }
};

//verifying if comment id exists
const isCommentIdExist = async (id = "") => {
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new Error("Comment does not exist");
  }
};
//verifying if comment id is active
const isCommentIdActive = async (id = "") => {
  const comment = await Comment.findById(id);
  if (!comment.status) {
    throw new Error("Comment is not active");
  }
};

module.exports = {
  duplicatedEmailValidator,
  isUserIdExist,
  isUserIdActive,
  isPostIdExist,
  isPostIdActive,
  isCommentIdExist,
  isCommentIdActive,
};
