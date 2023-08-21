const User = require("../model/User");

//verifying duplicated email
const duplicatedEmailValidator = async (email = "") => {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new Error("Email already exists");
    }
  };


  module.exports={
    duplicatedEmailValidator
  }