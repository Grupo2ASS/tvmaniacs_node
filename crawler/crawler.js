var config = require('../config/config.json');
var Crawler = require("crawler").Crawler;
var fs = require('fs');
var sqlite3 = require("sqlite3").verbose();
var pushlinks = require('../scraper/push_actor_links');
		
// Info of links in queue
var current_links = {};
var crawler_instance = null;
var enqueued_limit = config["links_enqueued_per_second"];

function print_to_log(str){
    console.log(str);
    str = "["+(new Date())+"]: "+str+"\n";
    fs.appendFile('crawler_log.txt', str, function (err) {
        if (err) {
            console.log("Error on writing to log: "+err);
        }
    });
}

function wait_new_links(){var db = new sqlite3.Database(config["db_file"]);
    var db = new sqlite3.Database(config["db_file"]);
    db.serialize(function(){
        var check_links_query = "SELECT count(*) as num_links FROM links WHERE date(last_visited,'+" +
            config["revisit_days"] + " days') <= date('now') LIMIT "+enqueued_limit;
        db.each(check_links_query,
            function(err, row) {
                if(row && row.num_links > 0) {
                    setTimeout(enqueue_links(),1000);
                }
                else {
                    print_to_log("Waiting "+config["seconds_until_next_db_check"]+" seconds until next check.");
                    setTimeout(wait_new_links,config["seconds_until_next_db_check"]*1000);
                }
            },
            function(err, row) {
                // Close db when no rows left
                db.close();
                if(err){
                    var error_str = "-----------ERROR - wait_new_links-----------\n";
                    error_str += " - [error] - "+err+"\n";
                    print_to_log(error_str);
                    print_to_log("Waiting "+config["seconds_until_next_db_check"]+" seconds until next check.");
                    setTimeout(wait_new_links,config["seconds_until_next_db_check"]*1000);
                }
            }
        );
    });
}


function enqueue_links() {
    create_crawler();
    // Load the database
    var db = new sqlite3.Database(config["db_file"]);
    db.serialize(function() {
        // Get all rows in db
        var active_urls = "SELECT url, site, type, last_visited FROM links WHERE date(last_visited,'+" +
            config["revisit_days"] + " days') <= date('now') LIMIT "+enqueued_limit;
        db.each(active_urls,
            function(err, row) {
                if(row != null){
                    current_links[row.url] = { 'site':row.site, 'type':row.type };
                    crawler_instance.queue(row.url);

                    // Update last_visited date to revisit_page days later
                    var stmt = db.prepare("UPDATE links set last_visited=date('now') WHERE url='"+row.url+"'");
                    stmt.run();
                    stmt.finalize();
                }
            },
            function(err, row) {
                // Close db when no rows left
                db.close();
                if(err){
                    var error_str = "-----------ERROR - enqueue_links-----------\n";
                    error_str += " - [error] - "+err+"\n";
                    print_to_log(error_str);
                    print_to_log("Waiting 1 second until trying enqueue_links again");
                    setTimeout(enqueue_links,1000);
                }
            }
        );
    });
}

function create_crawler() {
    crawler_instance = new Crawler({
        "maxConnections": config["max_connections"],
        "callback": function(error,result,$) {
            // This function will be called for each crawled page
            if(error != null || result == undefined || result == null) {
                var error_str = "-----------ERROR - REQUEST-----------\n";
                error_str += " - [error] - "+error+"\n";
                error_str += " - [result] - "+result;
                print_to_log(error_str);
            }
            else if(result.statusCode != 200) {
                var error_str = "-----------ERROR - REQUEST STATUS CODE-----------\n";
                error_str += " - [error] - Status code "+result.statusCode +" instead of 200\n";
                print_to_log(error_str);
            }
            else {
                var website_dir = config["html_folder"]+"/"+current_links[result.uri]['site'];
                var dir_name = current_links[result.uri]['type'];
                // Get page source code
                var page = result.body.toString();
                var file_name = (result.uri).replace(/[&\/\\#,+()$~%.'":*?<>{}=]/g,'_');
                var file_ext = ".html";

                // Write page source code to a file
                var file_path = website_dir+"/"+dir_name+"/"+file_name+file_ext;
                fs.writeFile(file_path, page, function(err) {
                    if(err) {
                        print_to_log("Error on write file:");
                        print_to_log(err);
                    } else {
                        print_to_log("File saved: "+file_path);
                    }
                });
            }

        },
        "onDrain": function() {
            // This function executes when queue is empty
            print_to_log("No pages on queue... starting to wait for new active links");
            
            wait_new_links();
            //pushlinks.pushImdbActorLinks();
        }
    });
}


wait_new_links();
