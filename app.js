require("dotenv").config();
const Database=require("./database");
const utils=require("./utils");
const express = require("express");
const cors = require("cors");
const app = express();
const fs= require("fs");
const { url } = require("inspector");
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`./public`));
app.use("/views", express.static("./views"));

app.use(express.urlencoded({extended:false}))


let database=new Database();
app.use((req,res,next)=>{
  database.getData();
  setTimeout(()=>{
    next();
  },300);
})


app.get("/", async (req, res) => {
  res.status(302).sendFile(__dirname + "/views/index.html");
});


app.post("/api/shorturl/new/",async (req,res)=>{
  let {body}=req;
    let storage=database.storage;
    let id=storage.length;
    let valid=await utils.validateOriginal(body.url);
    if(valid!==true){
      let status;
      if(valid.startsWith("Hostname")||valid.startsWith("Protocol"))
        status=400;
      else if(valid.startsWith("URL"))
        status=404;
      res.status(status).send("Invalid URL: "+valid)
      return
    }
    if(body.url[body.url.length-1]==="/")
      body.url=body.url.slice(0,body.url.length-1);
      
    let urlExists=await database.addressExists(body.url,"originalUrl");
    let shortExists=await database.addressExists(`http://localhost:${PORT}/api/shorturl/`+body.custom,"shortUrl");
    let shortUrl=body.custom;
    if(body.custom===""||Number(body.custom))
      shortUrl=id;
    
    let data={
      originalUrl: body.url,
      shortUrl: `http://localhost:${PORT}/api/shorturl/${shortUrl}`,
      id:id,
      creationDate: utils.createSqlDate(),
      redirectCount:1, 
    }
    if(urlExists===false){
      if(shortExists!==false){
        data.shortUrl=`http://localhost:${PORT}/api/shorturl/${id}`
      }
      database.post(data);

    }
    else{
      if(shortExists===false){
        if(shortUrl===id)
          shortUrl=database.storage[urlExists].id;
        database.updateShortUrl(urlExists,`http://localhost:${PORT}/api/shorturl/${shortUrl}`);
      }
      data.redirectCount=database.storage[urlExists].redirectCount;
      data.id=database.storage[urlExists].id;
      data.shortUrl=database.storage[urlExists].shortUrl;
    }
    res.status(201).send(data);
})

app.get("/api/shorturl/:shortUrl",(req,res)=>{
  let {shortUrl}=req.params;
  let characters = /^[0-9a-zA-Z]+$/;
    if(Number(shortUrl)<0||shortUrl.match(characters)===null){
      res.status(400).send("Invalid URL")
      return;
  }
  shortUrl="http://localhost:3000/api/shorturl/"+shortUrl;
  let shortUrlArray=database.storage.map((value)=>String(value.shortUrl));
    if(shortUrlArray.includes(shortUrl)){
      fs.readFile(`${__dirname}/storage/data.json`,"utf-8",(err)=>{
        if(err)
          console.log(err.message);
        else{
          database.addRedirect(shortUrlArray.indexOf(shortUrl));
          res.redirect(302,database.storage[shortUrlArray.indexOf(shortUrl)].originalUrl);
        }
      });
    }
    else
      res.status(404).send("file not found");
})

app.post("/api/clearCache/all", async (req,res)=>{
    database.clear();
    res.status(205).send(`directory cleared`);
    console.log("database cleared");
})
module.exports = app;
