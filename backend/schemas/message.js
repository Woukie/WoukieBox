const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Message = new Schema({
  parent_id: { type: Schema.Types.ObjectId },
  sender_id: { type: Schema.Types.ObjectId, require: true },
  channel_id: { type: Schema.Types.ObjectId, require: true },
  sent_at: { type: Date, default: () => Date.now(), require: true },
  content: { type: String, require: true },
});

module.exports = mongoose.model("Message", Message);
