const express = require('express');
const router = express.Router();
const randomID = require('@olaf-wilkosz/unique-id-generator');
const db = require('../db');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

router.route('/seats/:id').get((req, res) => {
  const id = req.params.id;
  if (db.seats.find(item => item.id == req.params.id)) {
    res.json(db.seats.find(item => item.id == req.params.id));
  } else {
    res.status(404).json({ message: 'Not found...' });
  };
});

router.route('/seats').post((req, res) => {
  const { day, seat, client, email } = req.body;
  const newBooking = {
    id: randomID(8),
    day: day,
    seat: seat,
    client: client,
    email: email,
  };
  db.seats.push(newBooking);
  res.json({ message: 'OK' });
});

router.route('/seats/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.seats.indexOf(db.seats.find(item => item.id == id));
  if (db.seats.find(item => item.id == req.params.id)) {
    db.seats.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  };
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
  const index = db.seats.indexOf(db.seats.find(item => item.id == id));
  if (db.seats.find(item => item.id == req.params.id)) {
    db.seats[index] = updatedBooking;
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  };
});

module.exports = router;