const express = require("express");
const { Project } = require("./../../models");
const authorizationMiddleware = require("./../../middleware/authorizationMiddleware");

const getAllProjects = express.Router();

getAllProjects.get("/", authorizationMiddleware(), async (req, res, next) => {
  try {
    // Fetch all projects from the database
    const projects = await Project.findAll();

    res.status(200).json(projects);
  } catch (error) {
    next(error);
    console.error("Error retrieving projects:", error);
    res.status(500).json({ message: "Error retrieving projects" });
  }
});

module.exports = getAllProjects;
