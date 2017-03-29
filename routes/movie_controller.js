var models = require('../models/models.js');

// GET /movies
exports.index = function(req, res, next) {

    var format = req.params.format || 'html';
    format = format.toLowerCase();

    models.Movie
        .findAll({order: 'updatedAt DESC', attributes: ['title', 'description']})
        .success(function(movies) {
            switch (format) { 
              case 'html':
              case 'htm':
                  res.render('movies/index', {
                    movies: movies
                  });
                  break;
              case 'json':
                  res.send(movies);
                  break;
              case 'xml':
                  res.send(movies_to_xml(movies));
                  break;
              case 'txt':
                  res.send(movies.map(function(movie) {
                      return movie.title+' ('+movie.description+')';
                  }).join('\n'));
                  break;
              default:
                  console.log('No se soporta el formato \".'+format+'\" pedido para \"'+req.url+'\".');
                  res.send(406);
            }
        })
        .error(function(error) {
            console.log("Error: No puedo listar los movies.");
            res.redirect('/');
        });
};

function movies_to_xml(movies) {

    var builder = require('xmlbuilder');
    var xml = builder.create('movies')
    for (var i in movies) {
        xml.ele('movie')
              .ele('id')
                 .txt(movies[i].id)
                 .up()
              .ele('title')
                 .txt(movies[i].title)
                 .up()
              .ele('description')
                 .txt(movies[i].description)
                 .up()
              .ele('released')
                 .txt(movies[i].released)
                 .up()
              .ele('createdAt')
                 .txt(movies[i].createdAt)
                 .up()
              .ele('updatedAt')
                 .txt(movies[i].updatedAt);
    }
    return xml.end({pretty: true});
}


// GET /movies/33
exports.show = function(req, res, next) {

    var format = req.params.format || 'html';
    format = format.toLowerCase();

    var id =  req.params.movieid;
    
    models.Movie
        .find({where: {id: Number(id)}, attributes: ['description', 'title']})
        .success(function(movie) {
            switch (format) { 
              case 'html':
              case 'htm':
                  if (movie) {
                    res.render('movies/show', { movie: movie });
                  } else {
                    console.log('No existe ningun movie con id='+id+'.');
                    res.redirect('/movies');
                  }
                  break;
              case 'json':
                  res.send(movie);
                  break;
              case 'xml':
                     res.send(movie_to_xml(movie));
                  break;
              case 'txt':
                  res.send(movie.title+' ('+movie.description+')');
                  break;
              default:
                  console.log('No se soporta el formato \".'+format+'\" pedido para \"'+req.url+'\".');
                  res.send(406);
            }
        })
        .error(function(error) {
            console.log(error);
            res.redirect('/');
        });
};

function movie_to_xml(movie) {

    var builder = require('xmlbuilder');
    if (movie) {
       var xml = builder.create('movie')
              .ele('id')
                 .txt(movie.id)
                 .up()
              .ele('title')
                 .txt(movie.title)
                 .up()
              .ele('description')
                 .txt(movie.description)
                 .up()
              .ele('released')
                 .txt(movie.released)
                 .up()
              .ele('createdAt')
                 .txt(movie.createdAt)
                 .up()
              .ele('updatedAt')
                 .txt(movie.updatedAt);
       return xml.end({pretty: true});
    } else {
       var xml = builder.create('error')
                           .txt('movie no existe');
       return xml.end({pretty: true});
    }
};

// GET /movies/new
exports.new = function(req, res, next) {

    var movie = models.Movie.build(
        { title:  'Set the title',
          description: 'Set the description',
          //released: null
        });
    
    res.render('movies/new', {movie: movie});
};

// MOVIE /movies
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
        .success(function() {
            res.redirect('/movies');
        })
        .error(function(error) {
            console.log("Error: No puedo crear el movie:", error);
            res.render('movies/new', {movie: movie});
        });
};

// GET /movies/33/edit
exports.edit = function(req, res, next) {

    var id =  req.params.movieid;
    
    models.Movie
        .find({where: {id: Number(id)}})
        .success(function(movie) {
            if (movie) {
                res.render('movies/edit', {movie: movie});
            } else {
                console.log('No existe ningun movie con id='+id+'.');
                res.redirect('/movies');
            }
        })
        .error(function(error) {
            console.log(error);
            res.redirect('/');
        });
};

// PUT /movies/33
exports.update = function(req, res, next) {

    var id =  req.params.movieid;
    
    models.Movie
        .find({where: {id: Number(id)}})
        .success(function(movie) {
            if (movie) {
                movie.title = req.body.movie.title;
                movie.description = req.body.movie.description;
                
                var validate_errors = movie.validate();
                if (validate_errors) {
                    console.log("Errores de validacion:", validate_errors);
                    res.render('movies/edit', {movie: movie});
                    return;
                } 
                movie.save(['title', 'description'])
                    .success(function() {
                        res.redirect('/movies');
                    })
                    .error(function(error) {
                        console.log("Error: No puedo editar el movie:", error);
                        res.render('movies/edit', {movie: movie});
                    });
            } else {
                console.log('No existe ningun movie con id='+id+'.');
                res.redirect('/movies');
            }
        })
        .error(function(error) {
            console.log(error);
            res.redirect('/');
        });
};

// DELETE /movies/33
exports.destroy = function(req, res, next) {

    var id =  req.params.movieid;
    
    models.Movie
        .find({where: {id: Number(id)}})
        .success(function(movie) {
            if (movie) {
                
                movie.destroy()
                    .success(function() {
                        res.redirect('/movies');
                    })
                    .error(function(error) {
                        console.log("Error: No puedo eliminar el movie:", error);
                        res.redirect('back');
                    });
            } else {
                console.log('No existe ningun movie con id='+id+'.');
                res.redirect('/movies');
            }
        })
        .error(function(error) {
            console.log(error);
            res.redirect('/');
        });
};