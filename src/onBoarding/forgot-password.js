const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const { Router } = require('express');
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

const forgotPassword = express.Router();

app.use(bodyParser.json());

AWS.config.update({
  region: 'af-south-1'
});

forgotPassword.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const params = {
      ClientId: process.env.CLIENT_ID,
      Username: email
    };

    await cognitoIdentityServiceProvider.forgotPassword(params).promise();
    res.status(200).json({ message: 'Password reset instructions have been sent to your email address' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(400).json({ message: error.message });
  }
});

forgotPassword.post('/reset-password', async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    const params = {
      ClientId: process.env.CLIENT_ID,
      Username: email,
      ConfirmationCode: verificationCode,
      Password: newPassword
    };

    await cognitoIdentityServiceProvider.confirmForgotPassword(params).promise();
    res.status(200).json({ message: 'Password has been successfully reset' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = forgotPassword;