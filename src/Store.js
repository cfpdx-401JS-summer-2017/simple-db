const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
  constructor(dirName) {
    this.dirName = dirName;
  }

  save(obj, cb) {
    obj._id = shortid.generate();
    const fileName = path.join(this.dirName, obj._id + '.json');
    fs.writeFile(fileName, JSON.stringify(obj), err => {
      cb(err, obj);
    });
  }

  get(id, cb) {
    const animalPath = process.cwd() + '/tests/data/animals/' + id + '.json';
    const buildingPath = process.cwd() + '/tests/data/buildings/' + id + '.json';
    let path = '';
    fs.existsSync(animalPath) ? (path = animalPath) : (path = buildingPath);
    fs.readFile(path, (err, retrievedObj) => {
      cb(err, JSON.parse(retrievedObj));
    });
  }

  getAll(tableType, cb) {
    const path = process.cwd() + '/tests/data/' + tableType;
    fs.readdir(path, (err, files) => {
      cb(err, files);
    });
  }

  remove(id, cb) {
    console.log('in remove: ', id);
    const animalPath = process.cwd() + '/tests/data/animals/' + id + '.json';
    const buildingPath = process.cwd() + '/tests/data/buildings/' + id + '.json';
    let path = '';
    fs.existsSync(animalPath) ? (path = animalPath) : (path = buildingPath);
    console.log(path);
    fs.unlink(path, err => {
      let success = 'yay!';
      console.log(path);
      console.log(err);
      cb(err, status);
      // return removed = true or removed = false;
      // cb(err, JSON.parse(retrievedObj));
    });
  }
};
/*


.remove(<id>, callback)
removes the object
return { removed: true } or { removed: false } */
