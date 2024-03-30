const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Channel = new Schema({
  name: { type: String, require: true },
  voice: { type: Boolean, default: false, require: true },
  last_message_id: { type: Schema.Types.ObjectId },
});

module.exports = mongoose.model("Channel", Channel);
