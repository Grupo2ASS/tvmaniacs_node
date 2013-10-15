var mongoose = require('mongoose');

// En este modulo se definen todas las tablas de nuestro modelo en mongo

Schema = mongoose.Schema;

actor = new Schema({
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


module.exports.actorModel = mongoose.model('actor', actor);