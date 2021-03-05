const request= require("supertest");
const fs=require("fs");
const app=require("./app");

const correctData={
    url:"https://www.youtube.com/",
    custom:"",
};
const hostnameError={
    url:"https://www.youtube/",
    custom:"",
}
const protocolError={
    url:"ps://www.youtube.com/",
    custom:"",
}
const notFoundError={
    url:"https://www.yasdasdasde.com/",
    custom:"",
}

describe("Clear Data",()=>{
    it("Should reset the data",async ()=>{
        const response=await request(app).post("/api/clearCache/all");
        fs.readFile("./storage/data.json",async (err,data)=>{
            if(err)
                console.log(err.message);
            else{
                let storage=JSON.parse(data);
                expect(storage).toEqual([]);
            }
        })
    })
})
describe("Home Page",()=>{
    it("Should take you to the home page",async (done)=>{
        const response = await request(app).get("/");
        expect(response.status).toBe(302);
        done();
    })
})

describe("Post URL",()=>{
    test("If posts with wrong request",async ()=>{
        const response= await request(app).post("/api/shorturl/");
        expect(response.status).toBe(404);
    })
    it("Should create the correct data",async (done)=>{
        const response= await (request(app).post("/api/shorturl/new/")).type("form").send(correctData);
        expect(response.status).toBe(201);
        done();
    })
    test("If creates new item if the url is the same",()=>{
        fs.readFile("./storage/data.json",async (err,data)=>{
            if(err)
                console.log(err.message);
            else{
                let length1=JSON.parse(data).length;
                const response= await (request(app).post("/api/shorturl/new/")).type("form").send(correctData);
                fs.readFile("./storage/data.json",(err,data)=>{
                    let length2=JSON.parse(data).length;
                    expect(length1).toEqual(length2);
                }
            )}
        });
    })
    test("For errors with wrong url",async ()=>{
        const response1= await (request(app).post("/api/shorturl/new/")).type("form").send(hostnameError);
        const response2= await (request(app).post("/api/shorturl/new/")).type("form").send(protocolError);
        const response3= await (request(app).post("/api/shorturl/new/")).type("form").send(notFoundError);
        expect(response1.status).toBe(400);
        expect(response2.status).toBe(400);
        expect(response3.status).toBe(404);
    })
})

describe("Redirection",()=>{
    it("Should redirect with the correct URL",async()=>{
        const response= await (request(app).get("/api/shorturl/0/"));
        expect(response.status).toBe(302);
    })
    it("Should return an error if the url isn't found",async ()=>{
        const response1= await (request(app).get("/api/shorturl/123/"));
        const response2= await (request(app).get("/api/shorturl/!@#!@#/"));
        expect(response1.status).toBe(404);
        expect(response2.status).toBe(400);
    })
    it("Should increase the redirect count", (done)=>{
        fs.readFile("./storage/data.json",async (err,data)=>{
            if(err)
                console.log(err.message);
            else{
                let count1=JSON.parse(data)[0].redirectCount;
                const response= await (request(app).get("/api/shorturl/0/"));
                fs.readFile("./storage/data.json",(err,data)=>{
                    let count2=JSON.parse(data)[0].redirectCount;
                    expect(count1+1).toBe(count2);
                    done();
                }
            )}
        });
    })
})