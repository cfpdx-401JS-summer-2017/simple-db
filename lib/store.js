const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const shortid = require('shortid');
module.exports = class Store {
    constructor(root) {
        this.root = root;
    }

    save(object, callback) {
        const toDir = path.join(__dirname,'animals');
        const filename = path.join(this.root, 'test');
        

        // do REAL implementation here...

        // this is here for now to make sure 
        // we have access to the directory
        // create my mkdirp
        mkdirp(toDir, function (err) {
            if (err) return err;
            else 
                fs.writeFile(filename, 'contents', err => {
                    if(err) return callback(err);
                    callback(null, object);
                });
        });

        
    }

    // moar methods...
};