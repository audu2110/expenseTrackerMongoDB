const path = require('path');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();


const User = require('../models/user');


exports.postSignup=async (req,res,next)=>{
    try{
        var name=req.body.name;
        var email=req.body.email;
        var password=req.body.password;
        console.log("user controller signup name======>",name);
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err)



            let user=new User({ name:name, email:email,password:hash})
            user.save()
            .then(result=>{
                res.status(201).json({message: 'Successfuly create new user'})
            })



            // await User.create({ name, email, password: hash })
            // res.status(201).json({message: 'Successfuly create new user'})
        })
    }
    catch(err){
        res.status(500).json({
            error:"Email Aldready exists"
        })
    }
}



const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId : id, name: name, ispremiumuser } ,process.env.TOKEN_SECRET);
}

exports.postLogin=async (req,res,next)=>{
    try{
        var email=req.body.email;
        var password=req.body.password;
        console.log("user controller login email======>",email);
        const user  = await User.findOne({ email: email})
        console.log(" user in login=========>",user)
        if(user){
            console.log("Inside if statemnet login")
            bcrypt.compare(password, user.password, (err, result) => {
                if(err){
                 throw new Error('Something went wrong')
                }
                 if(result === true){
                     return res.status(200).json({success: true, message: "User logged in successfully", token: generateAccessToken(user._id, user.name, user.ispremiumuser)})
                 }
                 else{
                 return res.status(400).json({success: false, message: 'Password is incorrect'})
                }
             })
        }
        else{
            return res.status(404).json({success: false, message: 'User Doesnot exitst'})
        }
    }
    catch(err){
        res.status(500).json({
            error:"User not found"
        })
    }
}