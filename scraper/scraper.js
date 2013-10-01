// instaciar scraper (requier node crawler etc etc)
//manejar threads
//definir metodos para leer html de carpeta (lo haria en otro archivo, getFiles.js o algo)
//sacar info de threads(tambien otro archivo, process.js)
//guardar en bdd(store.js)


var fs = require('fs');
var imdbActorProcesser = require('./imdb_actor');
var html = fs.readFileSync('./html_test_files/imdb/actors/imdb_actor.html')
var actor = imdbActorProcesser.getIMDBActorInfo(html);
console.log(actor);