const express = require('express');
const AWS = require('aws-sdk');
const { Project } = require('../../models');
const authorizationMiddleware = require('../../middleware/authorizationMiddleware');

const UpdateProject = express.Router();

UpdateProject.put('/update/:projectId', authorizationMiddleware(), async (req, res) => {
  const projectId = req.params.projectId;
  const { accessKey, secretKey, description } = req.body;

  if (!accessKey && !secretKey && !description) {
    return res.status(400).json({ error: 'Missing fields to update' });
  }

  const userId = req.userId;

  try {
    const project = await Project.findOne({
      where: {
        id: projectId,
        userId: userId,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (accessKey) {
      const accessKeyName = `/nebula/project/${userId}/${project.projectName}/accessKey`;
      await updateSSMParameter(accessKeyName, accessKey);
      project.accessKey = accessKeyName;
    }

    if (secretKey) {
      const secretKeyName = `/nebula/project/${userId}/${project.projectName}/secretKey`;
      await updateSSMParameter(secretKeyName, secretKey);
      project.secretKey = secretKeyName;
    }

    if (description) {
      project.description = description;
    }

    await project.save();

    console.log('Project updated successfully');
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Error updating project' });
  }
});

async function updateSSMParameter(parameterName, value) {
  const ssm = new AWS.SSM();
  await ssm.putParameter({
    Name: parameterName,
    Value: value,
    Type: 'SecureString',
    Overwrite: true,
  }).promise();
}

module.exports = UpdateProject;
