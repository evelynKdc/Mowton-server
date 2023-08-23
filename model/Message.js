const { model, Schema } = require("mongoose");
const messageSchema = Schema({
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
  respondTo: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
});

module.exports = model("Message", messageSchema);
