const signupModel = require("../../model/user/signupModel")

const bcrypt = require("bcrypt");




module.exports = {
    signUpPage: (req, res) => {
        res.render('user/signUpPage')
    },


   signup: (req , res ) =>{
      const newUser = signupModel({
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        password :req.body.password
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
   } ,




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
                return res.render ('user/signUpPage')
            }
        })
     }
   
   }
};