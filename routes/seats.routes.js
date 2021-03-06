const express = require('express');
const router = express.Router();
const randomID = require('@olaf-wilkosz/unique-id-generator');
const db = require('../db');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

router.route('/seats/:id').get((req, res) => {
  const id = req.params.id;
  const foundDbItem = db.seats.find(item => item.id == id);
  if (foundDbItem) {
    res.json(foundDbItem);
  } else {
    res.status(404).json({ message: 'Not found...' });
  };
});

router.route('/seats').post((req, res) => {
  const { day, seat, client, email } = req.body;
  const newBooking = {
    id: randomID(8),
    day: parseInt(day),
    seat: parseInt(seat),
    client: client,
    email: email,
  };
  if (db.seats.some(item => (item.seat === newBooking.seat && item.day === newBooking.day))) {
    res.status(409).json({ message: "The slot is already taken..." });
  } else {
    db.seats.push(newBooking);
    res.json({ message: 'OK' });
  }
});

router.route('/seats/:id').delete((req, res) => {
  const id = req.params.id;
  const foundDbItem = db.seats.find(item => item.id == id);
  const index = db.seats.indexOf(foundDbItem);
  if (foundDbItem) {
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
    day: parseInt(day),
    seat: parseInt(seat),
    client: client,
    email: email,
  }
  const foundDbItem = db.seats.find(item => item.id == id);
  const index = db.seats.indexOf(foundDbItem);
  if (foundDbItem) {
    db.seats[index] = updatedBooking;
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  };
});

module.exports = router;