const express = require('express');
const { seats } = require('../db');
const router = express.Router();
const Seat = require('../models/seat.model');

router.get('/seats', async (req, res) => {
  try {
    res.json(await Seat.find());
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/seats/:id', async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) res.status(404).json({ message: 'Not found' });
    else res.json(seat);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/seats', async (req, res) => {
  try {
    const { day, seat, client, email } = req.body;
    const seatExists = await Seat.findOne({ $and: [{ seat: seat, day: day }] });
    const newBooking = new Seat({
      day: parseInt(day),
      seat: parseInt(seat),
      client: client,
      email: email,
    });
    if (seatExists !== null) {
      res.status(409).json({ message: "The slot is already taken..." });
    } else {
      res.json({ message: 'OK' });
      await newBooking.save();
      req.io.emit('seatsUpdated', db.seats);
      res.json({ message: 'OK' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/seats/:id', async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (seat) {
      await Seat.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/seats/:id', async (req, res) => {
  const { day, seat, client, email } = req.body;
  try {
    const seat = await Seat.findById(req.params.id);
    if (seat) {
      await Seat.updateOne({ _id: req.params.id }, {
        $set: {
          day: parseInt(day),
          seat: parseInt(seat),
          client: client,
          email: email,
        }
      });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;