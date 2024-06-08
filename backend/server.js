const dotenv = require("dotenv").config();
const express = require("express");
const cors =require("cors");

const connectDb = require("./config/dbConnection");
const toDoRoutes = require("./routes/toDoRoutes");
const userRoutes = require("./routes/userRoutes")

const app = express();
const port = process.env.PORT || 3000;

connectDb();

// middlewares
app.use(express.json());
app.use(cors());
app.use("/api",userRoutes)
app.use("/api", toDoRoutes);




module.exports = app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
