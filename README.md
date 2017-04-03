# moviesapp
App for rating movies

This webapp allows the user to create, update, read and delete a list of movies. The technologies employed are nodejs for the application server, the expressjs framework, EJS for the views and SQLite for the database.

After creating the skeleton of the app (with a layout to be rendered as well as the mainpage), I defined the model of the Movie using sequelize (a package to provide an ORM). This command is needed ro tun the app locally.

>sequelize model:create --name Movies --attributes title:string,description:string,rating:integer,released:date

 The models is associated with the following migration, where the params of the movie can be seen:
 
 'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Movies');
  }
};


I have to remark that the field released apparently fails while being created. I have checked some posts on Stackoverflow and  this problems seems to be regarded to the DATE field. I couldn't solve it so far, so I have omitted it in the queries.

Once the model of the movie is created, we have to implement the following REST API:

HTTP Method	URL	Action
GET	/movies	movieController.index
GET	/movies/new	movieController.new
GET	/movies/{movieid}	movieController.show
POST	/movies/	movieController.create
GET	/movies/{movieid}/edit	movieController.edit
PUT	/movies/{movieid}	movieController.update
DELETE	/movies/{movieid}	movieController.destroy
 
Using an MVC pattern, we have to assemble, link and implement the logic application for all the views (with its URL) with the controller. To do so, in app.js we define the routes:


// Routes
app.get('/movies', movieController.index);
app.get('/movies/new', movieController.new);
app.get('/movies/:movieid([0-9]+)', movieController.show);
app.post('/movies', movieController.create);
app.get('/movies/:movieid([0-9]+)/edit', movieController.edit);
app.put('/movies/:movieid([0-9]+)', movieController.update);
app.delete('/movies/:movieid([0-9]+)', movieController.destroy);


Another important remark is that this method is deprecated in node 4 or above versions, so if you are using it you will have to manually access those links containing movieid.

And finally we have to implement the logic of the controller. For instance, let's see how the controller for create works:

exports.create = function(req, res, next) {

    var movie = models.Movie.build(
        { title: req.body.movie.title,
          description: req.body.movie.description,
          rating: null

          
        });
    
    // var validate_errors = movie.validate();
    // if (validate_errors) {
    //     console.log("Errores de validacion:", validate_errors);
    //     res.render('movies/new', {movie: movie});
    //     return;
    // } 
    
    movie.save()
        .then(function() {
            res.redirect('/movies');
        })
        .error(function(error) {
            console.log("Error: No puedo crear el movie:", error);
            res.render('movies/new', {movie: movie});
        });
};


This functions saves (if success) a movie with the the values of the request received from the new.ejs (view file). If we have a look on this view, we can observe that includes a formular to save a movie:

<div class="field">
  <label for="post_title">Title</label><br />
  <input type="text" id="post_title" name="movie[title]" size='80' value='<%= movie.title%>' />
</div>

<div class="field">
  <label for="post_body">Description</label><br />
  <textarea id="post_body" name="movie[description]" rows="20" cols="80"><%= movie.description %></textarea>
</div>

<div class="actions">
  <input name="commit" type="submit" value="Save" />
</div>

The fields title and description of the request body.movie will be send with the value contained in the text field. The rating is not included as I'd like to include a radio button to do it, but it takes more time (and neither the released is implemented because of the above mentioned issues).
