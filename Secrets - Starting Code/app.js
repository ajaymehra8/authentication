//jshint esversion:6
require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));

//connecting database

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser:true});

//creating schema

console.log(process.env.API_KEY);

const userSchema= new mongoose.Schema({

    email:String,
    password:String
});

//learning encryption

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

//using userSchema to make new model

const User=new mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
    res.render("home.ejs");
})

app.get("/login",(req,res)=>{
    res.render("login.ejs");
})

app.get("/register",(req,res)=>{
    res.render("register.ejs");
})

app.post("/register",(req,res)=>{

    const newUser=new User({
        email: req.body.username,
        password:req.body.password
    });

    newUser.save()
    .then(result=>res.render("secrets.ejs"))
    .catch(error=>console.log("error"));
});

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username})
    .then(foundUser=>{
if(foundUser){
    if(foundUser.password===password){
       res.render("secrets");
    }
}
    })
    .catch(err=>{
        console.log("Error");
    })
})

app.listen(4000,()=>{
    console.log("listening at 4000");
})
