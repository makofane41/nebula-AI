// const AWS = require('aws-sdk');

// const createS3Bucket = async (bucketName) => {
//   const s3 = new AWS.S3();

//   try {
//     await s3.createBucket({
//       Bucket: bucketName,
//     }).promise();

//     console.log(`S3 bucket "${bucketName}" created successfully`);
//     return bucketName;
//   } catch (error) {
//     console.error('Error creating S3 bucket:', error);
//     throw error;
//   }
// };

// module.exports = createS3Bucket;


const AWS = require('aws-sdk');

const createFolderInS3Bucket = async ( userId, projectName) => {
  const s3 = new AWS.S3();
  const bucketName = "nebula-project-s3-store";
  
  const folderKey = `${userId}/${projectName}/`;

  try {
    await s3.putObject({
      Bucket: bucketName,
      Key: folderKey, // Note: No content for the folder itself, just the key ending with "/"
      Body: '',
    }).promise();

    console.log(`Folder "${folderKey}" created successfully in bucket "${bucketName}"`);
    return folderKey;
  } catch (error) {
    console.error(`Error creating folder "${folderKey}" in S3 bucket:`, error);
    throw error;
  }
};

module.exports = createFolderInS3Bucket;
