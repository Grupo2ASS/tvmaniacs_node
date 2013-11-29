var fs = require('fs');
var _ = require('underscore');

//Podriamos pasar parametros por linea de comandos, la carpeta dnde estan los html, el .js dnd esta el acceso a la bdd
// (por los passwords y eso) y la cantidad de tiempo de cada cuanto rato revisa si hay nuevos archivos.


// Actores
testear( './html_test_files/imdb/actors/', './processers/imdb/imdb_actor', 'Actor Processer' );

// Series
testear('./html_test_files/imdb/series/', './processers/imdb/imdb_series', 'Series Processer');

// Episodios
testear('./html_test_files/imdb/episodes/', './processers/imdb/imdb_episode', 'Episodes Processer')


function testear( folder, processer_path, test_name  ){
	var processer = require(processer_path);

	//Obtengo la lista de archivos de prueba
	var files_list = fs.readdirSync(folder);
	files_list = _.filter(files_list, function(element) {
		var asArray = element.split('.');
		return asArray[asArray.length - 1] == 'html';
	});

	//Pruebo cada uno de los archivos

	console.log('\n', '######### Testing ' + test_name +  '######## \n')

	_.each(files_list, function(element) {
		console.log("Testeando: " + element);

		var html = fs.readFileSync(folder + element);
		var exito = true;
		try{
			var info = processer.getInfo(html);
		}
		catch(err){
			exito = false;
			console.log('Error en: ' + element);
			console.log('\n', err.stack, '\n');
		}
		finally{
			if(exito)
				console.log('Ok!');
			exito = true;
		}
	});
};


//obtener links de actor imdb. Check!
// var links_actor = imdbActorProcesser.getLinks(html_actor);
// console.log("Actor Links:")
// console.log(links_actor);

// var links_series = imdbSeriesProcesser.getLinks(html_series);
// console.log("Series Links:")
// console.log(links_series);

// var imdbActorsListProcesser = require('./processers/imdb/imdb_actors_list');
// //obtener lista de actores imdb.
// var html_actors_list = fs.readFileSync('./html_test_files/imdb/episodes_lists/imdb_actors_list.html')
// var links_actors_list = imdbActorsListProcesser.getInfo(html_actors_list);
// console.log("Actor link:");
// console.log(links_actors_list);


