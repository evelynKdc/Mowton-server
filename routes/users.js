const {Router} = require("express");
const {check} = require("express-validator");

const { getUsers, createUsers } = require("../controller/usersC");
const { fieldValidator } = require("../middlewares/validator");
const { duplicatedEmailValidator } = require("../helpers/dbValidators");
const router = Router();

router.get("/", getUsers);
router.post("/", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Is an invalid email").isEmail(),
    check("email").custom(duplicatedEmailValidator),
    check("password", "Password is required").not().isEmpty(),
    fieldValidator
] ,createUsers);
module.exports=router;