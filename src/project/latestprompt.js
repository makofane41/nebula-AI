const express = require('express');
const { Project, User, Prompt } = require('./../../models'); // Assuming Prompt model exists
const authorizationMiddleware = require('./../../middleware/authorizationMiddleware');

const GetLatestPrompt = express.Router();

GetLatestPrompt.get('/prompt/latest/:projectId', authorizationMiddleware(), async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findOne({ where: { id: projectId } });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const latestPrompt = await Prompt.findOne({
      where: { projectId },
      order: [['createdAt', 'DESC']],
    });

    if (!latestPrompt) {
      return res.status(404).json({ error: 'No prompts found for this project' });
    }

    res.status(200).json({ prompt: latestPrompt });
  } catch (error) {
    console.error('Error fetching latest prompt:', error);
    res.status(500).json({ error: 'Error fetching latest prompt' });
  }
});

module.exports = GetLatestPrompt;