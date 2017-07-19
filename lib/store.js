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

    get(id) {
        const filename = path.join(this.root, id + '.json');
        return readFile(filename)
            .catch(err => {if(err.code === 'ENOENT') {
                return null;
            }})
            .then(data => JSON.parse(data));
    }

    getAll(){
        const filepath = this.root;
        return readdir(filepath, 'utf8')
            .then( files => {
                const fileIds = files.map(file => file.split('.')[0]);
                return Promise.all(fileIds.map(id => this.get(id)));
            });
    }

    remove(id) {
        const filename = path.join(this.root, id + '.json');
        return unlink(filename)
            .then( () => ({removed: true}))
            .catch(err => {
                if(err.code === 'ENOENT') return {removed: false};
                throw err;
            });
    }
};