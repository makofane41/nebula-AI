const express = require("express");
const AWS = require("aws-sdk");
const { Project, User } = require("./../../models");
const authorizationMiddleware = require("./../../middleware/authorizationMiddleware");
const createFolderInS3Bucket = require("./../awsResources/createS3Bucket");

const CreateProject = express.Router();

CreateProject.post("/create/", authorizationMiddleware(), async (req, res) => {
  const { projectNameInput, accessKey, secretKey , region,description} = req.body;

  if (!projectNameInput || !accessKey || !secretKey) {
    return res.status(400).json({ error: "Missing required project details" });
  }

  const userId = req.userId;

  const projectName = projectNameInput;

  const existingProject = await Project.findOne({
    where: {
      projectName: projectName,
    },
  });

  if (existingProject) {
    return res
      .status(400)
      .json({ error: "Project with the same name already exists" });
  }

  try {
    const ssm = new AWS.SSM();

    const secretKeyName = `/nebula/project/${userId}/${projectName}/secretKey`;
    const accessKeyName = `/nebula/project/${userId}/${projectName}/accessKey`;

    await ssm
      .putParameter({
        Name: accessKeyName,
        Value: accessKey,
        Type: "SecureString",
        Overwrite: true,
      })
      .promise();

    await ssm
      .putParameter({
        Name: secretKeyName,
        Value: secretKey,
        Type: "SecureString",
        Overwrite: true,
      })
      .promise();


    // Create CodeCommit repository
    const s3Bucket = `nebula-project-s3-store/${userId}/${projectName}`;
    await createFolderInS3Bucket(userId,projectName);
    

    const newProject = new Project({
      projectName,
      accessKey: accessKeyName,
      secretKey: secretKeyName,
      region: region,
      description:description,
      s3Bucket:s3Bucket,
      userId: userId,
    });

    await newProject.save();
   

    console.log("Project created successfully");
    res
      .status(200)
      .json({
        message:
          "Project information and CodeCommit repository Created successfully", newProject
      });
  } catch (error) {
    console.error("Error Creating project information:", error);
    res.status(500).json({ error: "Error Creating project information" });
  }
});

module.exports = CreateProject;
