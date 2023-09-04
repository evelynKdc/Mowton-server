const { Router } = require("express");
const { fieldValidator } = require("../middleware/validator");
const { validateJWT } = require("../middleware/jwt-validator");
const { createPost, getPostByid, updatePost, deletePost, getAllPosts } = require("../controller/postC");
const { check } = require("express-validator");
const router = Router();


router.post("/", [validateJWT, fieldValidator] , createPost);

router.get("/:id", [validateJWT, check("id", "El id del post no es valido").isMongoId() ,fieldValidator] ,getPostByid)

router.put("/:id", [validateJWT,check("id", "El id del post no es valido").isMongoId(), fieldValidator] ,updatePost)

router.get("/", [validateJWT,fieldValidator], getAllPosts)

router.delete("/:id", [validateJWT,check("id", "El id del post no es valido").isMongoId(),fieldValidator], deletePost)

module.exports = router;
