
exports.data = {
    iAuth: null,
    configurations: {}
};

exports.requestingConfigurations = (intentionStorage, data = {}) => {
    exports.data.iAuth = intentionStorage.createIntention({
        title: 'Need authenticate device',
        input: 'AuthConfiguration',
        output: 'AuthData',
        enableBroadcast: false,
        onData: (status, intention, value) => {
            if (status == 'accepting')
                return { data };
            if (status == 'authConfiguration')
                exports.data.configurations[intention.origin] = value;
        }
    });
};

exports.load = function (intentionStorage) {
    requestingConfigurations(intentionStorage)
};

exports.unload = function (intentionStorage) {
    intentionStorage.deleteIntention(exports.data.iAuth);
    console.log('unloaded raintech auth client');
};