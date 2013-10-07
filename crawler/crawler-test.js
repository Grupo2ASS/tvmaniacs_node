// Config vars

// Not crawl page again in days
var revisit_page = 7




// Crawler module
var Crawler = require("crawler").Crawler;

// File reading and writing module
var fs = require('fs');

// Info of links in queue
var current_links = {}

var c = new Crawler({
"maxConnections":10,

// This will be called for each crawled page
"callback":function(error,result,$) {

	//console.log(current_links[result.uri]);


	var website_name = current_links[result.uri]['site'];
	var dir_name = current_links[result.uri]['type'];

	// Get page source code
    	var page = result.body.toString();
	
	// Create website directory if doesnt exists
	var file_name = "page", file_ext = ".html";
	fs.mkdir(website_name,function(e){
	    if(!e || e.code === 'EEXIST'){
		
		// Inside website directory create type directory if doesnt exists
		fs.mkdir(website_name+"/"+dir_name,function(f){
		    if(!f || f.code === 'EEXIST'){

			// Check if name already exists and add to counter
			var page_number = 1;
			while (fs.existsSync(website_name+"/"+dir_name+"/"+file_name+page_number+file_ext)) {
				page_number++;
			}
			// Write page source code to a file
			fs.writeFile(website_name+"/"+dir_name+"/"+file_name+page_number+file_ext, page, function(err) {
			    if(err) {
				console.log(err);
			    } else {
				console.log("The file was saved!");
			    }
			});
		    } else {
			//debug
			console.log(f);
		    }
		});

	    } else {
		//debug
		console.log(e);
	    }
	});
	
},
"onDrain":function(){
	// This function executes when queue is empty
	console.log("No pages on queue..");

	
	// Check db and create if doesnt exists
	var file = "test.db";
	var exists = fs.existsSync(file);
	if(!exists)
	{
		console.log("Creating DB file.");
		fs.openSync(file, "w");
	}
	var sqlite3 = require("sqlite3").verbose();
	var db = new sqlite3.Database(file);	

	
	db.serialize(function() {
		if(!exists) {
			db.run("CREATE TABLE links (url TEXT, site TEXT, type TEXT, last_visited datetime)");
			// Add a link to the recently created db (REMOVE LINE WHEN SCRAPPER READY)
			var stmt = db.prepare("INSERT INTO links VALUES ('http://www.imdb.com/title/tt0944947/', 'imdb', 'series',date('now'))");
			stmt.run();
			stmt.finalize();

			exists = true;
		}

		// Get all rows in db
		db.each("SELECT url, site, type, last_visited FROM links WHERE date(last_visited) <= date('now') LIMIT 0, 10", function(err, row) {

			var row_estructure = {
					'site':row.site,
					'type':row.type}
			current_links[row.url] = row_estructure;
			c.queue(row.url);
			
			// Update last_visited date to revisit_page days later
			var stmt = db.prepare("UPDATE links set last_visited=date('now','+"+revisit_page+" days') WHERE url='"+row.url+"'");
			stmt.run();
			stmt.finalize();
  		}, function(err, row) {
			// Close db when no rows left
			db.close();
  		});

	});

} 	
});



// First queue link
c.queue("http://www.google.com");
current_links["http://www.google.com"] = {
					'site':'other',
					'type':'other'}
