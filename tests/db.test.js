const assert = require('assert');
const path = require('path');
const rimraf = require('rimraf');
const db = require('../lib/db'); // root directory

describe('simple database', () => {
    // set the root directory for test
    const TEST_DIR = path.join(__dirname, 'data');

    // delete test data directory
    before(done => {
        rimraf(TEST_DIR, err => {
            if(err) done(err);
            else done();
        });
    });
    
    let books = null;

    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('books', (err, store) => {
            if(err) return done(err);
            books = store;
            done();
        });
    });

    let magazines = null;

    before(done => {
        db.rootDir = TEST_DIR;
        db.createTable('magazines', (err, store) => {
            if(err) return done(err);
            magazines = store;
            done();
        });
    });

    it('saves a new book with JSON content', done => {
        books.save({ author: 'Dr. Seuss', title: 'The Cat in the Hat' }, (err, book) => {
            if(err) return done(err);
            assert.equal(book.author, 'Dr. Seuss');
            assert.equal(book.title, 'The Cat in the Hat');
            done();
        });
    });

    it('saves a new magazine with JSON content', done => {
        magazines.save({ publisher: 'Condé Nast', title: 'The New Yorker' }, (err, magazine) => {
            if(err) return done(err);
            assert.equal(magazine.publisher, 'Condé Nast');
            done();
        });
    });

});
