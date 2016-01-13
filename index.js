/* Desc: index
 * Author: Kevin Zhang
 * Date: 2016-1-13
 */

'use strict';

var Tool = require('./lib/tool');
var async = require('async');
var debug = require('debug')('run.logic');

function run(){
	var sourceUrl = "http://list.jd.com/list.html?cat=9987,653,655";
	var tool = new Tool(sourceUrl);

	async.waterfall([
		function (next){
			tool.getHrefByUrl(function (err,titleList,hrefList){
				if(err){
					next(err);
				}else{
					next(null,hrefList);
				}
			});
		},

		function (hrefList,next){
			async.each(hrefList,function (item,callback){
				tool.getInfoByRef(item,next);
			},function (err){
				next(err);
			})
		}],

		function (err,results){
			if(err){
				console.error(err);
			}else{
				debug(results);
			}
		})
}

run();