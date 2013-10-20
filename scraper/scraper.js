var config = require('../config/config.json'); //Load config values

var fs = require('fs'); // files streaming
var _ = require('underscore'); // utilities like _.each
var watch = require('watch'); // adding a new file asynchronous event
//<processers>
var imdbActorProcesser = require('./processers/imdb/imdb_actor.js');
var imdbSeriesProcesser = require('./processers/imdb/imdb_series.js');
var imdbEpisodeProcesser = require('./processers/imdb/imdb_episode.js');
var imdbActorsListProcesser = require('./processers/imdb/imdb_actors_list.js');
var imdbSeriesListProcesser = require('./processers/imdb/imdb_series_list.js');
var imdbEpisodesListProcesser = require('./processers/imdb/imdb_episodes_list.js');
//</processers>
//folder where all html files are (could be an argument when running node scraper.js)
var path = './html_test_files';
//modules for storing in databases and access keys
var dbStore = require('./db_store');

var models = require('./models')

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
function store(info, links, model) {
	if(links){
		dbStore.storeInLocalDB(links, config["access"]["Local"]["username"], config["access"]["Local"]["password"],
            config["access"]["Local"]["address"]);
	}
	if(info){
		dbStore.storeInMongo(info, config["access"]["Mongo"]["username"], config["access"]["Mongo"]["password"],
            config["access"]["Mongo"]["address"], model);
	}
};

function threadProcess(processer, folder, model) {
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
			store(info, links, model);
			//delete file
		});
	}
};


watch.createMonitor(path + '/imdb/actors/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
     		threadProcess(imdbActorProcesser,path + '/imdb/actors/', models.actorModel );	
  		}
    })
});

watch.createMonitor(path + '/imdb/actors_lists/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(imdbActorsListProcesser,path + '/imdb/actors_lists/');
      	}
    })
});

watch.createMonitor(path + '/imdb/series/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(imdbSeriesProcesser,path + '/imdb/series/', models.serieModel);
      	}
    })
});

watch.createMonitor(path + '/imdb/series_lists/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(imdbSeriesListProcesser,path + '/imdb/series_lists/');
      	}
    })
});

watch.createMonitor(path + '/imdb/episodes/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(imdbEpisodeProcesser,path + '/imdb/episodes/', models.chapterModel );
      	}
    })
});

watch.createMonitor(path + '/imdb/episodes_lists/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(imdbEpisodesListProcesser,path + '/imdb/episodes_lists/');
      	}
    })
});
