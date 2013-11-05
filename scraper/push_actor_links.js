var sqlite3 = require("sqlite3").verbose();
var dbStore = require('./db_store');
var config = require('../config/config.json'); //Load config values

//function that enqueues IMDB actors when all the links are already visited
module.exports.pushImdbActorLinks function() {
	//start with link starting in http://www.imdb.com/name/nm0000001/
	var db = new sqlite3.Database(config["db_file"]);
	db.serialize(function() {
        // Get all actor_links rows in db
        var id_lookup = 1;
        var num_links = 10;
        var links = new Array(); 
        var actor_query = "SELECT url FROM links WHERE site ='IMDB' AND type ='actor' ORDER BY url";
        db.each(actor_query, 
        		function(err, row) {
        			//Agrega 10
        			if( num_links > 0 ){
        					var id_url = parseInt(row.url.match(pattern));
        					while(id_lookup < id_url && num_links > 0){
        						//Format link
        						var new_link = "http://www.imdb.com/name/nm" + pad(id_lookup,7) +"/";
        						//Add link
        						links.push(new_link);
        						num_links--;
        						id_lookup++;
        					}        			
        		}      
        );
        dbStore.storeInLocalDB(links, config["access"]["Local"]);
                
    });
}
//formatear un nro para que quede de forma 0000000
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

