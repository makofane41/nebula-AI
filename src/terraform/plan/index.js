const fs = require("fs/promises"); // Use fs/promises for async file I/O
const AWS = require("aws-sdk");
const express = require('express');
const { spawn } = require("child_process");
const retrieveFromS3 = require("./../../awsResources/s3-retrieve");
const {Prompt} = require('./../../../models');


const plan = express.Router();

async function updatePromptStatus(projectId) {
  try {
    const prompt = await Prompt.findOne({
      where: { projectId: projectId },
    });

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    //given
   // prompt.action = "plan";
    const updateAction =new Prompt({
      action:"test",
    })
     
     await updateAction.save();

     //given

  console.log("Prompt status updated to plan");
  } catch (err) {
    console.error(`Error updating updating status${err}`);
  }
}

plan.post('/plan', async (req, res) => {

  try {
    const { accessKeyId, secretAccessKey, userId, projectName, projectId } = req.body;
    const folderPath = `/home/ec2-user/${userId}/${projectName}`;
    const bucketKey = `${userId}/${projectName}`;
    const bucketName = "nebula-project-s3-store";
    // Efficiently update AWS credentials
    AWS.config.update({
      accessKeyId,
      secretAccessKey,
      region: "af-south-1",
    });

    // Asynchronously create the folder if it doesn't exist
    await fs.mkdir(folderPath, { recursive: true }); // Handle nested paths

    // Retrieve the main Terraform file
    await retrieveFromS3(bucketName, bucketKey);

    // Run Terraform commands sequentially
    await runCommand("terraform init", folderPath);
    await runCommand("terraform plan -out=tfplan", folderPath);
    await runCommand("terraform show -json tfplan > tfplan.json", folderPath);

    const jsonData = await fs.readFile(`${folderPath}/tfplan.json`);
    const result = parseJSON(jsonData);

    if (result) {
      if (projectId) {
        await updatePromptStatus(projectId);
      }
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: "No resources found" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error planning infrastructure" });
  }

  // Delete the folder after the operation


});

async function runCommand(command, folder) {
  console.log("Running " + command);
  try {
    const child = spawn(command, { shell: true, cwd: folder });
    await new Promise((resolve, reject) => {
      child.stdout.on("data", (data) => console.log(data.toString()));
      child.stderr.on("data", (data) => console.error(data.toString()));
      child.on('close', resolve);
      child.on('error', reject);
    });
  } catch (err) {  
    console.error(err);
    throw new Error(`Command failed with exit code ${code}`);
  }
  
}

function parseJSON(jsonData) {
  console.log(jsonData);
  try {
    const data = JSON.parse(jsonData);
    const resources = data.planned_values.root_module.resources;
    const result = [];
    for (const resource of resources) {
      const type = resource.type;
      const name = resource.name;
      const attributes = resource.values;
      const resultItem = {
        type,
        name,
        attributes
      };
      result.push(resultItem);
    }
    return result;
  } catch (err) {
    console.error(err);
    return;
  }
}



module.exports = plan;