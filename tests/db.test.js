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

    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('books', (err, db) => {
            if(err) return done(err);
            books = db;
            done();
        });
    });

    let magazines = null;
    let ny = null

    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('magazines', (err, db) => {
            if(err) return done(err);
            magazines = db;
            done();
        });
    });

    it('saves a new book with JSON content', done => {
        books.save({ author: 'Dr. Seuss', title: 'The Cat in the Hat' }, (err, book) => {
            if(err) return done(err);
            cat = book;

            assert.equal(book.author, 'Dr. Seuss');
            assert.equal(book.title, 'The Cat in the Hat');
            assert.ok(book._id);
            done();
        });
    });

    it('saves a new magazine with JSON content', done => {
        magazines.save({ publisher: 'Condé Nast', title: 'The New Yorker' }, (err, magazine) => {
            if(err) return done(err);
            ny = magazine;

            assert.equal(magazine.publisher, 'Condé Nast');
            assert.equal(magazine.title, 'The New Yorker');
            assert.ok(magazine._id);
            done();
        });
    });

    it('gets a book by id', done => {
        books.get(cat._id, (err, book) => {
            if(err) return done(err);

            assert.equal(book._id, cat._id);
            done();
        });
    });

    it('gets a book null', done => {
        books.get('wefoijwefoi', (err, book) => {
            if(err) return done(err);

            assert.equal(book, null);
            done();
        });
    });

});
