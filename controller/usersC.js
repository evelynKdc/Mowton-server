const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../model/User");

require("dotenv").config();
// Require the Cloudinary library
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const getUsers = async (req = request, res = response) => {
  const { limit = 10, from = 0 } = req.query;

  const query = { status: true };

  try {
    const users = await User.find(query)
      .skip(Number(from))
      .limit(Number(limit));
    res.json({ ok: true, users });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: "Error al obtener los usuarios", error });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: "Error al obtener el usuario", error });
  }
};

const updatePassword = async (req = request, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    //encrypting password
    const salt = bcryptjs.genSaltSync();
    const newPassword = bcryptjs.hashSync(password, salt);
    const userUpdated = await User.findByIdAndUpdate(
      id,
      { password: newPassword },
      { new: true }
    );
    res.json({ userUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const userDelete = async (req, res) => {
  const { id } = req.params;

  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }

  try {
    const user = await User.findById(id);
    if (req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        ok: false,
        mssg: "No tiene permisos para eliminar la cuenta",
      });
    }

    const userUpdated = await User.findByIdAndUpdate(
      id,
      { estatus: false },
      { new: true }
    );
    res.json({
      ok: true,
      userUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const updateProfileImg = async (req, res) => {
  const { id } = req.params;
  const { img } = req.body;
  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }

  try {
    const user = await User.findById(id);
    if (req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        ok: false,
        mssg: "No tiene permisos para actualizar la imagen de perfil",
      });
    }

    if (img) {
      if (user.img) {
        const fullNameArr = user.img.split("/");
        const name = fullNameArr[fullNameArr.length - 1];
        const [imgId] = name.split(".");
        await cloudinary.uploader.destroy(imgId);
      }

      const result = await cloudinary.uploader.upload(image);
      user.img = result.secure_url;
    } else {
      if (user.img) {
        const fullNameArr = user.img.split("/");
        const name = fullNameArr[fullNameArr.length - 1];
        const [imgId] = name.split(".");
        await cloudinary.uploader.destroy(imgId);
      }

      user.img = undefined;
    }

    await user.save();

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Error al actualizar la imagen de perfil",
      error,
    });
  }
};

const updateCoverImg = async (req, res) => {
  const { id } = req.params;
  const { cover } = req.body;
  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }

  try {
    const user = await User.findById(id);
    if (req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        ok: false,
        mssg: "No tiene permisos para actualizar la imagen de portada",
      });
    }

    if (cover) {
      if (user.cover) {
        const fullNameArr = user.cover.split("/");
        const name = fullNameArr[fullNameArr.length - 1];
        const [imgId] = name.split(".");
        await cloudinary.uploader.destroy(imgId);
      }

      const result = await cloudinary.uploader.upload(image);
      user.cover = result.secure_url;
    } else {
      if (user.cover) {
        const fullNameArr = user.cover.split("/");
        const name = fullNameArr[fullNameArr.length - 1];
        const [imgId] = name.split(".");
        await cloudinary.uploader.destroy(imgId);
      }

      user.cover = undefined;
    }

    await user.save();

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Error al actualizar la imagen de portada",
      error,
    });
  }
};

const updateAboutUser = async (req, res) => {
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

  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }

  try {
    const user = await User.findById(id);
    if (req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        ok: false,
        mssg: "No tiene permisos para actualizar datos de este usuario",
      });
    }
    const userUpdated = await User.findByIdAndUpdate(id, rest, { new: true });
    res.json({ userUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const updateFollow = async (req, res) => {
  const { id } = req.params;
  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }

  try {
    const user = await User.findById(id);
    const userFollowing = await User.findById(req.user._id);
    if (user.followers.includes(userFollowing)) {
      user.followers = user.followers.filter(
        (userID) => userID === userFollowing._id
      );
      userFollowing.following = userFollowing.following.filter(
        (userID) => userID === user._id
      );
    } else {
      user.followers.push(userFollowing._id);
      userFollowing.following.push(user._id);
    }

    await user.save();
    await userFollowing.save();

    res.json({ ok: true, user, userFollowing });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: "Error al seguir al usuario", error });
  }
};
const addToPendingFriend = async (req, res) => {
  const { id } = req.params;
  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }

  try {
    const user = await User.findById(id);
    const userReqFriend = await User.findById(req.user._id);

    if (
      userReqFriend.friends.includes(user._id) ||
      user.friends.includes(userReqFriend._id)
    ) {
      return res.status(400).json({
        ok: false,
        mssg: "Ya son amigos actualmente",
      });
    }
    if (
      userReqFriend.pendingFriend.includes(user._id) ||
      user.pendingAccept.includes(userReqFriend._id)
    ) {
      return res.status(400).json({
        ok: false,
        mssg: "Ya hay una solicitud pendiente",
      });
    }
    user.pendingAccept.push(userReqFriend._id);
    userReqFriend.pendingFriend.push(user._id);

    await user.save();
    await userReqFriend.save();

    res.json({ ok: true, user, userReqFriend });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: "Error al volverse amigo del usuario", error });
  }
};

const confirmFriend = async (req, res) => {
  const { id } = req.params;
  const { confirm } = req.body;
  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }

  try {
    const user = await User.findById(id);
    const userReqFriend = await User.findById(req.user._id);

    if (
      userReqFriend.friends.includes(user._id) ||
      user.friends.includes(userReqFriend._id)
    ) {
      return res.status(400).json({
        ok: false,
        mssg: "Ya son amigos actualmente",
      });
    }

    if (!user.pendingFriend.includes(userReqFriend._id)) {
      return res.status(400).json({
        ok: false,
        mssg: "No esta en la lista de amistad pendiente",
      });
    }

    if (confirm) {
      user.friends.push(userReqFriend._id);
      userReqFriend.friends.push(user._id);
    } 

    userReqFriend.pendingAccept = userReqFriend.pendingAccept.filter((userID) => userID === user._id);
    user.pendingFriend = user.pendingFriend.filter((userID) => userID === userReqFriend._id);

    await user.save();
    await userReqFriend.save();

    res.json({ ok: true, user, userReqFriend });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: "Error al volverse amigo del usuario", error });
  }
};

const searchUser = async (req, res) => {
  const { object } = req.params;

  const regex = new RegExp(object, "i");
  const user = await User.find({ name: regex, estatus: true });

  res.json({ results: user });
};

module.exports = {
  getUsers,
  userDelete,
  updateProfileImg,
  updateCoverImg,
  updateAboutUser,
  updatePassword,
  updateFollow,
  addToPendingFriend,
  confirmFriend,
  getUserById,
  searchUser,
};
