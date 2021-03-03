require("dotenv").config();
const Database=require("./database");
const utils=require("./utils");
const express = require("express");
const cors = require("cors");
const app = express();
const fs= require("fs");
const { rejects } = require("assert");

app.use(cors());

app.use("/public", express.static(`./public`));
app.use(express.urlencoded({extended:false}))


let database=new Database();
app.use(async (req,res,next)=>{
  let result=await database.getData();
  next();
})


app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/views/index.html");

});
app.post("/api/shorturl/new/",(req,res)=>{
  let {body}=req;
  fs.readdir("./storage/",async(err,files)=>{
    let id=0;
    if(files!==undefined){
      id=files.length;
    }
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

    let exists=await utils.addressExists(body.url,files);
    let data={};
    if(exists===false)
      data={
        originalUrl: body.url,
        shortUrl:id,
        creationDate: utils.createSqlDate(),
        redirectCount:1, 
      }
    else
      data={
        originalUrl: body.url,
        shortUrl: exists.shortUrl,
        creationDate: exists.creationDate,
        redirectCount: exists.redirectCount+1,
      }
    // fs.writeFileSync(`./storage/${data.shortUrl}.json`,JSON.stringify(data, null, 4));
    res.send(data);
  })
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

app.post("/api/clearCache/all", (req,res)=>{
  try{
  fs.readdir(`./storage/`,(err,files)=>{
    if(files===undefined){
      res.send("cache is already empty");
      return;
    }
    for(let file of files){
        fs.unlinkSync(`./storage/${file}`);
    }
  });
  res.send(`directory cleared`);
  console.log("database cleared");
  }
  catch(e){
    res.send(e);
  }
})
module.exports = app;
