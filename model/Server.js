const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { connexion } = require("../db/config");
const userRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const postRouter = require("../routes/posts");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.path = {
      users: "/api/users",
      auth: "/api/auth",
      post: "/api/posts",
    };
    this.connectDb();
    this.middlewares();
    this.routes();
  }

  async connectDb() {
    await connexion();
  }

  middlewares() {
    /*::::::::Using cors::::::::*/
    this.app.use(cors());

    /*::::::::Reading and writing from body:::::::*/
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    /*::::::::Uploading files:::::::*/
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }
  routes() {
    this.app.use(this.path.users, userRouter);
    this.app.use(this.path.auth, authRouter);
    this.app.use(this.path.post, postRouter);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Escuchando en el puerto ", this.port);
    });
  }
}

module.exports = Server;
