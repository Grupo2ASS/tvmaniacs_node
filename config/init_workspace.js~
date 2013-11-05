var config = require('./config.json'); //Load config values

// File reading and writing module
var fs = require('fs');

console.log("############## Database creation ##############");

// Check db. If doesnt exists, this script creates it and inserts the first row on the table.
var exists = fs.existsSync(config["db_file"]);
if(!exists)	{
	console.log("Creating DB file.");
	fs.openSync(config["db_file"], "w");
	var sqlite3 = require("sqlite3").verbose();
	var db = new sqlite3.Database(config["db_file"]);

	db.serialize(function() {
		if(!exists) {
			db.run("CREATE TABLE links (url TEXT, site TEXT, type TEXT, last_visited datetime)");
			var first_page = "INSERT INTO links VALUES ('"+config["first_site"]["url"] +
                "', '"+config["first_site"]["site"]+"', '"+config["first_site"]["site_type"]+
                "', date('now','-"+config["revisit_days"]+" days'))";
			var stmt = db.prepare(first_page);
			stmt.run();
			stmt.finalize();
			exists = true;
		}
	});
}
else {
	console.log("DB already exists");
}

console.log("############## Folders creation ##############");

var folders = [
	"imdb", 
	"metacritic"
];

var sub_folders = [
	"actor",
	"actors_list",
	"episode",
	"episodes_list",
	"series",
	"series_list",
	"series_full_credits"
];

function makeDir(parent_dir,dir_name) {
	var new_folder = parent_dir+"/"+dir_name;
	fs.mkdir(new_folder,function(e) {
	    if(!e || e.code === 'EEXIST') {
			console.log("Folder "+new_folder+" created.");			
	    } else {
			console.log(e);
	    }
	});
}

// Creating the folders
makeDir(config["html_folder"],"");
for (var i = 0; i < folders.length; i++) {
	makeDir(config["html_folder"], folders[i]);
	for (var j = 0; j < sub_folders.length; j++) {
		makeDir(config["html_folder"]+"/"+folders[i], sub_folders[j]);
	};
};