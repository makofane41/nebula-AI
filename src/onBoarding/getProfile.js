const express = require("express");
const app = express();
const getProfile = express.Router();
const User = require("./../../models").User;

getProfile.get("/profile/:id", async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID parameter is required" });
  }

  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "firstName", "lastName", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = getProfile;
