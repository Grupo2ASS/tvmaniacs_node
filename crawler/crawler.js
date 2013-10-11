// Config vars
	// Not crawl page again in days
	var revisit_page = 7
	// Database name
	var db_file = "../tvmaniacs_node.db";
	// html_folder directory
	var root_html_folder = "../html_folder";

// Crawler module
var Crawler = require("crawler").Crawler;
// File reading and writing module
var fs = require('fs');
// SQLITE3 module
var sqlite3 = require("sqlite3").verbose();
		
// Info of links in queue
var current_links = {}

var crawler_instance = new Crawler({
	"maxConnections": 10,

	// This will be called for each crawled page
	"callback":function(error,result,$) {
		//console.log(current_links[result.uri]);
		var website_dir = root_html_folder+"/"+current_links[result.uri]['site'];
		var dir_name = current_links[result.uri]['type'];

		// Get page source code
	    var page = result.body.toString();
		
		// Create website directory if doesnt exists
		var file_name = "page", file_ext = ".html";
		// Check if name already exists and add to counter
		var page_number = 1;
		while (fs.existsSync(website_dir+"/"+dir_name+"/"+file_name+page_number+file_ext)) {
			page_number++;
		}
		// Write page source code to a file
		fs.writeFile(website_dir+"/"+dir_name+"/"+file_name+page_number+file_ext, page, function(err) {
		    if(err) {
				console.log(err);
		    } else {
				console.log("The file was saved!");
		    }
		});
	},
	"onDrain":function(){
		// This function executes when queue is empty
		console.log("No pages on queue..");
		
		// Load the database
		var db = new sqlite3.Database(db_file);
		
		db.serialize(function() {
			// Get all rows in db
			var active_urls = "SELECT url, site, type, last_visited FROM links WHERE date(last_visited,'+" +
				revisit_page + " days') <= date('now') LIMIT 0, 10";
			db.each(active_urls, function(err, row) {
				var row_estructure = {
						'site':row.site,
						'type':row.type
				}
				current_links[row.url] = row_estructure;
				crawler_instance.queue(row.url);
				
				// Update last_visited date to revisit_page days later
				var stmt = db.prepare("UPDATE links set last_visited=date('now') WHERE url='"+row.url+"'");
				stmt.run();
				stmt.finalize();
	  		}, 
	  		function(err, row) {
				// Close db when no rows left
				db.close();
	  		});
		});
	}
});


// Load the database
var database = new sqlite3.Database(db_file);
		
// First queue link
database.serialize(function() {
	// Get all rows in db
	var active_urls = "SELECT url, site, type, last_visited FROM links LIMIT 0, 10";
	database.each(active_urls, function(err, row) {
		var row_estructure = {
				'site':row.site,
				'type':row.type
		}
		current_links[row.url] = row_estructure;
		crawler_instance.queue(row.url);
		
		// Update last_visited date to revisit_page days later
		var stmt = database.prepare("UPDATE links set last_visited=date('now') WHERE url='"+row.url+"'");
		stmt.run();
		stmt.finalize();
	}, 
	function(err, row) {
		// Close db when no rows left
		database.close();
	});
});