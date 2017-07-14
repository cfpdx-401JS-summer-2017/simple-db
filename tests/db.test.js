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
    let garfield = {type: 'cat', name: 'garfield'};
    let savedAnimal = null;

    it('saves animal', done => {
        // call save
        animals.save(garfield, (err, animal) => {
            if(err) return done(err);
            savedAnimal = animal;
            // test has, id, props match, etc, etc, 
            assert.equal(animal.type, 'cat');
            assert.equal(animal.name, 'garfield');
            assert.ok(animal._id);
            // moar tests...
            done();
        });
    });
    
    it('gets a saved object by id', done => {
        animals.get(savedAnimal._id, (err, animal) => {
            if (err) return done(err);
            assert.deepEqual(animal, savedAnimal);
            done();
        });
    });

    it('returns null if no id does not exist', done => {
        animals.get('hey mom', (err, animal) => {
            if (err) return done(err);
            assert.equal(animal, null);
            done();
        });
    });

});

