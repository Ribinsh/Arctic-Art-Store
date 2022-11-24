const express = require('express');
const router = express.Router();
const controller = require('../../controller/user/home');

router.get('/', controller.home);
router.get('/cart',controller.userSession, controller.cart)
router.get('/contact', controller.contact)
router.get('/wishlist',controller.userSession, controller.wishlist)
// product listing
router.get('/products',controller.userSession, controller.products)
router.get('/about',controller.aboutPage )
router.get('/single/:id',controller.userSession, controller.single)
router.get('/deleteCart/:id/:quantity',controller.userSession, controller.deleteCart)
router.get('/deleteWishlist/:id', controller.deleteWishlist)
router.get('/profilePage',controller.userSession,controller.profilePage)

router.get('/addAddressPage',controller.addAddressPage)
router.get('/checkout', controller.checkoutPage)
router.post('/orderPlaced', controller.orderSuccess)
router.get('/orderSuccess', controller.orderSuccessPage)
router.post('/verifyPayment', controller.verifyPayment)
router.get('/orderDetails' , controller.orderDetails)

router.post('/addToCart/:id',controller.userSession, controller.addToCart)
router.get('/editUser', controller.editUserData)
router.post('/updateUserData', controller.updateUserData)

router.post('/addToWishlist/:id',controller.userSession , controller.addToWishlist)

router.post('/change-quantity' ,controller.changeCartQuantity)
router.post('/newAddress', controller.newAddress)
router.post('/newDeliveryAddress', controller.newDeliveryAddress)
module.exports = router;