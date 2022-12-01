const productModel = require("../../model/productModel");
const categoryModel = require("../../model/categoryModel")
const userModel = require("../../model/user/signupModel");
const orderModel = require("../../model/orderModel")
const bannerModel = require("../../model/bannerModel")
const couponModel = require("../../model/couponModel");
const cartModel = require("../../model/cartModel");
const addressModel = require('../../model/addressModel')
const moment = require ("moment")
module.exports = {
    adminSession: (req , res ,next) => {
        if (req.session.adminLogin) {
          next()
        } else {
          res.redirect('/admin')
        }
   },

       
    login: (req, res) => {

        res.render('admin/adminLogin')

    },

    adminLogout : (req ,res ,next) => {
        if(req.session){
            req.session.destroy((err)=>{
                if(err) {
                    return next(err);
                }
                else{
                    return res.redirect ('/admin')
                }
            })
         }
    },


    loginAdmin: (req, res) => {
        let email = 'admin@gmail.com';
        let password = 'admin';
        console.log(req.body);
        if (req.body.password == password && req.body.email == email) {
            req.session.adminLogin = true;
        
            res.render('admin/adminHome')}
            else{
                res.redirect('/admin')
            }
        },
        dashboard : (req, res) => {
             res.render('admin/adminHome')

        },

        productList: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const items_per_page = 8;
        const totalproducts = await productModel.find().countDocuments()
            let products = await productModel.find().skip((page - 1) * items_per_page).limit(items_per_page)
            res.render('admin/adminProduct', {products ,page,
                hasNextPage: items_per_page * page < totalproducts,
                hasPreviousPage: page > 1,
                PreviousPage: page - 1,})
        },



        addProduct: async (req, res) => {
            let category = await categoryModel.find();
            res.render('admin/addProduct' , {category})
        },
        
        allUsers : async (req , res) => {
               
            let users = await userModel.find();
            res.render('admin/usersList', {users, index:1})

        },

        newProduct: async (req, res) => {
            console.log(req.body)
            const {category, productName, description, price} = req.body;
            const image = req.file;
            console.log(image);

            const newProduct = productModel({
                category,
                productName,
                description,
                price,
                imageUrl: image.path

            });

            await newProduct
            .save()
            .then(() => {
                console.log(" new product added successfully");
                res.redirect("/admin/addProducts")
            })
            .catch((err) => {
                console.log(err.message);
                res.redirect("/admin/addProducts")
            });


        },



        categories: async (req, res) => {
            let category = await categoryModel.find();
            res.render('admin/adminCategories', {category})
        },


        addCategory:(req ,res) => {
            res.render('admin/addCategory')
        },

        newCategory: async ( req,res) => {
            console.log(req.body)
            const { categoryName, description} = req.body;
            const image = req.file;
            console.log(image);

            const newProduct = categoryModel({
                categoryName,
                description,
                imageUrl: image.path

            });

            await newProduct
            .save()
            .then(() => {
                console.log(" new category added ");
                res.redirect("/admin/categories")
            })
            .catch((err) => {
                console.log(err.message);
                res.redirect("/admin/categories")
            });


            
        },

        blockUser: async (req ,res) => {
            let id = req.params.id
            await userModel.findByIdAndUpdate({_id:id},{$set:{status:"Blocked"}})
            .then(()=> {
                res.redirect('/admin/allUsers')
            })
        },

        unblockUser : async (req , res) => {
            let id = req.params.id
            await userModel.findByIdAndUpdate({_id:id},{$set:{status:"Unblocked"}})
            .then(()=> {
                res.redirect('/admin/allUsers')
            })

        },

        deleteProduct: async (req , res) => {
            let id = req.params.id
            await productModel.findByIdAndUpdate({_id:id}, {$set : { status :"Unlist"}})
            .then(()=>{
                res.redirect('/admin/adminProducts')
            })
        },
        listProduct : async(req, res) => {
            let id = req.params.id
            await productModel.findByIdAndUpdate({_id:id}, {$set : { status :"List"}})
            .then(()=>{
                res.redirect('/admin/adminProducts')
            })

        },
        // listSupplies : async(req, res) => {
        //     let id = req.params.id
        //     await supplyModel.findByIdAndUpdate({_id:id}, {$set : { status :"List"}})
        //     .then(()=>{
        //         res.render('admin/artSupplies')
        //     })

        // },

        // unlistSupplies : async(req, res) => {
        //     let id = req.params.id
        //     await supplyModel.findByIdAndUpdate({_id:id}, {$set : { status :"Unlist"}})
        //     .then(()=>{
        //         res.render('admin/artSupplies')
        //     })

        // },

        editProductPage: async (req, res) => {
            let id = req.params.id
            let product = await productModel.findOne({_id:id})
            let category = await categoryModel.find()
                 res.render('admin/editPage',{category,product})
         },

        updateProduct: async (req, res) => {
            const {  category,productName,description,price} = req.body;
            console.log(req.body);

            if(req.file) {
                let image = req.file;
                await productModel.findByIdAndUpdate(
                    {_id:req.params.id}, {$set: {imageUrl: image.path}}
                );
            } 
            let details = await productModel.findOneAndUpdate(
                {_id: req.params.id}, {$set: {category,productName,description,price}}
            );

            await details.save().then(() => {
                res.redirect('/admin/adminProducts')
            })

         },

         artSupplyPage : async(req,res) => {

            let products = await productModel.find({category:"Art supplies"});
            res.render('admin/adminProduct', {products})
         },

         addArtSupplies : (req,res) => {
            res.render('admin/addArtSupplies')
         },

         newArtSupply : async (req,res) => {
            console.log(req.body)
            const { category,productName, description, price} = req.body;
            const image = req.file;
            console.log(image);

            const newProduct = productModel({
                category,
                productName,
                description,
                price,
                imageUrl: image.path

            });

            await newProduct
            .save()
            .then(() => {
                console.log(" new Art supply added successfully");
                res.redirect("/admin/addArtSupply")
            })
            .catch((err) => {
                console.log(err.message);
                res.redirect("/admin/addArtSupply")
            });

         },
         listSupplies : async(req, res) => {
            let id = req.params.id
            await productModel.findByIdAndUpdate({_id:id}, {$set : { status :"List"}})
            .then(()=>{
                res.redirect('/admin/artSupplies')
            })

        },

        unlistSupplies : async(req, res) => {
            let id = req.params.id
            await productModel.findByIdAndUpdate({_id:id}, {$set : { status :"Unlist"}})
            .then(()=>{
                res.redirect('/admin/artSupplies')
            })

        },


        adminOrders :async (req , res) => {
          const orders =  await orderModel.find().sort({date:-1}).populate('products.productId')
          res.render('admin/adminOrders' ,{orders})
        
        },

        bannerPage :async (req,res) => {
            let category = await categoryModel.find()
            let banner = await bannerModel.find()
            res.render("admin/banner", {category,banner})
        },

        newBanner :async (req, res) => {
            console.log(req.body)
            const {title, description, category} = req.body;
            const image = req.file
            console.log(image);

            const newBanner = bannerModel({
                title,
                description,
                category,
                imageUrl: image.filename


            });

            await newBanner
            .save()
            .then(() => {
                console.log(" Banner Added ");
                res.redirect("/admin/bannerPage")
            })
            .catch((err) => {
                console.log(err.message);
                res.redirect("/admin/bannerPage")
            });
        },
        couponPage : async (req, res) => {
            const coupon = await couponModel.find();
            res.render("admin/coupon", {coupon})
        },

        addCoupon : async(req,res) => {
            console.log(req.body)
            const {couponName, discount, minAmount} = req.body;
           
            const newCoupon = couponModel({
                couponName,
                discount,
                minAmount

            });

            await newCoupon
            .save()
            .then(() => {
                console.log(" Coupon Added ");
                res.redirect("/admin/couponPage")
            })
            .catch((err) => {
                console.log(err.message);
                res.redirect("/admin/couponPage")
            });

        },

        editOrderStatus: async (req, res) => {
            const productId = req.body.proId;
            const orderId = req.body.orderId;
            const status = req.body.status;
            console.log(productId + "////" + orderId + "////" + status);
           
            
            await orderModel.updateOne(
              { _id: orderId, "products._id": productId },
              { $set: { "products.$.orderStatus": status } }
            ).then(() =>{
            res.json({statusChanged: true})
            })
          },

          invoice : async(req , res) => {
            const productId = req.params.orderId
            const orderId = req.params.productId
            const addresses = await addressModel.find()
            const orders =  await orderModel.findOne({_id : orderId }).populate('products.productId')
            const address =  await orderModel.findOne({_id : orderId }).populate('address')
            console.log(address);
            
            res.render('admin/invoice',{orders, moment})
          }





    
}