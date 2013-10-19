var mongoose = require('mongoose');

// En este modulo se definen todas las tablas de nuestro modelo en mongo

Schema = mongoose.Schema;

actor = new Schema({
	imdb_id: Number,
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
    series: [Number]
});

review = new Schema({
	score: Number,
	name: String,
	institution: String,
	comment: String,
	date: String,
	link: String,
	critic: Boolean				//True si la review es de un critico. False si es de una persona corriente
});

chapter = new Schema({
	name: String,
	description: String,
	rating: Number
});


season = new Schema({
	number: Number,
	// date: String,
	chapters: [chapter],
	reviews: [review]
});


serie = new Schema({
	imdb_id: Number, 
	name: String,
	user_rating: Number,
	metascore: Number,
	description: String,
	length: Number,
	genre: [String],
	pic: String,
	year_start: Number,
	year_end: Number,
	cast: [Number],
	seasons: [season]
});


module.exports.actorModel = mongoose.model('actor', actor);
module.exports.reviewModel = mongoose.model('review', review);
module.exports.chapterModel = mongoose.model('chapter', chapter);
module.exports.seasonModel = mongoose.model('season', season);
module.exports.serieModel = mongoose.model('serie', serie);