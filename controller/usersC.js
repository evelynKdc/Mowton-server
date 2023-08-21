const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../model/User");

const getUsers = (req = request, res = response) => {
  res.json({
    mssg: "im in user path!!!",
  });
};

const createUsers = async(req = request, res = response) => {
  const { name, email, password } = req.body;
  const user = new User({ name, password, email }); //create the model with the data from the body request
     //encrypting password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);
  //saving in database
  try {
    
    await user.save();
    
      return res.json({
        user
      });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({error})
  }
};
module.exports = { getUsers, createUsers };
