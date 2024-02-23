"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Token Generation API", () => {
    it("should generate a developer token", (done) => {
        chai.request(app)
            .post("/api/oAuth/v1/token")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("token");
                done();
            });
    });
});