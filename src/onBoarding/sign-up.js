const express = require("express");
const AWS = require("aws-sdk");
const signUp = express.Router();
const User = require("./../../models").User;

AWS.config.update({ region: "af-south-1" });
const cognito = new AWS.CognitoIdentityServiceProvider();

require("dotenv").config();

const userPoolId = process.env.USER_POOL_ID;
const clientId = process.env.CLIENT_ID;
const defaultRole = "user";

signUp.post("/signup", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    const user = await User.create({
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: defaultRole,
    });

    const params = {
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "custom:role", Value: defaultRole },
      ],
    };

    cognito.signUp(params, (err, data) => {
      if (err) {
        user.destroy();
        return res.status(500).send(err);
      }
      res.status(200).json({
        message: "User signed up successfully",
        user: {
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send(error);
  }
});

signUp.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const params = {
    ClientId: clientId,
    Username: email,
    ConfirmationCode: otp,
  };

  cognito.confirmSignUp(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.status(200).send("OTP verified successfully");
  });
});

module.exports = signUp;
