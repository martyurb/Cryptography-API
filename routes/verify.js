import express from 'express';
import crypto from 'crypto';
import { recDecrypt } from './decrypt.js'

const verifyRouter = express.Router();

verifyRouter.post('/', (req, res) => {
    // get public key used for verification, private key for decryption
    const publicKey = req.app.get('publicKey');
    const privateKey = req.app.get('privateKey');
    const data = req.body;

    try {
        const decryptedData = recDecrypt(data["data"], privateKey);
        const match = verify(JSON.stringify(decryptedData), data["signature"], publicKey)
        if (match) {
            res.status(204).json();
        } else {
            res.status(400).json({ "success": true, "match": false });
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ "success": false });
    }
});


function verify(data, signature, publicKey) {
    const match = crypto.verify(
        'SHA384',
        Buffer.from(data), {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        },
        Buffer.from(signature, 'base64')
    )

    return match
}


export default verifyRouter;