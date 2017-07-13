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
    let ipa = null;

    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('alcohol', (err, store) => {
            if(err) return done(err);
            alcohol = store;
            done();
        });
    });

    it('saves alcohol to the db', done => {
        alcohol.save({type: 'beer', name: 'IPA'}, (err, savedBeer) => {
            if(err) return done(err);
            ipa = savedBeer;
            assert.equal(savedBeer.type, 'beer');
            assert.equal(savedBeer.name, 'IPA');
            assert.ok(savedBeer._id);
            done();
        });
    });

    it('gets alcohol by id', done => {
        alcohol.get(ipa._id, (err, beer) => {
            if(err) return done(err);
            console.log(beer);
            assert.equal(beer._id, ipa._id);
            done();
        });

    });

});

