import express from 'express';
import crypto from 'crypto';

const decryptRouter = express.Router();

decryptRouter.post('/', (req, res) => {
    // get get private key used for decryption
    const privateKey = req.app.get('privateKey');
    const data = req.body;
    const r = {};

    try {
        for (const key in data) {
            try {
                r[key] = JSON.parse(decrypt(data[key], privateKey));
            } catch (err) {
                try {
                    r[key] = decrypt(data[key], privateKey);
                } catch (err) {
                    r[key] = data[key]
                }
            }
        }
        res.status(200).json(r);
    } catch (err) {
        console.error(err)
        res.status(500).json({ "success": false })
    }
});


function decrypt(data, privateKey) {
    const decryptedData = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'SHA384'
    }, Buffer.from(data, 'base64'))

    return decryptedData.toString()
}

// used for verification endpoint
function recDecrypt(obj, privateKey) {
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (typeof value === 'string') {
            try {
                const decrypted = decrypt(value, privateKey);
                try {
                    obj[key] = JSON.parse(decrypted)
                    recDecrypt(obj[key], privateKey) // decrypted field was a stringified object, check it's children
                } catch (err) {
                    // decrypted field was not an encrypted object
                    obj[key] = decrypted
                }
            } catch (err) {
                // string was not encrypted / decryption error
                // console.error(err)
            }
        } else if (typeof value === 'object') {
            recDecrypt(value, privateKey)
        }
    });
    return obj
}


export { decryptRouter, decrypt, recDecrypt };