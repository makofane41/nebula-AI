const express = require("express");
const { Project } = require("./../../models");
const authorizationMiddleware = require("./../../middleware/authorizationMiddleware");

const getAllProjectsByUserId = express.Router();

getAllProjectsByUserId.get(
  "/user/:userId",
  authorizationMiddleware(),
  async (req, res, next) => {
    try {
      const userId = req.params.userId;

      // Ensure userId is provided
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Assuming there's a relationship between users and projects (e.g., through a foreign key)
      const projects = await Project.findAll({
        where: { userId: userId },
      });

      if (!projects || projects.length === 0) {
        return res
          .status(404)
          .json({ message: "No projects found for the user" });
      }

      // If there are additional properties to fetch or modify, you can do it here

      res.status(200).json(projects);
    } catch (error) {
      console.error("Error retrieving projects:", error);

      // Log the stack trace for more detailed error information
      console.error(error.stack);

      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = getAllProjectsByUserId;