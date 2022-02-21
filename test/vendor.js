let mongoose = require("mongoose");
let Vendor = require("../models/vendor");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
chai.use(chaiHttp);

// our parent block
describe("Vendors", () => {
  //   afterEach((done) => {
  //     Vendor.remove({}, (err) => {
  //       done();
  //     });
  //   });
  describe("/POST vendor", () => {
    it("it should post a vendor with all details", (done) => {
      let vendor = {
        first_name: "xyz",
        last_name: "abc",
        email: "abc@gmail.com",
        password: "abcxyz",
        street_address: "street",
        city: "city",
      };
      chai
        .request(server)
        .post("/vendor/signup")
        .send(vendor)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("vendor");
          Vendor.deleteOne({ _id: res.body.vendor }, (err, result) => {
            if (err) {
              console.log(err);
            }
          });
          done();
        });
    });
  });
});
