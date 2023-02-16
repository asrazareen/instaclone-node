const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserData = new Schema({
    name:{type:String , required:true},
    email:{type:String , required:true ,unique:true},
    password:{type:String , required:true, min: 6, max: 16},
},{timestamps:true})

const userModel = mongoose.model("User",UserData);

module.exports = userModel; 