var supertest = require("supertest");
var fs = require('fs');

var options = {
  ca: fs.readFileSync('certs/ca-crt.pem'),
  key: fs.readFileSync('certs/client1-key.pem'),
  cert: fs.readFileSync('certs/client1-crt.pem')
};

// server to test
var server = supertest.agent("https://localhost:4433", options)

describe("Right cert : ", function() {
  // Test to check the use of a valid certificate
  it("The certificate is accepted", function(done) {
    server
    .get('/')
    .expect(200)
    .end(done);
  });
});