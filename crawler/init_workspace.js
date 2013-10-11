// Config vars
	// Not crawl page again in days
	var revisit_page = 7
	// Database name
	var db_file = "../tvmaniacs_node.db";
	// html_folder directory
	var root_html_folder = "../html_folder";

	// First row of database:
	var first_url = "http://www.imdb.com/title/tt0944947/";
	var first_url_site = "imdb";
	var first_url_type = "series";

// File reading and writing module
var fs = require('fs');

console.log("############## Database creation ##############");

// Check db. If doesnt exists, this script creates it and inserts the first row on the table.
var exists = fs.existsSync(db_file);
if(!exists)	{
	console.log("Creating DB file.");
	fs.openSync(db_file, "w");
	var sqlite3 = require("sqlite3").verbose();
	var db = new sqlite3.Database(db_file);

	db.serialize(function() {
		if(!exists) {
			db.run("CREATE TABLE links (url TEXT, site TEXT, type TEXT, last_visited datetime)");
			// Add a link to the recently created db (REMOVE LINE WHEN SCRAPPER READY)
			var firt_page = "INSERT INTO links VALUES ('"+first_url+"', '"+first_url_site+"', '"+first_url_type+"', date('now','-"+revisit_page+" days'))";
			var stmt = db.prepare(firt_page);
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
	"actors",
	"actors_lists",
	"episodes",
	"episodes_lists",
	"series",
	"series_lists",
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
makeDir(root_html_folder,"");
for (var i = 0; i < folders.length; i++) {
	makeDir(root_html_folder, folders[i]);
	for (var j = 0; j < sub_folders.length; j++) {
		makeDir(root_html_folder+"/"+folders[i], sub_folders[j]);
	};
};