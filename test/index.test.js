"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe("Api index", () => {
    describe("GET /", () => {
        it("Should return error, bad path", (done) => {
            chai.request(app)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(417);
                    res.body.should.be.an('object').that.includes({ message: 'Error, bad path' });
                    done();
                });
        });
    });
});

describe("Api index", () => {
    describe("GET /api/", () => {
        it("Should return error, bad path", (done) => {
            chai.request(app)
                .get("/api/")
                .end((err, res) => {
                    res.should.have.status(417);
                    res.body.should.be.an('object').that.includes({ message: 'Error, bad path' });
                    done();
                });
        });
    });
});