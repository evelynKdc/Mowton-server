const { Router } = require("express");
const { fieldValidator } = require("../middleware/validator");
const { validateJWT } = require("../middleware/jwt-validator");
const {
  createPost,
  getPostByid,
  updatePost,
  deletePost,
  getAllPosts,
  likedPost,
  sharedPost,
} = require("../controller/postC");
const { check } = require("express-validator");
const { isPostIdExist, isPostIdActive } = require("../helpers/dbValidators");
const router = Router();

router.get("/", [validateJWT, fieldValidator], getAllPosts);
router.get(
  "/:id",
  [
    validateJWT,
    check("id", "El id del post no es valido").isMongoId(),
    check("id").custom(isPostIdExist),
    check("id").custom(isPostIdActive),
    fieldValidator,
  ],
  getPostByid
);

router.post("/", [validateJWT, fieldValidator], createPost);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "El id del post no es valido").isMongoId(),
    check("id").custom(isPostIdExist),
    check("id").custom(isPostIdActive),
    fieldValidator,
  ],
  updatePost
);
router.put(
  "/like/:id",
  [
    validateJWT,
    check("id", "El id del post no es valido").isMongoId(),
    check("id").custom(isPostIdExist),
    check("id").custom(isPostIdActive),
    fieldValidator,
  ],
  likedPost
);
router.put(
  "/share/:id",
  [
    validateJWT,
    check("id", "El id del post no es valido").isMongoId(),
    check("id").custom(isPostIdExist),
    check("id").custom(isPostIdActive),
    fieldValidator,
  ],
  sharedPost
);

router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "El id del post no es valido").isMongoId(),
    check("id").custom(isPostIdExist),
    check("id").custom(isPostIdActive),
    fieldValidator,
  ],
  deletePost
);

module.exports = router;
