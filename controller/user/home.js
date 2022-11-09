const productModel = require("../../model/productModel");
const categoryModel = require("../../model/categoryModel");

const cartModel = require("../../model/cartModel");
const wishlistModel = require("../../model/wishlistModel");

module.exports = {
    home: async (req, res) => {
        let category = await categoryModel.find() 
        res.render('user/home', {category})
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

    cart: async (req , res) => {
        let cartProducts = await cartModel.find();
        res.render('user/cart',{cartProducts,index:1})
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
    }
}



