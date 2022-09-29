const User = require("../modal/userSchema");
const argon2 = require("argon2");

const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "MyKey";
var passwordValidator = require("password-validator");
const { updateOne } = require("../modal/userSchema");

var schema = new passwordValidator();
schema.is().min(8).is().max(20);
// =============SIGNUP=================================
const signup = async (req, res, next) => {
  console.log("oooooooo", req.body.data);
  const { name, email, password, mobile, housename } = req.body.data;

  const ValidatePwd = schema.validate(password);
  if (ValidatePwd) {
    try {
      const emailExist = await User.findOne({ email: email });
      if (emailExist) {
        return res.json({ message: "Email already exist", isError: true });
      }

      const hash = await argon2.hash(password, {
        type: argon2.argon2d,
        memoryCost: 2 ** 16,
        hashLength: 40,
      });

      const user = new User({
        name: name,
        email: email,
        housename: housename,
        mobile: mobile,
        password: hash,
        accessToken: "",
      });

      const data = await user.save();
      console.log("==========", data);
      res.json({ message: "user Registration Succesfull ", isError: false });
    } catch (err) {
      res.status(401).json({ message: err, isError: true });
    }
  } else {
    res.json({
      message: "password should have min:8 charectors max:20 charectors",
      isError: true,
    });
  }
};

// =================SIGNIN================================
const signin = async (req, res, next) => {
  const { email, password } = req.body;

  const ValidatePwd = schema.validate(password);
  if (ValidatePwd) {
    try {
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        return (
          res
            //   .status(400)
            .json({ message: "User not found.Please signup...", isError: true })
        );
      }
      const verify = await argon2.verify(existingUser.password, password);

      if (!verify) {
        res.json({
          message: "password does not match",
          accessToken: null,
          isError: true,
        });
      } else {
        //token generate......
        const userToken = jwt.sign(
          { email: existingUser.email },
          JWT_SECRET_KEY,
          {
            expiresIn: "24hr",
          }
        );

        res

          // .status(200)
          .json({
            message: "Successfully Logged In",
            _id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            mobile: existingUser.mobile,
            housename: existingUser.housename,
            accessToken: userToken,
            isError: false,
          });

        const setToken = await User.updateOne(
          { email: email },
          {
            $set: {
              accessToken: userToken,
            },
          }
        );
      }
    } catch (err) {
      res.status(400).json({ message: err, isError: true });
    }
  } else {
    res.json({
      message: "password should have min:8 charectors max:20 charectors",
      isError: true,
    });
  }
};

const verifyToken = (req, res, next) => {
  const jwttoken = req.headers["authorization"];

  token = jwttoken.split(" ")[1];

  if (!token) {
    res.status(404).json({ message: "No token found" });
  }
  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      res.status(400).json({ message: "invalid Token" });
    }

    req.user = user.email;
  });
  next();
};
const logout = async (req, res, nex) => {
  userEmail = req.user;
  let user;
  try {
    user = await User.findOne({ email: userEmail });
    console.log("ppppppppppp", user);
    if (!user) {
      return res.status(404).json({ message: "User not found", isError: true });
    } else {
      console.log("======================", user);
    }
  } catch (err) {
    return res, json({ message: err, isError: true });
  }

  await User.updateOne(
    { email: userEmail },
    {
      $set: {
        accessToken: "",
      },
    }
  );
  return res
    .status(200)
    .json({ message: "Logout Successfull", isError: false });
};

// ====================get users=======================

const userslist = async (req, res, next) => {
  const items = await User.find();

  res.json(items);
};

//=====================delete user=================

const deleteUser = async (req, res, next) => {
  const remove = await User.deleteOne({ _id: req.params.id });
  if (remove) {
    console.log("ppppppppppp", remove);
    res.json({ message: "delete Successfull", isError: false });
  } else {
    res.json({
      message: "Some thing went wrong .please try again...",
      isError: true,
    });
  }
};
//===========get single user=============

const getuser = async (req, res, next) => {
  const singleUser = await User.findOne({ _id: req.params.id });
  if (singleUser) {
    res.json({ isError: false, message: "success", singleUser: singleUser });
  }
};

//=========update user profile=========

const updateuser = async (req, res, next) => {
  const { email, name, mobile, housename } = req.body.data;
  console.log(req.body);
  const updateduser = await User.updateOne(
    { _id: req.body.id },
    { $set: { email: email, name: name, mobile: mobile, housename: housename } }
  );
  if (updateduser) {
    console.log("============", updateduser);
    res.json({
      message: "Profile Update successfully",
      isError: false,
      user: updateduser,
    });
  } else {
    res.json({ message: "some thing went wrong", isError: true });
  }
};

//===========get updated user========

const changeprofile = async (req, res, next) => {
  const singleUser = await User.findOne({ _id: req.params.id });
  if (singleUser) {
    res.json({ isError: false, message: "success", user: singleUser });
  }
};

exports.signup = signup;
exports.signin = signin;
exports.verifyToken = verifyToken;
exports.logout = logout;
exports.userslist = userslist;
exports.deleteUser = deleteUser;
exports.getuser = getuser;
exports.updateuser = updateuser;
exports.changeprofile = changeprofile;
