import express, { json } from 'express';
import { encryptRouter } from './routes/encrypt.js';
import { decryptRouter } from './routes/decrypt.js';
import signRouter from './routes/sign.js';
import verifyRouter from './routes/verify.js';
import { getKeys } from './keys.js';

const app = express();

const keyPair = getKeys();

app.set('publicKey', keyPair.publicKey);
app.set('privateKey', keyPair.privateKey);

app.set('port', process.env.PORT || 3030);

app.use(json());

app.use('/decrypt', decryptRouter);
app.use('/encrypt', encryptRouter);
app.use('/sign', signRouter);
app.use('/verify', verifyRouter);

app.listen(app.get('port'), () => {
    console.log('Server listening on port ' + app.get('port'));
});


export default app;