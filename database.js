const { json } = require("body-parser");

class Database{
    constructor(){
        this.storage=[];
    }
    post(json){
        let data= JSON.stringify(json)
        this.storage.push({
         oldURL: data.oldUrl,
         newURL: data.newURL,
         id: this.storage.length,   
        });
    }
}