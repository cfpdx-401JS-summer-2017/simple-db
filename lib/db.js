const path = require('path');
const promisify = require('util').promisify;
const mkdirp = promisify(require('mkdirp'));
const Store = require('./store');


module.exports = {
    rootDir: __dirname,
    createTable(table) {
        const dir = path.join(this.rootDir, table);
        return mkdirp(dir)
            .then(() => new Store(dir));
    }
};