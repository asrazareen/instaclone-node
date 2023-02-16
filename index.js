const express = require("express");
const cors = require("cors");
const db = require("mongoose");
const PORT = process.env.PORT || 8080;
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
const jwt = require("jsonwebtoken");
const Secret = "INSTACLONEAPP";


const app = express();
app.use(cors()); 
app.use(express.json());

app.use("/post", (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, Secret, function (err, decoded) {
      if (err) {
        console.log(err);
        return res.status(403).json({
          status: "Failed",
          message: "Token is not valid",
        });
         
      }
      req.user = decoded.data;
      next(); 
    });
  } else {
    res.status(403).json({
      status: "Failed",
      message: "User is not authenticated",
    }); 
  }
});
app.use("/user", userRoute)
app.use("/post", postRoute)


db.connect(
  "mongodb+srv://Asrazareen:asra1999@cluster0.6bipnt6.mongodb.net/?retryWrites=true&w=majority",
  () => console.log("Connected to db")
);

app.listen(PORT, () => console.log(`Port is open at ${PORT}`)); 
