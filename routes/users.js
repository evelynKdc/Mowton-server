const {Router} = require("express");
const {check} = require("express-validator");

const { getUsers, createUsers, userUpdate, userDelete } = require("../controller/usersC");
const { fieldValidator } = require("../middleware/validator");
const { duplicatedEmailValidator, isUserIdExist } = require("../helpers/dbValidators");
const { validateJWT } = require("../middleware/jwt-validator");
const router = Router();

router.get("/", getUsers);
router.post("/", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Is an invalid email").isEmail(),
    check("email").custom(duplicatedEmailValidator),
    check("password", "Password is required").not().isEmpty(),
    fieldValidator
] ,createUsers);
router.put("/:id", [
    validateJWT,
    check("id", "is no a mongo db valid").isMongoId(),
    check("id").custom(isUserIdExist),
    fieldValidator
] ,userUpdate);

router.delete(":id", [
    validateJWT,
    check("id", "is no a mongo db valid").isMongoId(),
    check("id").custom(isUserIdExist),
    fieldValidator
] ,userDelete)
module.exports=router;