var Cake = require("../models/cake");
var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/cakes", { useNewUrlParser: true }, function(e){
  console.log('You are now connected to mongodb...');
});

var cakes = [ 
    new Cake( {
        imagePath:'https://i9.fnp.com/images/pr/l/v20190423143901/fresh-butterscotch-cake-half-kg_1.jpg',
        title : 'Cake',
        description : 'A Casual Cream Cake With Egg',
        price : 500
    }),
    new Cake( {
        imagePath : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiVpHBb3AjRuzkeudPXVViJLZ19oz5VkcavviHb-_tCMMYabD8DA&s',
        title : 'Plain Cake',
        description : 'Plain Cake With Egg',
        price : 430
    }),
    new Cake( {
        imagePath : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoXTmfLH6F2TzhjilS7OLmV7fCNpFf1j9jOoxWpILNd4nmXFIP&s',
        title : 'Eggless Cake',
        description : 'Eggless Cake With Honey',
        price : 470
    }),
    new Cake( {
        imagePath : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWzpRw1b_X9inbAApzOYVT0yd3yYBfdJ0gO2yN-pHE5i9hvKnC&s',
        title : 'Plain Eggless Cake',
        description : 'Plain Cake Without Egg',
        price : 320
    }),
    new Cake( {
        imagePath : 'https://cdn.igp.com/f_auto,q_auto,t_prodth/products/p-chocolate-cake-with-chocolate-cream-topping-2-kg--6133-m.jpg',
        title : 'Chocolate Cake',
        description : 'Chocolate Cake With Cream',
        price : 690
    }),
    new Cake( {
        imagePath : 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2012/12/20/2/FNM_010113-Chocolate-Cake-Recipes_s4x3.jpg',
        title : 'Plain Chocolate Cake',
        description : 'Basic Chocolate Cake Without Cream',
        price : 500
    })
];
var done = 0;
for (var i = 0 ; i < cakes.length; i++) {
    cakes[i].save(function(err, res){ 
        done++;
        if(done === cakes.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}