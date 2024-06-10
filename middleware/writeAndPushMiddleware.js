const fs = require('fs');
const { execSync } = require('child_process');
const AWS = require('aws-sdk');

const writeToTerraformFile = (data) => {
    const filePath = 'main.tf';

    try {
        fs.writeFileSync(filePath, data);
        console.log(`Data written to ${filePath}`);
    } catch (error) {
        console.error(`Error writing to ${filePath}: ${error.message}`);
    }
};

const uploadToS3 = async (filePath, bucketName, key) => {
    try {
        const s3 = new AWS.S3();
        const fileContent = fs.readFileSync(filePath);

        const params = {
            Bucket: bucketName,
            Key: key,
            Body: fileContent
        };

        await s3.upload(params).promise();
        console.log(`File uploaded to S3 bucket ${bucketName} with key ${key}`);
    } catch (error) {
        console.error(`Error uploading file to S3: ${error.message}`);
    }
};

const writeAndUploadMiddleware = (s3BucketName, s3Key) => async (req, res, next) => {
    const responseData = res.locals.completion;

    writeToTerraformFile(responseData);
    await uploadToS3('main.tf', s3BucketName, s3Key);

    next();
};

module.exports = { writeToTerraformFile, uploadToS3, writeAndUploadMiddleware };
