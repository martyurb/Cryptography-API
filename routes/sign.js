import express from 'express';
import crypto from 'crypto';

const signRouter = express.Router();

signRouter.post('/', (req, res) => {
    // get private key used for signning
    const privateKey = req.app.get('privateKey');
    const data = req.body;

    try {
        const r = { "signature": sign(JSON.stringify(data), privateKey) }
        res.status(200).json(r);
    } catch (err) {
        console.error(err)
        res.status(500).json({ "success": false })
    }
});


function sign(data, privateKey) {
    const dataSignatureBuffer = crypto.sign(
        'SHA384',
        Buffer.from(data), {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }
    );

    // encode to base64 for safe transport later
    const dataSignature = dataSignatureBuffer.toString('base64');
    return dataSignature
}


export default signRouter;