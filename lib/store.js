const fs = require('fs');
const path = require('path');

module.exports = class Store {
    constructor(root) {
        this.root = root;
    }

    save(object, callback) {
        const filename = path.join(this.root, 'test');

        // do REAL implementation here...

        // this is here for now to make sure 
        // we have access to the directory
        // create my mkdirp
        fs.writeFile(filename, 'contents', err => {
            if(err) return callback(err);
            callback(null, object);
        });
    }

    // moar methods...
};