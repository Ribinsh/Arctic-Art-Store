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
router.get('/single/:id',controller.userSession, controller.single)
router.post('/deleteCart',controller.userSession, controller.deleteCart)
router.post('/deleteWishlist', controller.deleteWishlist)
router.get('/profilePage',controller.userSession,controller.profilePage)

router.get('/addAddressPage',controller.userSession,controller.addAddressPage)
router.get('/checkout', controller.userSession,controller.checkoutPage)
router.post('/orderPlaced',controller.userSession ,controller.orderSuccess)
router.get('/orderSuccess',controller.userSession ,controller.orderSuccessPage)
router.post('/verifyPayment',controller.userSession ,controller.verifyPayment)
router.get('/orderDetails' ,controller.userSession ,controller.orderDetails)

router.post('/addToCart/:id',controller.userSession, controller.addToCart)
router.get('/editUser', controller.userSession,controller.editUserData)
router.post('/updateUserData', controller.updateUserData)

router.post('/addToWishlist/:id',controller.userSession , controller.addToWishlist)

router.post('/change-quantity' ,controller.changeCartQuantity)
router.post('/newAddress',controller.userSession, controller.newAddress)
router.post('/newDeliveryAddress',controller.userSession, controller.newDeliveryAddress)
router.post("/changeAddress", controller.changeAddressIndex)
router.post("/removeAddress",controller.userSession, controller.removeAddress)
router.post('/applyCoupon',controller.userSession, controller.couponApply)
module.exports = router;