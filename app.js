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
  console.log(utils.checkError());
  res.sendFile(__dirname + "/views/index.html");

});
app.post("/api/shorturl/new/",(req,res)=>{
  let {body}=req;
  fs.readdir("./storage/",async(err,files)=>{
    let id=0;
    if(files!==undefined){
      id=files.length;
    }
    let status=await utils.validate(body.url);
    if(status===403){
      res.status(403).send("INVALID URL")
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
    fs.writeFileSync(`./storage/${data.shortUrl}.json`,JSON.stringify(data, null, 4));
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

module.exports = app;
