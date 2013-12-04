var fs = require('fs');
var cheerio = require('cheerio');
var config = require('../config/config.json');
var sqlite3 = require("sqlite3").verbose();

module.exports.links_db = new sqlite3.Database(config["db_file"]);

module.exports.print_to_log = function(str){
	
	console.log(str);
	str = "["+(new Date())+"]: "+str+"\n";
	fs.appendFile('scraper_log.txt', str, function (err) {
		if (err) throw err;
	});
};


// Retorna true si la página es un error 404 de metacritic
module.exports.check_404 = function( html ){

	var $ = cheerio.load(html);
	var error = $('.error_code').html();

	if( error != undefined )
		return true;
	else
		return false;
}

