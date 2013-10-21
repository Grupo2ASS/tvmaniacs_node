var fs = require('fs');

module.exports.print_to_log = function(str){
	
	console.log(str);
	str = "["+(new Date())+"]: "+str+"\n";
	fs.appendFile('scraper_log.txt', str, function (err) {
		if (err) throw err;
	});
};

