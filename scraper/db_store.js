(function() {
	
	var storeInLocalDB = function(links, username, password, address){
        console.log(links);
	};

	var storeInMongo = function(info, username, password, address){
        console.log(info);
	}; 


    module.exports.storeInLocalDB = function(links, username, password, address) {
        return storeInLocalDB(links, username, password, address);
    };
    module.exports.storeInMongo = function(info, username, password, address) {
        return storeInMongo(info, username, password, address);
    };

}());