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


        it('book that does not exist and returns null', () => {
            return books.get('not-a-real-id')
                .then(book => {
                    assert.equal(book, null);
                });
        });

    });

    describe('gets all', () => {
        
        it('books and returns array', () => {
            let book1 = { author: 'Roald Dahl', title: 'Charlie and the Chocolate Factory' };
            let book2 = { author: 'C. S. Lewis', title: 'The Lion, the Witch and the Wardrobe' };
            
            //QUESTION: correct way to chain?
            return books.save(book1)
                .then(books.save(book2))
                .then(books.getAll(files => {
                    //QUESTION: how can I test the array?
                    assert.equal(files.length, 2);
                }));
        });

        // it('books and returns empty array')
        
        it('magazines and returns array', () => {
            let mag1 = { publisher: 'National Geographic Society', title: 'National Geographic' };
            let mag2 = { publisher: 'Time Inc.', title: 'Time' };
            
            return magazines.save(mag1)
                .then(magazines.save(mag2))
                .then(magazines.getAll(files => {
                    assert.equal(files.length, 2);
                }));
        });

    });

    describe('removes', () => {

        it('book by id', () => {
            let book = { author: 'William Shakespeare', title: 'Hamlet' };
            
            return books.save(book)
                .then(book => books.remove(book._id))
                .then(status => {
                    assert.deepEqual(status, ({ removed: true }));
                });
        });

        it('magazine by id returns false', () => {
            return magazines.remove('id-dont-exist')
                .then(status => {
                    assert.deepEqual(status, ({ removed: false }));
                });
        });

    });
});
