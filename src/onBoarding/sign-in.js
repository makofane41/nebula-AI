const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const signIn = express.Router();
const config = require('./../../env-local');

const AWS = require('aws-sdk');
const { Router } = require('express');
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
const User = require('./../../models').User;

require('dotenv').config();


AWS.config.update({
  region: 'af-south-1'
});

signIn.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
  

  try {

    //not neccessary to check if user exist, cognito has capabilities to return relevent error!
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'firstName', 'lastName','role'],
    });

    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const response = await cognitoIdentityServiceProvider.initiateAuth(params).promise();

    const tokenPayload = { email,firstName:user.firstName , lastName:user.lastName,role: user.role, user: user.toJSON() };
    const token = jwt.sign(tokenPayload, config.JWT_SECRET, { expiresIn: '1d' });


    res.status(200).json({ user, token });
  } catch (error) {

    if (error.code === 'NotAuthorizedException') {
         return res.status(401).json({ message: 'In-correct password entered' });
    }

    console.error('Wrong Credentials:', error);
    res.status(400).json({ message: error });
  }
});

module.exports = signIn;
