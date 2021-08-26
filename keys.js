import fs from 'fs';
import crypto from 'crypto';


function genKeys() {
    // encryption with EC keys is not supported by the built-in crypto library, RSA was chosen instead
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }
    });

    return keyPair
}

function getKeys() {
    const path = './keys.json'

    if (fs.existsSync(path)) {
        // previously generated key file exists
        try {
            const jsonBuffer = fs.readFileSync(path);
            const keyPair = JSON.parse(jsonBuffer);
            return keyPair
        } catch (err) {
            console.error(err)
        }

    } else {
        // file doesn't exist, generate ney kew pair
        const keyPair = genKeys();
        const jsonString = JSON.stringify(keyPair);
        fs.writeFile(path, jsonString, (err) => {
            if (err) {
                console.error('Error writing file', err);
            } else {
                console.log('Successfully wrote keys to file');
            }
        });
        return keyPair
    }
}


export { getKeys, genKeys };