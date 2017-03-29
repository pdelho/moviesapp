// Modelos ORM
var path = require('path');
var Sequelize = require('sequelize');
// Para usar SQLite:
var sequelize = new Sequelize(null,null,null,
{dialect:"sqlite",
storage:"blog.sqlite"});
// Importar la definicion de la clase Post desde post.js.
// Y que este modulo exporta la clase Post:
exports.Movie = sequelize.import(path.join(__dirname,'movies'));