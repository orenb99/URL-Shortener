const request= require("supertest");
const app=require("./app");

describe("Home Page",()=>{
    it("Should take you to the home page",async (done)=>{
        const response = await request(app).get("/");
        expect(response.status).toBe(302);
        done();
    })
})