const path = require('path');

const express = require('express');

const router = express.Router();
const Expense = require('../models/expense');
const AWS=require('aws-sdk')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const User = require('../models/user');

require("dotenv").config();
// const sequelize=require('../util/database');

router.use(bodyParser.json())



function uploadToS3(data,filename){
    const BUCKET_NAME=process.env.BUCKET_NAME
    const IAM_USER_KEY=process.env.IAM_USER_KEY
    const IAM_SECRET_KEY=process.env.IAM_SECRET_KEY

    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_SECRET_KEY,
        Bucket:BUCKET_NAME
    })

    
        var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }

        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log("Somethin went wrong",err);
                    reject(err);
                }
                else{
                    console.log("SUCESS",s3response);
                    resolve(s3response.Location);
                }
            })
        })
        

}



exports.downloadExpense=async(req,res,next)=>{
    const expenses=await req.user.getExpenses();
    console.log("expenses=======>",expenses);
    const stringfiedExpenses=JSON.stringify(expenses);
    const userId=req.user.id;
    const filename=`Expense${userId}/${new Date()}.txt`;
    const fileURL=await uploadToS3(stringfiedExpenses,filename);
    res.status(200).json({fileURL, sucess:true})
}









exports.postAddExpense= async (req,res,next)=>{
    
    try{
        
        var amount=req.body.amount;
        var Description=req.body.Description;
        var category=req.body.category;
        console.log("amount in the pst add expense",amount)
        console.log("Description in the pst add expense",Description)
        console.log("category in the pst add expense",category)
        const data= new Expense({amount:amount, Description:Description, category:category, userId: req.user.id})
        await data.save()
        console.log("post data===>",data);
        console.log("post amount===>",amount);
        console.log("post totalExpenses===>",req.user.totalExpenses);
        
        const totalExpense=Number(req.user.totalExpenses)+Number(amount)
        console.log("Total expense in the pst add expense",totalExpense)
        console.log("Total expense in the pst add expense user",req.user.id)
        await User.findOneAndUpdate({_id:req.user.id},{totalExpenses:totalExpense}) 
        res.status(201).json({newExpenseDetail:data})
    }
    catch(err){
        res.status(500).json({

            error:err
        })
    }
}

exports.getExpenses= async(req, res,next)=> {
    const ITEMS_PER_PAGE=5;
    const page=+ req.query.page ||1;
    let totalExp;
    console.log("req====>",req.user.id)

    // const {count,rows}=await Expense.findAndCountAll({ where : { userId: req.user.id},
    //     offset: (page-1)*ITEMS_PER_PAGE,
    //     limit: ITEMS_PER_PAGE
    // })

    const getexp = await Expense.find({ userId: req.user.id })


    const rows = await Expense.find({ userId: req.user.id })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);

    // console.log("count======>",count)
    console.log("count======>",getexp.length);
    console.log("expenses======>",rows)
    totalExp=getexp.length;
    res.status(200).json({allExpenses:rows, currentPage:page, hasNextPage: ITEMS_PER_PAGE*page<totalExp, nextPage:page+1, hasPreviousPage: page>1, previousPage: page-1, lastPage: Math.ceil(totalExp/ITEMS_PER_PAGE)})

}

exports.deleteExpense = async(req,res,next)=>{
    try{
        const uId=req.params.id;
        console.log("Inside the delete function=========>",uId);
        console.log("totexpense=====>",req.user.totalExpenses);
        const delData=await Expense.findById(uId).then(delexpense=>{
            console.log("inside the del expene val",delexpense.amount)
            return delexpense.amount
        })
        let delTotExpense=Number(req.user.totalExpenses)-Number(delData);
        console.log("delTotExpense====>",delTotExpense)
        await User.findOneAndUpdate({_id:req.user.id},{totalExpenses:delTotExpense})
        // await User.updateOne({totalExpenses:delTotExpense},{id:req.user.id})
        await Expense.deleteOne({_id:uId});
        console.log("done with the delete");
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
    
}