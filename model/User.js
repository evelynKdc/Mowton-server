const { Schema, model } = require("mongoose");

const userSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    min:2
  },
  lastName: {
    type: String,
    required: [true, "El apellido es requerido"],
    min: 4,
  },
  username: {
    type: String,
    min:4,
    max:10
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
  cover: {
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
  description: {
    type: String,
  },
  occupation: String,
  location: String,
  twitter: String,
  linkedin: String,
  github: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  friends: {
    type: Array,
    default: [],
  },
  pendingAccept: {
    type: Array,
    default: [],
  },
  pendingFriend:{
    type: Array,
    default: [],
  },
  followers: {
    type: Array,
    default: [],
  },
});

userSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", userSchema);
