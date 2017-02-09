/**
 * Created by nicksempere on 1/15/17.
 */
var express = require('express');
var pizzapi = require('dominos');
var orderData = require("../order.json");
var router = express.Router();

var me = new pizzapi.Customer(orderData.order.customer);

/*
 * Look up nearest stores, pick the closest one, and create an order with that store's ID. All other order
 * information is stored in order.json. Modify it there if you want to change anything.
 *
 * Once the order is created, add the items in order.json, price the order, and then send it!
 */
router.get('/dominos/za', function(req, res, next){
    pizzapi.Util.findNearbyStores(
        orderData.order.customer.address,
        'Delivery',
        function(storeData){
            var newOrder = new pizzapi.Order({
                customer: me,
                storeID: storeData.result.Stores[0].StoreID, //Stores are sorted by distance.
                deliveryMethod: "Delivery"
            });

            newOrder.addItem(new pizzapi.Item(orderData.items [0]));
            newOrder.validate(function(){
                console.log("Validated");
                newOrder.price(function(result) {
                    console.log("Priced");
                    res.send(newOrder);
                });
            });

        });
});


/*
 * GET route for the dominos menu items. Everything that can be ordered via the API is here with the
 * corresponding order codes. To choose your order, execute this get route and look at the options.
 */
router.get('/dominos/menu', function(req, res, next){
    var store = new pizzapi.Store({
        ID: orderData.order.storeID
    });

    store.getFriendlyNames(function(menuItems) {
        res.send(menuItems);
    });
});


router.get('/someBeer', function(req, res, next) {
    //todo: Integrate the Drizly API for beer orders
});

module.exports = router;






