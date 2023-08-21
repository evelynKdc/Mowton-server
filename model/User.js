const { Schema, model } = require("mongoose");

const userSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  email: {
    type: String,
    required: [true, "El correo es requerido"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  img: {
    type: String,
  },
  estatus: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.toJSON = function () {
  const { __v, password,_id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};



module.exports = model("User", userSchema);
