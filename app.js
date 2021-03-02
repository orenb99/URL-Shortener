require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { url } = require("inspector");
const app = express();

app.use(cors());

app.use("/public", express.static(`./public`));
app.use("/api/shorturl/new", express.static(`./database`));
app.use(express.urlencoded({extended:false}))


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/new",async (req,res)=>{
  let {body}=req;
  console.log("printed");
  await res.send(body.url)
})

module.exports = app;
