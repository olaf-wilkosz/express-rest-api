const express = require('express');
const router = express.Router();
const Concert = require('../models/concert.model');
const mongoose = require('mongoose');

router.get('/concerts', async (req, res) => {
  try {
    res.json(await Concert.find());
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/concerts/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ message: 'Provided id is not valid' });
    } else {
      const concert = await Concert.findById(req.params.id);
      if (!concert) res.status(404).json({ message: 'Not found' });
      else res.json(concert);
    }
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/concerts', async (req, res) => {
  try {
    const { performer, genre, price, day, image } = req.body
    const newConcert = new Concert({
      performer: performer,
      genre: genre,
      price: price,
      day: day,
      image: image,
    });
    await newConcert.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/concerts/:id', async (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ message: 'Provided id is not valid' });
    } else {
      const concert = await Concert.findById(req.params.id);
      if (concert) {
        await Concert.updateOne({ _id: req.params.id }, {
          $set: {
            performer: performer,
            genre: genre,
            price: price,
            day: day,
            image: image,
          }
        });
        res.json({ message: 'OK' });
      }
      else res.status(404).json({ message: 'Not found...' });
    }
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/concerts/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ message: 'Provided id is not valid' });
    } else {
      const concert = await Concert.findById(req.params.id);
      if (concert) {
        await Concert.deleteOne({ _id: req.params.id });
        res.json({ message: 'OK' });
      }
      else res.status(404).json({ message: 'Not found...' });
    }
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;