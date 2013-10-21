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

var metacriticActorProcesser = require('./processers/metacritic/metacritic_actor.js');
var metacriticSeriesProcesser = require('./processers/metacritic/metacritic_series.js');
//var metacriticEpisodeProcesser = require('./processers/metacritic/metacritic_episode.js');
var metacriticActorsListProcesser = require('./processers/metacritic/metacritic_actors_list.js');
var metacriticSeriesListProcesser = require('./processers/metacritic/metacritic_series_list.js');
//var metacriticEpisodesListProcesser = require('./processers/metacritic/metacritic_episodes_list.js');
//</processers>

//folder where all html files are (could be an argument when running node scraper.js)
var path = config["html_folder"];
//modules for storing in databases and access keys
var dbStore = require('./db_store');

var models = require('./models')

var utils = require('./utils.js')

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
		dbStore.storeInLocalDB(links, config["access"]["Local"]);
	}
	if(info){
		dbStore.storeInMongo(info, config["access"]["Mongo"], model);
	}
};

function threadProcess(processer, folder, model) {
	var files_list = fs.readdirSync(folder);
	files_list = _.filter(files_list, function(element) {
		var asArray = element.split('.');
		return asArray[asArray.length - 1] == 'html';
	});
	utils.print_to_log('Archivos en carpeta: ' + files_list);
	if(files_list.length){
		_.each(files_list, function(element) {
			utils.print_to_log("Gonna read: " + folder + element);
			var info = processer.getInfo(fs.readFileSync(folder + element));
			var links = processer.getLinks(fs.readFileSync(folder + element));
			store(info, links, model);
			
			//delete file
			fs.unlinkSync( folder + element);
			utils.print_to_log('Successfully deleted: ' + folder + element);
		});
	}
};


//Actors
	//IMDB
watch.createMonitor(path + '/imdb/actor/',function(monitor){
    monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
     		threadProcess(imdbActorProcesser,path + '/imdb/actor/', models.actorModel );
  		}
    })
});
	
	//metacritic
watch.createMonitor(path + '/metacritic/actor/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
     		threadProcess(metacriticActorProcesser,path + '/metacritic/actor/', models.actorModel );
  		}
    })
});


//Actors List
	//IMDB
watch.createMonitor(path + '/imdb/actors_list/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(imdbActorsListProcesser,path + '/imdb/actors_list/');
      	}
    })
});

	//metacritic
watch.createMonitor(path + '/metacritic/actors_list/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(metacriticActorsListProcesser,path + '/metacritic/actors_list/');
      	}
    })
});

//Series
	//IMDB
watch.createMonitor(path + '/imdb/series/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(imdbSeriesProcesser,path + '/imdb/series/', models.serieModel);
      	}
    })
});

	//metacritic
watch.createMonitor(path + '/metacritic/series/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(metacriticSeriesProcesser,path + '/metacritic/series/', models.serieModel);
      	}
    })
});

//Series List
	//IMDB
watch.createMonitor(path + '/imdb/series_list/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(imdbSeriesListProcesser,path + '/imdb/series_list/');
      	}
    })
});

	//metacritic
watch.createMonitor(path + '/metacritic/series_list/',function(monitor){
        monitor.on("created", function (f, stat) {
            if (monitor.files[f] === undefined) {
                threadProcess(metacriticSeriesListProcesser,path + '/metacritic/series_list/');
            }
        })
});

//Episodes
	//IMDB
watch.createMonitor(path + '/imdb/episode/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(imdbEpisodeProcesser,path + '/imdb/episode/', models.chapterModel );
      	}
    })
});

	//metacritic
/*
watch.createMonitor(path + '/metacritic/episode/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(metacriticEpisodeProcesser,path + '/metacritic/episode/', models.chapterModel );
      	}
    })
});
*/

//Espisodes List
	//IMDB
watch.createMonitor(path + '/imdb/episodes_list/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(imdbEpisodesListProcesser,path + '/imdb/episodes_list/');
      	}
    })
});

	//metacritic
/*
watch.createMonitor(path + '/metacritic/episodes_list/',function(monitor){
	 monitor.on("created", function (f, stat) {
	 	if (monitor.files[f] === undefined) {
      		threadProcess(metacriticEpisodesListProcesser,path + '/metacritic/episodes_list/');
      	}
    })
});
*/
