//schema of users having their account in amazon
const mongoose=require("mongoose");
const validator=require("validator");
    //we have to install bcrpytjs
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
    //const keysecret=process.env.KEY;
const secretKey = "uiopqwerghjxnsadruiywervmoplasxz";

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email address");
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    cpassword: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    carts:Array
});


//before saving data we will apply hashing to the passwords and then call the other parts of "/register" route function
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});


//GENERATING TOKEN
userSchema.methods.generatAuthtoken = async function(){
    try {
        let token = jwt.sign({ _id:this._id},secretKey);
        //we are storing generated token into array token in schema
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;

    } catch (error) {
        console.log(error);
    }
}


// add to cart data
userSchema.methods.addcartdata = async function(cart){
    try {
        //we will store cart data posted by user into carts array in userschema (this) is used for it 
        this.carts = this.carts.concat(cart);
        await this.save();
        return this.carts;
    } catch (error) {
        console.log(error + "bhai error hai addcartdata function mein");
    }
}

const USER = new mongoose.model("user", userSchema);

module.exports = USER;