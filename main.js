const network = require('./network.js');
const NodeRSA = require('node-rsa');

let gRsa = null;

async function getRsa() {
    if (gRsa != null) return gRsa;
    const keys = await network.getJSON('https://auth.raintech.su:8093/api/certificate/key');
    gRsa = new NodeRSA();
    gRsa.importKey(keys.public, 'pkcs8-public-pem');
    return gRsa;
}

exports.check = async function (data) {
    const rsa = await getRsa();
    return JSON.parse(rsa.decryptPublic(data, 'utf8'));
};

exports.loginByPassword = async function (data) {
    return await network.postJSON('https://auth.raintech.su:8093/api/users/login/bypassword', data);
};