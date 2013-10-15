var mongoose = require('mongoose');
var models = require('./models');


mongoose.connect('mongodb://localhost/tvdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports.storeInLocalDB = function(links, username, password, address) {
    // console.log(links);
    console.log('Guardando links');
};

module.exports.storeInMongo = function(info, username, password, address) {
    console.log('Guardando info');
    
    // aux = new actorModel({
    //     first_name: info.first_name,
    //     last_name: info.last_name,
    //     score: info.score,
    //     high_score: info.high_score,
    //     low_score: info.low_score,
    //     // bio: info.bio,
    //     picture: info.pic,
    //     birth_date: info.birth_date,
    //     birth_place: info.birth_place, 
    // });
    
    aux = new models.actorModel( info );
    aux.save(function(err){
        if (err) { console.log(err); }
        else { console.log('exito')}
    });
};

