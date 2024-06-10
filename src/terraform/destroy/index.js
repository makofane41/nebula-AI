const { spawn } = require("child_process");
const express = require("express");
const AWS = require("aws-sdk");
const fs = require("fs/promises"); // Use fs/promises for async file I/O
const Prompt = require('./../../../models').Prompt;

const destroyInfra = "terraform destroy -auto-approve=true";
const region = "af-south-1";

const destroy = express.Router();

destroy.post("/destroy", async (req, res) => {
  try {
    const { accessKeyId, secretAccessKey, userId, projectName, projectId} = req.body;
    const folderPath = `/home/ec2-user/${userId}/${projectName}`;

    // Efficiently update AWS credentials
    AWS.config.update({
      accessKeyId,
      secretAccessKey,
      region,
    });

    // Check for the folder's existence before destruction
    try {
      await fs.access(folderPath);
    } catch (err) {
      res.status(400).json({ message: "Folder not found" });
      return;
    }

    // Run the Terraform destroy command directly
    const exitCode = await runCommand(destroyInfra, folderPath);

    if (exitCode === 0) {
      if (projectId) {
        await updatePromptStatus(projectId);
      }
      res.status(200).json({ message: "Infrastructure destroyed successfully" });
    } else {
      res.status(500).json({ message: "Error destroying infrastructure" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error destroying infrastructure" });
  }
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
    return 0;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function updatePromptStatus(projectId) {
  try {
    const prompt = await Prompt.findOne({
      where: { projectId: projectId },
    });

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    
    prompt.action = "destroy";

    await prompt.save();
  console.log("Prompt status updated to plan");
  } catch (err) {
    console.error(`Error updating updating status${err}`);
  }
}


module.exports = destroy;
