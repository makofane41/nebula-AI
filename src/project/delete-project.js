const express = require("express");
const AWS = require("aws-sdk");
const { Project } = require("./../../models");
const authorizationMiddleware = require("./../../middleware/authorizationMiddleware");
const deleteCodeCommitRepo = require("./../awsResources/delete-code-commit");
const DeleteProject = express.Router();

DeleteProject.delete("/delete/:projectId", authorizationMiddleware(), async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.userId;

  try {
    // Check if the project exists and belongs to the authenticated user
    const projectToDelete = await Project.findOne({
      where: {
        id: projectId,
        userId: userId,
      },
    });

    if (!projectToDelete) {
      return res.status(404).json({ error: "Project not found or does not belong to the user" });
    }

    // Delete the CodeCommit repository
    const codeCommitRepoName = `${projectToDelete.projectName}-Nebula`;
    await deleteCodeCommitRepo(codeCommitRepoName);

    // Delete the project from the database
    await projectToDelete.destroy();

    // Additional cleanup (e.g., clear AWS SSM parameters)
    // ...

    console.log("Project and CodeCommit repository deleted successfully");
    res.status(200).json({ message: "Project and CodeCommit repository deleted successfully" });
  } catch (error) {
    console.error("Error deleting project and CodeCommit repository:", error);
    res.status(500).json({ error: "Error deleting project and CodeCommit repository" });
  }
});

module.exports = DeleteProject;
