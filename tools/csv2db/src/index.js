import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import randomstring from 'randomstring';

dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

import { connect } from 'db';

const db = connect({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

const { Guest } = db;

const getCellphoneFromField = field => {
  let cellphone = field.replace('-', '');
  if (cellphone) {
    if (cellphone[0] === '0') {
      cellphone = cellphone.substring(1);
    }

    cellphone = `+972${cellphone}`;
  }

  return cellphone;
};

const importCsv = async (file, data) => {
  const lines = data.split('\r\n');
  for (let i = 1; i < lines.length; i++) {
    // Skip the first row
    const row = lines[i];
    const fields = row.split(',');

    const name = fields[0];
    const nameSplitted = name.split(' ');
    const firstName = nameSplitted[0];
    let lastName = '';
    for (let j = 1; j < nameSplitted.length; j++) {
      lastName += nameSplitted[j];
    }
    const cellphone = getCellphoneFromField(fields[1]);

    const guest = await Guest.findOne({
      where: {
        firstName,
        lastName,
      },
    });
    if (guest) {
      console.log(`Already found a guest with name "${firstName} ${lastName}", skipping...`);
      continue;
    }

    await Guest.create({
      id: randomstring.generate(8),
      firstName,
      lastName,
      cellphone,
      amountOfPeople: 0,
    });
  }
};

const csv2dbFolder = path.join(__dirname, '..');
fs.readdir(csv2dbFolder, async (err, files) => {
  const filesToRead = [];

  files.forEach(file => {
    if (!file.endsWith('.csv')) return;

    filesToRead.push(file);
  });

  if (!filesToRead.length) {
    return console.log('No CSV file found!');
  }

  for (let i = 0; i < filesToRead.length; i++) {
    const file = filesToRead[i];

    console.log(`Importing ${file}`);
    const content = fs.readFileSync(`./${file}`, 'utf8');

    await importCsv(file, content);
    console.log(`Done importing ${file}`);
  }

  console.log('MY JOB HERE IS DONE! THANK YOU AND GOOD BYE');
});
