require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { url } = require("inspector");
const app = express();
const fs= require("fs");

app.use(cors());

app.use("/public", express.static(`./public`));
app.use(express.urlencoded({extended:false}))


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/new/", async (req,res)=>{
  let {body}=req;
  fs.readdir("./storage/",(err,files)=>{
    let id=0;
    if(files!==undefined)
      id=files.length;
    let data={
      oldURL: body.url,
      shortURL:id, 
    }
    fs.writeFileSync(`./storage/${id}.json`,JSON.stringify(data, null, 4));
    res.send(data);
  })
})

app.get("/api/shorturl/:id",(req,res)=>{
  let {id}=req.params;
  fs.readdir("./storage/",async (err,files)=>{
    if(files.includes(id+".json")){
      let file=await JSON.parse(fs.readFileSync(`${__dirname}/storage/${id}.json`,"utf-8"));
      res.redirect(302,file.oldURL)
    }
    else
      res.status(404).send("file not found");
  })
})

module.exports = app;
