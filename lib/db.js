const path = require('path');
const mkdirp = require('mkdirp');
const Store = require('./store');

module.exports = {
    // prop for storing rootDir
    rootDir: __dirname,
    createTable(table, callback) {
        // make the directory for the store
        const dir = path.join(this.rootDir, table);
        mkdirp(dir, err => {
            if(err) return callback(err);
            // async so we have to wait to create here...
            const store = new Store(dir);
            // now pass it back via callback...
            callback(null, store);
        });
    }
    
};