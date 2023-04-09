const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var app=express();
var cors=require('cors');
const mongoose=require("mongoose")

const Expense = require('./models/expense');
const User = require('./models/user');
const Order = require('./models/orders');
const Forgotpassword =require('./models/forgotpassword');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);


const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const purchaseRoutes = require('./routes/purchase')
app.use('/purchase', purchaseRoutes)

const premiumFeatureRoutes = require('./routes/premiumFeature')
app.use('/premium', premiumFeatureRoutes)

const passwordRoutes = require('./routes/password')
app.use('/password', passwordRoutes)

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


mongoose.connect("")
.then(result=>{
    app.listen(5000)
    console.log("done")
})
.catch(err=>{
    console.log(err)
})

// app.listen(5000);