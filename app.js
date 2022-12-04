const express = require('express');
const cookieParser = require('cookie-parser')
const path = require('path');
const mongoose =require('./config/connection')
const session = require('express-session');
const logger = require('morgan')
const multer = require('multer')


const app = express();


const usersRouter = require('./routes/user/home');
const adminRouter = require('./routes/admin/adminLogin');
const loginRouter = require('./routes/user/signUp');
const { nextTick } = require('process');



app.use(session({
    secret: 'secret key',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 1000*60*60*24},
}))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// multer setting
const storage =multer.diskStorage({
    destination: (req, file , cb) => {
        cb(null, "Images")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
    }
})
app.use(multer({dest:"Images", storage: storage}).single("image"))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use(function(req, res, next) {
    res.header("Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate");
    next();
});







app.use(express.static(path.resolve(__dirname+'/public')));
app.use("/public",express.static('public'))
app.use("/Images",express.static('Images'))

app.use('/', usersRouter);
app.use('/admin', adminRouter);
app.use('/login', loginRouter);
app.use("*",(req,res)=>{
    res.render('err')
  })




app.listen(3000,()=>{
    console.log('server started')
})