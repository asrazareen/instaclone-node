const express = require("express");
const cors = require("cors");
const Post = require("./model/post")
const app = express();
const mongoose = require("mongoose")
const path = require("path");
const fileUpload = require("express-fileupload");


app.use(express.json());

app.use(fileUpload());
app.use(cors())

// mongoose.set('strictQuery', true)

const uri = `mongodb+srv://Asrazareen:asra1999@cluster0.6bipnt6.mongodb.net/?retryWrites=true&w=majority`


// app.get("/", async (req,res)=>{
//     res.status(200).send("This is start page")
// })


app.post("/api" ,  (req,res)=>{
    const {auther,location,desc,likes} = req.body

    // console.log(req.body)
    // console.log(req.files);
    const {imageFile} = req.files
    const   img = Date.now()+imageFile.name;
    imageFile.mv('./images/'+ img,async (err) => {
        if(err){
            res.json({message:err})
        } 
        else{

            //try
            
                const post = await Post.create({
                    image:"http://localhost:8009/images/"+img,
                    auther,
                    location,
                    desc,
                    likes,
            
                })
            
                res.json({
                    message:"everthing is fine",
                    post,
            
                })
                // res.redirect('/')
            
            // catch(e){
            //     console.log(e)
            //     message:e.message
                
            // }

        }
    })
  
  

    // console.log(imageFile);
})

app.get("/", async (req, res) => {
    try{
        const post =await Post.find().sort({createdAt:-1});
        // console.log(post)
        res.json(
            post
            )
    }
    catch(e){
        res.status(400).json({
            message:e.message
        })
    }
    
})

app.get("/images/:fileName", async (req, resp) => {
    // console.log(`./uploads/${req.params.fileName}`)
    resp.sendFile(path.join(__dirname, `./images/${req.params.fileName}`))
})

app.get("*", async (req,res)=>{
    res.status(404).send("API not found")
})

mongoose.connect(uri,(err) => {
    if(err){
        console.log("connection to mongodb failed")
    }
    else
    {
        console.log("connection to mongodb success")
    }
})

app.listen(8009,()=>{console.log("Server is up and running at port no. 8009")})