
'use strict';

var request = require('request');
var debug = require('debug')('tool.logic');
var async = require('async');
var cheerio = require('cheerio');

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

var Tools = function (source){
	this.source = source;
	this.options = {
		headers:{
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.117 Safari/537.36'
		}
	};
}

Tools.prototype.getHrefByUrl = function (callback){
	var options = this.options;
	options.url = this.source;

	request.get(options,function (err,res,body){
		if(err){
			console.error(err);
			callback(err);
		}

		var $ = cheerio.load(body.toString());
		var titleList = [];
		var hrefList = [];
		var itemInfo = $('.gl-item .p-name a').each(function(){
			var me = $(this);
			var title = $(me).attr('title');
			var href  = $(me).attr('href');
			debug('title:%j',title);
			debug('href:%j',href);
			titleList.push(title);
			hrefList.push(href);
			
			phoneModel.create({
				title:title,
				href:href
			},function (err){
				if(err){
					return callback(err);
				}
			})
		})

		callback(null,titleList,hrefList);

	})
}

Tools.prototype.getInfoByRef = function (url,callback){
	var options = this.options;
	options.url = url;
	request.get(options,function (err,res,body){
		if(err){
			console.error(err);
			callback(err);
		}

		if(body){
			var $ = cheerio.load(body.toString());
		}else{
			callback("no body data");
		}
		

		async.waterfall([
			function (next){
				var photoList = [];
				$('.spec-items').find('img').each(function (){
					var $me = $(this);
					if($me){
						var imgSrc = $me.attr('src');
						//debug("imgSrc:%j",imgSrc);
						photoList.push(imgSrc);
					}
				});
				debug(photoList);
				next(null,photoList);
			},

			function (photoList,next){
				phoneModel.update({href:url},{photo: photoList},{multi:true},function (err,row){
					if(err){
						console.error(err);
						next(err);
					}else{
						debug("response from mongo was ",row);
						next(null,row);
					}
				})
			}
			],callback);	

	})
}

/*
tool.getHrefByUrl("http://list.jd.com/list.html?cat=9987,653,655",function (err,results){
	if(err){
		console.error(error);
	}
});*/
/*
tool.getInfoByRef('http://item.jd.com/1731757.html',function (err){
	if(err){
		console.error(err);
	}
})*/

module.exports = Tools;