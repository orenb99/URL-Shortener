const fs= require("fs");
const Database= require("./database");
const fetch=require("node-fetch");

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

async function validate(url){
    const response= await fetch(url).then((res)=>true)
    .catch((rej)=>checkError(url));
    return response;
 }

function checkError(url){
    let checkProtocol=false;
    let checkDomain=false;
    if(url.startsWith("https://")){
        url=url.slice(8);
        checkProtocol=true;
    }
    else if(url.startsWith("http://")){
        url=url.slice(7);
        checkProtocol=true;
    }
    else
        return "Protocol Error";

    if(url.endsWith("/"))
        url=url.slice(0,url.length-1);

    let topLevelDomains=[".com",".co.il",".org",".gov",".net"];
    for(let domain of topLevelDomains){
        if(url.endsWith(domain)){
            checkDomain=true;
            break;
        }
    }
    if(!checkDomain||!url.startsWith("www."))
        return "Hostname Error";
        
    return "URL Not Found";
}

module.exports ={createSqlDate,validate,checkError};