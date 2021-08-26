import chai from 'chai';
import app from '../app.js';
import request from 'supertest';

import { encrypt } from '../routes/encrypt.js'

const port = process.env.PORT || 3030;
const HOST = 'http://localhost:' + port;

const should = chai.should();
const expect = chai.expect;

const publicKey = app.get('publicKey')


describe('Decrypt API endpoint unit tests', function() {
    const goodRequestPayload = {};
    const plaintextPayload = {
        "foo": "foobar",
        "bar": {
            "isBar": true
        }
    };

    before((done) => {
        for (const key in plaintextPayload) {
            goodRequestPayload[key] = encrypt(JSON.stringify(plaintextPayload[key]), publicKey)
        }
        return done();
    })
    it('Should decrypt every value in the object, returning decrypted payload as JSON', (done) => {
        request(HOST)
            .post('/decrypt')
            .send(goodRequestPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an("object")
                JSON.stringify(res.body).should.equal(JSON.stringify(plaintextPayload))
                if (err) throw err;
                done();
            })
    })
    it('Should return plaintext values if values were not encrypted', (done) => {
        request(HOST)
            .post('/decrypt')
            .send(plaintextPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an("object")
                JSON.stringify(res.body).should.equal(JSON.stringify(plaintextPayload))
                if (err) throw err;
                done();
            })
    })
    it('Sending an empty object should return an empty object', (done) => {
        request(HOST)
            .post('/decrypt')
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