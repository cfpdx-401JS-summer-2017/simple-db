const fs = require('fs');
const db = require('../src/db');
const Store = require('../src/Store');
const assert = require('assert');

describe('test db functions', () => {
  before(() => {});
  it('saves new animal object', () => {
    const Store = new Store({ name: 'yolanda', type: 'animal' });
  }), it('gets object from requested table by id', () => {}), it('gets all objects from requested table', () => {}), it('removes the object by id', () => {});
});
