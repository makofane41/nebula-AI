const express = require("express");
const app = express();
const editProfile = express.Router();
const User = require("./../../models").User;

// PUT request to update user profile
editProfile.put("/profile/:id", async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID parameter is required" });
  }

  if (!email || !firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "Email, firstName, and lastName are required fields" });
  }

  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile with the provided data (only firstName, lastName, and email)
    await User.update(
      { firstName, lastName, email },
      { where: { id: userId } }
    );

    // Fetch the updated user profile
    const updatedUser = await User.findByPk(userId, {
      attributes: ["id", "email", "firstName", "lastName", "role"],
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = editProfile;
