const axios = require('axios');
const AWS = require('aws-sdk');

const fetchAWSCredentials = async (projectName) => {
    try {
        const response = await axios.get(`https://2ae2hztqtb.execute-api.af-south-1.amazonaws.com/project/getKeys/${projectName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching AWS credentials:', error);
        throw error;
    }
};

const awsConfigMiddleware = async (req, res, next) => {
    const projectName = "AWSConfig-1"; 

    try {
        const awsCredentials = await fetchAWSCredentials(projectName);

        console.log(awsCredentials)
        AWS.config.update({
            accessKeyId: awsCredentials.accessKey,
            secretAccessKey: awsCredentials.secretKey
        });
        next(); 
    } catch (error) {
        console.error('Error fetching AWS credentials:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = awsConfigMiddleware;
