const express=require("express");
const Products = require("../models/productsSchema");
const router=new express.Router();
const USER=require("../models/userSchema");
const bcrypt=require("bcryptjs");
//importing middleware
const authenticate = require("../middleware/authenticate");

//get products data
    //we will use postman for api testing
router.get("/getproducts", async (req, res) => {
    try {
        const producstdata = await Products.find();
        
        res.status(201).json(producstdata);
    } catch (error) {
        console.log("errorin-router.js=" + error.message);
    }
});

//get products by id see productsdata in which there is id for each product.It is will be used in(Cart.js) 
router.get("/getproductsone/:id", async (req, res) => {

    try {
        //accesing data from given API path
        const { id }= req.params;
        //console.log(id)
          

        //finding data with given id in products collection
        const individual = await Products.findOne({ id: id });
            //console.log(individual);\

        res.status(201).json(individual);

    } catch (error) {
        res.status(400).json(error);
    }
});



//FOR '/register' in frontend or to save old or new user's data 
router.post("/register", async (req, res) => {
        // console.log(req.body);
       
       const { fname, email, mobile, password, cpassword } = req.body;

       if (!fname || !email || !mobile || !password || !cpassword) {
           res.status(422).json({ error: "fill the all details" });
                       
       };
   
       try {
   
           const preuser = await USER.findOne({ email: email });
   
           if (preuser) {
               res.status(422).json({ error: "This email is already exist" });
           } else if (password !== cpassword) {
               res.status(422).json({ error: "password are not matching" });;
           } else {
   
               const finaluser = new USER({
                   fname, email, mobile, password, cpassword
               });
   
               //bcryptjs hashing will be applied before saving

               //saving data in mongodb use save() method 
               const storedata = await finaluser.save();
                        //console.log("data added succesfully");

               //below line response or shows stored data in terminal
               res.status(201).json(storedata);
           }
   
       } catch (error) {
                        //console.log("error the bhai catch ma for registratoin time" + error.message);
           res.status(422).send(error);
       }

});




//FOR LOGIN DETAILS
router.post("/login", async (req, res) => {
    //console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "fill the details" });
    }
    
    try {

        const userlogin = await USER.findOne({ email: email });
                //console.log(userlogin.password);

        if (userlogin) 
             {
            const isMatch = await bcrypt.compare(password, userlogin.password);
                //console.log(isMatch);

            //ACCESSING TOKEN
            const token = await userlogin.generatAuthtoken();
                //console.log("token generated succesfully - "+token);
            

            //CODE TO SHOW COOKIE GENRATED AT FRONT-END
            //"Amazonweb"- is the cookie name ,expires signifies from current after how many mili sec cookie will get expire 
            res.cookie("Amazonweb", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            });


            if (!isMatch) {
                res.status(400).json({ error: "invalid crediential pass" });
            } else {
                
                res.status(201).json(userlogin);
            }
        
            }
        else
            {
            res.status(400).json({ error: "invalid crediential pass" });   
            }
    } 
    catch (error) {
        res.status(400).json({ error: "invalid crediential pass hmm.." });
    }

});


//ADDING DATA RO THE CART
router.post("/addcart/:id", authenticate, async (req, res) => {

    try {
        console.log("perfect 6");
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        console.log(cart + "cart milta hain");
        //authenticate is the middleware to verufy cookie

        const UserContact = await USER.findOne({ _id: req.userID });
        console.log(UserContact + "user milta hain");


        if (UserContact) {
            //WE WILLCALL ADDCART FUNCTION USERSCHEMA USING INSTANCE METHOD OR THE WAY WE FETCHED cartDATA is called INSTANCE METHOD
            const cartData = await UserContact.addcartdata(cart);

            await UserContact.save();
            console.log(cartData + " thse save wait kr");
            console.log(UserContact + "userjode save");
            res.status(201).json(UserContact);
            }
        } catch (error) {
                res.status(401).json({error:"invalid user"});
        }

});



// get data into the cart
router.get("/cartdetails", authenticate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id: req.userID });
        console.log(buyuser + "user hain buy pr");
        res.status(201).json(buyuser);
    } catch (error) {
        console.log(error + "error for buy now");
    }
});


//route to check whether user is login or not
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const validuserone = await USER.findOne({ _id: req.userID });
            //console.log(validuserone + "user hain home k header main pr");
        res.status(201).json(validuserone);
    } catch (error) {
        console.log(error + "error for valid user");
    }
});



// remove iteam from the cart
    //BELOW IS THE FUNCTION TO DELETE THE RECORD OUT OF CART
    //WHEN WE WILLL CLICK ON DELETE BUTTON THAT ITEM'S ID NUMBER WILL BE SEND TO BACKEND
    //THEN OUT OF ALLTHAT ID'S WHICH ARE NOT EQUAL TO DELETING ITEM WILL GET RETURNED 

router.delete("/remove/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((curel) => {
            return curel.id != id
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("iteam remove");

    } catch (error) {
        console.log(error + "jwt provide then remove");
        res.status(400).json(error);
    }
});


// for userlogout

router.get("/logout", authenticate, async (req, res) => {
    try {
        //all those tokens who didn't request for logout must be returned
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        //clear cookie for that user 
        res.clearCookie("Amazonweb", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});



module.exports=router;
