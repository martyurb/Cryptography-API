import express from 'express';
import crypto from 'crypto';

const encryptRouter = express.Router();

encryptRouter.post('/', (req, res) => {
    // get public key used for encryption
    const publicKey = req.app.get('publicKey');
    const data = req.body;
    const r = {};

    try {
        for (const key in data) {
            if (data[key] instanceof Object) {
                data[key] = JSON.stringify(data[key]);
            }
            r[key] = encrypt(data[key], publicKey)
        }
        res.status(200).json(r);
    } catch (err) {
        console.error(err)
        res.status(500).json({ "success": false })
    }
});


function encrypt(data, publicKey) {
    const encryptedDataBuffer = crypto.publicEncrypt({
        key: publicKey,
        oaepHash: 'SHA384',
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    }, Buffer.from(data));

    // encode to base64 for safe transport later
    const encryptedData = encryptedDataBuffer.toString('base64');

    return encryptedData
}


export { encryptRouter, encrypt };