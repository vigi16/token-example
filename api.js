

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var guid = require('guid');
var middlewares = require('./middlewares');

exports.initRoutes = function (server) {
    
    console.log('API Routes Setup');

  
   
    server.post('/api/login', function (req, res) {

        var data = req.body;

        var email = data.email;
        var password = data.password;

        if(email === undefined){
            return res.status(400).send('No email provided');
        }
        if(password === undefined){
            return res.status(400).send('No password provided');
        }

        var User = mongoose.model('User');

        User.findOne({ email:email }, function(err, userDoc) {                
            if(userDoc) {

                bcrypt.compare(password, userDoc.password, function (err, result) {   
                    if (result) {

                        var token = guid.raw();                                 
                        userDoc.tokens.push({ token:token});                    
                        userDoc.save(function (err) {

                            if(!err) {
                                res.send({
                                    token: token                                         
                                });
                            }else{
                                res.status(400).send(err);
                            }

                        });                                                

                    } else {
                        res.status(400).send('Email or password is wrong');
                    }
                });

            }else{

                res.status(400).send('Email or password is wrong');
            }
        });

    });

    server.post('/api/user', function (req, res) {

        var data = req.body;    

        var email = data.email;
        var password = data.password;

        //kako preverimo ce uporabnik obstaja/validacija?

        if(email === undefined){
            return res.status(400).send('No email provided');
        }
        if(password === undefined){
            return res.status(400).send('No password provided');
        }

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {    
                var User = mongoose.model('User');

                var user = new User ({ email:email, password:hash });  

                user.save(function (err) {

                    if(!err){
                        res.send(user);
                    }else{
                        console.log(err);
                        res.status(400).send(err);
                    }

                });

            });
        });
    });

};

