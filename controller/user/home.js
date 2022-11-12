const productModel = require("../../model/productModel");
const categoryModel = require("../../model/categoryModel");

const cartModel = require("../../model/cartModel");
const wishlistModel = require("../../model/wishlistModel");
const { param } = require("../../routes/user/home");

module.exports = {
    userSession: (req , res ,next) => {
        if (req.session.userLogin) {
          next()
        } else {
          res.redirect('/login')
        }
   },

    home: async (req, res) => {
        let category = await categoryModel.find() 
        if (req.session.userLogin) {
            res.render("user/home", { category, login: true })
          } else {
            res.render("user/home", { category, login: false });
          }
        // res.render('user/home', {category})
    },
    aboutPage: (req, res) => {
        res.render('user/about')
    },

    products: async (req, res) => {
        let products = await productModel.find()
        let category = await categoryModel.find()
        res.render('user/products', {products, category})
    },
    single : async  (req,res) => {
        let id = req.params.id
        console.log(req.params.id);
        let single = await productModel.findById({_id:id})
        
        res.render('user/single' ,{single});

    },

    contact: (req, res) => {
        res.render('user/contact')
    },
    addToCart:async (req,res) => {
        console.log(req.params.id)
            let newId = req.params.id;
            let {category, productName, description, price, imageUrl} = await productModel.findOne({_id:newId})
            // console.log(image);

            let product = cartModel({
                category,
                productName,
                description,
                price,
                imageUrl

            });

            await product
            .save()
            .then(() => {
                console.log(" product added to cart successfully");
                res.redirect("/products")
            })
            .catch((err) => {
                console.log(err.message);
                res.redirect("/products")
            });


    },
    addToCartWishlist:async (req,res) => {
        console.log(req.params.id)
            let newId = req.params.id;
            let {category, productName, description, price, imageUrl} = await wishlistModel.findOne({_id:newId})
            

            let product = cartModel({
                category,
                productName,
                description,
                price,
                imageUrl

            });

            await product
            .save()
            .then(() => {
                console.log(" product added to cart successfully");
                res.redirect("/wishlist")
            })
            .catch((err) => {
                console.log(err.message);
                res.redirect("/wishlist")
            });
    },
    cart: async (req , res) => {
        let cartProducts = await cartModel.find();
        res.render('user/cart',{cartProducts,index:1})
    },

    deleteCart : async (req, res) => {
        let id = req.params.id
        console.log(id);
        await cartModel.findByIdAndDelete({_id:id})
        .then(() =>{
            res.redirect('/cart')
        })

    },

   


    addToWishlist : async (req , res) => {
        console.log(req.params.id)
            let newId = req.params.id;
            let {category, productName, description, price, imageUrl} = await productModel.findOne({_id:newId})
            

            let product = wishlistModel({
                category,
                productName,
                description,
                price,
                imageUrl

            });

            await product
            .save()
            .then(() => {
                console.log(" product added to wishlist successfully");
                res.redirect("/products")
            })
            .catch((err) => {
                console.log(err.message);
                res.redirect("/products")
            });

    },


    wishlist: async (req,res) =>{
        let wishlist = await wishlistModel.find()
        res.render('user/wishlist', {wishlist, index:1})
    },
    
    
    deleteWishlist : async(req, res) => {
        let id = req.params.id
        console.log(id);
        await wishlistModel.findByIdAndDelete({_id:id})
        .then(() =>{
            res.redirect('/wishlist')
        })

        
    }
}



