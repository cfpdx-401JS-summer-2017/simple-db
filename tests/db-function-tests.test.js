const db = require('../src/db');
const path = require('path');
const fs = require('fs');
const chai = require('chai');
const assert = chai.assert;
const rimraf = require('rimraf');
const store = require('../src/Store');

// table is the directory! ie., animals or buildings!
// store is the individual obj - file in the directory!

describe('test db functions', () => {
  const DATA_DIR = path.join(__dirname, 'data/');

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
    const obj = { name: 'yolanda', color: 'pink' };
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
  }), it('gets object from requested table by id', () => {}), it('gets all objects from requested table', () => {}), it('removes the object by id', () => {});
});
