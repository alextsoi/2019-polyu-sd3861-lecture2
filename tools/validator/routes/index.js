var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var config = require('../config');

function checkRepo(githubId, callback){
  let url = config.githubRawPrefix + githubId + config.githubSuffix;
  let result = {};
  result.githubUrl = config.githubPrefix + githubId;
  result.githubId = githubId;
  result.repoReadMe = url + '/master/README.md';
  let p = new Promise(function(resolve, reject){
    console.log('Checking ' + result.repoReadMe);
    request({
      url: url + '/master/README.md'
    }, function(error, response, body){
      if(!error){
        if(response.statusCode == 200){
          if(body === 'Lecture 2'){
            result.repoReadMeResult = true;
            result.repoReadMeBody = body;
            result.repoReadMeCode = response.statusCode;
          }else{
            result.repoReadMeResult = false;
            result.repoReadMeBody = body;
            result.repoReadMeCode = response.statusCode;
          }
        }else{
          result.repoReadMeResult = false;
          result.repoReadMeBody = null;
          result.repoReadMeCode = response.statusCode;
        }
      }else{
        result.repoReadMeResult = false;
        result.repoReadMeBody = null;
        result.repoReadMeCode = 'N.A';
      }
      resolve();
    });
  });
  p.then(function(){
    return new Promise(function(resolve, reject){
      result.repoLecture2 = url + '/master/lecture2.md';
      console.log('Checking ' + result.repoLecture2);
      request({
        url: result.repoLecture2
      }, function(error, response, body){
        if(!error){
          if(response.statusCode == 200){
            result.repoLecture2Result = true;
            result.repoLecture2repoBody = body;
            result.repoLecture2repoCode = response.statusCode;
          }else{
            result.repoLecture2Result = false;
            result.repoLecture2repoBody = null;
            result.repoLecture2repoCode = response.statusCode;
          }
        }else{
          result.repoLecture2Result = false;
          result.repoLecture2repoBody = null;
          result.repoLecture2repoCode = 'N.A';
        }
        resolve();
      });
    });
  }).then(function(){
    callback(null, result);
  }).catch(function(e){
    callback(null, result);
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let result = [];
  if(typeof config.githubIds !== 'undefined'){
    async.mapLimit(config.githubIds, 3, checkRepo, function(err, results){
      console.log(results);
      res.render('index', {
        results: results,
        title: 'Validator'
      });
    });
  }else{
    res.render('index', {
      results: result,
      title: 'Validator'
    });
  }
});

module.exports = router;
