var express = require('express');
var router = express.Router();
var https = require('https');

const RANDOM_URL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
const INDEX_URL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail';
const DETAIL_URL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';
const SERACH_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const INGREDIENT_URL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
const ALCOHOLIC_URL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic';
const NON_ALCHOHOLLIC_URL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';

// Index
router.get('/', function(req, res, next) {
  getURL(INDEX_URL).then(function onFulfilled(value){
    res.render('index', { 'res': value });
  }).catch(function onRejected(error){
    console.error(error);
  });
});


// Random
router.get('/random', function(req, res, next) {
    var id = req.query.id;
    getURL(RANDOM_URL).then(function onFulfilled(value){
      res.render('detail', { 'res': value[0] });
    }).catch(function onRejected(error){
      console.error(error);
    });
});

// Detail
router.get('/detail', function(req, res, next) {
  var id = req.query.id;
  getURL(DETAIL_URL + id).then(function onFulfilled(value){
    res.render('detail', { 'res': value[0] });
  }).catch(function onRejected(error){
    console.error(error);
  });
});

// Search
router.get('/search', function(req, res, next) {
  var keywords = req.query.keywords ? req.query.keywords : '';
  var type = req.query.type ? req.query.type : '';
  var url  = '';
  switch(type){
      case "1":
        url = SERACH_URL + keywords;
        break;
      case "2":
        url = INGREDIENT_URL + keywords;
        break;
      case "3":
        url = ALCOHOLIC_URL;
        break;
      case "4":
        url = NON_ALCHOHOLLIC_URL;
        break;
      default :
        url = INDEX_URL;
        break;
  }
  getURL(url).then(function onFulfilled(value){
    if(!value) {
      getURL(INDEX_URL).then(function onFulfilled(value){
         return res.render('index', { 'res': value,'messages': 'No Result', 'keywords': keywords });
      });
    }else{
      res.render('index', { 'res': value, 'keywords': keywords });
    }
  }).catch(function onRejected(error){
    console.error(error);
  });
});

// 非同期処理　使用禁止
function api(callback) {
  https.get(RANDOM_URL, function(res){
      var body = '';
      res.setEncoding('utf8');

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(res){
          console.log(body);
          ret = JSON.parse(body);
          callback(ret.drinks);
      });
  }).on('error', function(e){
      console.log(e.message);
  });
}

// 同期処理
function getURL(url) {
    return new Promise(function (resolve, reject) {
      https.get(url, function(res) {
        if (res.statusCode === 200) {
          var body = '';
          var ret = '';
          res.setEncoding('utf8');
          res.on('data', function(chunk) {
            body += chunk;
          });
          res.on('end', function(res){
            if(body){
              ret = JSON.parse(body);
            }
              resolve(ret.drinks);
          });
        } else {
          reject(new Error(res.statusCode));
        }
      }).on('error', function(e) {
        reject(new Error(e.message));
      });
    })
  }

module.exports = router;
