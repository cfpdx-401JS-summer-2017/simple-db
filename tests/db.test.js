const assert = require('assert');
const path = require('path');
const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const db = require('../lib/db');

describe('db', () => {

    const TEST_DIR = path.join(__dirname, 'test');

    before( () => rimraf(TEST_DIR));

    let animals = null;

    before( () => {
        db.rootDir = TEST_DIR;
        return db.createTable('animals')
            .then( store => animals = store );
    }); 

    let buildings = null;

    before( () => {
        db.rootDir = TEST_DIR;
        return db.createTable('buildings')
            .then( store => buildings = store );
    });

    let jinx = { type: 'cat', name: 'jinx' };
    let garfield = {type: 'cat', name: 'garfield'};
    let felix = {type: 'cat', name: 'felix'};
    let otis = {type: 'cat', name: 'otis'};
    let savedAnimal = null;
    let savedBuilding = null;
    let savedGarfield = null;
    let savedFelix = null;
    let savedOtis = null;

    it.only('saves animal', () => {
        return animals.save(jinx)
            .then( animal => {
                savedAnimal = animal;
                assert.equal(animal.type, 'cat');
                assert.equal(animal.name, 'jinx');
                assert.ok(animal._id);
            });
    });
    
    it.only('gets a saved object by id', () => {
        return animals.get(savedAnimal._id)
            .then (animal => assert.deepEqual(animal, savedAnimal));
    });

    it.only('returns null if id does not exist', () => {
        return animals.get('hey mom')
            .then (animal => assert.equal(animal, null));
    });

    it('removes an object from the db as specified from a supplied id', done => {
        animals.remove(savedAnimal._id, (err, response) => {
            if(err) return done(err);
            assert.deepEqual(response, { removed: true });
            done();
        });
    });

    it('returns {removed: false} if remove does not occur', done => {
        animals.remove('hey mom', (err, response) => {
            if (err) return done(err);
            assert.deepEqual(response, { removed: false });
            done();
        });
    });

    it('returns an empty array if there is nothing in the directory', done => {
        animals.getAll((err, allGot)=>{
            if(err) return done(err);
            assert.deepEqual(allGot, []);
            done();
        });
    });
    describe('getAll', () => {
        before( done => {
            savedGarfield = animals.save(garfield, () =>{});
            savedFelix = animals.save(felix, () =>{});
            savedOtis = animals.save(otis, () =>{});
            done();
        });

        it('returns an array of all objects from the requested table', done => {
            animals.getAll((err, allGot)=>{
                if(err) return done(err);
                assert.equal(allGot.length, 3);
                assert.ok(allGot.find(obj => obj._id === savedGarfield._id));
                assert.ok(allGot.find(obj => obj._id === savedOtis._id));
                assert.ok(allGot.find(obj => obj._id === savedFelix._id));
                done();
            });
        });
    });

    it('saves building', done => {
        buildings.save(jinx, (err, building) => {
            if(err) return done(err);
            savedBuilding = building;
            assert.equal(building.type, 'cat');
            assert.equal(building.name, 'jinx');
            assert.ok(building._id);
            done();
        });
    });
    
    it('gets a saved object by id', done => {
        buildings.get(savedBuilding._id, (err, building) => {
            if (err) return done(err);
            assert.deepEqual(building, savedBuilding);
            done();
        });
    });

    it('returns null if id does not exist', done => {
        buildings.get('hey mom', (err, building) => {
            if (err) return done(err);
            assert.equal(building, null);
            done();
        });
    });

    it('removes an object from the db as specified from a supplied id', done => {
        buildings.remove(savedBuilding._id, (err, response) => {
            if(err) return done(err);
            assert.deepEqual(response, { removed: true });
            done();
        });
    });

    it('returns {removed: false} if remove does not occur', done => {
        buildings.remove('hey mom', (err, response) => {
            if (err) return done(err);
            assert.deepEqual(response, { removed: false });
            done();
        });
    });

    it('returns an empty array if there is nothing in the directory', done => {
        buildings.getAll((err, allGot)=>{
            if(err) return done(err);
            assert.deepEqual(allGot, []);
            done();
        });
    });
    describe('getAll', () => {
        before( done => {
            savedGarfield = buildings.save(garfield, () =>{});
            savedFelix = buildings.save(felix, () =>{});
            savedOtis = buildings.save(otis, () =>{});
            done();
        });

        it('returns an array of all objects from the requested table', done => {
            buildings.getAll((err, allGot)=>{
                if(err) return done(err);
                assert.equal(allGot.length, 3);
                assert.ok(allGot.find(obj => obj._id === savedGarfield._id));
                assert.ok(allGot.find(obj => obj._id === savedOtis._id));
                assert.ok(allGot.find(obj => obj._id === savedFelix._id));
                done();
            });
        });
    });

});

