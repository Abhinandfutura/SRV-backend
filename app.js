const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./src/Routes/userRoutes");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.listen("8000", () => {
  console.log("Server is Running port 8000");
});
mongoose.connect("mongodb://localhost:27017/SRC-task", (err) => {
  if (err) {
    console.log("Data Base is not Connected");
  }
  console.log("Data Base Connected Successfully");
});
