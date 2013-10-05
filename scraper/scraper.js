var fs = require('fs');
var _ = require('underscore');
var imdbActorProcesser = require('./imdb_actor');
var imdbSeriesProcesser = require('./imdb_series');
var imdbEpisodeProcesser = require('./imdb_episode');
var imdbActorsListProcesser = require('./imdb_actors_list');
var imdbSeriesListProcesser = require('./imdb_series_list');
var imdbEpisodesListProcesser = require('./imdb_episodes_list');

var path = './html_test_files';

var dbStore = require('./db_store');

var access = require('./access.json');


/*
Each of the next functions should:
	Check if there are new files in its folder
		If not, wait a minute
		If true:
			process file
				get info (if there is any):
					call function to store in mongo
				get links
					call function to store in local db
			delete file

*/

function store(info, links) {
	console.log(links);


};

function threadProcess(processer, folder) {
	var files_list = fs.readdirSync(folder);
	files_list = _.filter(files_list, function(element) {
		var asArray = element.split('.');
		return asArray[asArray.length - 1] == 'html';
	});
	_.each(files_list, function(element) {
		var info = processer.getInfo(fs.readFileSync(folder + element));
		var links = processer.getLinks(fs.readFileSync(folder + element));
		store(info, links);
	});
};

setInterval(function() {
	threadProcess(imdbActorProcesser, path + '/imdb/actors/');
}, 6000);

setInterval(function() {
	threadProcess(imdbSeriesProcesser, path + '/imdb/series/');
}, 6000);

/*setInterval(function() {
	threadProcess(imdbEpisodeProcesser, path + '/imdb/episode/');
}, 6000);*/
setInterval(function() {
	threadProcess(imdbActorsListProcesser, path + '/imdb/actors_lists/');
}, 6000);

setInterval(function() {
	threadProcess(imdbSeriesListProcesser, path + '/imdb/series_lists/');
}, 6000);

setInterval(function() {
	threadProcess(imdbEpisodesListProcesser, path + '/imdb/episodes_lists/');
}, 6000);