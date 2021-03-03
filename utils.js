const fs= require("fs");
const Database= require("./database");
const fetch=require("node-fetch");
const { url } = require("inspector");

function createSqlDate(){
    let date=new Date();
    let timeString=date.toTimeString();
    timeString=timeString.slice(0,timeString.indexOf("G")-1);
    let dateString=date.getFullYear()+"-";
    let dayString=date.getDate();
    let monthString=(date.getMonth()+1)+"-";
    if(date.getDate()<10)
        dayString="0"+dayString;
    if(date.getMonth()<10)
        monthString="0"+monthString;
    dateString+=monthString+dayString+" "+timeString;
    return dateString;
}


 async function addressExists(url,files){
    if(files===undefined)
        return false;
    let urlArray=await files.map((value,index)=>
        JSON.parse(fs.readFileSync(`${__dirname}/storage/${index}.json`,"utf-8")).originalUrl);
    if(!urlArray.includes(url))
        return false;
    else{
        let index=urlArray.indexOf(url);
        return JSON.parse(fs.readFileSync(`${__dirname}/storage/${index}.json`,"utf-8"));
    }
        
 }

async function validate(url){
    const response= await fetch(url).then((res)=>true)
    .catch((rej)=>403);
    return response;
 }
function checkError(){
    url="http://www.youtube.com/";
    let checkProtocol;
    if(url.startsWith("https://"){
        url=url.slice(8);
        checkProtocol=true;
    }
    else if(url.startsWith("http://"){
        url=url.slice(7);
        checkProtocol=true;
    }
    else
        return "Protocol Error";
    
    
    return protocol;
}

module.exports ={createSqlDate,addressExists,validate,checkError};