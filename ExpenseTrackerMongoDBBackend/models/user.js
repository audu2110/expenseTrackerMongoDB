const mongoose=require("mongoose")
const Schema=mongoose.Schema
const User=new Schema({
    
    name:{
        type:String,
        required:true
      },
      email:{
        type:String,
        required:true
      },
      password:{
        type:String,
        required:true
      },
      ispremiumuser:{
        type:Boolean,
      required:true,
      default:false
      },
      totalExpenses:{
        type:Number,
        required:true,
        default: 0
      }
})

module.exports=mongoose.model("User",User)







// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   ispremiumuser: Sequelize.BOOLEAN,
//   totalExpenses:{
//     type: Sequelize.INTEGER,
//     defaultValue:0
//   }
// });

// module.exports = User;