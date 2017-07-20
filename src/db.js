const db = require('./db');
const path = require('path');
const mkdirp = require('');
const Store = require('./Store');
db.rootDir = path.join(__dirname, '../data');
const animals = db.createTable('animals');
const buildings = db.createTable('buildings');

function createTable(typeOfObj) {
  new Store(path.join(this.rootDir, tablename));
  callback();
}
