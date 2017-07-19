const promisify = require('util').promisify;
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);


module.exports = class Store {
    constructor(root) {
        this.root = root;
    }

    save(object) {
        object._id = shortid.generate();
        const filename = path.join(this.root, object._id + '.json');
        return writeFile(filename, JSON.stringify(object))
            .then( ()  => object );
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
            }
        });
    }

    remove(id, callback) {
        const filename = path.join(this.root, id + '.json');
        fs.unlink(filename, err => {
            if(err) return callback(err.code === 'ENOENT' ? null : err, { removed: false } );
            callback(null, { removed: true } );
        });
    }
};