const mongoose = require("mongoose");

noteSchema = mongoose.Schema(
  {
    title: { type: String, require: true },
    content: { type: String, require: true },
    summary: { type: String, default: "" },
    quiz: { type: String, default: "" },
  },
  { timestamp: true },
);
module.exports = mongoose.model("Note", noteSchema);
