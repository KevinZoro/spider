
'use strict';

var request = require('request');
var debug = require('debug')('tool.logic');
var async = require('async');
var cheerio = require('cheerio');
var phantom = require('phantom');
var URL = require('url');

var DB = require('../db/connectDB');
var phoneModel = require('../db/phoneModel').Phone;

var db = new DB();
db.connect(function (err,result){
	if(err){
		console.error(err);
	}else{
		debug("connecting...")
	}
});

var Tools = function (){
	//this.source = source;
	this.options = {
		headers:{
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.117 Safari/537.36'
		}
	};
	this.headUrl = "http://list.jd.com/";
}

Tools.prototype.renderImage = function (url,name,width,height,callback){
	phantom.create(function (ph){
		ph.viewportSize = {width: (width ? width: 1920),height:(height ? height : 1080)};
		ph.createPage( function (page){
			page.open(url,function (status){
				setTimeout( function (){
					page.render(name+'.jpeg',{
						format:'jpeg',
						quality: '100'
					});
					ph.exit();
					callback("done")
				},5000);
			})
		})
	})

}

var __getNextPage = function (url,callback){
	if(!url || url.length === 0){
		callback(null,'done');
		process.exit();
	}
	var urlObj = URL.parse(url);
	var headUrl = urlObj.protocol+'//'+urlObj.hostname;
	__getPageBody(url,function (body){
		__getPageInfo(body,function (err){
			if(err){
				console.error(err);
			}
		});
		var $ = cheerio.load(body.toString());
		//find class pn-next
		var nextUrl = $('.p-num').find('.pn-next').attr('href');
		if(!nextUrl){
			callback(null,'done');
			return;
			//return process.exit();
		}
		nextUrl = URL.resolve(headUrl.toString(),nextUrl);
		debug(nextUrl);

		__getNextPage(nextUrl,callback);
	})
/*
	request.get(options,function (err,res,body){
		if(err){
			console.error(err);
			callback(err);
		}

		var $ = cheerio.load(body.toString());
		var pageNumber = $('#J_bottomPage .p-num .pn-next').attr();
		callback(null,pageNumber);
		

	})
*/

};


var __getPageBody = function (url,callback){
	phantom.create( function (ph){
		ph.createPage( function (page){
			page.open(url, function (status){
				page.evaluate( function (){
					var text = document.body.innerHTML;
					return text;
				},function (result){
					ph.exit();
					callback(result);
				});
			})
		})
	})
};

var __getPageInfo = function (body,callback){
	var $ = cheerio.load(body.toString());
	debug($);
	$('.gl-item').each(function (){
		var member = {};
		var item = $(this);
		member.name = $(item).find('.p-name').find('a').attr('title');
		member.href = $(item).find('.p-name').find('a').attr('href');
		member.price = $(item).find('.J_price').text();
		debug("member:%j",member);
		phoneModel.create({
			title:member.name,
			href:member.href,
			price:member.price
		},function (err,result){
			if(err){
				console.error("save data failed:"+err);
				callback(err);
				return
			}else{
				debug("save data!");
			}
		});
	});
	callback();
};

Tools.prototype.saveInfo = function (url,callback){
	__getNextPage(url,callback);
}

Tools.prototype.savePageInfo = function (url,callback){
	var options = this.options;
	options.url = url;
	__getPageInfo(url,callback);
}

module.exports = Tools;