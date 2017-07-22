const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
  constructor(dirName) {
    this.dirName = dirName;
  }

  save(obj, cb) {
    obj._id = shortid.generate();
    const filePath = path.join(this.dirName, obj._id + '.json');
    fs.writeFile(filePath, JSON.stringify(obj), err => {
      cb(err, obj);
    });
  }

  get(id, cb) {
    const filePath = path.join(this.dirName, id + '.json');
    fs.readFile(filePath, (err, obj) => {
      cb(err, JSON.parse(obj));
    });
  }

  getAll(tableType, cb) {
    const dirPath = path.join(this.dirName);
    fs.readdir(dirPath, (err, files) => {
      cb(err, files);
    });
  }

  remove(id, cb) {
    const filePath = path.join(this.dirName, id + '.json');
    fs.unlink(filePath, err => {
      cb(err);
    });
  }
};
