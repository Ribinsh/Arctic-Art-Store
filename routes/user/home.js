const express = require('express');
const router = express.Router();
const controller = require('../../controller/user/home');

router.get('/', controller.home);
router.get('/cart',controller.userSession, controller.cart)
router.get('/contact', controller.contact)
router.get('/wishlist',controller.userSession, controller.wishlist)
// product listing
router.get('/products', controller.products)
router.get('/about',controller.aboutPage )
router.get('/single/:id', controller.single)
router.get('/deleteCart/:id', controller.deleteCart)
router.get('/deleteWishlist/:id', controller.deleteWishlist)


router.post('/addToCart/:id',controller.userSession, controller.addToCart)
router.get('/addToCartWishlist/:id',controller.userSession, controller.addToCartWishlist)

router.post('/addToWishlist/:id' ,controller.userSession, controller.addToWishlist)


module.exports = router;