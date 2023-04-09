const { ObjectId } = require("bson")
const mongoose=require("mongoose")
const Schema=mongoose.Schema
const Expense=new Schema ({
    amount:{
        type:Number,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})
module.exports=mongoose.model("Expense",Expense)







// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Expense = sequelize.define('expense', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   amount: {
//     type: Sequelize.INTEGER,
//     allowNull: false
//   },
//   Description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   category: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

// module.exports = Expense;