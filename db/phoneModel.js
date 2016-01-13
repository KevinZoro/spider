var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var phoneSchema = new Schema({
	title: String,
	price: Number,
	href : String,
	photo: {filepath: String, url: String},
	date: { type: Date, default: Date.now},
	status : Number, //0 - invalid ; 1 - valid
})

var Phone = mongoose.model('Phone',phoneSchema);

module.exports.Phone = Phone;