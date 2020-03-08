const assert = require('assert');
const { IntentionStorage } = require('intention-storage');
const iMain = require('../intentionsMain.js');
describe('Get Configuration', function() {
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
            iMain.requestingConfigurations(intentionStorage, { message: 'hello'} );
            assert.notStrictEqual(iMain.data.iAuth, null);
        });

        it('Wait 10 seconds', function (done) {
            this.timeout(0);
            setTimeout(function () {
                done();
            }, 10000);
        });

        it('Check configuration', function () {
            const conf = iMain.data.configurations['ws://localhost:10011'];
            assert.notEqual(conf, null);
            assert.notEqual(conf.public, null);
            assert.notEqual(conf.private, null);
            assert.notEqual(conf.certificate, null);
            assert.notEqual(conf.id, null);
            assert.deepEqual(conf.data, { message: 'hello'});
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