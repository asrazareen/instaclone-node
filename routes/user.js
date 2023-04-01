const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../model/user");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Secret = "INSTACLONEAPP";

const router = express.Router();
mongoose.set("strictQuery", true);
router.use(cors());
router.use(fileUpload());
router.use(express.json());

router.post(
  "/register",
  body("email").isEmail(),
  body("name").isAlphanumeric().isLength({ min: 4 }),
  body("password").isLength({ min: 6}),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = errors.array()[0];
        if (error.param == "email") {
          return res.status(400).json({
            message: "Invalid Email",
          });
        } else if (error.param == "name") {
          return res.status(400).json({
            message: "Invalid Name",
          });
        } else {
          return res.status(400).json({
            message: "Invalid Password",
          });
        }
      }

      const { name, email, password, city } = req.body;

      const useremail = await User.findOne({ email });
      if (useremail) {
        return res.status(409).json({
          status: "Failed",
          message: "User already exists",
        });
      }

      const username = await User.findOne({ name });
      if (username) {
        return res.status(409).json({
          status: "Failed",
          message: "Username already exists, please use another name",
        });
      }

      bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
          return res.status(500).json({
            status: "Failed",
            message: err.message,
          });
        }
         await User.create({
          name,
          city,
          email,
          password: hash,
        });
        return res.status(200).json({
          status: "Success",
          message: "User registered successfully",
          
          
        });
      });
    } catch (e) {
      return res.status(500).json({
        status: "Failed",
        message: "Registration unsuccessful",
      });
    }
  }
);

router.post("/login", body("email").isEmail(), async (req, res) => {
  try {
    console.log
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Invalid Email",
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "Failed",
        message: "User not registered, please register",
      });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({
          status: "Failed",
          message: err.message,
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: user._id,
          },
          Secret
        );

        return res.status(200).json({
          status: "Succces",
          message: "Login successfully",
          token,
        });
      } else {
        return res.status(400).json({
          status: "Failed",
          message: "Wrong Password",
        });
      }
    });
  } catch (e) {
    return res.status(500).json({
      status: "Failed",
      message: "e.message",
    });
  }
});
module.exports = router;
