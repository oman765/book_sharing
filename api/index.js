const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const app=express();
const dotenv = require("dotenv").config();
app.use(express.json({limit : "10mb"}))
app.use(cors())

const PORT=process.env.PORT || 8080
// mongodb connection

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));



//schema
const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    confirmPassword: String,
    image: String,
  });


  
  //model
  const userModel = mongoose.model("user", userSchema);
app.get("/",(req,res)=>{
    res.send("surver is running")
})





app.post('/signup', (req, res) => {
   // console.log(req.body);
    const { email } = req.body;
  
    userModel
      .findOne({ email: email })
      .then((result) => {
        if (result) {
          res.send({ message: 'Email id is already registered', alert: false });
        } else {
          const data = new userModel(req.body);
          const save=  data.save();
           res.send({ message: 'Successfully signed up', alert: true });
        }
      })
     
     
           .catch((err) => {
        console.log(err);
        res.send({ message: 'Error occurred', alert: false });
      });
  });
  // api login
  app.post("/login", (req, res) => {
    // console.log(req.body);
    const { email } = req.body;
    userModel.findOne({ email: email } )
    .then((result) => {
      if (result) {
        const dataSend = {
          _id: result._id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          image: result.image,
        };
        console.log(dataSend);
        res.send({
          message: "Login is successfully",
          alert: true,
          data: dataSend,
        });
      } else {
        res.send({
          message: "Email is not available, please sign up",
          alert: false,
        });
      }
    }).catch((err) => {
      console.log(err);
      res.send({ message: 'Error occurred', alert: false });
    });

      
    });
    /// product section

    const schemaBook = mongoose.Schema({
      name: String,
      category:String,
      image: String,
      price: String,
      description: String,
    });
    const bookModel = mongoose.model("book",schemaBook)
// save product data

app.post("/uploadProduct",async(req,res)=>{
  // console.log(req.body)
  const data = await bookModel(req.body)
  const datasave = await data.save()
  res.send({message : "Upload successfully"})
})
// 
app.get("/product",async(req,res)=>{
  const data = await bookModel.find({})
  res.send(JSON.stringify(data))
})
  
app.listen(PORT,()=>{
    console.log("running at port : " + PORT);
})
