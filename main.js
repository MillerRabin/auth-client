const network = require('./network.js');
const NodeRSA = require('node-rsa');

let gRsa = null;
const url = 'https://auth.raintech.su:8093';

async function getRsa() {
    if (gRsa != null) return gRsa;
    const keys = await network.getJSON(`${url}/api/certificate/key`);
    gRsa = new NodeRSA();
    gRsa.importKey(keys.public, 'pkcs8-public-pem');
    return gRsa;
}

exports.check = async function (data) {
    const rsa = await getRsa();
    return JSON.parse(rsa.decryptPublic(data, 'utf8'));
};

exports.loginByPassword = async function (data) {
    return await network.postJSON(`${url}/api/users/login/bypassword`, data);
};