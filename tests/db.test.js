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
    let garfield = null;
    let codeFellows = null;

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
    describe('save', () => {
        it('saves object and gives it and ID', done => {
            // call save
            animals.save({ type: 'cat', name: 'garfield'}, (err, animal) => {
                if(err) return done(err);
                // test has, id, props match, etc, etc, 
                garfield = animal;
                assert.equal(animal.type, 'cat');
                assert.equal(animal.name, 'garfield');
                assert.ok(animal._id);
                // moar tests...
            });

            buildings.save({ type: 'school', name: 'codeFellows'}, (err, building) => {
                if(err) return done(err);
                // test has, id, props match, etc, etc, 
                codeFellows = building;
                assert.equal(building.type, 'school');
                assert.equal(building.name, 'codeFellows');
                assert.ok(building._id);
                // moar tests...
                done();
            });
        });

    }); 
    describe('get', () => {
        it('returns the object from the requested table that has that id', (done)  => {
            animals.get(garfield._id, (err, animal) => {
                if (err) return done(err);
                assert.equal(animal._id, garfield._id);
            });

            buildings.get(codeFellows._id, (err, building) => {
                if (err) return done(err);
                assert.equal(building._id, codeFellows._id);

                done();
            });
        });

        it('return null if that id does not exist', (done)  => {
            animals.get(3, (err, animal) => {
                if (err) return done(err);
                assert.equal(animal, null);
            });

            buildings.get(3, (err, building) => {
                if (err) return done(err);
                assert.equal(building, null);

                done();
            });
        });
    });

    describe('remove', () => {
        it('removes the object and returns removed: true', (done) => {
            animals.remove(garfield._id, (err, animal) => {
                if (err) return done(err);
                assert.deepEqual(animal, { removed: true });
            });

            buildings.remove(codeFellows._id, (err, building) => {
                if (err) return done(err);
                assert.deepEqual(building, { removed: true });

                done();
            });

        });

        it('returns removed: false if object does not exist', (done) => {
            animals.remove(garfield._id, (err, animal) => {
                if (err) return done(err);
                assert.deepEqual(animal, { removed: false });
            });

            buildings.remove(codeFellows._id, (err, building) => {
                if (err) return done(err);
                assert.deepEqual(building, { removed: false });
                done();
            });
        });
    });

    describe('getAll', () => {
        it('returns empty array if no objects found', (done) => {
            animals.getAll((err, testObjs) => {
                if (err) return done(err);
                assert.deepEqual(testObjs, []);
            });

            buildings.getAll((err, testObjs) => {
                if (err) return done(err);
                assert.deepEqual(testObjs, []);

                done();
            });
        });

        it('returns array of all animals', (done) => {
            let catArr = [{ type: 'cat', name: 'garfield'},  {type: 'cat', name: 'felix'}, { type: 'cat', name: 'minerva'}];
            function saveCats (callback) {
                let counter = catArr.length;
                catArr.forEach((catObj) => {
                    animals.save(catObj, (err, animal) => {
                        if (err) return done(err);
                        catObj._id = animal._id;
                        counter--;
                        if (counter ===0) callback(null);

                    });
                });

            }
            saveCats(err => {
                animals.getAll((err, testObjs) => {
                    if (err) return done(err);
                    assert.deepEqual(testObjs.length, catArr.length);
            
                    done();
                });

            });

        });
        
    });

});