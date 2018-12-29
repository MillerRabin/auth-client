**Raintech Auth Client for Node JS and browsers**

Client Part of Raintech Auth Project. It can read and verify certificates from Raintech Auth Server

---

## How to install

npm install raintech-auth-client

---

## How to use

**Node JS**
Login by password to obtain certificate

```javascript
const client = require('raintech-auth-client');
const response = client.loginByPassword({
    loginOrEmail: 'Your login',
    password: 'Your password',
    referer: 'link to your resource'
})
const certificate = response.certificate;
console.log(certificate);
```

Check certificate

```javascript
const client = require('raintech-auth-client');
const certificate = //Your certificate
const session = await client.check(cypherCert);
console.log(certificate);
```