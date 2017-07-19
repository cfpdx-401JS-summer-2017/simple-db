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

    it('saves animal', () => {
        return animals.save(jinx)
            .then( animal => {
                savedAnimal = animal;
                assert.equal(animal.type, 'cat');
                assert.equal(animal.name, 'jinx');
                assert.ok(animal._id);
            });
    });
    
    it('gets a saved object by id', () => {
        return animals.get(savedAnimal._id)
            .then (animal => assert.deepEqual(animal, savedAnimal));
    });

    it('returns null if id does not exist', () => {
        return animals.get('hey mom')
            .then (animal => assert.equal(animal, null));
    });

    it('removes an object from the db as specified from a supplied id', () => {
        return animals.remove(savedAnimal._id)
            .then (response => assert.deepEqual(response, { removed: true }));
    });

    it('returns {removed: false} if remove does not occur', () => {
        return animals.remove('hey mom')
            .then(response => assert.deepEqual(response, { removed: false }));
    });

    it('returns an empty array if there is nothing in the directory', () => {
        return animals.getAll(allGot => assert.deepEqual(allGot, []));
    });

    describe('getAll', () => {
        before( () => {
            return Promise.all([
                animals.save(garfield).then(animal => savedGarfield = animal),
                animals.save(felix).then(animal => savedFelix = animal),
                animals.save(otis).then(animal => savedOtis = animal)
            ]);
        });

        it('returns an array of all objects from the requested table', () => {
            return animals.getAll()
                .then(allGot =>{
                    assert.equal(allGot.length, 3);
                    assert.ok(allGot.find(obj => obj._id === savedOtis._id));
                    assert.ok(allGot.find(obj => obj._id === savedGarfield._id));
                    assert.ok(allGot.find(obj => obj._id === savedFelix._id));
                });
        });
    });

    it('saves building', () => {
        return buildings.save(jinx)
            .then( building => {
                savedBuilding = building;
                assert.equal(building.type, 'cat');
                assert.equal(building.name, 'jinx');
                assert.ok(building._id);
            });
    });
    
    it('gets a saved object by id', () => {
        return buildings.get(savedBuilding._id)
            .then (building => assert.deepEqual(building, savedBuilding));
    });

    it('returns null if id does not exist', () => {
        return buildings.get('hey mom')
            .then (building => assert.equal(building, null));
    });

    it('removes an object from the db as specified from a supplied id', () => {
        return buildings.remove(savedBuilding._id)
            .then (response => assert.deepEqual(response, { removed: true }));
    });

    it('returns {removed: false} if remove does not occur', () => {
        return buildings.remove('hey mom')
            .then(response => assert.deepEqual(response, { removed: false }));
    });

    it('returns an empty array if there is nothing in the directory', () => {
        return buildings.getAll(allGot => assert.deepEqual(allGot, []));
    });

    describe('getAll', () => {
        before( () => {
            return Promise.all([
                buildings.save(garfield).then(building => savedGarfield = building),
                buildings.save(felix).then(building => savedFelix = building),
                buildings.save(otis).then(building => savedOtis = building)
            ]);
        });

        it('returns an array of all objects from the requested table', () => {
            return buildings.getAll()
                .then(allGot =>{
                    assert.equal(allGot.length, 3);
                    assert.ok(allGot.find(obj => obj._id === savedOtis._id));
                    assert.ok(allGot.find(obj => obj._id === savedGarfield._id));
                    assert.ok(allGot.find(obj => obj._id === savedFelix._id));
                });
        });
    });

});