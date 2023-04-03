const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PostData = new Schema({
    image:{type:String , required:true},
    auther:{type:String , required:true},
    location:{type:String , required:true},
    desc:{type:String , required:true},
    likes:{type:Number, default:0}
},{timestamps:true})

const postModel = mongoose.model("Post",PostData);

module.exports = postModel;