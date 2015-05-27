var http = require('http');
var static = require('node-static');

var Items = function(){
  this.items = [];
  this.id = 0;
};

Items.prototype.add = function(name){
  var item = {name: name, id: this.id};
  this.items.push(item);
  this.id += 1;
}

var items = new Items();
items.add('Broad beans');
items.add('Tomatoes');
items.add('Peppers');

var fileServer = new static.Server('./public');

var server = http.createServer(function(req,res){
  if(req.method === 'GET' && req.url === '/items'){
    var responseData = JSON.stringify(items.items);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(responseData);
  }
  else if (req.method === 'POST' && req.url === '/items'){
    var item = '';
    req.on('data', function(chunk){
      item += chunk;
    });
    req.on('end', function(){
      try{
        item = JSON.parse(item);
        items.add(item.name);
        res.statusCode = 201;
        res.end();
      }
      catch(e){
        res.statusCode = 400;
        responseData = {'message': 'Invalid JSON'};
        res.end(JSON.stringify(responseData));
      }
    });
  } else if(req.method === 'DELETE' && req.url.split('/').length > 2){
    var id = req.url.split('/')[2];
    console.log("ID of item to delete: " + id);
    for(var index = 0; index<items.items.length; index++){
      if(items.items[index]['id'] == id){
        console.log("Found");
        var deletedItem = items.items.splice(index, 1);
        res.statusCode = 201;
        res.end(JSON.stringify(responseData));
      }
    }
  } else if(req.method === 'PUT' && req.url.split('/').length > 2){

    var id = req.url.split('/')[2];
    var item = '';
    var found = false;
    req.on('data', function(chunk){
      item += chunk;
    });
    req.on('end', function(){
      try{
        item = JSON.parse(item);
      } catch(e){
        res.statusCode = 400;
        responseData = {'message': 'Invalid JSON'};
        res.end(JSON.stringify(responseData));
      }
        for(var index=0; index<items.items.length; index++){
          if(items.items[index]['id'] == id){
            console.log("Found");
            items.items[index]['name'] = item.name;
            res.statusCode = 201;
            responseData = JSON.stringify(items.items[index]);
            res.end(responseData);
            found = true;
          }
        }
        if(!found){
          console.log("Not found. Creating item...");
          items.add(item.name);
          res.statusCode = 201;
          res.end();
      }
    });
  }
   else{
    console.log('Serving something else');
    fileServer.serve(req, res);
  }
});

server.listen(8080, function(){
  console.log("listening on localhost:8080");
});
