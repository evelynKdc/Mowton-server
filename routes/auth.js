const {Router} = require("express");
const { registerAuth, loginAuth, googleAuth } = require("../controller/authC");
const { check } = require("express-validator");
const { fieldValidator } = require("../middleware/validator");
const { duplicatedEmailValidator } = require("../helpers/dbValidators");
const router = Router();

router.post("/register", [
    check("name", "Is not valid").isLength({min: 2}),
    check("lastName", "Is not valid").isLength({min: 2}),
    check("password", "Is not valid").isLength({min: 6}),
    check("email", "Is not a valid email").isEmail(),
    check("email").custom(duplicatedEmailValidator),
    fieldValidator
] ,registerAuth);
router.post("/login", [
    check("email", "email is required").isEmail(),
    check("password", "password is required").not().isEmpty(),
    fieldValidator
] ,loginAuth);
router.post("/google", googleAuth);
module.exports = router;