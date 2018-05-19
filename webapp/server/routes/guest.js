const mysql = require('mysql');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';

module.exports = (app) => {
    app.get('/guest', (req, res) => {
        const reqData = getRequestData(req);
        if (!reqData) return;

        reqData.con.connect((err) => {
            if (err) throw err;

            reqData.con.query(`select * from guests where cellphone = "${reqData.cellphone}"`, (err, result) => {
                return res.send(result[0]);
            });
        });
    });

    app.post('/guest', (req, res) => {
        const reqData = getRequestData(req);
        if (!reqData) return;

        reqData.con.connect((err) => {
            if (err) throw err;

            reqData.con.query(`update guests set arriving=${req.body.arriving}, comment="${req.body.comment}", num_of_attendees=${req.body.num_of_attendees} where cellphone = "${cellphone}"`, () => {
                return res.send();
            });
        });
    });
};

const decrypt = (text) => {
    const decipher = crypto.createDecipher(algorithm,password);
    let dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
};

const getRequestData = (req) => {
    const token = req.query.token;
    if (!token) {
        return;
    }

    const cellphone = decrypt(token);

    const con = mysql.createConnection({
        host: 'someip',
        user: 'ori',
        password: 'somepassword',
        database: 'wedding'
    });

    return {
        cellphone,
        con,
    }
};