const express = require('express');
const router = express.Router();
const controller = require('../../controller/user/home');

router.get('/', controller.home);
router.get('/cart', controller.cart)
router.get('/contact', controller.contact)
router.get('/wishlist', controller.wishlist)
// product listing
router.get('/products', controller.products)
router.get('/about',controller.aboutPage )
router.get('/single/:id', controller.single)


router.post('/addToCart/:id', controller.addToCart);
router.post('/addToWishlist/:id' , controller.addToWishlist)


module.exports = router;