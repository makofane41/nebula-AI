const AWS = require("aws-sdk");
const fs = require("fs");

const retrieveMainTF = async (repositoryName, repoFilePath, folderPath) => {    
    try {
        fetchFileFromCodeCommit(repositoryName, repoFilePath, folderPath);
        return 200;
    } catch (err) {
        console.error(err);
        return 400;
    }
};

async function fetchFileFromCodeCommit(repositoryName, repoFilePath, filePath) {
    const codeCommit = new AWS.CodeCommit();

    const params = {
        repositoryName: repositoryName,
        filePath: repoFilePath,
    };

    try {
        const data = await codeCommit.getFile(params).promise();
        fs.writeFileSync(`${filePath}/main.tf`, data.fileContent, "utf-8");
        console.log("File fetched successfully");
        return 200;
    } catch (err) {
        console.error(err);
        return 400;
    }
};

module.exports = retrieveMainTF;
