const { request } = require("express");
const Post = require("../model/Post");
require("dotenv").config();
// Require the Cloudinary library
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const createPost = async (req, res) => {
  const { description, image } = req.body;

  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }
  if (!description && !image) {
    return res.status(400).json({
      ok: false,
      mssg: "La descripcion o la imagen es requerida",
    });
  }

  const user = req.user._id;
  const data = { user };
  try {
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      data.img = result.secure_url;
    }

    if (description) {
      data.description = description;
    }

    const post = new Post(data);
    await post.save();
    res.status(201).json({
      ok: true,
      post,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Error al cargar el post" });
  }
};

const updatePost = async (req, res) => {
  const { description, image } = req.body;
  const { id } = req.params;
  console.log(id, description);

  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }

  if (!description && !image) {
    return res.status(400).json({
      ok: false,
      mssg: "La descripcion o la imagen es requerida",
    });
  }


  try {
    const post = await Post.findById(id);
    // Verifica si el usuario actual (req.user) es el creador del post
    if (req.user._id.toString() !== post.user.toString()) {
      return res.status(403).json({
        ok: false,
        mssg: "No tiene permisos para actualizar este post",
      });
    }

    if (description) {
      post.description = description;
    } else {
      post.description = undefined;
    }

    if (image) {
      if (post.img) {
        const fullNameArr = post.img.split("/");
        const name = fullNameArr[fullNameArr.length - 1];
        const [imgId] = name.split(".");
        await cloudinary.uploader.destroy(imgId);
      }

      const result = await cloudinary.uploader.upload(image);
      post.img = result.secure_url;
    } else {
      const fullNameArr = post.img.split("/");
      const name = fullNameArr[fullNameArr.length - 1];
      const [imgId] = name.split(".");
      await cloudinary.uploader.destroy(imgId);
      post.img = undefined;
    }

    await post.save();

    res.json({
      ok: true,
      post,
    });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: "Error al actualizar el post", error });
  }
};

const deletePost = async (req, res) => {

  const { id } = req.params;
  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }
  try {
    const post = await Post.findById(id);
    // Verifica si el usuario actual (req.user) es el creador del post
    if (req.user._id.toString() !== post.user.toString()) {
      return res.status(403).json({
        ok: false,
        mssg: "No tiene permisos para eliminar este post",
      });
    }
    const postUpdated = await Post.findByIdAndUpdate(id, { status: false }); //TODO verificar
    await postUpdated.save();
    res.json({
      ok: true,
      postUpdated
    });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

const getPostByid = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);

    res.json({
      ok: true,
      post,
    });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: "Error al obtener datos del post", error });
  }
};


const getAllPosts = async (req=request,res) =>{
  const {limit = 10, from = 0} = req.query;

  const query = {status: true};

  try {

    const posts = await Post.find(query).populate("user").skip(Number(from)).limit(Number(limit))
    res.json({ok:true, posts})
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: "Error al obtener los posts", error });
  }
}
module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPostByid,
  getAllPosts
};
