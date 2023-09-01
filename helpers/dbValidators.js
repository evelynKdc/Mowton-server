const User = require("../model/User");

//verifying duplicated email
const duplicatedEmailValidator = async (email = "") => {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new Error("Email already exists");
    }
  };
//verifying if user id exists
  const isUserIdExist = async (id = "") => {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User does not exist");
    }
  };



  module.exports={
    duplicatedEmailValidator,
    isUserIdExist
  }