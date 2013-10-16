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
    // console.log('Guardando actor: ' + info._id);
    console.log(info)
    
    // aux = new models.actorModel( info );

    aux = new model( info );
    
    aux.save(function(err){
        if (err) { console.log(err); }
        else { console.log('exito')}
    });
};

