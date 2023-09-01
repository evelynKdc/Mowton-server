const jwt = require("jsonwebtoken");

const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    //const payload = uid;
    jwt.sign(
      {uid},
      process.env.SECRETKEYJWT,
      {
        expiresIn: '2 days'
      },
      (err, token) => {
        if (err) {
          console.log(err);
          console.log(uid);
          reject("It can´t generate the token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
