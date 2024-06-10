const express = require('express');
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const prompting =  express.Router();
const authorizationMiddleware = require('./../../middleware/authorizationMiddleware');
const { Prompt, Project } = require('./../../models');
const { writeToTerraformFile, uploadToS3, writeAndUploadMiddleware } = require('./../../middleware/writeAndPushMiddleware');

const invokeJurassic2 = async (prompt) => {
    const client = new BedrockRuntimeClient({ region: 'us-east-1' });

    const modelId = 'ai21.j2-ultra-v1';

    const payload = {
        prompt,
        maxTokens: 500,
        temperature: 0.5,
    };

    const command = new InvokeModelCommand({
        body: JSON.stringify(payload),
        contentType: 'application/json',
        accept: 'application/json',
        modelId,
    });

    try {
        const response = await client.send(command);
        const decodedResponseBody = new TextDecoder().decode(response.body);

        const responseBody = JSON.parse(decodedResponseBody);

        return responseBody.completions[0].data.text;
    } catch (err) {
        console.error(err);
    }
};

prompting.post('/prompt', authorizationMiddleware(), async (req, res) => {
    const { prompt, projectId } = req.body;

    const projectInfo = await Project.findOne({
        where: {
          id: projectId,
        },
    });

    const s3BucketName = projectInfo.s3Bucket;
    const s3Key = 'main.tf'; // Key for the uploaded file in S3
    
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
 //work s
    try {
        const completion = await invokeJurassic2(prompt);

        if (completion) {
            const feedback = await invokeJurassic2("Create a summary of this in less than 100 words: " + completion);
            const recordPrompt = new Prompt({
                prompt: prompt,
                feedback: feedback,
                projectId: projectId,
            });

            await recordPrompt.save();
            writeToTerraformFile(completion); // Write completion to a file

            // Upload completion file to S3
            await uploadToS3('main.tf', s3BucketName, s3Key);

            res.status(200).json({ feedback });
            console.log(completion);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = prompting;
