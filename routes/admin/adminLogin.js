const express = require('express');
const router = express.Router();
const controller = require('../../controller/admin/adminLogin');


// get method
router.get('/', controller.login)
router.get('/adminProducts',controller.adminSession, controller.productList)
router.get('/dashboard',controller.adminSession,controller.dashboard)
router.get('/addProducts',controller.adminSession, controller.addProduct)
router.get('/allUsers',controller.adminSession, controller.allUsers)
router.get('/categories',controller.adminSession,controller.categories)
router.get('/addCategory' ,controller.adminSession, controller.addCategory)
router.get('/adminLogout',controller.adminLogout)
router.get('/artSupplies', controller.adminSession,controller.artSupplyPage)
router.get('/addArtSupply',controller.addArtSupplies)
router.get('/adminOrders', controller.adminOrders)
router.get('/bannerPage',controller.bannerPage)
router.get('/couponPage' , controller.couponPage)


// post method
router.post('/adminLogin', controller.loginAdmin)
router.post('/newProduct', controller.newProduct)
router.post('/newCategory', controller.newCategory)
router.post('/blockUser/:id' , controller.blockUser)
router.post('/unblockUser/:id' , controller.unblockUser)
router.post('/deleteProduct/:id' ,controller.deleteProduct)
router.post('/listProduct/:id' ,controller.listProduct)
router.post('/listSupplies/:id', controller.listSupplies)
router.post('/unlistSupplies/:id', controller.unlistSupplies)
router.post('/editProduct/:id', controller.editProductPage)
router.post('/updateProduct/:id',controller.updateProduct)
router.post('/newArtSupply', controller.newArtSupply)
router.post('/addCoupon',controller.addCoupon)
router.post('/newBanner', controller.newBanner)
router.post('/changeOrderStatus', controller.editOrderStatus)
router.get('/invoicePage/:orderId/:productId',controller.invoice)

module.exports = router;