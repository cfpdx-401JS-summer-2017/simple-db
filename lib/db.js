// cSpell:ignore promisify
const promisify = require('util').promisify;
const path = require('path');
const Store = require('./store');
const mkdirp = promisify(require('mkdirp'));

module.exports = {
    // prop for storing rootDir
    rootDir: __dirname,
    createTable(table) {
        // make the directory for the store
        const dir = path.join(this.rootDir, table);
        return mkdirp(dir)
            .then(()=>  new Store(dir));
        // async so we have to wait to create here...
        // now pass it back via callback...
    }
};