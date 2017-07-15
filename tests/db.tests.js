const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');
const db = require('../lib/db');
const fs = require('fs');

describe('db', () => {

    const TEST_DIR = path.join(__dirname, 'test');

    before(done => {
        rimraf(TEST_DIR, err => {
            if (err) done(err);
            else done();
        });
    });

    let animals = null;

    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('animals', (err, store) => {
            if (err) return done(err);
            animals = store;
            done();
        });
    });

    let buildings = null;

    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('buildings', (err, store) => {
            if (err) return done(err);
            buildings = store;
            done();
        });
    });

    it('saves animal', done => {
        animals.save({ type: 'cat', name: 'garfield' }, (err, animal) => {

            if (err) return done(err);

            const id = animal._id;
            const filePath = path.join(TEST_DIR, 'animals/' + animal._id + '.json');

            assert.equal(animal.type, 'cat');
            assert.equal(animal.name, 'garfield');
            assert.ok(id);
            assert.ok(fs.readFileSync(filePath));
            done();

        });
    });

    it('gets animal', done => {
        animals.save({ type: 'dog', name: 'snoopy' }, (err, animal) => {

            if (err) return done(err);

            const id = animal._id;

            animals.get(id, (err, dog) => {
                if (err) return done(err);
                assert.deepEqual(animal, dog);
                done();
            });
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