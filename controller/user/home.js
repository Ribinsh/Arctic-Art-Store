const productModel = require("../../model/productModel");
const categoryModel = require("../../model/categoryModel");
const userModel = require("../../model/user/signupModel");
const cartModel = require("../../model/cartModel");
const wishlistModel = require("../../model/wishlistModel");
const addressModel = require( '../../model/addressModel')
const orderModel = require("../../model/orderModel")
const bannerModel = require("../../model/bannerModel")
const couponModel = require("../../model/couponModel")
const { param } = require("../../routes/user/home");

let addressIndex = 0;

const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: 'rzp_test_V5iFHTFztlUktp',
  key_secret: 'TbGeNBaswAhSLk4C4zG2NJnY',
});

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
    let banner = await bannerModel.find();
    let supplies = await productModel.find({ category: "Art supplies" });
    let allProducts = await productModel.find({}).countDocuments()
    let activeUsers = await userModel.find({}).countDocuments()
    let allCategories = await categoryModel.find().countDocuments()
    let allSales = await orderModel.find().countDocuments()
   
    if (req.session.userLogin) {
      res.render("user/home", { category, login: true, supplies, banner,allProducts,activeUsers,allCategories ,allSales});
    } else {
      res.render("user/home", { category, login: false, supplies, banner,allProducts,activeUsers,allCategories,allSales });
    }
  },


  aboutPage: async (req, res) => {
    let category = await categoryModel.find();

    
      res.render("user/about", { category, login: true });
   
  },

  products: async (req, res) => {
    let products = await productModel.find();
    let category = await categoryModel.find();
    // res.render('user/products', {products, category})
   
      res.render("user/products", { products, category, login: true });
   
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
          if(product.category=== "Art supplies"){
            await cartModel.findOneAndUpdate({userId, "products.productId": productId}, {$inc :{"products.$.quantity": 1 , "products.$.total" : total, cartTotal : total }})
            .then((response) => {
                console.log(" product already exist in cart");
                res.json({ status: true });
            })
        }else{

        }
      }else {
      await cartModel
        .findOneAndUpdate(
          { userId: userId },
          { $push: { products: { productId, total } }, $inc : {cartTotal : total} }
        ) 
        .then(() => {
          console.log(" product added to cart successfully");
          res.json({ status: true });
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
          res.json({ status: true });
        })
        .catch((err) => {
          console.log(err.message);
          res.json({ status: false });
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
    
    
    if (list) {
      let cartProducts = list.products;
      let cartId = list._id;
    
      
        res.render("user/cart", {
          cartId,
          cartProducts,
          category,
          index: 1,
          login: true,
          list
        });
      
    } else {
      res.render("user/cart", {category, cartProducts: null, list:null,  login: true,});
    }
  },

  deleteCart: async (req, res) => {
    let productId = req.body.productId;
    let quantity =req.body.quantity;
    console.log(quantity);
    let userData = req.session.user;
    let userId = userData._id;
    let product = await productModel.findOne({_id : productId})
    let price = product.price;

   
    
    await cartModel
      .findOneAndUpdate({ userId }, { $pull: { products : { productId }}, $inc : {cartTotal: - price*quantity} })
      .then(() => {
        res.json({status : true});
      })
      
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
        .then((response) => {
          console.log(" product added to cart successfully");
          res.json({ status: true });
        });
    } else {
      const wish = new wishlistModel({
        userId,
        productId: [productId],
      });
      await wish
        .save()
        .then((response) => {
          console.log(" product added to wishlist")
            res.json({ status: true });
        })
        .catch((err) => {
          console.log(err.message);
          res.json({ status: false });
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
      
        res.render("user/wishlist", { list, wish, category, index: 1, login: true });
      } else {
        res.render("user/wishlist", {list: null,  category, index: 1, login: false });
      
    }
  },

  deleteWishlist: async (req, res) => {
    let id = req.body.productId;
    let userData = req.session.user;
    let userId = userData._id;
    console.log(id);
    await wishlistModel
      .findOneAndUpdate({ userId }, { $pull: { productId: id } })
      .then(() => {
        // res.redirect("/wishlist");
        res.json({status: true})
      });
  },

  profilePage: async (req, res) => {
    let userData = req.session.user;
    let userId = userData._id;
    let category = await categoryModel.find();
    let user = await userModel.findOne({ _id: userId });
    let address = await addressModel.findOne({ userId: userId })
    
    if ( address) {
     
     
        res.render("user/profile", { user, category,address,  login: true });
     

  } else {
    
      res.render("user/profile", { user, category,address, login: true });
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
    
  

    let list = await cartModel
    .findOne({ userId: userId })
    .populate("products.productId")
    .sort({ date: -1 });
  console.log(list);
  console.log(list._id);
  let totalAmount = list.cartTotal;
  let cartProducts = list.products;
  let offer = list.discount;
  if(address) {
    let address1= address.address[addressIndex];
    
      res.render("user/checkout", { totalAmount,offer,user,cartProducts,newAddress:false, noAddress : false,category,address1,address, login: true,addressIndex });
    } else {
      
      res.render("user/checkout", { totalAmount,offer,user,cartProducts,newAddress:false,noAddress: true,address, category, login: true });
    } 
     
  },

  orderSuccess : async(req ,res) => {
    let addressindex = req.body.addressIndex
    let paymentMethod = req.body.paymentMethod
    // let addressData = await addressModel.findOne({address: address})    
    let userData = req.session.user;
    let userId = userData._id;
    let profile = await addressModel.findOne({userId})
    let address = profile.address[addressindex]
    let cart = await cartModel.findOne({ userId})
    let product = await cartModel.findOne({ userId}).populate('products.productId');
    let total = cart.cartTotal
    let products = cart.products
    let discount = cart.discount


    console.log(product);
    product.products.forEach(async(item) => {
      if(item.productId.category != "Art supplies") {
        await productModel.findOneAndUpdate({_id : item.productId._id},{$set:{status:"Unlist"}})
 }
    }) 
   

    const newOrder = new orderModel ({
      userId,
      products,
      total,
      address,
      paymentMethod,
      discount
      
    })
    newOrder.save()
    .then(async() =>{
      
      await cartModel.findOneAndDelete ({_id: cart._id})
      let orderId = newOrder._id
      let total = cart.cartTotal
      console.log(paymentMethod);
      if (paymentMethod === 'COD') {
        res.json({codSuccess:true})
      } else {
        
          return new Promise (async(resolve,reject)=>{
            instance.orders.create({
                amount: total * 100,
                currency: "INR",
                receipt: "" + orderId,
                
              },function (err,order) {
                console.log("New order ", order)
                resolve(order)
              })
        }).then((response)=>{
          res.json(response)
        })
          
         
        
      }
    })

    
   

  },
  verifyPayment : (req , res) => {
    console.log(req.body);
    let details = req.body
    return new Promise (async(resolve,reject)=>{
      const crypto = require('crypto')
      let hmac = crypto.createHmac('sha256', 'TbGeNBaswAhSLk4C4zG2NJnY')
      hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
      hmac = hmac.digest('hex')
      if(hmac == details['payment[razorpay_signature]']){
          resolve()
      }else{
          reject()
      }
  }).then(()=>{
    console.log(req.body['receipt']);
    res.json({status:true})
  })
  }
  ,
//   generateRazorpay: (orderId, total)=>{
//     return new Promise (async(resolve,reject)=>{
//         instance.orders.create({
//             amount: total * 100,
//             currency: "INR",
//             receipt: "" + orderId,
            
//           },function (err,order) {
//             console.log("New order ", order)
//             resolve(order)
//           })
//     })
// },
  

  orderDetails : async (req , res ) => {
    let category = await categoryModel.find();
    let userData = req.session.user;
    let userId = userData._id;
    let order = await orderModel.find({ userId }).populate('products.productId');
    

    if (req.session.userLogin) {
      res.render("user/orderDetails", { order, category, login: true });
    } else {
      res.render("user/orderDetails", { order,category, login: false });
    }

  },
  orderSuccessPage : async (req , res) => {
    let category = await categoryModel.find();

    if (req.session.userLogin) {
      res.render("user/orderPlaced", {  category, login: true });
    } else {
      res.render("user/orderPlaced", { category, login: false });
    }

  },
 
  editUserData : async(req , res) => {
    let user = req.session.user
    let category = await categoryModel.find();
    if (req.session.userLogin) {
      res.render("user/editUser", {  user,category, login: true });
    } else {
      res.render("user/editUser", {user, category, login: false });
    }

  },

  updateUserData :async (req, res) => {
    let userData = req.session.user
    const userId = userData._id
    const { name, email, phone, gender} = req.body
    console.log(phone);

    let newData = await userModel.findOneAndUpdate({_id : userId} , {$set : {name, email, phone, gender}}
       );
       await newData.save().then(() =>{
        res.redirect('/profilePage')
       })


 

  },

  newDeliveryAddress : async (req , res) => {

    const {fullName, houseName, city, state, pincode,phone} = req.body;
    let userData = req.session.user;
    let userId = userData._id;

    let exist = await addressModel.findOne({userId : userId})

    if (exist) {
        await addressModel.findOneAndUpdate({userId }, {$push: {address:{fullName, houseName, city, state, pincode,phone}}})
        .then( async() => {
            console.log(" address added ");
            let userData = req.session.user;
            let userId = userData._id;
            let category = await categoryModel.find();
            let user = await userModel.findOne({ _id: userId });
            let address = await addressModel.findOne({ userId: userId })

            let length = address.address.length
            let address1= address.address[0];
            let address2= address.address[length-1];
        
            let list = await cartModel
            .findOne({ userId: userId })
            .populate("products.productId")
            .sort({ date: -1 });
          console.log(list);
          console.log(list._id);
          let totalAmount = list.cartTotal;
          let cartProducts = list.products;
          let offer = list.discount;
        
            
              res.render("user/checkout", { totalAmount,offer,user,cartProducts, address,noAddress:  false, newAddress: true, category,address1,address2, login: true ,addressIndex});
            
        })
    }
    else {
        const address = new addressModel({
            userId,
            address:[{fullName, houseName, city, state, pincode,phone}]
          });
          await address
            .save()
            .then( async() => {
              console.log(" address added successfully");
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
            let offer = list.discount;
         
              
                res.render("user/checkout", { totalAmount,offer,user,cartProducts,newAddress:false,address,noAddress:false, category,address1,address2, login: true,addressIndex });
              
              
            })
            .catch((err) => {
              console.log(err.message);
              res.redirect("/checkout");
            });
    }


  },

  changeAddressIndex : (req, res) => {
     addressIndex = req.body.index;

     res.json({status: true})
  },

  removeAddress : async(req ,res) => {
    let addressId = req.body.addressId
    let userData = req.session.user;
    let userId = userData._id;


    await addressModel.findOneAndUpdate({ userId }, { $pull: { address: { _id: addressId } } }).then(() => {
      res.json({status:true})
    })
  },

  couponApply : async (req , res) => {
    console.log(req.body);
    const {cartId, couponCode} = req.body
    let cart = await cartModel.findOne({_id:cartId})
    console.log(cart.discount);
    if(cart.discount === 0){

      await couponModel.findOne({couponName:couponCode}).then(async(coupon) =>{
    
      if(coupon != null){
        console.log(" hi its coupon");
        let cart =await cartModel.findOne({_id: cartId});
        const discount = coupon.discount
        const minAmount =  coupon.minAmount
        console.log("coupon" + coupon)
        console.log("min" +minAmount);
        console.log("total"+ cart.cartTotal)
        if(cart.cartTotal >= minAmount) {
          console.log('SUCCESS 5000');
          await cartModel.findByIdAndUpdate({_id:cartId},{$inc : {cartTotal:-discount, discount: discount}})
          .then(async() =>{
            let money = await cartModel.findOne({_id:cartId})
              let sumTotal = money.cartTotal;
            res.json({couponSuccess:true,discount,sumTotal})
          })
      } else {
        console.log('CART AMOUNT LESS THAN 5000');
        res.json({status:true,minAmount})
      } 
    }else {
      console.log('NO COUPON');
      res.json({status:false})
    }
      
    
    
    })

   } else {
    res.json({couponApplied:true})
   }
  }


};
