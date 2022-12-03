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
router.get('/addArtSupply',controller.adminSession,controller.addArtSupplies)
router.get('/adminOrders', controller.adminSession,controller.adminOrders)
router.get('/bannerPage',controller.adminSession,controller.bannerPage)
router.get('/couponPage' , controller.adminSession,controller.couponPage)


// post method
router.post('/adminLogin', controller.loginAdmin)
router.post('/newProduct',controller.adminSession ,controller.newProduct)
router.post('/newCategory',controller.adminSession ,controller.newCategory)
router.post('/blockUser/:id',controller.adminSession , controller.blockUser)
router.post('/unblockUser/:id',controller.adminSession , controller.unblockUser)
router.post('/deleteProduct/:id',controller.adminSession ,controller.deleteProduct)
router.post('/listProduct/:id',controller.adminSession ,controller.listProduct)
router.post('/listSupplies/:id',controller.adminSession, controller.listSupplies)
router.post('/unlistSupplies/:id',controller.adminSession, controller.unlistSupplies)
router.post('/editProduct/:id', controller.adminSession,controller.editProductPage)
router.post('/updateProduct/:id',controller.adminSession,controller.updateProduct)
router.post('/newArtSupply',controller.adminSession ,controller.newArtSupply)
router.post('/addCoupon',controller.adminSession,controller.addCoupon)
router.post('/newBanner',controller.adminSession ,controller.newBanner)
router.post('/changeOrderStatus',controller.adminSession ,controller.editOrderStatus)
router.get('/invoicePage/:orderId/:productId',controller.invoice)

module.exports = router;