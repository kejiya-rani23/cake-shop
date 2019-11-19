var express = require('express');
var router = express.Router();
var Cake = require("../models/cake");
var Cart = require('../models/cart');
var Order = require("../models/order");

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  var cakes = Cake.find(function(err, docs){
    var cakeChunks = [];
    var chunkSize = 3;
    for(var i =0;i < docs.length;i += chunkSize)
    {
      cakeChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Cake Shop', cakes : cakeChunks, successMsg: successMsg, noMessages: !successMsg });
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var cakeId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Cake.findById(cakeId, function(err, cake){
    if(err){
      return res.redirect('/');
    }
    cart.add(cake, cake.id);
    req.session.cart = cart;
  //  console.log(cart);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next) {
  var cakeId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(cakeId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
  var cakeId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(cakeId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {cakes : null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {cakes: cart.generateArray(), totalPrice : cart.totalPrice})
});

router.get('/checkout', isLoggedIn,  function(req, res, next) {
  if(!req.session.cart){
    return res.render('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total : cart.totalPrice, errMsg : errMsg, noErrors: !errMsg})
});

router.post('/checkout', isLoggedIn,  function(req, res, next)
{
  //alert('submit');
  if(!req.session.cart){
    return res.render('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")("sk_test_p0g4d8beXuWumV1XoEi3ApBB");
  //alert(req.body.stripeToken);
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken , // obtained with Stripe.js
    description: "Test Charge"
  }, function(err, charge) {
    // asynchronously called
    if(err){
      req.flash('error',err.message);
      return res.redirect('/checkout');      
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result){
      req.flash('success','Successfully bought cake.');
      req.session.cart = null;
      res.redirect('/');
    });    
  });
});
module.exports = router;
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  req.session.oldUrl = req.url; 
  res.redirect("/user/signin");
}
