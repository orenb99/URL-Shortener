require("dotenv").config();
const Database=require("./database");
const utils=require("./utils");
const express = require("express");
const cors = require("cors");
const app = express();
const fs= require("fs");

app.use(cors());

app.use("/public", express.static(`./public`));
app.use(express.urlencoded({extended:false}))


let database=new Database();
app.use(async (req,res,next)=>{
  res=await database.getData();
  next();
})


app.get("/", async (req, res) => {
  res.status(302).sendFile(__dirname + "/views/index.html");
});
app.post("/api/shorturl/new/",async (req,res)=>{
  let {body}=req;
    let storage=database.storage;
    let id=storage.length;
    let valid=await utils.validate(body.url);
    if(valid!==true){
      let status;
      if(valid==="Hostname Error"||valid==="Protocol Error")
        status=403;
      else if(valid==="URL Not Found")
        status=404;
      res.status(status).send("Invalid URL: "+valid)
      return
    }

    let exists=await database.addressExists(body.url);
    let data={
      originalUrl: body.url,
      shortUrl:id,
      creationDate: utils.createSqlDate(),
      redirectCount:1, 
    }
    if(exists===false){
      database.post(data);
    }
    else{
      database.addRedirect(exists);
    }
    res.send(data);
})

app.get("/api/shorturl/:id",(req,res)=>{
  let {id}=req.params;
  fs.readdir("./storage/",async (err,files)=>{
    if(files.includes(id+".json")){
      let file=await JSON.parse(fs.readFileSync(`${__dirname}/storage/${id}.json`,"utf-8"));
      res.redirect(302,file.originalUrl)
    }
    else
      res.status(404).send("file not found");
  })
})

app.post("/api/clearCache/all", async (req,res)=>{
    database.clear();
    res.send(`directory cleared`);
    console.log("database cleared");
})
module.exports = app;
