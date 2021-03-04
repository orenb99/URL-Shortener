require("dotenv").config();
const Database=require("./database");
const utils=require("./utils");
const express = require("express");
const cors = require("cors");
const app = express();
const fs= require("fs");
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`./public`));
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
      shortUrl: `http://localhost:${PORT}/api/shorturl/${id}`,
      id:id,
      creationDate: utils.createSqlDate(),
      redirectCount:1, 
    }
    if(exists===false){
      database.post(data);
    }
    else{
      data.redirectCount=database.storage[exists].redirectCount;
    }
    res.status(201).send(data);
})

app.get("/api/shorturl/:id",(req,res)=>{
  let {id}=req.params;
  let idArray=database.storage.map((value)=>value.id);
    if(idArray.includes(Number(id))){
      fs.readFile(`${__dirname}/storage/data.json`,"utf-8",(err)=>{
        if(err)
          console.log(err.message);
        else{
          database.addRedirect(Number(id));
          res.redirect(302,database.storage[Number(id)].originalUrl);
        }
      });
    }
    else if(Number(id))
      res.status(404).send("file not found");
    else
      res.status(400).send("Invalid ID");
})

app.post("/api/clearCache/all", async (req,res)=>{
    database.clear();
    res.status(205).send(`directory cleared`);
    console.log("database cleared");
})
module.exports = app;
