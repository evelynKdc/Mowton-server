const { model, Schema } = require("mongoose");
const chatSchema = Schema({
  integrants: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = model("Chat", chatSchema);
