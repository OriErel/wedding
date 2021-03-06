import path from 'path';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

import { connect } from 'db';

const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const db = connect({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

const { Guest } = db;

const sendSms = guest =>
  new Promise(resolve => {
    const url = `https://hilaran.orierel.com/${guest.id}`;

    const name = `${guest.firstName} ${guest.lastName}`.trim();
    return twilioClient.messages
      .create({
        to: guest.cellphone,
        from: 'HilaAndRan',
        // body: `היי ${name},\n\nאנא אשרו הגעתכם לחתונה של הילה ורן ביום שישי ה-5 ליולי ב-"גרייס", ראשון לציון\n\n${url}`,
        body: `היי ${name},\n\nאנא אשרו הגעתכם לחינה של הילה ורן ביום שבת ה-29 ביוני, קאנטרי גלי הדר - ראשון לציון\n\n${url}`,
      })
      .then(() => {
        console.log(`Successfully sent SMS to ${guest.cellphone} - ${name}`);
      })
      .catch(error => {
        console.error(`Error sending SMS to ${guest.cellphone} - ${name}`, error);
      })
      .finally(() => resolve());
  });

Guest.findAll({
  where: {
    rsvp: null,
    // rsvp: 'ATTENDING',
    // cellphone: '+972586456456',
    // id: 'GKDKAO22rDSCV2',
  },
}).then(async guestsToMessage => {
  for (const guest of guestsToMessage) {
    if (!guest.cellphone) {
      continue;
    }

    // console.log(`${guest.firstName} ${guest.lastName}`);
    await sendSms(guest);
  }
});
