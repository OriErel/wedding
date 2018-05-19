const fs = require('fs');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'someip',
    user: 'ori',
    password: 'somepassword',
    database: 'wedding',
});

con.connect((err) => {
    if (err) throw err;

    fs.readdir('./', (err, files) => {
        const filesToRead = [];

        files.forEach(file => {
            if (!file.endsWith('.csv')) return;

            filesToRead.push(file);
        });

        if (!filesToRead.length) {
            return console.log('No CSV files found!')
        }

        filesLeft = filesToRead.length;
        filesToRead.forEach(file => {
            console.log(`Working on ${file}`);
            fs.readFile(`./${file}`, 'utf8', (err, data) => {
               if (err) throw err;

                fileCallback(file, data);
            });
        })
    });
});

let filesLeft = 0;
const fileCallback = (file, data) => {
    const lines = data.split('\r\n');
    let linesAddedToDb = 0;
    for (let i = 1; i < lines.length; i++) {
        // Skip the first row
        const row = lines[i];
        const fields = row.split(',');

        const firstName = fields[0];
        const lastName = fields[1];
        const extraData = fields[2];
        const cellphone = getCellphoneFromField(fields[3]);

        const group = fields[4];
        const isMale = fields[5] === 'ז';

        con.query(`select * from guests where first_name = "${firstName}" AND last_name = "${lastName}"`, (err, result) => {
            if (err) throw err;

            if (result.length) {
                console.log(`Already found first_name = "${firstName}" AND last_name = "${lastName}" AND group = ${group}, skipping`);

                return postFileHandle(lines, linesAddedToDb);
            }

            con.query(`insert into guests values (0,"${firstName}", "${lastName}", null, null, "${extraData}", "${group}", "${cellphone}", ${isMale}, null)`, (err) => {
                if (err) throw err;

                postFileHandle(lines, linesAddedToDb);
            })
        });
    }
};

const getCellphoneFromField = (field) => {
    let cellphone = field.replace('-', '');
    if (cellphone) {
        if (cellphone[0] === '0') {
            cellphone = cellphone.substring(1);
        }

        cellphone = `+972${cellphone}`;
    }

    return cellphone;
};

const postFileHandle = (lines, linesAddedToDb) => {
    linesAddedToDb++;

    if (linesAddedToDb !== lines.length - 1) return;

    console.log(`Done working on ${file }`);
    filesLeft--;

    if (!filesLeft) {
        console.log('MY JOB HERE IS DONE! THANK YOU AND GOOD BYE');
    }
};