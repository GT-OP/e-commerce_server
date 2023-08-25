require("dotenv").config( {path: './sample.env' });
const mongoose=require('mongoose');

//ESTABLISHSING CONNECTION WITH MONGODB 
const DB=process.env.MONGO_URI;

mongoose.connect("mongodb+srv://GT:Ga333200212@cluster0.8y3tysd.mongodb.net/Amazonweb?retryWrites=true&w=majority").then(()=>{console.log("database connected")}).catch((error)=>{console.log("error_at_conn.js= "+error.message)});