const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../model/User");

const getUsers = (req = request, res = response) => {
  res.json({
    mssg: "im in user path!!!",
  });
};

const createUsers = async (req = request, res = response) => {
  const { name, email, password } = req.body;
  const user = new User({ name, password, email }); //create the model with the data from the body request
  //encrypting password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);
  //saving in database
  try {
    await user.save();

    return res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const userUpdate = async (req = request, res) => {
  const user = req.user;
  const { id } = req.params;
  const {
    _id,
    password,
    _v,
    google,
    email,
    estatus,
    cover,
    img,
    createdAt,
    friends,
    followers,
    ...rest
  } = req.body;

  if (password) {
    //encrypting password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  try {
    const userUpdated = await User.findByIdAndUpdate(id, rest, { new: true });
    res.json({ userUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error }); 
  }

  res.json({
    user,
    id,
  });
};

const userDelete =async(req,res)=>{
  const {id} = req.params;

  try {
    const user= await User.findByIdAndUpdate(id, {estatus:false}, { new: true });
    res.json({user})
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error }); 
  }
}
module.exports = { getUsers, createUsers, userUpdate, userDelete };
