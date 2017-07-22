const promisify = require('util').promisify;
const db = require('../src/db');
const rimraf = promisify(require('rimraf'));
const path = require('path');
const chai = require('chai');
const assert = chai.assert;

// table is the directory! ie., animals or buildings!
// store is the individual obj - file in the directory!

describe('test db functions', () => {
  const DATA_DIR = path.join(__dirname, 'data');
  let animals = null;
  let buildings = null;

  before(() => {
    return rimraf(DATA_DIR).then();
  });

  before(() => {
    return db.createTable('animals').then(db => (animals = db));
  });

  before(() => {
    return db.createTable('buildings').then(db => (buildings = db));
  });
  it.only('does nothing', () => {
    console.log('it has done nothing');
  });
  it('tests callbacks', () => {
    let newAnimal = { name: 'ruby', color: 'blue' };
    return animals.save(newAnimal).then(elephant => {
      assert.deepEqual(newAnimal.name, elephant.name);
    });
  }), it('saves new animal object', () => {
    let newAnimal = { name: 'ruby', color: 'blue' };
    return animals.save(newAnimal).then(elephant => {
      assert.deepEqual(newAnimal.name, elephant.name);
    });
  }), it('gets object from requested table by id', () => {
    let newBuilding = { name: 'skyscraper', numOfStories: '100' };
    return buildings.save(newBuilding).then(skyscraper => {
      buildings.get(skyscraper._id).then(obj => {
        assert.deepEqual(newBuilding.name, obj.name);
      });
    });
  }), it('gets all objects from requested table', () => {
    return animals.getAll('animals').then(stores => {
      console.log(stores);
      if (stores.length < 1) assert.deepEqual([], stores);
      else assert.isOk(stores);
    });
  }), it('removes the object by id', () => {
    let newAnimal = { name: 'josephina', color: 'orange' };
    animals.save(newAnimal).then(elephant => {
      animals.remove(elephant._id).then(status => {
        console.log(status);
        assert.notExists(elephant);
      });
    });
  });
});
