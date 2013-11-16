//Podriamos pasar parametros por linea de comandos, la carpeta dnd estan los html, el .js dnd esta el acceso a la bdd
// (por los passwords y eso) y la cantidad de tiempo de cada cuanto rato revisa si hay
//nuevos archivos.



var fs = require('fs');

var imdbActorProcesser = require('./processers/imdb/imdb_actor');

//obtener info de actor IMDB. Check!
// var html_actor = fs.readFileSync('./html_test_files/imdb/actors/imdb_actor.html')

// var actor = imdbActorProcesser.getInfo(html_actor);
// console.log("Actor Info:")
// console.log(actor);

//obtener links de actor imdb. Check!
// var links_actor = imdbActorProcesser.getLinks(html_actor);
// console.log("Actor Links:")
// console.log(links_actor);

var imdbSeriesProcesser = require('./processers/imdb/imdb_episode');

//obtener info de series imdb. Check!
var html_episode = fs.readFileSync('./html_test_files/imdb/episodes/imdb_episode.html')
var episodes = imdbSeriesProcesser.getInfo(html_episode);
console.log("Episodes Info:")
console.log(episodes);

// var links_series = imdbSeriesProcesser.getLinks(html_series);
// console.log("Series Links:")
// console.log(links_series);

var imdbActorsListProcesser = require('./processers/imdb/imdb_actors_list');
//obtener lista de actores imdb.
var html_actors_list = fs.readFileSync('./html_test_files/imdb/episodes_lists/imdb_actors_list.html')
var links_actors_list = imdbActorsListProcesser.getInfo(html_actors_list);
console.log("Actor link:");
console.log(links_actors_list);


