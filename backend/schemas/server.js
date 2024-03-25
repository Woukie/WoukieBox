const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Server = new Schema({
  name: { type: String, require: true },
  channel_ids: [{ type: Schema.Types.ObjectId }],
  owner_id: { type: Schema.Types.ObjectId, require: true },
  user_ids: [{ type: Schema.Types.ObjectId }],
});

module.exports = mongoose.model("Server", Server);
