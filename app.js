//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
var encrypt = require('mongoose-encryption');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");
console.log(process.env);
const userSchema=new mongoose.Schema({
            email:String,
            password:String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]  });
const User=new mongoose.model("User",userSchema);
app.get("/",function(req,res){
        res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.get("/secrets",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
            const ema=req.body.username;
            const pass=req.body.password;
            const us=new User({
                email:ema,
                password:pass
            });
            const createuser=async()=>{
                    await us.save();
            };
            try{
                    console.log("creating");
                    createuser();
                    res.render("secrets");
            }catch(e){
                console.log(e);
            }
});
app.post("/login",function(req,res){
              const check=async()=>{
              const result = await  User.find({email:req.body.username});
              console.log(result[0].password);
              console.log(result);
              console.log(req.body.password);
            
              if(result[0].password===req.body.password){
                res.render("secrets");
              }else {
                res.send("Your credentials are wrong.");
              }
              }; 
              try{
                    console.log("Checking");
                    check();
              }catch(e){
                    console.log(e);
              }
}); 
app.listen(5000,function(){
    console.log("Server is running on port 3000.");
});