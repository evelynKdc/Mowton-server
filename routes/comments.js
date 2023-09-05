const { Router } = require("express");
const { fieldValidator } = require("../middleware/validator");
const { validateJWT } = require("../middleware/jwt-validator");
const { check } = require("express-validator");
const {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
  commentLiked,
} = require("../controller/commentC");
const {
  isPostIdExist,
  isPostIdActive,
  isCommentIdExist,
  isCommentIdActive,
} = require("../helpers/dbValidators");
const router = Router();

router.post(
  "/",
  [
    validateJWT,
    check("post", "El id del post es requerido").isMongoId(),
    check("post").custom(isPostIdExist),
    check("post").custom(isPostIdActive),
    fieldValidator,
  ],
  createComment
);

router.get(
  "/",
  [
    validateJWT,
    check("post", "El id del post es requerido").isMongoId(),
    check("post").custom(isPostIdExist),
    check("post").custom(isPostIdActive),
    fieldValidator,
  ],
  getAllComments
);

router.get(
  "/:id",
  [
    validateJWT,
    check("id", "El id del comentario es requerido").isMongoId(),
    check("id").custom(isCommentIdExist),
    check("id").custom(isCommentIdActive),
    fieldValidator,
  ],
  getCommentById
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "El id del comentario no es valido").isMongoId(),
    check("id").custom(isCommentIdExist),
    check("id").custom(isCommentIdActive),
    fieldValidator,
  ],
  updateComment
);
router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "El id del comentario no es valido").isMongoId(),
    check("id").custom(isCommentIdExist),
    check("id").custom(isCommentIdActive),
    fieldValidator,
  ],
  deleteComment
);

router.put(
  "/like/:id",
  [
    validateJWT,
    check("id", "El id del comentario no es valido").isMongoId(),
    check("id").custom(isCommentIdExist),
    check("id").custom(isCommentIdActive),
    fieldValidator,
  ],
  commentLiked
);
module.exports = router;
