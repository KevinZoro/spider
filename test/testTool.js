var Tools = require('../lib/tool');
var should = require('should');
var debug = require('debug')('tool.test');
var DB = require('../db/connectDB');
var db = new DB();
var phone = require('../db/phoneModel').Phone;

var tool = new Tools("http://list.jd.com/list.html?cat=9987,653,655");

describe('getHrefByUrl test',function (){
	after(function (done){
		db.dropCollection('phones',function (err,results){
			if(err){
				console.error(err);
				done(err);
			}else{
				debug(results);
				done();
			}
		});
	})

	it('mongoose should have data',function (done){
		tool.getHrefByUrl(function (err,data1,data2){
			if(err){
				done(err);
			}else{
				data1.length.should.equal(data2.length);
				data2.length.should.not.equal(0);
				phone.find(function (err,result){
					if(err){
						done(err);
					}else{
						debug("result:%j",result);
						result.length.should.not.equal(0);
						done();
					}
				})		
			}
		})
	})
})
