//Podriamos pasar parametros por linea de comandos, la carpeta dnd estan los html, el .js dnd esta el acceso a la bdd
// (por los passwords y eso) y la cantidad de tiempo de cada cuanto rato revisa si hay
//nuevos archivos.


var fs = require('fs');


//QUEDA PENDIENTE VER UNA DUDA, FUNCIONA EN CHROME NO ACA


console.log("--------------ACTOR PROCESSER-----------------------");
var metacriticActorProcesser = require('./processers/metacritic/metacritic_actor');
//obtener info de actor metacriticIMDB. Check!
var html_actor = fs.readFileSync('./html_test_files/metacritic/actors/metacritic_actor.html')

var actor = metacriticActorProcesser.getInfo(html_actor);
console.log("Actor Info:")
console.log(actor);

//obtener links de actor metacritic. Check!
var links_actor = metacriticActorProcesser.getLinks(html_actor);
console.log("Actor Links:")
console.log(links_actor);



console.log("--------------SERIE PROCESSER-----------------------");
var metacriticSeriesProcesser = require('./processers/metacritic/metacritic_series');

//obtener info de series metacritics. Check!
var html_series = fs.readFileSync('./html_test_files/metacritic/series/metacritic_series.html')
var series = metacriticSeriesProcesser.getInfo(html_series);
console.log("Series Info:")
console.log(series);

var links_series = metacriticSeriesProcesser.getLinks(html_series);
console.log("Series Links:")
console.log(links_series);


console.log("--------------ACTOR LIST PROCESSER-----------------------");

var metacriticActorsListProcesser = require('./processers/metacritic/metacritic_actors_list');
//obtener lista de actores metacritic.
var html_actors_list = fs.readFileSync('./html_test_files/metacritic/actors_lists/metacritic_actors_list.html')

var links_actors_list = metacriticActorsListProcesser.getLinks(html_actors_list);

console.log("Actors link:");
console.log(links_actors_list);




console.log("--------------SERIES LIST PROCESSER-----------------------");

var metacriticSeriesListProcesser = require('./processers/metacritic/metacritic_series_list');
//obtener lista de actores metacritic.
var html_series_list = fs.readFileSync('./html_test_files/metacritic/series_lists/metacritic_series_list.html')

var links_series_list = metacriticSeriesListProcesser.getLinks(html_series_list);

console.log("Series link:");
console.log(links_series_list);


//este aun funciona mal
console.log("-------------------REVIEWS PROCESSESOR------------------");

var metacriticReviewProcesser = require('./processers/metacritic/metacritic_review');
//obtener lista de actores metacritic.
var html_review = fs.readFileSync('./html_test_files/metacritic/reviews/metacritic_reviews.html');
var reviews = metacriticReviewProcesser.getInfo(html_review);

console.log("Reviews:");
console.log(reviews);
