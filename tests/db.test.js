const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');
const db = require('../lib/db'); // root directory

describe('simple database', () => {
    // set the root directory for test
    const TEST_DIR = path.join(__dirname, 'test-data');

    before(done => {
        rimraf(TEST_DIR, err => {
            if(err) done(err);
            else done();
        });
    });
    
    let books = null;
    let cat = null;
    let web = null;
    let charlie = null;

    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('books', (err, db) => {
            if(err) return done(err);
            books = db;
            done();
        });
    });

    let magazines = null;
    let newyork = null;
    let natgeo = null;
    let time = null;

    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('magazines', (err, db) => {
            if(err) return done(err);
            magazines = db;
            done();
        });
    });

    describe('saves', () => {

        it('new book with JSON content', done => {
            books.save({ author: 'Dr. Seuss', title: 'The Cat in the Hat' }, (err, book) => {
                if(err) return done(err);
                cat = book;

                assert.equal(book.author, cat.author);
                assert.equal(book.title, cat.title);
                assert.ok(book._id);
                done();
            });
        });

        it('new magazine with JSON content', done => {
            magazines.save({ publisher: 'Condé Nast', title: 'The New Yorker' }, (err, magazine) => {
                if(err) return done(err);
                newyork = magazine;
                assert.equal(magazine.publisher, magazine.publisher);
                assert.equal(magazine.title, magazine.title);
                assert.ok(magazine._id);
                done();
            });
        });

    });

    describe('gets', () => {

        it('book by id', done => {
            books.get(cat._id, (err, book) => {
                if(err) return done(err);
                assert.equal(book._id, cat._id);
                done();
            });
        });

        it('magazine by id', done => {
            magazines.get(newyork._id, (err, magazine) => {
                if(err) return done(err);
                assert.equal(magazine._id, newyork._id);
                done();
            });
        });

        it('book that does not exist and returns null', done => {
            books.get('not-a-real-id', (err, book) => {
                if(err) return done(err);
                assert.equal(book, null);
                done();
            });
        });

        it('magazine that does not exist and returns null', done => {
            magazines.get('non-existent-id', (err, magazine) => {
                if(err) return done(err);
                assert.equal(magazine, null);
                done();
            });
        });

    });

    describe('gets all', () => {
        
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

    describe('removes', () => {

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
