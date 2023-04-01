const express = require("express");
const cors = require("cors");
const POST = require("../model/post");
const fileUpload = require("express-fileupload");
const User = require("../model/user")

const app = express();

app.use(express.json());
app.use(cors());
app.use(fileUpload()); 

app.get("/user", async (req, res) => {
  const userid = req.user;
  const user = await User.findOne({ _id: userid });   
  res.status(200).json({
    name: user.name
  });  
}); 

app.get("/", async (req, res) => {
  const data = await POST.find().sort({ createdAt: -1 });
  res.json(data);
});

app.post("/", async (req, res) => {
  const { auther, location, desc, likes, image } = req.body; 
//   console.log(req.body)
  await POST.create({
    auther: auther,
    location: location,
    desc: desc,
    likes: likes, 
    image: image,
  });
  res.json({
    message: "Post Successful",
  });
});

app.get("/username",async(req,res) => {
    const data = await User.find();
    res.json(data);
})

// app.post("/like/:id", async (req, res) => {
//   const userid = req.user;
//   const post = await POST.findOne({ _id: req.params.id });
//   const index = post.like.indexOf(userid);
//   if (index != -1) {  
//     await POST.updateOne({ _id: req.params.id }, { $pull: { like: userid } });
//   } else {
//     await POST.updateOne({ _id: req.params.id }, { $push: { like: userid } });
//   }
// });

// app.delete("/remove/:id", async (req, res) => {
//   await POST.deleteOne({ _id: req.params.id });
//     res.json({
//       massage: "Succesfully deleted post"
//     });
// });

// app.get("/userDetails/:name", async (req, res) => {
//   const user = await USER.findOne({ name: req.params.name });
//   const posts = await POST.find({ name: req.params.name });
//   res.json({
//     user,
//     posts
//   })
// });

module.exports = app;  
