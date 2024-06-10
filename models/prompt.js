'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prompt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Prompt.belongsTo(models.Project, { foreignKey: 'projectId' });
    }
  }
  Prompt.init({
    prompt: DataTypes.STRING,
    feedback: DataTypes.STRING,
    projectId: DataTypes.INTEGER,
    action: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Prompt',
  });
  return Prompt;
};