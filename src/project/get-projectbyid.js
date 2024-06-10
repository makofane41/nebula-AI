const express = require("express");
const { Project } = require("./../../models");
const authorizationMiddleware = require("./../../middleware/authorizationMiddleware");

const getProjectId = express.Router();

getProjectId.get("/:id", authorizationMiddleware(), async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // If there are additional properties to fetch or modify, you can do it here

    res.status(200).json(project);
  } catch (error) {
    next(error);
    console.error("Error retrieving project:", error);
    res.status(500).json({ message: "Error retrieving project" });
  }
});

module.exports = getProjectId;
