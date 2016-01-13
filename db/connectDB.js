/* Desc: mongodb connection
 * Author: KevinZoro
 * Date: 2016.1.12
 */

var mongoose = require('mongoose');
var debug = require('debug')('connect.db');

function connectDB(){
 	mongoose.connect('mongodb://localhost/pra_mongo');
 	var db = mongoose.connection;
 	db.on('error', console.error.bind(console,' connection error:'));
 	db.once('open',function (){
 		debug("mongodb connecting success!");
 	})
}

module.exports.connectDB = connectDB;