/* Desc: mongodb connection
 * Author: KevinZoro
 * Date: 2016.1.12
 */

var mongoose = require('mongoose');
var debug = require('debug')('connect.db');

function DB(){
 	this.db = this;
}

DB.prototype.connect = function (callback){
	mongoose.connect('mongodb://localhost/pra_mongo');
 	var db = mongoose.connection;
 	db.on('error', function (err){
 		if(err){
 			console.error(err);
 			callback(err);
 		}
 	});;
 	db.once('open',function (){
 		debug("mongodb connecting success!");
 		callback();
 	})
}

DB.prototype.dropCollection = function (collectionName,callback){
	mongoose.connection.db.dropCollection(collectionName,function (err,result){
		if(err){
			console.error(err);
			callback(err);
		}else{
			debug("drop collection:%j success!",collectionName);
			callback(null,collectionName);
		}
	})
}

module.exports = DB;