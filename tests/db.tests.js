const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');
const db = require('../lib/db');

describe('db', () => {
    const TEST_DIR = path.join(__dirname, 'test');
   
    before(done => {
        rimraf(TEST_DIR, err => {
            if(err) done(err);
            else done();
        });
    });

    let animals = null;
    
    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('animals', (err, store) => {
            if(err) return done(err);
            animals = store;
            done();
        });
    });

    let buildings = null;
    
    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('buildings', (err, store) => {
            if(err) return done(err);
            buildings = store;
            done();
        });
    });

    it('saves animal', done => {
        animals.save({ type: 'cat', name: 'garfield'}, (err, animal) => {
            if(err) return done(err);
            assert.equal(animal.type, 'cat');
            done();
        });
    });
});