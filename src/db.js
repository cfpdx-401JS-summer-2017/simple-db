const path = require('path');
const mkdirp = require('mkdirp');
const Store = require('./Store');
const rootDir = path.join(__dirname, '../tests/data');

// const DATA_DIR = path.join(__dirname, 'data/');
module.exports = {
  rootDir: rootDir,
  createTable(table, cb) {
    const tableDir = rootDir + '/' + table;
    mkdirp(tableDir, err => {
      if (err) throw 'the error is ' + err;
      else {
        const store = new Store(tableDir);
        cb(err, store);
      }
    });
  }
};
