const express = require('express');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');
const authorizationMiddleware = require('./../../middleware/authorizationMiddleware');
const { Project } = require('./../../models');

const GetProjectKeys = express.Router();

const base64Decode = (encodedString) => {
  try {
    const buff = Buffer.from(encodedString, 'base64');
    return buff.toString('utf-8');
  } catch (error) {
    console.error('Error decoding base64:', error);
    throw error;
  }
};

GetProjectKeys.get('/getKeys/:projectName', async (req, res) => {
  const { projectName } = req.params;

  if (!projectName) {
    return res.status(400).json({ error: 'Missing project name' });
  }

  
   
  const existingProject = await Project.findOne({
    where: {
      projectName:projectName ,
    },
  });
  
  const userId = existingProject.userId;

 
  try {
    const existingProject = await Project.findOne({
      where: {
        projectName: projectName,
      },
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Set the AWS region to 'af-south-1'
    const region = 'af-south-1';
    const ssmClient = new SSMClient({ region });

    const accessKeyParam = await ssmClient.send(new GetParameterCommand({
      Name: `/nebula/project/${userId}/${projectName}/accessKey`,
      WithDecryption: true, // Ensure decryption for Binary values
    }));

    const secretKeyParam = await ssmClient.send(new GetParameterCommand({
      Name: `/nebula/project/${userId}/${projectName}/secretKey`,
      WithDecryption: true, // Ensure decryption for Binary values
    }));

    console.log('accessKeyParam:', accessKeyParam);
    console.log('secretKeyParam:', secretKeyParam);

    console.log('Encoded accessKey:', accessKeyParam.Parameter.Value);

    const accessKey = accessKeyParam.Parameter.Value;
    const secretKey = secretKeyParam.Parameter.Value;

    console.log('Access Key (Binary):', accessKey);
    console.log('Secret Key (Binary):', secretKey);

    // Include the project details in the response
    const response = {
      projectId: existingProject.id,
      projectName: existingProject.projectName,
      accessKey,
      secretKey,
      codeCommitUrl: existingProject.codeCommitUrl,
      userId: existingProject.userId,
      region,
      description: existingProject.description,
      updatedAt: existingProject.updatedAt,
      createdAt: existingProject.createdAt,
    };

    res.status(200).json(response);

  } catch (error) {
    if (error.name === 'ParameterNotFound') {
      return res.status(404).json({ error: 'Project keys not found' });
    }

    console.error('Error retrieving project keys:', error);
    res.status(500).json({ error: 'Error retrieving project keys' });
  }
});

module.exports = GetProjectKeys;
