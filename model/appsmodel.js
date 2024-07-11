const mongoose = require("mongoose");

const appsSchema = mongoose.Schema({
    provider:{
        type:String,
        required:true
    },
    accessToken:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("apps",appsSchema);