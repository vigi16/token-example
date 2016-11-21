

var express = require('express');
var server = express();
var api = require('./api');
var database = require('./database');
var bodyParser = require('body-parser');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended:true }));

server.use('/', express.static('./public'));

server.listen(3050, function () {

    console.log('Server listening on port 3050');
    
    database.connect(function () {         

        require('./models/user');          
        api.initRoutes(server);
    });

});