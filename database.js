const fs=require("fs");
class Database{
    constructor(){
        this.storage=[];
    }
    post(data){
        this.storage.push(data);
    }
    async getData(){
        let res = await fs.readdir("./storage",async (err,files)=>{
            if(files===undefined)
               return false;
           for(let i=0;i<files.length;i++){
               let item= await JSON.parse(fs.readFileSync(`${__dirname}/storage/${i}.json`,"utf-8"));
               this.post(item);
           }
           return true;
        })
    }
}

module.exports =Database