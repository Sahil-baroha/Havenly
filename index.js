const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const listing = require("./models/listining");
const ejsMate= require("ejs-mate");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// const { v4: uuidv4 } = require("uuid");
// const Swal = require('sweetalert2');

app.use(express.json()); /////////////   These are parsers
app.use(express.urlencoded({ extended: true })); ///////   These are parser

app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

// & logger - morgan
app.use((req,res,next)=>{
  req.time=Date.now();
  console.log(req.method,req.hostname,req.path,req.time)
  next()
})
app.use("/",(req,res,next)=>{
  console.log("Home middleware !")
  next()
})

app.set("view engine", "ejs");


app.engine('ejs',ejsMate);
main()
  .then(() => {
    console.log("Connection Sucessfull !");
  })
  .catch((err) => console.log(err));

// ^_^ DB Connection 
async function main() {
  /// Establishes Connection with Dbs
  await mongoose.connect("mongodb://127.0.0.1:27017/WonderStay");
}

// *_* HERO rout 
app.get("/", async(req, res) => {
  const data =await listing.find()
  res.render("hero",{data});
});

// ^_^ Details rout 
app.get("/detail/:id",async(req,res)=>{
  const data1 = await listing.findById(`${req.params.id}`)
  res.render("detail",{data1})
})

// *_* Create rout
app.get("/create/new",(req,res)=>{
  res.render("create")
})

// & Upload_DB rout 
app.post("/create",async(req,res)=>{
// let newlist = new listing(req.body.listing)
// console.log(newlist)
try {
  const newlist = new listing(req.body.listing);
  console.log(newlist); // For debugging
  await newlist.save();
  res.redirect("/");
} catch (err) {
  console.error("Error saving listing:", err);
  res.status(500).send("Error creating listing");
}
})

// ^This is Edit rout 
app.get("/editR/:id",async(req,res)=>{
let Listing =await listing.findById(req.params.id)
  res.render("Edit",{Listing})
})
app.patch("/edit/:id",async(req,res)=>{
  const data = await listing.findByIdAndUpdate(
    req.params.id,            // The ID from the URL
    req.body.Listing,         // The updated fields from the form (req.body.Listing)
    { new: true, runValidators: true } // Options: return updated doc, run validators
  ).then((res)=>{console.log(res)})
  res.redirect("/")
})

// ! This is Drop Rout 
app.get("/drop/:id",async(req,res)=>{  
 await listing.findByIdAndDelete(`${req.params.id}`).then((res)=>{console.log("Sucessfully droped!")})
  res.redirect("/")
})


app.listen(3000, () => {
  console.log("Sun raha hu !");
});
