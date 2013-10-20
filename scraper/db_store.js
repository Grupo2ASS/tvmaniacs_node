var mongoose = require('mongoose');
var models = require('./models');
var config = require('../config/config.json');

var sqlite3 = require("sqlite3").verbose();
var links_db = new sqlite3.Database(config["db_file"]);

// links_db.run("CREATE TABLE links (url TEXT), (site TEXT), (type TEXT), (last_visited datetime)");

mongoose.connect('mongodb://localhost/tvdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports.storeInLocalDB = function(links, username, password, address) {
    // console.log(links);
    // console.log("Guardando los siguientes links: ");

    //Solo si no se encuentra el link se agrega. 
    var insert = links_db.prepare( "INSERT INTO links VALUES (?,?,?,?)" );

    for( var i = 0; i < links.length; i++){
      insert.run( links[i].url.substring(0,a.indexOf('&ref')), links[i].site.toLowerCase(), links[i].type, date('now', (-(config["revisit_days"] + 1)).toString() + ' days'));
    }

    insert.finalize();


    //Para testear que este guardando.
    // links_db.each("SELECT url, site, type, last_visited as lv FROM links", function(err, row) {
    //     console.log(row.url + ", " + row.site + ", " + row.type + ", " + row.lv);
    // });
};

module.exports.storeInMongo = function(info, username, password, address, model) {
    

    //En el caso de que sea un episodio lo que se este guardando se debe buscar
    //la serie y la temporada a la que corresponde y embedirlo dentro de ella.

    if ( model == models.chapterModel ){    	
    	console.log('Saving episode %s from %s', info.name, info.serie );

    	models.serieModel.findOne( { 'name': info.serie }, 'name seasons', function( err, serie){
    		if (err) return handleError(err);

  			var num = info.season - 1;
  			delete info.season;
  			aux = new model ( info );

  			serie.seasons[ num ].chapters.push( aux );

  			serie.save( function(err){
  				if (err) { console.log(err); }
	        	else { console.log('exito')}
  			});
    	});
    }

    else {
    	console.log('Guardando info')
    	aux = new model( info );
    
	    aux.save(function(err){
	        if (err) { console.log(err); }
	        else { console.log('exito')}
	    });	
    }
};

