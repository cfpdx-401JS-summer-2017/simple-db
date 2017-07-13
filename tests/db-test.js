const rimraf = require('rimraf');
const assert = require('assert');
const path = require('path');
const db = require('../lib/db');

describe('db', () => {
    const TEST_DIR = path.join(__dirname, 'test');

    before(done => {
        rimraf(TEST_DIR, err => {
            if(err) return done(err);
            else done();
        });
    });
    let alcohol = null;
    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable = ('alcohol', (err, store) => {
            if(err) return done(err);
            alcohol = store;
            done();
        });
    });
    it('saves alcohol to the db', (done) => {
        alcohol.save({type: 'beer', name: 'IPA'}, (err, alcohol) => {
            if(err) return done(err);
            
            assert.equal(alcohol.type, 'beer');
            done();
        });
    });
});

