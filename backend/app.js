const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./conn/conn"); 
connectDB(); // ✅ Ensures DB connection before running queries
  // ✅ Import MongoDB connection function
const cors = require("cors");

const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB first, then start the serve

// ✅ API Routes
app.use("/api/v1", UserAPI);
app.use("/api/v2", TaskAPI);

// ✅ Catch-all route for unknown paths
app.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// ✅ Set the port (use .env if available)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
