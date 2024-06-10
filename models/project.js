'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Project.init({
    projectName: DataTypes.STRING,
    description: DataTypes.STRING,
    accessKey: DataTypes.STRING,
    secretKey: DataTypes.STRING,
    region: DataTypes.STRING,
    s3Bucket: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};