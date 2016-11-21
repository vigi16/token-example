var mongoose = require('mongoose');



    var token = req.headers.authorization;
    var User = mongoose.model('User');
    
    
    User.findOne({ 'tokens.token': token, 'tokens.expires':{ $gt : Date.now() }}, function (err, userDoc) {

        if(userDoc){
            req.user = userDoc;
            next();
        }else{
            res.status(401).send('You are not authorized');
        }

    });
};