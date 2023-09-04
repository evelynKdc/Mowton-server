const { Schema, model } = require("mongoose");

const postSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
  },
  likes: {
    type: Array,
    default: [],
    required: true,
  },
  comments: {
    type: Array,
    default: [],
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  shares: {
    type: Array,
    default: [],
    required: true,
  },
  img: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
});

module.exports = model("Post", postSchema);

// const { Schema, model } = require("mongoose");

// const categorieSchema = Schema({
//   name: {
//     type: String,
//     required: [true, "Name is required"],
//     unique: true
//   },
//   estatus: {
//     type: Boolean,
//     default: true,
//     required: true
//   },
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   }
// });

// categorieSchema.methods.toJSON = function () {
//   const { __v, estatus,  ...categorie} = this.toObject();
//   return categorie
// }
// module.exports = model("Categorie", categorieSchema);
