const db = require('../src/db');
const path = require('path');
const chai = require('chai');
const assert = chai.assert;
const rimraf = require('rimraf');

// table is the directory! ie., animals or buildings!
// store is the individual obj - file in the directory!

describe('test db functions', () => {
  const DATA_DIR = path.join(__dirname, 'data');

  before(done => {
    rimraf(DATA_DIR, err => {
      if (err) done(err);
      else done();
    });
  });

  let animals = null;
  before(done => {
    db.createTable('animals', (err, store) => {
      if (err) done(err);
      else {
        animals = store;
        done();
      }
    });
  });

  let buildings = null;
  before(done => {
    db.createTable('buildings', (err, store) => {
      if (err) done(err);
      else {
        buildings = store;
        done();
      }
    });
  });

  it('saves new animal object', () => {
    let newAnimal = { name: 'yolanda', color: 'pink' };
    animals.save(newAnimal, (err, elephant) => {
      if (err) throw err;
      assert.deepEqual(newAnimal.name, elephant.name);
    });
  }), it('gets object from requested table by id', () => {
    let newBuilding = { name: 'skyscraper', numOfStories: '100' };
    buildings.save(newBuilding, (err, skyscraper) => {
      if (err) throw err;
      buildings.get(skyscraper._id, (err, obj) => {
        if (err) throw err;
      });
      assert.deepEqual(newBuilding, obj);
    });
  }), it('gets all objects from requested table', () => {
    const tableType = 'animals';
    animals.getAll(tableType, (err, stores) => {
      if (err) throw err;
      else {
        if (stores.length < 1) assert.deepEqual([], stores);
        else assert.isOk(stores);
      }
    });
  }), it('removes the object by id', () => {
    let newAnimal = { name: 'josephina', color: 'orange' };
    animals.save(newAnimal, (err, elephant) => {
      if (err) throw err;
      animals.remove(elephant._id, err => {
        if (err) throw err;
        else assert.notExists(elephant);
      });
    });
  });
});
