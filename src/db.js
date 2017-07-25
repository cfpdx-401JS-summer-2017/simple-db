const path = require('path');
const promisify = require('util').promisify;
const mkdirp = promisify(require('mkdirp'));
const Store = require('./Store');
const rootDir = path.join(__dirname, '../tests/data');

module.exports = {
  rootDir: rootDir,
  createTable(table) {
    const tableDir = path.join(rootDir, '/', table);
    return mkdirp(tableDir).then(() => new Store(tableDir));
  }
};
