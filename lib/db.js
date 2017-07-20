// cSpell:ignore promisify
const promisify = require('util').promisify;
const path = require('path');
const Store = require('./store');
const mkdirp = promisify(require('mkdirp'));

module.exports = {
    rootDir: __dirname,
    createTable(table) {
        const dir = path.join(this.rootDir, table);
        return mkdirp(dir)
            .then(()=>  new Store(dir));
    }
};