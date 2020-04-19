const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

const {expect} = chai;
chai.use(chaiHttp);

describe('Test Employee Microservice', () => {
  it('returns all employees', (done) => {
    chai
        .request(app)
        .get('/employees/all')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equals('success');
          expect(res.body.message).to.equals('1 2 3 4');
          done();
        });
  });

  it('returns correct employee information for employee a', (done) => {
    chai
        .request(app)
        .post('/employees/get-profile')
        .send({'employeeID': '1234'})
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.name).to.equals('John Doe');
          done();
        });
  });
});
