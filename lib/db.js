const promisify = require('util').promisify;
const path = require('path');
const mkdirp = promisify(require('mkdirp'));
const Store = require('./store');


module.exports = {
    // prop for storing rootDir
    rootDir: __dirname,
    createTable(table) {
        const dir = path.join(this.rootDir, table);
        return mkdirp(dir)
            .then( () => new Store(dir) );
    }
    
};