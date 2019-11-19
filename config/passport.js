var passport = require('passport');
var User = require("../models/user");
var localStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null,user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    })    
});

passport.use('local-signup', new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, function(req, email, password, done){
    req.checkBody('email', 'Invlid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invlid password').notEmpty().isLength({min: 4 });
    var errors = req.validationErrors();
    if(errors){
        //console.log(errors);
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        console.log(messages);
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email' : email}, function(err, user){
        if(err){
            console.log('err');
            return done(err);
        }        
        console.log("2" + JSON.stringify(user));
        if(user) {
            return done(null, false, {message : 'Email is already in use.'});
        }
        
        console.log("3");
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){            
            console.log("4");
            if(err){
                console.log('err');
                return done(err);
            }
            console.log("5");
            return done(null, newUser);
        });
    });
}));

passport.use('local-signin', new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, function(req, email, password, done){
    req.checkBody('email', 'Invlid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invlid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        //console.log(errors);
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        console.log(messages);
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email' : email}, function(err, user){
        
        console.log(err);
        console.log(user);
        if(err){
            return done(err);
        }        
        if(!user) {
            return done(null, false, {message : 'No user found.'});
        }
        if(!user.validPassword(password)) {
            return done(null, false, {message : 'Wrong password.'});
        }
        console.log("user");
        return done(null, user);
    });
}));