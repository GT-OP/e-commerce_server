//importing productsschema 
const Products=require("./models/productsSchema.js");
//importing all the data from productsdata file
const productsdata=require("./constant/productsdata.js");

//console.log(productsdata);

const Defaultdata= async()=>{
    try{
       
        //deleting all the fields when function is called
        await Products.deleteMany();

        //storing data into data base 
       
        const storeData=await Products.insertMany(productsdata);
        console.log("Data stored");
    }
    catch(error)
    {
        console.log("error-number = "+error.message);
    }

}

module.exports=Defaultdata;
