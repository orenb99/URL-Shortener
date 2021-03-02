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


app.get("/", (req, res) => {
  let database=new Database();
  database= utils.getData();
  console.log(database)
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/new/",(req,res)=>{
  let {body}=req;
  fs.readdir("./storage/",async(err,files)=>{
    let id=0;
    if(files!==undefined){
      id=files.length;
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
