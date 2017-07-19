const assert = require('assert');
const path = require('path');
const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const db = require('../lib/db'); // root directory

describe('simple database', () => {
    // set the root directory for test
    const TEST_DIR = path.join(__dirname, 'test-data');

    before(() => rimraf(TEST_DIR));
    
    let books = null;
    // let cat = null;
    // let web = null;
    // let charlie = null;

    before(() => {
        db.rootDir = TEST_DIR;
        return db.createTable('books')
            .then(db => books = db);
    });

    let magazines = null;
    // let newyork = null;
    // let natgeo = null;
    // let time = null;

    before(() => {
        db.rootDir = TEST_DIR;
        db.createTable('magazines')
            .then(db => magazines = db);
    });

    describe('saves', () => {

        it('new book with JSON content', () => {
            let newBook = { author: 'Dr. Seuss', title: 'The Cat in the Hat' };
            return books.save(newBook)
                .then(book => {
                    assert.equal(book.author, newBook.author);
                    assert.equal(book.title, newBook.title);
                    assert.ok(book._id);
                    // QUESTION: add readFile assert?
                });
                // .catch(err => console.log(err));
        });

        it('new magazine with JSON content', () => {
            let newMagazine = { publisher: 'Condé Nast', title: 'The New Yorker' };
            return magazines.save(newMagazine)
                .then(magazine => {
                    assert.equal(magazine.publisher, newMagazine.publisher);
                    assert.equal(magazine.title, newMagazine.title);
                    assert.ok(magazine._id);
                });
                // .catch(err => console.log(err));
        });

    });

    describe('gets', () => {

        it('book by id', () => {
            let newBook = { author: 'Eric Carle', title: 'The Very Hungry Caterpillar' };
            return books.save(newBook)
                .then(book => books.get(book._id))
                .then(book => {
                    assert.equal(book.author, newBook.author);
                    assert.equal(book.title, newBook.title);
                });
        });

        it('magazine by id', () => {
            let newMagazine = { publisher: 'Time Inc.' , title: 'People'};
            return magazines.save(newMagazine)
                .then(magazine => magazines.get(magazine._id))
                .then(magazine => {
                    assert.equal(magazine.publisher, newMagazine.publisher);
                    assert.equal(magazine.title, newMagazine.title);
                });
        });

        it.skip('book that does not exist and returns null', () => {
            return books.get('not-a-real-id')
                .then(book => {
                    assert.equal(book, null);
                })
                .catch(err => {
                    console.log('failure (reject)', err);
                    // return 'is this the end?';
                });
        });

        it.skip('magazine that does not exist and returns null', done => {
            magazines.get('non-existent-id', (err, magazine) => {
                if(err) return done(err);
                assert.equal(magazine, null);
                done();
            });
        });

    });

    describe.skip('gets all', () => {
        
        it('books and returns array', done => {
            // add book
            books.save({ author: 'E. B. White', title: 'Charlotte\'s Web' }, (err, book1) => {
                if(err) return done(err);
                web = book1;
            });
            // add book
            books.save({ author: 'Roald Dahl', title: 'Charlie and the Chocolate Factory' }, (err, book2) => {
                if(err) return done(err);
                charlie = book2;
            });

            books.getAll((err, files) => {
                if(err) return done(err);
                // assert.deepEqual(files, [web, cat, charlie]); // doesn't work
                assert.equal(files.length, 3);
                done();
            });
        });

        // it('books and returns empty array')
        
        it('magazines and returns array', done => {
            // add magazine
            magazines.save({ publisher: 'National Geographic Society', title: 'National Geographic' }, (err, mag1) => {
                if(err) return done(err);
                natgeo = mag1;
            });
            // add magazine
            magazines.save({ publisher: 'Time Inc.', title: 'Time' }, (err, mag2) => {
                if(err) return done(err);
                charlie = mag2;
            });

            magazines.getAll((err, files) => {
                if(err) return done(err);
                assert.equal(files.length, 3);
                done();
            });
        });

    });

    describe.skip('removes', () => {

        it('book by id', done => {
            books.remove(cat._id, (err, status) => {
                assert.deepEqual(status, { removed: true });
                done();
            });
        });

        it('magazine by id returns false', done => {
            magazines.remove('id-dont-exist', (err, status) => {
                assert.deepEqual(status, { removed: false });
                done();
            });
        });

    });
});
