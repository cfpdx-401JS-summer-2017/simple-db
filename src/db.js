const path = require('path');
const mkdirp = require('mkdirp');
const Store = require('./Store');
const rootDir = path.join(__dirname, '../tests/data');

module.exports = {
  rootDir: __dirname,
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
