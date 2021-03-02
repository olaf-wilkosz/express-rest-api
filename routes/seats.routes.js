const express = require('express');
const router = express.Router();
const randomID = require('@olaf-wilkosz/unique-id-generator');
const db = require('../db');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

router.route('/seats/:id').get((req, res) => {
  res.json(db.seats.find(item => item.id == req.params.id));
});

router.route('/seats').post((req, res) => {
  const { day, seat, client, email } = req.body;
  const newBooking = {
    id: randomID(8),
    day: day,
    seat: seat,
    client: client,
    email: email,
  }
  db.seats.push(newBooking);
  res.json({ message: 'OK' });
});

router.route('/seats/:id').delete((req, res) => {
  const id = req.params.id;
  db.seats.splice(item => item.id == id, 1);
  res.json({ message: 'OK' });
});

router.route('/seats/:id').put((req, res) => {
  const { day, seat, client, email } = req.body;
  const id = req.params.id;
  const updatedBooking = {
    id: id,
    day: day,
    seat: seat,
    client: client,
    email: email,
  }
  const bookingToBeUpdated = db.seats.find(item => item.id == id);
  const index = db.seats.indexOf(bookingToBeUpdated);
  db.seats[index] = updatedBooking;
  res.json({ message: 'OK' });
});

module.exports = router;