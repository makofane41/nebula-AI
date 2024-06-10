const AWS = require("aws-sdk");
const fs = require('fs/promises');

const retrieveFromS3 = async (bucketName, bucketKey ) => {
  try {
    const s3 = new AWS.S3();

    const fileParams = {
      Bucket: bucketName,
      Key: `${bucketKey}/main.tf`,
    };

    // Retrieve the object from S3
    const data = await s3.getObject(fileParams).promise();

    // Store the object in the local file system
    await writeFile(data.Body, `/home/ec2-user/${bucketKey}`);

    // Return success status
    return 200;
  } catch(err) {
    throw new Error(`failed to retrieve Object from S3 : ${err}`);
  }
};

async function writeFile(data, folderPath) {
  try {
    await fs.writeFile(`${folderPath}/main.tf`, data);
  }catch(err){
    console.err(`failed to write file : ${err}`);
    return 400;
  }
};

module.exports = retrieveFromS3;