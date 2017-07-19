// cSpell:ignore promisify
const assert = require('assert');
const path = require('path');
const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const db = require('../lib/db');



describe('db', () => {

    // mocha runs before blocks sequentially, in order.
    // that means we can break the setup work into smaller
    // before functions

    // this will be our test_dir
    const TEST_DIR = path.join(__dirname, 'test');

    // 1. delete the test directory
    before(() => rimraf(TEST_DIR));
    
    // declare variable out here so we have access in
    // the "it" tests...
    let animals = null;
    let garfield = null;
    let codeFellows = null;
    let buildings = null;

    // 2. create an animal store ("table")
    // (you can use whatever domain "thing" you want)
    before(() => {
        db.rootDir = TEST_DIR;
        return db.createTable('animals')
            .then(store => animals = store);
    }); 

    // 2. create a buildings store ("table")
    before(() => {
        db.rootDir = TEST_DIR;
        return db.createTable('buildings')
            .then(store => buildings = store); 
    });

    // 3. use the store in tests
    describe('save', () => {
        it('saves object and gives it and ID', () => {
            // call save
            return animals.save({ type: 'cat', name: 'garfield'})
                .then(animal => {
                    garfield = animal;
                    assert.equal(animal.type, 'cat');
                    assert.equal(animal.name, 'garfield');
                    assert.ok(animal._id);
                 

                });
            

            // return buildings.save({ type: 'school', name: 'codeFellows'})
            // .then(building => {
            //     codeFellows = building;
            //     assert.equal(building.type, 'school');
            //     assert.equal(building.name, 'codeFellows');
            //     assert.ok(building._id);
            // });
                
            // });
        });

    }); 
    describe('get', () => {
        it('returns the object from the requested table that has that id', ()  => {
            return animals.get(garfield._id)
                .then(animal => assert.equal(animal._id, garfield._id));

             

            // buildings.get(codeFellows._id, (err, building) => {
            //     if (err) return done(err);
            //     assert.equal(building._id, codeFellows._id);

            //     done();
            // });
        });

        it('return null if that id does not exist', ()  => {
            return animals.get(3)
            .then(animal => assert.equal(animal, null));
            

            // buildings.get(3, (err, building) => {
            //     if (err) return done(err);
            //     assert.equal(building, null);

            //     done();
            // });
        });
    });

    describe.skip('remove', () => {
        it('removes the object and returns removed: true', (done) => {
            animals.remove(garfield._id, (err, animal) => {
                if (err) return done(err);
                assert.deepEqual(animal, { removed: true });
            });

            // buildings.remove(codeFellows._id, (err, building) => {
            //     if (err) return done(err);
            //     assert.deepEqual(building, { removed: true });

            //     done();
            // });

        });

        it('returns removed: false if object does not exist', (done) => {
            animals.remove(garfield._id, (err, animal) => {
                if (err) return done(err);
                assert.deepEqual(animal, { removed: false });
            });

            // buildings.remove(codeFellows._id, (err, building) => {
            //     if (err) return done(err);
            //     assert.deepEqual(building, { removed: false });
            //     done();
            // });
        });
    });

    describe.skip('getAll', () => {
        it('returns empty array if no objects found', (done) => {
            animals.getAll((err, testObjs) => {
                if (err) return done(err);
                assert.deepEqual(testObjs, []);
            });

            // buildings.getAll((err, testObjs) => {
            //     if (err) return done(err);
            //     assert.deepEqual(testObjs, []);

            //     done();
            // });
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
            saveCats(err => {  //eslint-disable-line
                animals.getAll((err, testObjs) => {
                    if (err) return done(err);
                    assert.deepEqual(testObjs.length, catArr.length);
            
                    done();
                });

            });

        });
        
    });

});