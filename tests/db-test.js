const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const assert = require('assert');
const path = require('path');
const db = require('../lib/db');



describe('db', () => {
    const TEST_DIR = path.join(__dirname, 'test');

    before(() => rimraf(TEST_DIR));

    let alcohol = null;
    let ipa = null;
    let drinks = [];

    before(() => {
        db.rootDir = TEST_DIR;
        return db.createTable('alcohol')
            .then(store => { alcohol = store; });
    });

    it.only('saves alcohol to the db', () => {
        return alcohol.save({ type: 'beer', name: 'IPA' })
            .then(savedBeer => {
                ipa = savedBeer;
                drinks.push(ipa);
                assert.equal(savedBeer.type, 'beer');
                assert.equal(savedBeer.name, 'IPA');
                assert.ok(savedBeer._id);
            });
    });

    it('gets alcohol by id', done => {
        alcohol.get(ipa._id, (err, beer) => {
            if (err) return done(err);
            assert.equal(beer._id, ipa._id);
            done();
        });

    });

    it('returns all of the alcohol objects', (done) => {
        alcohol.save({ type: 'hardA', name: 'gin' }, (err, saved) => {
            if (err) return done(err);
            drinks.push(saved);
        });
        alcohol.getAll((err, alcoholArray) => {
            if (err) return done(err);
            assert.deepEqual(alcoholArray, drinks);
            done();

        });


    });

    it('removes alcohol by id', done => {
        alcohol.remove(ipa._id, (err, data) => {
            if (err) return done(err);
            assert.deepEqual(data, { removed: true });
            done();
        });
    });

});

