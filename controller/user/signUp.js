const signupModel = require("../../model/user/signupModel")
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

var Name
var Email;
var Phone;
var Password;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: "arcticstore7@gmail.com",
    pass: "awdtftztyrsjlrtc",
  },
});




module.exports = {
     userSession: (req , res ,next) => {
          if (req.session.userLogin) {
            next()
          } else {
            res.redirect('/login')
          }
     },


    signUpPage: (req, res) => {
        res.render('user/signUpPage')
    },
    
    sendOtp: async(req ,res) => {
        Email=req.body.email;
        Name = req.body.name;
        Phone= req.body.phone;
        Password = req.body.password;
        const user = await signupModel.findOne({email :Email});
    
        // send mail with defined transport object
        if (!user) {

    var mailOptions={
        to: req.body.email,
       subject: "Otp for registration is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('user/otp');
    });
       }

       else{
         res.redirect('/login');
       }

    },

    resendOtp : () => {
        var mailOptions={
            to: Email,
           subject: "Otp for registration is: ",
           html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
         };
         
         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('otp',{msg:"otp has been sent"});
        });
    
    
    },

    verify : (req,res) => {
        if(req.body.otp==otp){
            const newUser = signupModel({
                name : Name,
                email : Email,
                phone : Phone,
                password :Password
              });
              bcrypt.genSalt(10,(err, salt)=>{
                bcrypt.hash(newUser.password, salt,(err, hash) =>{
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                    .save()
                    .then(()=> {
                        
                        res.redirect("/login");
                    })
                    .catch((err)=>{
                        console.log(err);
                        res.redirect("/login")
                    })
                })
              })
            
        }
        else{
            res.render('otp',{msg : 'otp is incorrect'});
        }
      
    },


//    signup: (req , res ) =>{
//       const newUser = signupModel({
//         name : req.body.name,
//         email : req.body.email,
//         phone : req.body.phone,
//         password :req.body.password
//       });
//       bcrypt.genSalt(10,(err, salt)=>{
//         bcrypt.hash(newUser.password, salt,(err, hash) =>{
//             if (err) throw err;
//             newUser.password = hash;
//             newUser
//             .save()
//             .then(()=> {
//                 res.redirect("/login");
//             })
//             .catch((err)=>{
//                 console.log(err);
//                 res.redirect("/login")
//             })
//         })
//       })
//    } ,




   doLogin: async (req, res) =>{
        const {email, password} =req.body;
        const user = await signupModel.findOne({$and:[{email :email} , {status: "Unblocked"}]});
        if(!user) {
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.redirect('/login');
        }
        req.session.userLogin = true;
        res.redirect('/');
   },

  
   logout: (req , res, next) =>{
     if(req.session){
        req.session.destroy((err)=>{
            if(err) {
                return next(err);
            }
            else{
                return res.redirect ('/')
            }
        })
     }
   
   }
};