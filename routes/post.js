const express = require("express");
const Post = require("../model/post");
const fileUpload = require("express-fileupload"); 

const app = express();

app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(fileUpload())

app.get("/", async (req, res) => {
    try {
        const post = await Post.find().sort({ createdAt: -1 });
        // console.log(post) 
        res.json( post )
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        })
    }

})

app.post("/", async (req, res) => {
    const { auther, location, desc, likes, image } = req.body;
    console.log(req.body);
    await Post.create({
        auther: auther,
        location: location,
        desc: desc,
        image: image,
        likes: likes
    });
    res.json({
        massage: "Post Successful",
    });
});

 

module.exports = app;