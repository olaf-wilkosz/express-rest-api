const Seat = require('../models/seat.model');
const mongoose = require('mongoose');

exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find());
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ message: 'Provided id is not valid' });
    } else {
      const seat = await Seat.findById(req.params.id);
      if (!seat) res.status(404).json({ message: 'Not found' });
      else res.json(seat);
    }
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.addNew = async (req, res) => {
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
      await newBooking.save();
      const seats = await Seat.find();
      req.io.emit('seatsUpdated', seats);
      res.json({ message: 'OK' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.edit = async (req, res) => {
  const { day, seat, client, email } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ message: 'Provided id is not valid' });
    } else {
      const booking = await Seat.findById(req.params.id);
      if (booking) {
        await Seat.updateOne({ _id: req.params.id }, {
          $set: {
            day: parseInt(day),
            seat: parseInt(seat),
            client: client,
            email: email,
          }
        });
        const seats = await Seat.find();
        req.io.emit('seatsUpdated', seats);
        res.json({ message: 'OK' });
      }
      else res.status(404).json({ message: 'Not found...' });
    }
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ message: 'Provided id is not valid' });
    } else {
      const seat = await Seat.findById(req.params.id);
      if (seat) {
        await Seat.deleteOne({ _id: req.params.id });
        const seats = await Seat.find();
        req.io.emit('seatsUpdated', seats);
        res.json({ message: 'OK' });
      }
      else res.status(404).json({ message: 'Not found...' });
    }
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};