const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  tasks:[{
    type: mongoose.Schema.Types.ObjectId,  
    ref: "task",  // Ensure "Task" matches the model name in task.js
  }]
});

module.exports = mongoose.model("user", userSchema);
