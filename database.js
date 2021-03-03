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
    async getData(){
        let res= await JSON.parse(fs.readFileSync(`${__dirname}/storage/data.json`,"utf-8"));
        this.storage=res;
        return true;
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
        fs.writeFileSync(`./storage/data.json`,JSON.stringify(this.storage,null,4));
    }
}

module.exports =Database