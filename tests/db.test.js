const assert = require('assert');
const path = require('path');
const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const db = require('../lib/db'); // root directory

describe('simple database', () => {
    // set the root directory for test
    const TEST_DIR = path.join(__dirname, 'test-data');
    let books = null;
    let magazines = null;

    beforeEach(() => rimraf(TEST_DIR));

    beforeEach(() => {
        db.rootDir = TEST_DIR;
        return db.createTable('books')
            .then(db => books = db);
    });

    beforeEach(() => {
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
        });

        it('new magazine with JSON content', () => {
            let newMagazine = { publisher: 'Condé Nast', title: 'The New Yorker' };
            return magazines.save(newMagazine)
                .then(magazine => {
                    assert.equal(magazine.publisher, newMagazine.publisher);
                    assert.equal(magazine.title, newMagazine.title);
                    assert.ok(magazine._id);
                });
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

    describe('gets all', () => {
        
        it('books and returns array', () => {
            let book1 = { author: 'Roald Dahl', title: 'Charlie and the Chocolate Factory' };
            let book2 = { author: 'C. S. Lewis', title: 'The Lion, the Witch and the Wardrobe' };
            
            //QUESTION: how can I chain the saves?
            books.save(book1);
            books.save(book2);
            return (books.getAll())
                .then(files => {
                    //QUESTION: how can I test the array?
                    assert.equal(files.length, 2);
                });
        });

        // it('books and returns empty array')
        
        it.skip('magazines and returns array', done => {
            let Magazine
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
