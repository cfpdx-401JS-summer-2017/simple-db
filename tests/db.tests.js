const assert = require('assert');
const path = require('path');
const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const db = require('../lib/db');
const fs = require('fs');

describe('db', () => {

    const TEST_DIR = path.join(__dirname, 'test');

    before(() => rimraf(TEST_DIR));

    let animals = null;

    before(() => {
        db.rootDir = TEST_DIR;
        return db.createTable('animals')
            .then(store => {
                animals = store;
            });
    });

    let buildings = null;

    before(() => {
        db.rootDir = TEST_DIR;
        return db.createTable('buildings')
            .then(store => {
                buildings = store;
            });
    });

    it('saves animal', () => {
        return animals.save({ type: 'cat', name: 'garfield' })
            .then(animal => {

                const id = animal._id;
                const filePath = path.join(TEST_DIR, 'animals/' + animal._id + '.json');

                assert.equal(animal.type, 'cat');
                assert.equal(animal.name, 'garfield');
                assert.ok(id);
                assert.ok(fs.readFileSync(filePath));

            });
    });

    it('gets animal', () => {

        let snoopy = null;
        return animals.save({ type: 'dog', name: 'snoopy' })
            .then(animal => {
                snoopy = animal;
                const id = animal._id;

                return animals.get(id);
            })
            .then(dog => {
                
                assert.deepEqual(snoopy, dog);

            });
    });

    it('gets all animals', done => {
        animals.getAll((err, results) => {
            if (err) return done(err);
            assert.equal(results.length, 2);
            done();
        });
    });

    it('removes animal', done => {
        animals.save({ type: 'bird', name: 'tweety' }, (err, animal) => {

            if (err) return done(err);

            const id = animal._id;
            const filePath = path.join(TEST_DIR, 'animals/' + animal._id + '.json');

            assert.ok(fs.readFileSync(filePath));

            animals.remove(id, (err, callback) => {
                if (err) return done(err);
                assert.equal(callback.removed, true);
                done();
            });
        });
    });

    it('saves buildings', done => {
        buildings.save({ type: 'pretty', name: 'Falling Water' }, (err, building) => {
            if (err) return done(err);
            assert.equal(building.type, 'pretty');
            assert.equal(building.name, 'Falling Water');
            assert.ok(building._id);
            assert.ok(fs.readFileSync(path.join(TEST_DIR, 'buildings/' + building._id + '.json')));
        });
        buildings.save({ type: 'skyscraper', name: 'Chrysler Building' }, (err, building) => {

            if (err) return done(err);
            assert.equal(building.type, 'skyscraper');
            assert.equal(building.name, 'Chrysler Building');
            assert.ok(building._id);
            assert.ok(fs.readFileSync(path.join(TEST_DIR, 'buildings/' + building._id + '.json')));

            done();
        });
    });
});