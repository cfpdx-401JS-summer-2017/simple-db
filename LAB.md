<img src="https://cloud.githubusercontent.com/assets/478864/22186847/68223ce6-e0b1-11e6-8a62-0e3edc96725e.png" width=30> Simple Database
===

## Doc/Resources
* [Node fs docs](https://nodejs.org/api/fs.html) - specifically the methods `readFile` and `writeFile`
* [Node path docs](https://nodejs.org/api/path.html) - specifically the methods `join`

* JSON [stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) 
and [parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
* Checkout `mkdirp` and `rimraf` on `npm`

## Description:

You library exports a single, global db that has a:
* `rootDir` property to set the root dir:
```js
const db = require('../lib/db');
db.rootDir = __dirname + '/test';
```
* `createTable` method that returns a store:
```js
const db = require('../lib/db');
db.rootDir = __dirname + '/test';
const animals = db.createTable('animals');
const buildings = db.createTable('buildings');
```

Use a class for your return store that takes the directory that it should use in the constructor:

```js
return new Store(path.join(rootDir, tablename));
```

The store offers `save`, `get`, `getAll`, and `remove` methods.

Use json as a file format to store (serialized and deserialized) javascript objects.

**You are strongly encouraged to pair on this assignment**

## Testing

You should use TDD to drive the implementation. Note that these are mostly E2E (end to end) tests, but we will still use the 
basic structure of mocha's testing ability.

The setup for the test can be difficult as we want to ensure the tests start with a "clean" file directory 
**(hint: this is where `rimraf` will come in handy)** 
You will want to read about [Mocha's before/after hooks](https://mochajs.org/#hooks)

Your tests will need to handle asynchronous calls.  You will need to read about [Mocha and async support](https://mochajs.org/#asynchronous-code)

## Requirements/Guidelines

For today, your db should offer the following methods:

* `.save(<objectToSave>, callback)`
  * creates a `_id` property for the object
  * saves the object in a file, where the filename is the `_id`. e.g. if the id is 12345, the file will be 12345.json
  * returns `objectToSave` with added `_id` property
* `.get(<id>, callback)`
  * returns the object from the requested table that has that id
  * return `null` if that id does not exist
* `.getAll(callback)`
  * returns array of all objects from the requested table
  * return empty array `[]` when no objects
* `.remove(<id>, callback)`
  * removes the object
  * return `{ removed: true }` or `{ removed: false }`


Here is an example of how your module might be imported (required) and used:

```js
const db = require('./db');
db.rootDir = path.join(__dirname, 'data');

const animals = db.createTable('animals');

animals.save({ name: 'garfield' }, (err, cat) => {
  
    if(err) return console.log('ERROR', err);
    
    const id = cat._id;
    
    animals.get(id, (err, cat) => {
      if(err) return console.log('ERROR', err);
      console.log('got cat', cat);
    } 
});

animals.getAll((err, animals) => {
  if(err) return console.log('ERROR', err);
  console.log('we have', animals.length, 'animals');
});
```

Make sure to test:

* Two types of "objects" (e.g. "animals" vs "stores")
* Two different id's of same object type.


  ```
  ---+ data
     |
     +--+ animals
        |
        +---* 34fdr5.json
        |
        +---* 65rej5.json
        |
        +---* 93odb2.json
     |
     +--+ buildings
        |
        +---* 3tlf4.json
        |
        +---* 23dew3.json
  ```
      
* Use `JSON.parse` and `JSON.stringify` to move from javascript object to file representation

Standard repository/dev stuff: README, package.json, travis-ci, tests, meaningful commits, named npm scripts, etc.

## Rubric:

* Tests: 6pts
* Async Coding: 6pts
* Functional Correct Behavior: 4pts
* Project (Module) Organization: 4pts
