var Tools = require('../lib/tool');
var should = require('should');
var debug = require('debug')('tool.test');
var DB = require('../db/connectDB');
var db = new DB();

var phone = require('../db/phoneModel').Phone;
var testUrl = "http://list.jd.com/list.html?cat=9987,653,655";

var tool = new Tools();

describe('getInfo test',function (){
	/*after(function (done){
		db.dropCollection('phones',function (err,results){
			if(err){
				console.error(err);
				done(err);
			}else{
				debug(results);
				done();
			}
		});
	})*/

	it('save info test',function (done){

		tool.saveInfo(testUrl,function (err,results){
			if(err){
				console.error(err);
				done(err);
			}else{
				phone.count({},function (err,count){
					if(err){
						console.error(err);
						done(err);
					}else{
						debug(count);
						count.should.not.equal(0);
						done();
					}
				})
			}
		})
	})
})
