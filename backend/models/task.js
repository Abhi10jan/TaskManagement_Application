const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  des: {
    type: String,
    required: true,
    unique: true,
  },
  important: {
    type: Boolean,
    default :false,
  },
  complete: {
    type: Boolean,
    default :false,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

module.exports = mongoose.model("task", taskSchema);
