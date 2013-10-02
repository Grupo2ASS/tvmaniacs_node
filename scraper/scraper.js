


//Podriamos pasar parametros por linea de comandos, la carpeta dnd estan los html, el .js dnd esta el acceso a la bdd
// (por los passwords y eso) y la cantidad de tiempo de cada cuanto rato revisa si hay
//nuevos archivos.



var fs = require('fs');

var imdbActorProcesser = require('./imdb_actor');

//obtener info de actor IMDB. Check!
var html = fs.readFileSync('./html_test_files/imdb/actors/imdb_actor.html')
var actor = imdbActorProcesser.getInfo(html);
console.log(actor); 

//obtener links de actor imdb
var links = imdbActorProcesser.getLinks(html);
console.log(links);