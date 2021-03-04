const { json } = require("body-parser");
const fs=require("fs");
const { type } = require("os");
class Database{
    constructor(){
        this.storage=[];
    }
    post(data){
        this.storage.push(data);
        this.updateData();
    }
    addRedirect(shortUrl){
        this.storage[shortUrl].redirectCount=this.storage[shortUrl].redirectCount+1;
        this.updateData();
    }
    clear(){
        this.storage=[];
        this.updateData();
    }
    getData(){
        fs.readFile("./storage/data.json","utf-8",(err,data)=>{
            if(err)
                console.log(err);
            else{
                this.storage=JSON.parse(data);
            }
        })
    }
    async addressExists(url){
        let urlArray=await this.storage.map((value,index)=>value.originalUrl);
        if(!urlArray.includes(url))
            return false;
        else{
            let index=urlArray.indexOf(url);
            return index;
        }
     }
    updateData(){
        let buffer= Buffer.from(JSON.stringify(this.storage,null,4));
        fs.writeFile("./storage/data.json",buffer,err=>{
            if(err)
                console.log(err.message)
        })
    }
}

module.exports =Database