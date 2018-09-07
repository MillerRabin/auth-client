const Url = require('url');
const http = require('http');
const https = require('https');
const http2 = require('http2');


function request({ protocol, params, postData }) {
    return new Promise((resolve, reject) => {
        const data = [];
        const req = protocol.request(params, (res) => {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data.push(chunk);
            });
            res.on('end', function () {
                if (res.statusCode >= 400) {
                    return reject(data.join(''));
                }
                return resolve(data.join(''));
            });
        });
        req.on('error', function (e) {
            return reject(e);
        });

        if (postData != null)
            req.write(postData);
        req.end();
        return req;
    });
}

function request2({ params, postData }) {
    return new Promise((resolve, reject) => {
        const {
            HTTP2_HEADER_PATH,
            HTTP2_HEADER_METHOD
        } = http2.constants;

        const client = http2.connect(`${params.protocol}//${params.host}`);
        client.on('error', (err) => reject(err));
        const rObj = {
            [HTTP2_HEADER_PATH]: params.pathname,
            [HTTP2_HEADER_METHOD]: params.method
        };

        let buffer = null;
        if (postData != null) {
            buffer = Buffer.from(postData);
            rObj["Content-Type"] = "application/json";
            rObj["Content-Length"] = buffer.length;
        }

        const req = client.request(rObj);
        req.setEncoding('utf8');
        const data = [];
        req.on('data', (chunk) => {
            data.push(chunk)
        });
        req.on('end', () => {
            client.close();
            resolve(data.join(''));
        });
        if (buffer != null)
            req.write(buffer);
        req.end();
    });
}

exports.request = async ({
    url,
    method = 'GET',
    postData = null,
    headers = {},
    useHttp2 = false
}) => {
    const params = Url.parse(url);
    params.method = method;
    params["rejectUnauthorized"] = false;
    let protocol = http;
    if (params.protocol == 'https:')
        protocol = https;
    params.headers = headers;
    if (useHttp2)
        return await request2({ params, postData });
    else
        return await request({ protocol, params, postData });
};

exports.get = ({
    url,
    headers = {}
}) => {
    return exports.request({ url, headers });
};


exports.getJSON = async (url) => {
    const results = await exports.get({
        url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    return JSON.parse(results);
};