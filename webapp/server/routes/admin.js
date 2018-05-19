const mysql = require('mysql');

const token = 'someToken';

module.exports = (app) => {
    app.get('/token-validate', (req, res) => {
        if (req.headers['x-token'] !== token) {
            res.status(500).send('error');
            return;
        }

        res.send('ok');
    });

    app.post('/password-validate', (req, res) => {
        if (req.body.password !== 'somepassword') {
            res.status(500).send('error');
            return;
        }

        res.send(token)
    });

    app.get('/guests', (req, res) => {
        if (req.headers['x-token'] !== token) {
            res.status(500).send('error');
            return;
        }

        const con = mysql.createConnection({
            host: 'someip',
            user: 'ori',
            password: 'somepassword',
            database: 'wedding',
        });

        con.connect((err) => {
            if (err) throw err;

            con.query('SELECT * FROM guests', (err, result) => {
                return res.send(result);
            });
        });
    })
};