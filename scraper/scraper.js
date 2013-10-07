var fs = require('fs'); // files streaming
var _ = require('underscore'); // utilities like _.each
var watch = require('watch'); // adding a new file asynchronous event
//<processers>
var imdbActorProcesser = require('./imdb_actor');
var imdbSeriesProcesser = require('./imdb_series');
var imdbEpisodeProcesser = require('./imdb_episode');
var imdbActorsListProcesser = require('./imdb_actors_list');
var imdbSeriesListProcesser = require('./imdb_series_list');
var imdbEpisodesListProcesser = require('./imdb_episodes_list');
//</processers>
//folder where all html files are (could be an argument when running node scraper.js)
var path = './html_test_files';
//modules for storing in databases and access keys
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

//function that calls dbstore modules and sends it the info and access keys
function store(info, links) {
	if(links){
		dbStore.storeInLocalDB(links, access["Local"]["username"], access["Local"]["password"], access["Local"]["address"]);
	}
	if(info){
		dbStore.storeInMongo(info, access["Mongo"]["username"], access["Mongo"]["password"], access["Mongo"]["address"]);
	}
};

function threadProcess(processer, folder) {
	var files_list = fs.readdirSync(folder);
	files_list = _.filter(files_list, function(element) {
		var asArray = element.split('.');
		return asArray[asArray.length - 1] == 'html';
	});
	console.log(files_list);
	if(files_list.length){
		_.each(files_list, function(element) {
			console.log("Gonna read: " + folder + element);
			var info = processer.getInfo(fs.readFileSync(folder + element));
			var links = processer.getLinks(fs.readFileSync(folder + element));
			store(info, links);
			//delete file
		});
	}
};



watch.createMonitor(path + '/imdb/actors/',function(monitor){
	 monitor.on("created", function (f, stat) {
      threadProcess(imdbActorProcesser,path + '/imdb/actors/');
    })
});

watch.createMonitor(path + '/imdb/actors_lists/',function(monitor){
	 monitor.on("created", function (f, stat) {
      threadProcess(imdbActorsListProcesser,path + '/imdb/actors_lists/');
    })
});

watch.createMonitor(path + '/imdb/series/',function(monitor){
	 monitor.on("created", function (f, stat) {
      threadProcess(imdbSeriesProcesser,path + '/imdb/series/');
    })
});

watch.createMonitor(path + '/imdb/series_lists/',function(monitor){
	 monitor.on("created", function (f, stat) {
      threadProcess(imdbSeriesListProcesser,path + '/imdb/series_lists/');
    })
});

watch.createMonitor(path + '/imdb/episodes/',function(monitor){
	 monitor.on("created", function (f, stat) {
      threadProcess(imdbEpisodeProcesser,path + '/imdb/episodes/');
    })
});

watch.createMonitor(path + '/imdb/episodes_lists/',function(monitor){
	 monitor.on("created", function (f, stat) {
      threadProcess(imdbEpisodesListProcesser,path + '/imdb/episodes_lists/');
    })
});

