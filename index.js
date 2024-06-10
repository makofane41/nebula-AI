const serverless = require("serverless-http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

//settings
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.get("/home", (req, res, next) => {
  return res.status(200).json({
    message: "Welcome to Nebula",
  });
});

const signUp = require("./src/onBoarding/sign-up");
const signIn = require("./src/onBoarding/sign-in");
const forgotPassword = require("./src/onBoarding/forgot-password");
const CreateProject = require("./src/project/create-project");
const UpdateProject = require("./src/project/update-project");
const plan = require("./src/terraform/plan");
const apply = require("./src/terraform/apply");
const destroy = require("./src/terraform/destroy");
const getProjectId = require("./src/project/get-projectbyid");
const getAllProjects = require("./src/project/get-allproject");
const getAllProjectsByUserId = require("./src/project/get-projectbyuserid");
const deleteProject = require("./src/project/delete-project");
const getProfile = require("./src/onBoarding/getProfile");
const GetProjectKeys = require("./src/project/get-keys")
const editProfile = require("./src/onBoarding/updateprofile");
const GetLatestPrompt = require("./src/project/latestprompt");



//prompt
const prompting = require("./src/prompt/prompting");

//use my routes
app.use("/auth", signUp);
app.use("/auth", signIn);
app.use("/auth", forgotPassword);
app.use("/project", CreateProject);
app.use("/project", getProjectId);
app.use("/project", UpdateProject);
app.use("/terraform", plan);
app.use("/terraform", apply);
app.use("/terraform", destroy);
app.use("/project", getAllProjects);
app.use("/project", getAllProjectsByUserId);
app.use("/project", deleteProject);
app.use("/onBoarding", getProfile);
app.use("/onBoarding", editProfile);
app.use("/project", GetProjectKeys);
app.use("/project", GetLatestPrompt);


//prompt
app.use('/prompt',prompting);

// Server for local development
const port = 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports.handler = serverless(app);