const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const writeFile = promisify(fs.readFile);
const readFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const shortid = require('shortid');

module.exports = class Store {
  constructor(dirName) {
    this.dirName = dirName;
  }

  save(obj) {
    obj._id = shortid.generate();
    const filePath = path.join(this.dirName, '/' + obj._id + '.json');
    return writeFile(filePath, obj).then(() => obj);
  }

  get(id) {
    const filePath = path.join(this.dirName, id + '.json');
    console.log(filePath);
    return readFile(filePath).then(obj => obj);
  }

  getAll() {
    const filePath = path.join(this.dirName, '/');
    console.log(filePath);
    return readdir(filePath).then(files => files);
  }

  remove(id) {
    const filePath = path.join(this.dirName, id + '.json');
    console.log(filePath);
    unlink(filePath).then(status => status);
  }
};
