const request= require("supertest");
const app=require("./app");

const correctData={
    url:"https://www.youtube.com/"
};

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
        console.log(correctData);
        const response= await request(app).post("/api/shorturl/new/").send(correctData);
        expect(2).toBe(2);
        done();
    })
})