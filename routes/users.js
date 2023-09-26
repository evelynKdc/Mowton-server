const { Router } = require("express");
const { check } = require("express-validator");

const {
  getUsers,
  createUsers,
  userDelete,
  updateProfileImg,
  updateCoverImg,
  updateAboutUser,
  updatePassword,
  updateFollow,
  updateFriend,
  getUserById,
  searchUser,
} = require("../controller/usersC");
const { fieldValidator } = require("../middleware/validator");
const {
  duplicatedEmailValidator,
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
  updateFriend
);


router.get("/search/:object", searchUser);
module.exports = router;
