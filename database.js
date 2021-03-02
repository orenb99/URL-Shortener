class Database{
    constructor(){
        this.storage=[];
    }
    post(data){
        this.storage.push(data);
    }
}

module.exports =Database