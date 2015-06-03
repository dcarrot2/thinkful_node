var static = require('node-static');
var http = require('http');
var https = require('https');
var events = require('events');
var querystring = require('querystring');

var getFromApi = function(endpoint, args) {
    var emitter = new events.EventEmitter();
    var options = {
        host: 'api.spotify.com',
        path: '/v1/' + endpoint + '?' + querystring.stringify(args)
    };
    var item = '';
    var searchReq = https.get(options, function(response) {
        response.on('data', function(chunk) {
            item += chunk;
        });
        response.on('end', function() {
            item = JSON.parse(item);
            console.log(item);
            emitter.emit('end', item);
        });
        response.on('error', function() {
            emitter.emit('error');
        });
    });
    return emitter;
};

var fileServer = new static.Server('./public');
var server = http.createServer(function(req, res) {
    var artist;

    var onSearchEnd = function(item) {
    	console.log('ID: ' + item.artists.items[0]['id']);

        artist = item.artists.items[0];
        res.end(JSON.stringify(artist));
    };

    var onError = function() {
        res.statusCode = 404;
        res.end();
    };

    res.setHeader('Content-Type', 'application/json');
    if (req.method == "GET" && req.url.indexOf('/search/') == 0) {
        var name = req.url.split('/')[2];
        var searchReq = getFromApi('search', {
            q: name,
            limit: 1,
            type: 'artist'
        });
        searchReq.on('end', onSearchEnd);
        searchReq.on('error', onError);
    }
    else {
        fileServer.serve(req, res);
    }
});

server.listen(8080);