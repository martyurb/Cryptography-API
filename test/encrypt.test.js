import chai from 'chai';
import app from '../app.js';
import request from 'supertest';

const port = process.env.PORT || 3030;
const HOST = 'http://localhost:' + port;

const should = chai.should();
const expect = chai.expect;

describe('Encrypt API endpoint unit tests', function() {

    it('Should encrypt every value in the object at a depth of 1, returning the encrypted payload as JSON', (done) => {
        const goodRequestPayload = {
            "foo": "foobar",
            "bar": {
                "isBar": true
            }
        }
        request(HOST)
            .post('/encrypt')
            .send(goodRequestPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an("object")
                if (err) throw err;
                for (const key in res.body) {
                    res.body[key].should.be.a('string');
                    // legal base64 encoded strings end with a '='
                    // the encrypted strings are returned base64 encoded
                    res.body[key].slice(-1).should.equal('=');
                }
                done();
            })
    })
    it('Sending an empty object should return an empty object', (done) => {
        request(HOST)
            .post('/encrypt')
            .send({})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an("object")
                Object.keys(res.body).length.should.equal(0)
                if (err) throw err;
                done();
            })
    })
})