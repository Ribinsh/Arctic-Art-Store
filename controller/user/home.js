const productModel = require("../../model/productModel");
const categoryModel = require("../../model/categoryModel");
const userModel = require("../../model/user/signupModel");
const cartModel = require("../../model/cartModel");
const wishlistModel = require("../../model/wishlistModel");
const addressModel = require( '../../model/addressModel')
const orderModel = require("../../model/orderModel")
const { param } = require("../../routes/user/home");

module.exports = {
  userSession: (req, res, next) => {
    if (req.session.userLogin) {
      next();
    } else {
      res.redirect("/login");
    }
  },
  home: async (req, res) => {
    let category = await categoryModel.find();
    let supplies = await productModel.find({ category: "Art supplies" });
    if (req.session.userLogin) {
      res.render("user/home", { category, login: true, supplies });
    } else {
      res.render("user/home", { category, login: false, supplies });
    }
  },
  aboutPage: async (req, res) => {
    let category = await categoryModel.find();

    if (req.session.userLogin) {
      res.render("user/about", { category, login: true });
    } else {
      res.render("user/about", { category, login: false });
    }
  },

  products: async (req, res) => {
    let products = await productModel.find();
    let category = await categoryModel.find();
    // res.render('user/products', {products, category})
    if (req.session.userLogin) {
      res.render("user/products", { products, category, login: true });
    } else {
      res.render("user/products", { products, category, login: false });
    }
  },
  single: async (req, res) => {
    let id = req.params.id;
    console.log(req.params.id);
    let category = await categoryModel.find();
    let single = await productModel.findById({ _id: id });

    // res.render('user/single' ,{single,category});
    if (req.session.userLogin) {
      res.render("user/single", { single, category, login: true });
    } else {
      res.render("user/single", { single, category, login: false });
    }
  },

  contact: async (req, res) => {
    let category = await categoryModel.find();
    // res.render('user/contact',{category})
    if (req.session.userLogin) {
      res.render("user/contact", { category, login: true });
    } else {
      res.render("user/contact", { category, login: false });
    }
  },
  addToCart: async (req, res) => {
    console.log(req.params.id);
    let productId = req.params.id;
    let userData = req.session.user;
    let userId = userData._id;
    let product = await productModel.findOne({_id:productId})
    let total = product.price
    let cartExist = await cartModel.findOne({ userId: userId });

    if (cartExist) {
        const productExist = await cartModel.findOne({userId ,  "products.productId": productId})

        if(productExist) {
            await cartModel.findOneAndUpdate({userId, "products.productId": productId}, {$inc :{"products.$.quantity": 1 , "products.$.total" : total, cartTotal : total }})
            .then(() => {
                console.log(" product added to cart successfully");
                res.redirect("/products");
              });
        }
        else {
      await cartModel
        .findOneAndUpdate(
          { userId: userId },
          { $push: { products: { productId, total } }, $inc : {cartTotal : total} }
        ) 
        .then(() => {
          console.log(" product added to cart successfully");
          res.redirect("/products");
        });
        }
    } else {
      const cartProduct = new cartModel({
        userId,
        products: [{ productId, total }],
        cartTotal : total
      });
      await cartProduct
        .save()
        .then(() => {
          console.log(" product added to cart successfully");
          res.redirect("/products");
        })
        .catch((err) => {
          console.log(err.message);
          res.redirect("/products");
        });
    }
  },

  addToCartWishlist: async (req, res) => {
    console.log(req.params.id);
    let productId = req.params.id;
    let userData = req.session.user;
    let userId = userData._id;
    let wishlist = await cartModel.findOne({ userId: userId });

    if (wishlist) {
      await cartModel
        .findOneAndUpdate(
          { userId: userId },
          { $push: { products: { productId } } }
        )
        .then(() => {
          console.log(" product added to cart successfully");
          res.redirect("/products");
        });
    } else {
      const cartProduct = new cartModel({
        userId,
        products: [{ productId }],
      });
      await cartProduct
        .save()
        .then(() => {
          console.log(" product added to cart successfully");
          res.redirect("/products");
        })
        .catch((err) => {
          console.log(err.message);
          res.redirect("/products");
        });
    }
  },

  cart: async (req, res) => {
    let userData = req.session.user;
    let category = await categoryModel.find();
    let userId = userData._id;
    let list = await cartModel
      .findOne({ userId: userId })
      .populate("products.productId")
      .sort({ date: -1 });
    console.log(list);
    console.log(list._id);
    let cartId = list._id;
    if (list) {
      let cartProducts = list.products;

      // res.render('user/cart', {cartProducts,category, index:1})
      if (req.session.userLogin) {
        res.render("user/cart", {
          cartId,
          cartProducts,
          category,
          index: 1,
          login: true,
          list
        });
      } else {
        res.render("user/cart", {
          cartId,
          cartProducts,
          category,
          index: 1,
          login: false,
        });
      }
    } else {
      res.render("user/cart");
    }
  },

  deleteCart: async (req, res) => {
    let id = req.params.id;
    let userData = req.session.user;
    let userId = userData._id;
    let product = await productModel.findOne({_id : id})
    let price = product.price;
    // let cartProduct =  await cartModel.findOne({userId : userId}) 
    console.log(id);
    await cartModel
      .findOneAndUpdate({ userId }, { $pull: { products : { productId: id }}, $inc : {cartTotal: - price} })
      .then(() => {
        res.redirect("/cart");
      });
  },

  addToWishlist: async (req, res) => {
    console.log(req.params.id);
    let productId = req.params.id;
    let userData = req.session.user;
    let userId = userData._id;
    let wishlist = await wishlistModel.findOne({ userId: userId });

    if (wishlist) {
      await wishlistModel
        .findOneAndUpdate(
          { userId: userId },
          { $addToSet: { productId: productId } }
        )
        .then(() => {
          console.log(" product added to cart successfully");
          res.redirect("/products");
        });
    } else {
      const wish = new wishlistModel({
        userId,
        productId: [productId],
      });
      await wish
        .save()
        .then(() => {
          console.log(" product added to cart successfully");
          res.redirect("/products");
        })
        .catch((err) => {
          console.log(err.message);
          res.redirect("/products");
        });
    }
  },

  wishlist: async (req, res) => {
    let category = await categoryModel.find();
    let userData = req.session.user;
    const userId = userData._id;
    let list = await wishlistModel
      .findOne({ userId: userId })
      .populate("productId");
    console.log(list);
    if (list) {
      let wish = list.productId;
      // res.render('user/wishlist', {wish,category, index:1})
      if (req.session.userLogin) {
        res.render("user/wishlist", { wish, category, index: 1, login: true });
      } else {
        res.render("user/wishlist", { wish, category, index: 1, login: false });
      }
    }
  },

  deleteWishlist: async (req, res) => {
    let id = req.params.id;
    let userData = req.session.user;
    let userId = userData._id;
    console.log(id);
    await wishlistModel
      .findOneAndUpdate({ userId }, { $pull: { productId: id } })
      .then(() => {
        res.redirect("/wishlist");
      });
  },

  profilePage: async (req, res) => {
    let userData = req.session.user;
    let userId = userData._id;
    let category = await categoryModel.find();
    let user = await userModel.findOne({ _id: userId });
    let address = await addressModel.findOne({ userId: userId })
    
    let address1= address.address[0];
    let address2= address.address[1];

    if (req.session.userLogin) {
      res.render("user/profile", { user, category,address1,address2, login: true });
    } else {
      res.render("user/profile", { user, category,address1,address2, login: false });
    }
  },

  changeCartQuantity: async (req, res) => {
    console.log(req.body);
    cartId = req.body.cart;
    count = req.body.count;
    quantity = req.body.quantity;
    productId = req.body.product;
    let product = await productModel.findOne({_id:productId})
    let price = product.price

    return new Promise(async (resolve, reject) => {
      await cartModel
        .findOneAndUpdate(
          { _id: cartId, "products.productId": productId },
          { $inc: { "products.$.quantity": count, "products.$.total" : price , cartTotal : price*count} }
        )
        .then(async(response) => {
            let money = await cartModel.findOne({_id:cartId})
            let sumTotal = money.cartTotal;
          console.log("count increased");
          res.json({sumTotal, status: true });
        });
    });
  },

  addAddressPage :async(req, res) => {
    let category = await categoryModel.find();
    if (req.session.userLogin) {
        res.render("user/addAddress", { category, login: true });
      } else {
        res.render("user/addAddress", { category, login: false });
      }

  },

  newAddress :async (req ,res) => {
    const {fullName, houseName, city, state, pincode,phone} = req.body;
    let userData = req.session.user;
    let userId = userData._id;

    let exist = await addressModel.findOne({userId : userId})

    if (exist) {
        await addressModel.findOneAndUpdate({userId }, {$push: {address:{fullName, houseName, city, state, pincode,phone}}})
        .then(() => {
            console.log(" address added successfully");
            res.redirect("/profilePage");
        })
    }
    else {
        const address = new addressModel({
            userId,
            address:[{fullName, houseName, city, state, pincode,phone}]
          });
          await address
            .save()
            .then(() => {
              console.log(" address added successfully");
              res.redirect("/profilePage");
            })
            .catch((err) => {
              console.log(err.message);
              res.redirect("/profilePage");
            });
    }

  },

  checkoutPage : async (req, res) => {
    let userData = req.session.user;
    let userId = userData._id;
    let category = await categoryModel.find();
    let user = await userModel.findOne({ _id: userId });
    let address = await addressModel.findOne({ userId: userId })
    
    let address1= address.address[0];
    let address2= address.address[1];

    let list = await cartModel
    .findOne({ userId: userId })
    .populate("products.productId")
    .sort({ date: -1 });
  console.log(list);
  console.log(list._id);
  let totalAmount = list.cartTotal;
  let cartProducts = list.products;


    if (req.session.userLogin) {
      res.render("user/checkout", { totalAmount,user,cartProducts, category,address1,address2, login: true });
    } else {
      res.render("user/checkout", {totalAmount, user,cartProducts, category,address1,address2, login: false });
    }
  },

  orderSuccess : async(req ,res) => {
    let address = req.params.id
    // let addressData = await addressModel.findOne({address: address})    
    let userData = req.session.user;
    let userId = userData._id;
    let cart = await cartModel.findOne({ userId})
    let total = cart.cartTotal
    let products = cart.products
    let category = await categoryModel.find()

    const newOrder = new orderModel ({
      userId,
      products,
      total,
      address,
      // paymentMethod,
      orderStatus : "Order Placed"
    })
    newOrder.save()
    .then(async() =>{
      await cartModel.findOneAndDelete ({_id: cart._id})
    

    
    if (req.session.userLogin) {
      res.render("user/orderPlaced", {  category, login: true });
    } else {
      res.render("user/orderPlaced", { category, login: false });
    }
  })

  },

  orderDetails : async (req , res ) => {
    let category = await categoryModel.find();
    let userData = req.session.user;
    let userId = userData._id;
    let order = await orderModel
    .findOne({ userId: userId })
    .populate("products.productId");
    let products = order.productId;

    if (req.session.userLogin) {
      res.render("user/orderDetails", { products, category, login: true });
    } else {
      res.render("user/orderDetails", { products,category, login: false });
    }

  }
};
