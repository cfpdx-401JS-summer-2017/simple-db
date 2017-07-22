const db = require('../src/db');
const path = require('path');
const chai = require('chai');
const assert = chai.assert;
const rimraf = require('rimraf');
const store = require('../src/Store');

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

  it.only('saves new animal object', () => {
    let newAnimals = { name: 'yolanda', color: 'pink' };
    animals.save(newAnimals, (err, elephant) => {
      if (err) throw err;
      assert.deepEqual(newAnimals.name, elephant.name);
    });
  }), it('gets object from requested table by id', () => {
    const obj = { name: 'skyscraper', numOfStories: '100' };
    db.createTable('buildings', (err, myStore) => {
      myStore = new store(myStore.tableDir);
      myStore.obj = obj;
      if (err) throw err;
      else {
        myStore.save(myStore, (err, savedObj) => {
          if (err) throw err;
          myStore.get(savedObj._id, (err, retrievedObj) => {
            if (err) throw err;
          });
        });
        assert.deepEqual(retrievedObj, savedObj);
      }
    });
  }), it('gets all objects from requested table', () => {
    const tableType = 'buildings';
    const storePath = process.cwd() + '/tests/data/buildings/';
    const retrievedStores = new store(storePath);
    retrievedStores.getAll(tableType, (err, stores) => {
      if (err) throw err;
      else {
        if (stores.length < 1) assert.deepEqual([], stores);
        else assert.isOk(stores);
      }
    });
  }), it('removes the object by id', () => {
    const obj = { name: 'josephina', color: 'orange' };
    db.createTable('buildings', (err, storeToDel) => {
      if (err) throw err;
      storeToDel = new store(storeToDel.tableDir);

      storeToDel.save(obj, (err, savedObjToDel) => {
        console.log(savedObjToDel);
        if (err) throw err;
        storeToDel.remove(savedObjToDel._id, (err, success) => {
          if (err) throw err;
          else console.log('success');
        });
      });
      // assert.deepEqual(removedObj, savedObj);
    });
  });
});
