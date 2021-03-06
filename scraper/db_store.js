var mongoose = require('mongoose');
var http = require('http');
var models = require('./models');
var config = require('../config/config.json');

var utils = require('./utils.js');
var fs = require('fs');


// links_db.run("CREATE TABLE links (url TEXT), (site TEXT), (type TEXT), (last_visited datetime)");

var sendPicLinkToMediaServer = function(info) {
	var pic = info['pic'];
	http.get("http://arqui12.ing.puc.cl/receiver?image_url=" + pic, function(res) {
		console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
  		console.log("Got error: " + e.message);
	});
};

mongoose.connect('mongodb://localhost/tvdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports.storeInLocalDB = function(links, local_access) {
    var username = local_access["username"];
    var password = local_access["password"];
    var address = local_access["address"];
    //Solo si no se encuentra el link se agrega. 

    // Obtengo la conexión a la base de datos desde utils
    var links_db = utils.links_db;
    links_db.serialize(function(){

        var insert = links_db.prepare( "INSERT INTO links VALUES (?,?,?,?)" );

        var old_date = new Date();
        old_date.setDate( old_date.getDate() - config["revisit_days"] );
        var old_date_str =  old_date.getFullYear() + "-";
        if(old_date.getMonth() + 1 < 10) {
            old_date_str += "0" + (old_date.getMonth() + 1) + "-";
        }
        else {
            old_date_str += (old_date.getMonth() + 1) + "-";
        }

        if(old_date.getDate() < 10) {
            old_date_str += "0" + old_date.getDate();
        }
        else {
            old_date_str += old_date.getDate();
        }

        for( var i = 0; i < links.length; i++){
            if( links[i].url ){
                var index_ref = (links[i].url.indexOf('&ref') == -1) ? links[i].length : links[i].url.indexOf('&ref');
                index_ref = (links[i].url.indexOf('?ref') == -1) ? index_ref : links[i].url.indexOf('?ref');
                
                insert.run(
                          "http://"+links[i].url.substring(0,index_ref),
                          links[i].site.toLowerCase(),
                          links[i].type,
                          old_date_str
                        );               
            }
        }

        insert.finalize();
    });
    //Para testear que este guardando.
    // links_db.each("SELECT url, site, type, last_visited as lv FROM links", function(err, row) {
    //     console.log(row.url + ", " + row.site + ", " + row.type + ", " + row.lv);
    // });
};

// No se esta usando. Era para intentar una acción en la BD hasta que funcionara, atrapando los errores
function runOnDatabase( accion ){
    var done = false
    while( !done ){
        try{
            accion;
            saved = true;
        }
        catch(err){
            utils.print_to_log( 'Catched error: ' + err.stack );
            saved = false;
        }
    }
};

module.exports.storeInMongo = function(info, mongo_access, model) {
    var username = mongo_access["username"];
    var password = mongo_access["password"];
    var address = mongo_access["address"];

    //Replace pic link immediately	
	if (info['pic']!= undefined){
		sendPicLinkToMediaServer(info);
		info['pic'] = info['pic'].replace('ia.media-imdb.com', 'arqui12.ing.puc.cl');
	}

    //En el caso de que sea un episodio lo que se este guardando se debe buscar
    //la serie y la temporada a la que corresponde y embedirlo dentro de ella.

    if ( model == models.chapterModel ){    

        log = 'Saving episode ' + info.name + ' from ' + info.series;	
    	utils.print_to_log( log );

    	models.serieModel.findOne( { 'name': info.series }, 'name seasons', function( err, series){
    		if (err) return handleError(err);
            if( !series ) {console.log('error capitulo sin serie'); return; }

  			var num = info.season - 1;
  			delete info.season;
  			aux = new model ( info );

            if( !series.seasons[num] ) {console.log('error capitulo sin temporada'); return; }
            
  			series.seasons[ num ].chapters.push( aux );

  			series.save( function(err){
  				if (err) { utils.print_to_log(err); }
	        	else { utils.print_to_log('exito episode')}
  			});
    	});
    }
    else if ( model == models.reviewModel ){
        //FALTA REVISAR QUE ESTE CASO FUNCIONE BIEN


       // log = 'Saving review from ' + info.name + ' about ' + info.series;
        log = info;
        //info es un arreglo de objetos, hay que recorrerlo y guardar cada uno.
        utils.print_to_log( log );

        models.serieModel.findOne( { 'series': info.series }, 'name seasons', function( err, series){
            if (err) return handleError(err);
            if( !series ) {console.log('error review sin serie'); return; }

            var num = info.season - 1;
            delete info.season;
            aux = new model ( info );

            if( !series.seasons[num] ) {console.log('error review sin temporada'); return; }

            series.seasons[ num ].reviews.push( aux );

            series.save( function(err){
                if (err) { utils.print_to_log(err); }
                else { utils.print_to_log('exito review')}
            });
        });
    }
    else if( model == models.actorModel){
        //busca si existe un documento con el mismo s_name
       models.actorModel.findOneAndUpdate({s_name: info.s_name}, { $set: info}, function(err, actor) {
            if(err){
                return console.error(err);
                utils.print_to_log(err);
            }
            //si no existe, se crea un documento nuevo con los datos
            else if(actor == null){
                    aux = new model( info );
                    aux.save(function(err){
                        if (err) { utils.print_to_log(err); }
                        else { utils.print_to_log('exito nuevo '+ model.modelName + '  --  ' + info.s_name);}
                    });
            }
            //si existe, se hace el update guardando los datos nuevos
            else
                utils.print_to_log('update exitoso ' + actor.s_name);

       });
    }
    else if( model == models.serieModel){
        //busca si existe un documento con el mismo s_name
        models.serieModel.findOneAndUpdate({s_name: info.s_name}, { $set: info}, function(err, series) {
            if(err)
                return console.error(err);
            //si no existe, se crea un documento nuevo con los datos
            else if(series == null){
                    aux = new model( info );
                    aux.save(function(err){
                        if (err) { utils.print_to_log(err); }
                        else { utils.print_to_log('exito nuevo '+ model.modelName + '  --  ' + info.s_name);}
                    });
            }
            //si existe, se hace el update guardando los datos nuevos
            else
                utils.print_to_log('update exitoso ' + series.s_name);

        });
    }
    else {
    	aux = new model( info );
	    aux.save(function(err){
	        if (err) { utils.print_to_log(err); }
	        else { utils.print_to_log('exito '+ model.modelName);}
	   });	
    }
};

