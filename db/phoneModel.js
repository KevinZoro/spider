var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var phoneSchema = new Schema({
	title: String,
	price: String,
	href : String,
	photo: [String],
	date: { type: Date, default: Date.now},
	status : Number, //0 - invalid ; 1 - valid
})

var Phone = mongoose.model('Phone',phoneSchema);

module.exports.Phone = Phone;