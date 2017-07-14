const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
    constructor(root) {
        this.root = root;
    }

    save(object, callback) {
        object._id = shortid.generate();
        const filename = path.join(this.root, object._id + '.json');
        // do REAL implementation here...
        // this is here for now to make sure 
        // we have access to the directory
        // create my mkdirp
        fs.writeFile(filename, JSON.stringify(object), err => {
            if(err) return callback(err);
            callback(null, object);
        });
        return object;
    }

    get(id, callback) {
        const filename = path.join(this.root, id + '.json');
        fs.readFile(filename, (err, data) => {
            if (err) return callback(err.code === 'ENOENT' ? null : err, null);
            callback(null, JSON.parse(data));
        });
    }

    getAll(callback){
        const filepath = this.root;
        let allObjs = [];
        fs.readdir(filepath, 'utf8', (err, files) => {
            if (err) return callback(err);

            if (!files.length) return callback(null, allObjs);

            for (let i = 0; i < files.length; i++) {

                let fileId = files[i].split('.')[0];

                this.get(fileId, (err, obj) => {
                    if (err) return callback(err);
                    allObjs[i] = obj;

                    if (i === files.length-1) callback(null, allObjs);
                });

                // allObjs.push(files[i]);
            }
            // callback(allObjs); THIS DOESN'T DO ANYTHING
        });
        // callback (allObjs);
    }

    // files = [filename.json, filename2.json, etc.]
    // files.forEach( 
    //     1. detach filename from .json extension
    //     2. push detached filename into another container
    //     3. use get(id) method in the store to get the object that is in the file
    //     4. store returned object into an array
    //     5. when it has all been looped through, return that array
    // )


    remove(id, callback) {
        const filename = path.join(this.root, id + '.json');
        fs.unlink(filename, err => {
            if(err) return callback(err.code === 'ENOENT' ? null : err, { removed: false } );
            callback(null, { removed: true } );
        });
    }
};