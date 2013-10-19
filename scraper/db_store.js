var mongoose = require('mongoose');
var models = require('./models');


mongoose.connect('mongodb://localhost/tvdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports.storeInLocalDB = function(links, username, password, address) {
    // console.log(links);
    console.log('Guardando links');
};

module.exports.storeInMongo = function(info, username, password, address, model) {
    
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

