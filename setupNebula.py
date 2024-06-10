#!/usr/bin/env python3

import os
import subprocess

project_directory = os.getcwd()
os.chdir(project_directory)


#entire Project Setup
subprocess.run(["npm" , "install", "--save-dev", "sequelize-cli"])


#start
subprocess.run([ "npx", "sequelize-cli","db:drop"])

#database creation
subprocess.run([ "npx", "sequelize-cli", "db:create"])
print("Database successfully create")



#model creation

#user_model
user_model = [
    "npx",
    "sequelize-cli",
    "model:generate",
    "--name",
    "User",
    "--attributes",
    "email:string,firstName:string,lastName:string,role:string",
    "--force"
]


subprocess.run(user_model)
print("User model run successfully")

#project_model 
project_model = [
    "npx",
    "sequelize-cli",
    "model:generate",
    "--name",
    "Project",
    "--attributes",
     "projectName:string,description:string,accessKey:string,secretKey:string,region:string,s3Bucket:string,userId:integer",
    "--force"
]
subprocess.run(project_model)
print("Project Model successfully")

prompt_model =[
    "npx",
    "sequelize-cli",
    "model:generate",
    "--name",
    "Prompt",
    "--attributes",
     "prompt:string,feedback:string,projectId:integer,action:string",
    "--force"
]

subprocess.run(prompt_model)
print("Prompt Model successfully")

#Project.belongsTo(models.User, { foreignKey: 'userId' });
#prompt.belongsTo(models.Project, { foreignKey: 'projectId' });





subprocess.run(["npx", "sequelize", "db:migrate"])
print("Sequelize migrations run successfully.")
