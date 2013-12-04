var fs = require('fs');
var _ = require('underscore');

// Actors
// testear('./html_test_files/imdb/actors/imdb_actor.html', './processers/imdb/imdb_actor', 'IMDB Actors Links Processer');
// testear('./html_test_files/imdb/actors_lists/imdb_actors_list.html', './processers/imdb/imdb_actors_list', 'IMDB Actors_lists Links Processer');

// Series
// testear('./html_test_files/imdb/series/imdb_series.html', './processers/imdb/imdb_series', 'IMDB Series Links Processer');
// testear('./html_test_files/imdb/series_lists/imdb_series_list.html', './processers/imdb/imdb_series_list', 'IMDB Series_list Links Processer');

// Episodes
// testear('./html_test_files/imdb/episodes/imdb_episode.html', './processers/imdb/imdb_episode', 'IMDB Episodes Links Processer');
testear('./html_test_files/imdb/episodes_lists/imdb_episodes_list.html', './processers/imdb/imdb_episodes_list', 'IMDB Episodes_list Links Processer');

function testear( file, processer_path, test_name  ){
	var processer = require(processer_path);

	//Pruebo cada uno de los archivos

	console.log('\n', '######### Testing ' + test_name +  '######## \n')

	console.log("Testeando: " + file);

	var html = fs.readFileSync(file);
	
	var links = processer.getLinks(html);
	console.log(links)
	
};