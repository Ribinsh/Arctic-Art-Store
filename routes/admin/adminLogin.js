const express = require('express');
const router = express.Router();
const controller = require('../../controller/admin/adminLogin');


// get method
router.get('/', controller.login)
router.get('/adminProducts', controller.productList)
router.get('/addProducts', controller.addProduct)
router.get('/allUsers', controller.allUsers)
router.get('/categories',controller.categories)
router.get('/addCategory' , controller.addCategory)


// post method
router.post('/adminLogin', controller.loginAdmin)
router.post('/newProduct', controller.newProduct)
router.post('/newCategory', controller.newCategory)
router.post('/blockUser/:id' , controller.blockUser)
router.post('/unblockUser/:id' , controller.unblockUser)
router.post('/deleteProduct/:id' ,controller.deleteProduct)
router.post('/listProduct/:id' ,controller.listProduct)
router.post('/editProduct/:id', controller.editProductPage)
router.post('/updateProduct/:id',controller.updateProduct)



module.exports = router;