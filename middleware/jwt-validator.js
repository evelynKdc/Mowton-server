const jwt = require("jsonwebtoken");
const User = require("../model/User");

const validateJWT = async (req, res, next) => {
  //cathing thr token from the headers
  const token = req.header("token");

  //verifying if token exists
  if (!token) {
    return res.status(401).json({
      mssg: "Token is required",
    });
  }

  //verifying if the token is valid
  try {
    const { uid } = jwt.verify(token, process.env.SECRETKEYJWT);
    

    const user = await User.findById(uid);

    //verifying if user exists
    if (!user) {
        return res.status(401).json({
            mssg: "User was not found in database",
          });
    }

    //verifying if that user is active in db
    if (!user.estatus) {
        return res.status(401).json({
            mssg: "User is not active in db",
          });
    }

    req.user = user;
    console.log(req.user);
  } catch (error) {
    console.log(error);
    console.log(token);
    return res.status(401).json({
      mssg: "Token is invalid",
    });
  }

  next();
};

module.exports = {
  validateJWT,
};
