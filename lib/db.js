const path = require('path');
const mkdirp = require('mkdirp');
const Store = require('./store');

module.exports = {
    rootDir: __dirname,
    createTable(table, callback){
        const dir = path.join(this.rootDir, table);
        mkdirp(dir, err => {
            if(err) return callback(err);
            const store = new Store(dir);
            callback(null, store);
        });
    }
};