const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  verifyToken,
  logout,
  userslist,
  deleteUser,
  getuser,
  updateuser,
  changeprofile,
} = require("../Controller/userController");
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", verifyToken, logout);
router.get("/getallusers", userslist);
router.delete("/delete/:id", deleteUser);
router.get("/get-user/:id", getuser);
router.put("/update-user", updateuser);
router.get("/change-profile/:id", changeprofile);

module.exports = router;
