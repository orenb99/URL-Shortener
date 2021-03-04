require("dotenv").config();
const Database=require("./database");
const utils=require("./utils");
const express = require("express");
const cors = require("cors");
const app = express();
const fs= require("fs");
const { url } = require("inspector");

app.use(cors());

app.use("/public", express.static(`./public`));
app.use(express.urlencoded({extended:false}))


let database=new Database();
app.use((req,res,next)=>{
  // let promise=new Promise((resolve,reject)=>{
  //   resolve(database.getData());
  // }).then((data)=>{
  //   console.log(data);
  //   next();
  // });
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
    //let valid=await utils.validate(JSON.stringify(body.url).slice(1,JSON.stringify(body.url).length-1));
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
      data.redirectCount=database.storage[exists].redirectCount;
    }
    res.send(data);
})

app.get("/api/shorturl/:id",(req,res)=>{
  let {id}=req.params;
  let urlArray=database.storage.map((value)=>value.shortUrl);
    if(urlArray.includes(Number(id))){
      fs.readFile(`${__dirname}/storage/data.json`,"utf-8",(err)=>{
        if(err)
          console.log(err.message);
        else
          res.redirect(302,database.storage[Number(id)].originalUrl);
      });
    }
    else
      res.status(404).send("file not found");
})

app.post("/api/clearCache/all", async (req,res)=>{
    database.clear();
    res.send(`directory cleared`);
    console.log("database cleared");
})
module.exports = app;
