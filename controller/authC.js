const { request } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../model/User");
const { generateJWT } = require("../helpers/jwtValidator");
const { googleVerify } = require("../helpers/googleVerify");

const registerAuth = async (req = request, res) => {
  const { name, lastName, email, password } = req.body;
  const user = new User({ name, lastName, password, email }); //create the model with the data from the body request
  //encrypting password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);
  //saving in database
  try {
    await user.save();
    const token = await generateJWT(user._id);

    return res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, error });
  }
};

const loginAuth = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        mssg: "This user is not in database",
      });
    }

    if (!user.estatus) {
      return res.status(400).json({
        ok: false,
        mssg: "This user is not active",
      });
    }

    //verifying password
    const passwordCompared = bcryptjs.compareSync(password, user.password);
    if (!passwordCompared) {
      return res.status(400).json({
        ok: false,
        mssg: "Password is incorrect",
      });
    }

    //generate token
    const token = await generateJWT(user._id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
    });
  }
};
const googleAuth = async (req, res) => {
  //TODO verify
  const { googleToken } = req.body;

  try {
    const { email, name } = await googleVerify(googleToken);
    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        username: name, //TODO verify
        email,
        password: ":)",
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    if (!user.estatus) {
      res.status(401).json({
        mssg: "Talk with the authorities because it is not an user active",
      });
    }

    //Generating JWT
    const token = await generateJWT(user.id);

    res.json({
      mssg: "google autentication ok",
      user,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      mssg: "Google token is invalid or it could not be verified",
    });
  }
};

module.exports = {
  registerAuth,
  loginAuth,
  googleAuth,
};
