const { Router } = require("express");
const { check } = require("express-validator");

const {
  getUsers,
  userDelete,
  updateProfileImg,
  updateCoverImg,
  updateAboutUser,
  updatePassword,
  updateFollow,
  getUserById,
  searchUser,
  addToPendingFriend,
  confirmFriend,
} = require("../controller/usersC");
const { fieldValidator } = require("../middleware/validator");
const {
  isUserIdExist,
  isUserIdActive,
} = require("../helpers/dbValidators");
const { validateJWT } = require("../middleware/jwt-validator");
const router = Router();

router.get("/", [validateJWT, fieldValidator], getUsers);
router.get(
  "/:id",
  [
    validateJWT,
    check("id", "is no a mongo db valid").isMongoId(),
    check("id").custom(isUserIdExist),
    fieldValidator,
  ],
  getUserById
);
router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "is no a mongo db valid").isMongoId(),
    check("id").custom(isUserIdExist),
    fieldValidator,
  ],
  userDelete
);

router.put(
  "/profile/:id",
  [
    validateJWT,
    check("id", "is no a mongo db valid").isMongoId(),
    check("id").custom(isUserIdExist),
    fieldValidator,
  ],
  updateProfileImg
);

router.put(
  "/cover/:id",
  [
    validateJWT,
    check("id", "is no a mongo db valid").isMongoId(),
    check("id").custom(isUserIdExist),
    fieldValidator,
  ],
  updateCoverImg
);

router.put(
  "/about/:id",
  [
    validateJWT,
    check("id", "is no a mongo db valid").isMongoId(),
    check("id").custom(isUserIdExist),
    fieldValidator,
  ],
  updateAboutUser
);

router.put(
  "/password/:id",
  [
    validateJWT,
    check("id", "is no a mongo db valid").isMongoId(),
    check("id").custom(isUserIdExist),
    check("password").not().isEmpty(),
    fieldValidator,
  ],
  updatePassword
);

router.put(
  "/follow/:id",
  [
    validateJWT,
    check("id", "is no a mongo db valid").isMongoId(),
    check("id").custom(isUserIdExist),
    check("id").custom(isUserIdActive),
    fieldValidator,
  ],
  updateFollow
);

router.put(
  "/friend/:id",
  [
    validateJWT,
    check("id", "is no a mongo db valid").isMongoId(),
    check("id").custom(isUserIdExist),
    check("id").custom(isUserIdActive),
    fieldValidator,
  ],
  addToPendingFriend
);

router.put(
  "/confirmFriend/:id",
  [
    validateJWT,
    check("id", "is no a mongo db valid").isMongoId(),
    check("id").custom(isUserIdExist),
    check("id").custom(isUserIdActive),
    check("confirm", "la cofirmacion o rechazo es requerido").isBoolean(),
    fieldValidator,
  ],
  confirmFriend
);


router.get("/search/:object", searchUser);
module.exports = router;
