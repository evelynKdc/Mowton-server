const { model, Schema } = require("mongoose");
const commentModel = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: Array,
    default: [],
    required: true,
  },
});

module.exports = model("Comment", commentModel);
