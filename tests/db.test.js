const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');
const db = require('../lib/db');

describe('db', () => {

    // mocha runs before blocks sequentially, in order.
    // that means we can break the setup work into smaller
    // before functions

    // this will be our test_dir
    const TEST_DIR = path.join(__dirname, 'test');

    // 1. delete the test directory
    before(done => {
        rimraf(TEST_DIR, err => {
            if(err) done(err);
            else done();
        });
    });
    
    // declare variable out here so we have access in
    // the "it" tests...
    let animals = null;
    // 2. create an animal store ("table")
    // (you can use whatever domain "thing" you want)
    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('animals', (err, store) => {
            if(err) return done(err);
            animals = store;
            done();
        });
    }); 

    // 2. create a buildings store ("table")
    let buildings = null;
    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('buildings', (err, store) => {
            if(err) return done(err);
            buildings = store;
            done();
        });
    });

    // 3. use the store in tests
    it('saves animal type', done => {
        // call save
        animals.save({ type: 'cat', name: 'garfield' }, (err, animal) => {
            if(err) return done(err);
            // test has, id, props match, etc, etc, 
            assert.equal(animal.type, 'cat');
            // moar tests...
            done();
        });
    });
    it('saves animal name', done => {
        // call save
        animals.save({ type: 'cat', name: 'garfield' }, (err, animal) => {
            if(err) return done(err);
            // test has, id, props match, etc, etc, 
            assert.equal(animal.name, 'garfield');
            // moar tests...
            done();
        });
    });
    it('saves animal type', done => {
        // call save
        animals.save({ type: 'cat', name: 'garfield' }, (err, animal) => {
            if(err) return done(err);
            // test has, id, props match, etc, etc, 
            assert.ok(animal._id);
            // moar tests...
            done();
        });
    });
});