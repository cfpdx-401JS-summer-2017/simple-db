// cSpell:ignore promisify
const assert = require('assert');
const path = require('path');
const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const db = require('../lib/db');

describe('db', () => {

    const TEST_DIR = path.join(__dirname, 'test');

    before(() => rimraf(TEST_DIR));

    let animals = null;
    let garfield = null;
    let buildings = null;

    before(() => {
        db.rootDir = TEST_DIR;
        return db.createTable('animals')
            .then(store => animals = store);
    });

    before(() => {
        db.rootDir = TEST_DIR;
        return db.createTable('buildings')
            .then(store => buildings = store);
    });

    describe('save', () => {
        it('saves animal object and gives it and ID', () => {
            return animals.save({ type: 'cat', name: 'garfield' })
                .then(animal => {
                    garfield = animal;
                    assert.equal(animal.type, 'cat');
                    assert.equal(animal.name, 'garfield');
                    assert.ok(animal._id);
                });
        });

        it('saves building object and gives it and ID', () => {
            return buildings.save({ type: 'school', name: 'codeFellows'})
                .then(building => {
                    assert.equal(building.type, 'school');
                    assert.equal(building.name, 'codeFellows');
                    assert.ok(building._id);
                });
        });
    });

    describe('get', () => {
        it('returns the object from the requested table that has that id', () => {
            return animals.get(garfield._id)
                .then(animal => assert.equal(animal._id, garfield._id));
        });

        it('return null if that id does not exist', () => {
            return animals.get(3)
                .then(animal => assert.equal(animal, null));
        });
    });

    describe('remove', () => {
        it('removes the object and returns removed: true', () => {
            return animals.remove(garfield._id)
                .then(animal => assert.deepEqual(animal, { removed: true }));
        });

        it('returns removed: false if object does not exist', () => {
            return animals.remove(garfield._id)
                .then(animal => assert.deepEqual(animal, { removed: false }));
        });
    });

    describe('getAll', () => {
        it('returns empty array if no objects found', () => {
            return animals.getAll()
                .then(testObjs => assert.deepEqual(testObjs, []));
        });

        let catArr = [
            { type: 'cat', name: 'garfield' }, 
            { type: 'cat', name: 'felix' }, 
            { type: 'cat', name: 'minerva' }
        ];

        function saveCats() {
            return Promise.all(
                catArr.map(cat => {
                    animals.save(cat)
                        .then(animal => {
                            cat._id = animal._id;
                            return cat;
                        });
                })
            );
        }

        it('returns array of all animals', () => {
            return saveCats()
                .then(() => animals.getAll())
                .then(testObjs => assert.deepEqual(
                    testObjs, 
                    catArr.sort((a,b) => a._id > b._id ? 1 : -1)
                ));
        });
    });
});