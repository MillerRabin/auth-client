const assert = require('assert');
const { IntentionStorage } = require('intention-storage');
const iMain = require('../intentionsMain.js');
describe('Get Keys', function() {
    let intentionStorage = null;

    describe('Prepare intention storage', function () {
        it ('Create storage', async function () {
            intentionStorage = new IntentionStorage();
            const link = intentionStorage.addLink([
                { name: 'WebAddress', value: 'localhost'},
                { name: 'IPPort', value: '10011'}
            ]);
            await link.waitConnection();
        });
    });

    describe('Init', function() {
        it('Should load module', function() {
            iMain.requestingKeys(intentionStorage, null, { message: 'hello'} );
            assert.notStrictEqual(iMain.data.iAuth, null);
        });

        it('Wait 10 seconds', function (done) {
            this.timeout(0);
            setTimeout(function () {
                done();
            }, 10000);
        });

        it('Check keys', function () {
            const conf = iMain.data.keys['localhost-10011'];
            assert.notEqual(conf, null);
            assert.notEqual(conf.public, null);
            assert.notEqual(conf.private, null);
            assert.notEqual(conf.id, null);
        });
    });

    describe('Test loaded keys', function () {
        it('Load', async function () {
            iMain.deleteKeys('localhost-10011');
            await iMain.loadKeys();
            const key = iMain.data.keys['localhost-10011'];
            assert.notEqual(key, null);
            assert.notEqual(key.public, null);
            assert.notEqual(key.private, null);
            assert.notEqual(key.id, null);
        });
    });

    describe('Close', function () {
        it ('should unload module', function () {
            iMain.unload(intentionStorage);
        });

        it('close', function () {
            intentionStorage.close();
        });
    });
});