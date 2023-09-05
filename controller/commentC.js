const Comment = require("../model/Comment");
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

const createComment = async (req, res) => {
  //Todo verify!!!
  const { description, image, post } = req.body;

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
  const data = { user, post };
  try {
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      data.img = result.secure_url;
    }

    if (description) {
      data.description = description;
    }

    const comment = new Comment(data);
    await comment.save();

    const postUpdated = await Post.findById(post);
    postUpdated.comments.push(comment._id);
    postUpdated.save();
    res.status(201).json({
      ok: true,
      comment,
      postUpdated,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Error al crear el comentario" });
  }
};

const getAllComments = async (req, res) => {
  const { post } = req.body;
  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }

  const query = {
    post,
    status: true,
  };

  try {
    const comments = await Comment.find(query).populate("user");

    res.json({ comments });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: "Error al cargar los comentarios" });
  }
};

const getCommentById = async (req, res) => {
  const { id } = req.params;
  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }

  try {
    const comment = await Comment.findById(id).populate("user");

    res.json({ comment });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: "Error al cargar los comentarios" });
  }
};

const updateComment = async (req, res) => {
  const { description, image } = req.body;
  const { id } = req.params;

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
    const comment = await Comment.findById(id);
    if (req.user._id.toString() !== comment.user.toString()) {
      return res.status(403).json({
        ok: false,
        mssg: "No tiene permisos para actualizar este comentario",
      });
    }

    if (description) {
      comment.description = description;
    } else {
      comment.description = undefined;
    }

    if (image) {
      if (comment.img) {
        const fullNameArr = comment.img.split("/");
        const name = fullNameArr[fullNameArr.length - 1];
        const [imgId] = name.split(".");
        await cloudinary.uploader.destroy(imgId);
      }

      const result = await cloudinary.uploader.upload(image);
      comment.img = result.secure_url;
    } else {
      if (comment.img) {
        const fullNameArr = comment.img.split("/");
        const name = fullNameArr[fullNameArr.length - 1];
        const [imgId] = name.split(".");
        await cloudinary.uploader.destroy(imgId);
      }
      comment.img = undefined;
    }

    await comment.save();

    res.json({
      ok: true,
      comment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, error: "Error al actualizar el comentario", error });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  if (!req.user._id) {
    return res.status(500).json({
      ok: false,
      mssg: "internal error, jwt is not validated because it is not available the id",
    });
  }
  try {
    const comment = await Comment.findById(id);
    // // Verifica si el usuario actual (req.user) es el creador del post
    if (req.user._id.toString() !== comment.user.toString()) {
      return res.status(403).json({
        ok: false,
        mssg: "No tiene permisos para eliminar este comentario",
      });
    }
    const comentUpdated = await Comment.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );
    res.json({
      ok: true,
      comentUpdated,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const commentLiked = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;

  try {
    const comment = await Comment.findById(id);

    if (comment.likes.includes(user)) {
      comment.likes = comment.likes.filter((userID) => userID === user);
    } else {
      comment.likes.push(user);
    }

    await comment.save();

    res.json({ ok: true, comment });
  } catch (error) {
    res
      .status(500)
      .json({
        ok: false,
        error: "Error al dar reaccionar al comentario",
        error,
      });
  }
};

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
  commentLiked,
};
