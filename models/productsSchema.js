const mongoose=require('mongoose');

//DEFINING SCHEMA OF PRODUCTS WHICH ARE TO BE DISPLAYED
const productsSchema=new mongoose.Schema({
    id:String,
    url:String, 
    detailUrl:String,
    title:Object, 
    price:Object,
    description:String,
    discount:String, 
    tagline:String
})

//DEFINING COLLECTION OF PRODUCTS WHICH ARE TO BE DISPLAYED OR ASSIGNING SCHEMA TO 'products' collection in 'Amazonweb' database in mongodb
const Products=new mongoose.model("products",productsSchema);

//Allowing export of collection
module.exports=Products;