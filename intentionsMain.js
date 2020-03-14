const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs').promises;

exports.data = {
    iAuth: null,
    keys: {}
};

exports.loadKeys = async (keyPath) => {
    try {
        const fname = (keyPath == null) ? path.join(__dirname, 'keys') : keyPath;
        const dir = await fs.opendir(fname);
        const files = await dir.read();
        const promises = [];
        for (const file of files)
            promises.push(fs.readFile(file, 'utf8')
                .then(d => exports.data.keys[file] = d)
                .catch(() => null));
        await Promise.all(promises)
    } catch (e) {}
};

function getOriginName(origin) {
    const parts = origin.split('://');
    const fname = (parts[1] == null) ? parts[0] : parts[1];
    return fname.replace(/:/gi, '-');
}

exports.saveKey = async (keyPath, keyName) => {
    const key = exports.data.keys[keyName];
    if (key == null) throw Error(`Key ${keyName} does not exists`);
    const fpath = (keyPath == null) ? path.join(__dirname, 'keys') : keyPath;
    await mkdirp(fpath);
    const fname = path.join(fpath, keyName);
    await fs.writeFile(fname, key);
};

exports.requestingConfigurations = (intentionStorage, keyPath, data = {}) => {
    exports.data.iAuth = intentionStorage.createIntention({
        title: 'Need authenticate device',
        input: 'AuthConfiguration',
        output: 'AuthData',
        enableBroadcast: false,
        onData: async (status, intention, value) => {
            if (status == 'accepting')
                return { data };
            if (status == 'authConfiguration') {
                const name = getOriginName(intention.origin);
                exports.data.keys[name] = value;
                await exports.saveKey(keyPath, name);
            }
        }
    });
};

exports.load = async (intentionStorage, keyPath) => {
    await exports.loadKeys(keyPath);
    requestingConfigurations(intentionStorage, keyPath);
};

exports.unload = function (intentionStorage) {
    intentionStorage.deleteIntention(exports.data.iAuth);
    console.log('unloaded raintech auth client');
};