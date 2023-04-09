const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const Forgotpassword=new Schema({
    id:{
        type:Schema.Types.UUID
    },
    active:{
        type:Boolean
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})
module.exports=mongoose.model('Forgotpassword',Forgotpassword);





// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');


// const Forgotpassword = sequelize.define('forgotpassword', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN,
//     expiresby: Sequelize.DATE
// })

// module.exports = Forgotpassword;