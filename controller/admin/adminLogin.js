const productModel = require("../../model/productModel");
const categoryModel = require("../../model/categoryModel")
const userModel = require("../../model/user/signupModel");


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
            let products = await productModel.find();
            res.render('admin/adminProduct', {products})
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
                res.redirect("admin/categories")
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

         }




    
}