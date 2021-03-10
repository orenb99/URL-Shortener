const fs=require("fs");
class Database{
    constructor(){
        this.storage=[];
    }
    post(data){
        this.storage.push(data);
        this.updateData();
    }
    addRedirect(index){
        this.storage[index].redirectCount=this.storage[index].redirectCount+1;
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
    async addressExists(url,prop){
        let urlArray=await this.storage.map((value,index)=>value[prop]);
        if(!urlArray.includes(url))
            return false;
        else{
            let index=urlArray.indexOf(url);
            return index;
        }
     }
     
    async updateShortUrl(id,shortUrl){
        this.storage[id].shortUrl=shortUrl;
        this.updateData();

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