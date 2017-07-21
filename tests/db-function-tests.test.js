const db = require('../src/db');
const path = require('path');
const assert = require('assert');
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
    db.createTable('animals', (err, store) => {
      if (err) throw ('something went wrong ', err);
      else {
        store.save(obj, cb);
      }
    });
  }), it('gets object from requested table by id', () => {}), it('gets all objects from requested table', () => {}), it('removes the object by id', () => {});
});
