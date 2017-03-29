'use strict';
module.exports = function(sequelize, DataTypes) {
  var Movies = sequelize.define('Movies', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    rating: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Movies;
};