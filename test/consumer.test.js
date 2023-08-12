const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
const expect = chai.expect;

let authToken;

before(async () => {
    const res = await chai.request(app).post("/api/oAuth/v1/token");
    
    authToken = res.body.token;
});

describe("Consumer Endpoint", () => {

    it("should return a 403 error if code is missing", async () => {
        const res = await chai.request(app)
            .post("/api/consumer")
            .set("Authorization", `Bearer ${authToken}`)
            .send();

            expect(res).to.have.status(403);
            expect(res.body).to.have.property("error", "Product code is required");
    });

    it("should handle errors and return a 200 status", async () => {
        const res = await chai.request(app)
            .post("/api/consumer")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ code: "21055" });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("error", "Error finding the product");
    });

    it("should return a product based on the code", async () => {
        const res = await chai.request(app)
    
            .post("/api/consumer")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ code: "210558" });
    
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("identifier");
    });
});