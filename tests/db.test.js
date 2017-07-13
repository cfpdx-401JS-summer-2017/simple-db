const assert = require('assert');
const path = require('path');
const rimraf = require('rimfraf');
const db = require('../lib/db'); // root directory

describe('simple database', () => {
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
        db.createTable('books', (err, store) => {
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
        // call save
        animals.save({ type: 'cat', name: 'garfield' }, (err, animal) => {
            if(err) return done(err);
            // test has, id, props match, etc, etc, 
            assert.equal(animal.type, 'cat');
            // moar tests...
            // make assertions against properties
            done();
        });
    });
});