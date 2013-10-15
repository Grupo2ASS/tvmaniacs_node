var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/tvdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
Schema = mongoose.Schema;

Actor = new Schema({
    first_name: String, 
    last_name: String,
    score: Number,                  
    high_score: Number,             
    low_score: Number,              
    bio: String,    
    pic: String,                
    // birthdate: { type: Date },
    birth_date: String,
    birth_place: String,
    // series: [Schema.Types.ObjectId]
    // series: [String]
});

ActorModel = mongoose.model('Actor', Actor);

module.exports.storeInLocalDB = function(links, username, password, address) {
    // console.log(links);
    console.log('Guardando links');
};

module.exports.storeInMongo = function(info, username, password, address) {
    console.log('Guardando info');
    
    aux = new ActorModel({
        first_name: info.first_name,
        last_name: info.last_name,
        score: info.score,
        high_score: info.high_score,
        low_score: info.low_score,
        // bio: info.bio,
        picture: info.pic,
        birth_date: info.birth_date,
        birth_place: info.birth_place, 
    });

    aux.save(function(err){
        if (err) { console.log(err); }
        else { console.log('exito')}
    });
};

