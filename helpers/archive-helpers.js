var fs = require('fs');
var path = require('path');
var http = require('http');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

var paths = exports.paths;

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(paths.list, (err, data) => {
    if (err) { console.log(err); }
    if (data) { callback(data.toString().split('\n')); }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(array) {
    callback(array.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(paths.list, url + '\n', callback);
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(paths.archivedSites, (err, array) => {
    callback(array.includes(url));
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(url => {
    var theUrl = 'http://' + url;
    http.get(theUrl, res => { 
      var file = [];
      res.on('data', chunk => {
        file.push(chunk);
      }).on('end', () => {
        file = Buffer.concat(file).toString();
        // save the response we get
        fs.writeFile(paths.archivedSites + '/' + url, file, (err, data) => {
          if (err) { console.log('error: ', err); }
        });
      });
    });
  });
};



