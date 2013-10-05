//Podriamos pasar parametros por linea de comandos, la carpeta dnd estan los html, el .js dnd esta el acceso a la bdd
// (por los passwords y eso) y la cantidad de tiempo de cada cuanto rato revisa si hay
//nuevos archivos.



var fs = require('fs');

var imdbActorProcesser = require('./imdb_actor');

//obtener info de actor IMDB. Check!
var html_actor = fs.readFileSync('./html_test_files/imdb/actors/imdb_actor.html')
var actor = imdbActorProcesser.getInfo(html_actor);
console.log("Actor Info:")
console.log(actor);

//obtener links de actor imdb. Check!
var links_actor = imdbActorProcesser.getLinks(html_actor);
console.log("Actor Links:")
console.log(links_actor);

var imdbSeriesProcesser = require('./imdb_series');

//obtener info de series imdb. Check!
var html_series = fs.readFileSync('./html_test_files/imdb/series/imdb_series.html')
var series = imdbSeriesProcesser.getInfo(html_series);
console.log("Series Info:")
console.log(series);



var links_series = imdbSeriesProcesser.getLinks(html_series);
console.log("Series Links:")
console.log(links_series);