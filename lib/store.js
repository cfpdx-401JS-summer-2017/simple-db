const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
    constructor(root) {
        this.root = root;
        // this._id = shortid.generate();
    }

    save(object, callback) {
        object._id = shortid.generate();

        const filename = path.join(this.root, object._id + '.json');

        fs.writeFile(filename, JSON.stringify(object), err => {
            if (err) return callback(err);
            callback(null, object);
        });
    }

    get(id, callback) {
        const filename = path.join(this.root, id + '.json');

        fs.readFile(filename, (err, data) => {
            if (err) return callback(null, null);
            const contents = JSON.parse(data);
            
            callback(null, contents);
        });
    }

    getAll(callback) {
        // returns array of all objects from the requested table
        // return empty array [] when no objects

        fs.readdir(this.root, (err, files) => {
            if (err) return callback(null, null);
            // callback(null, files);
            var list = [];
            let count = files.length;

            files.forEach(file => {
                const filePath = path.join(this.root, file);

                fs.readFile(filePath, 'utf8', (err, contents) => {
                    if (err) return callback(null, null);
                    list.push(JSON.parse(contents));
                    count--;
                    if (count === 0) callback(null, list);
                });
                
            });

            // if (list.length !== 0) callback(null, list);     
        });
    }

    // remove(id, callback) {
    //     const filename = path.join(this.root, id + '.json');
        
    //     var status = {};
        
    //     this.get(id, (err, contents) => {
    //         if (err) {
    //             status = { removed: false };
    //         }
    //         else {
    //             fs.unlink(filename, (err) => {
    //                 if (err) return callback(err, null);
    //                 status = { removed: true };
    //             });
    //         }
    //     });

    //     callback(null, status);
    // }

};
