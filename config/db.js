const mongoose = require("mongoose");

const connectdb = async()=>{
    const MONGOURI = process.env.MONGOURI;
   try{
      const connect =  await mongoose.connect(MONGOURI,{
        dbName:"thirdpartyapps"
       })
       console.log("connect db");
   }catch(error){
    console.log("this is error occur",error.message)
   }
}

module.exports= connectdb;
   
