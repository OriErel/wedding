import express from 'express';

export const create = ({ db }) => {
  const router = express.Router();

  const { Guest } = db;

  router.get('/:guestId', async (req, res, next) => {
    const guest = await Guest.findOne({
      where: {
        id: req.params.guestId,
      },
    });

    if (!guest) {
      return res.sendStatus(404);
    }

    guest.rsvp = guest.rsvp === null ? null : guest.rsvp === 'ATTENDING';
    return res.send(guest);
  });

  router.post('/:guestId', async (req, res, next) => {
    const guest = await Guest.findOne({
      where: {
        id: req.params.guestId,
      },
    });

    if (!guest) {
      return res.sendStatus(404);
    }

    const { rsvp, comment, amountOfPeople } = req.body;

    if (typeof rsvp !== 'boolean' || typeof amountOfPeople !== 'number') {
      return res.sendStatus(500);
    }

    await guest.update({
      rsvp: rsvp ? 'ATTENDING' : 'NOT ATTENDING',
      amountOfPeople: rsvp && amountOfPeople === 0 ? 1 : amountOfPeople,
      comment: typeof comment === 'string' ? comment : guest.comment,
    });

    return res.sendStatus(200);
  });

  return router;
};
