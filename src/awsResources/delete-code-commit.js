const AWS = require("aws-sdk");

async function deleteCodeCommitRepo(repositoryName) {
  try {
    const codecommit = new AWS.CodeCommit();

    // Delete the repository
    await codecommit
      .deleteRepository({
        repositoryName: repositoryName,
      })
      .promise();

    console.log(`CodeCommit repository ${repositoryName} deleted successfully`);
  } catch (error) {
    console.error("Error deleting CodeCommit repository:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

module.exports = deleteCodeCommitRepo;
