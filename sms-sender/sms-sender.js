const mysql = require('mysql');

const request = require('request');

const twilio = require('twilio');
const client = new twilio('key1', 'key2');

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const encryptPass = 'd6F3Efeq';

const con = mysql.createConnection({
    host: '2someip',
    user: 'ori',
    password: 'somepassword',
    database: 'wedding',
});

con.connect((err) => {
    if (err) throw err;

    con.query('select * from guests where arriving is null and cellphone is not null and cellphone <> ""', (err, results) => {
        if (err) throw err;

        if (!results.length) return;

        smsCounter = results.length;
        sendSms(results, 0);
    });
});

let smsCounter = 0;
const sendSms = (results, index) => {
    const dbResult = results[index];
    const token = encrypt(dbResult.cellphone);
    let url = `https://neta.orierel.com/#/${token}`;

    const name = `${dbResult.first_name} ${dbResult.last_name}`.trim();

    request.post({
        url: 'https://www.googleapis.com/urlshortener/v1/url?key=',
        json: { longUrl: url }
    }, (err, res, body) => {
        if (err) {
            console.log(`Couldn\'t shorten URL for ${name} ${dbResult.cellphone}`);
        }
        else {
            url = body.id;
        }

        smsCounter--;
        return client.messages.create({
            to: dbResult.cellphone,
            from: 'Neta Ori',
            body: `שלום ${name},\n\nאנא אשר${dbResult.isMale ? '' : 'י'} הגעתך לחתונה של נטע ואורי ביום שישי ה-20 לאוקטובר ב-"קיו", קיבוץ גליל ים:\n\n${url}`
        }).then(() => {
            console.log(`Sent SMS to index ${index} - ${dbResult.cellphone}`);
        }).catch((error) => {
            console.log(`Error sending SMS to ${dbResult.cellphone} ${error}`);
        }).finally(() => postSmsHandle(results, index));
    });
};

const encrypt = (text) => {
    let cipher = crypto.createCipher(algorithm,encryptPass);
    let crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

const postSmsHandle = (results, index) => {
    if (smsCounter === 0) {
        console.log(`Done sending SMS!`);
        return;
    }

    return sendSms(results, ++index);
};