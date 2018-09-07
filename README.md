**Raintech Auth Client for Node JS and browsers**

Client Part of Raintech Auth Project. It can read and verify certificates from Raintech Auth Server

---

## How to install

npm install raintech-auth-client

---

## How to use

**Node JS**

const client = require('raintech-auth-client');
const cypherCert = //Your certificate
const certificate = client.check(cypherCert);
console.log(certificate);