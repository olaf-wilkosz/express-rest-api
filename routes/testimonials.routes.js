const express = require('express');
const router = express.Router();
const Testimonial = require('../models/testimonial.model');
const mongoose = require('mongoose');

router.get('/testimonials', async (req, res) => {
  try {
    res.json(await Testimonial.find());
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/testimonials/random', async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const testimonial = await Testimonial.findOne().skip(rand);
    if (!testimonial) res.status(404).json({ message: 'Not found' });
    else res.json(testimonial);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/testimonials/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ message: 'Provided id is not valid' });
    } else {
      const testimonial = await Testimonial.findById(req.params.id);
      if (!testimonial) res.status(404).json({ message: 'Not found' });
      else res.json(testimonial);
    }
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const { author, text } = req.body;
    const newTestimonial = new Testimonial({
      author: author,
      text: text,
    });
    await newTestimonial.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  const { author, text } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ message: 'Provided id is not valid' });
    } else {
      const testimonial = await Testimonial.findById(req.params.id);
      if (testimonial) {
        await Testimonial.updateOne({ _id: req.params.id }, {
          $set: {
            author: author,
            text: text,
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

router.delete('/testimonials/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ message: 'Provided id is not valid' });
    } else {
      const testimonial = await Testimonial.findById(req.params.id);
      if (testimonial) {
        await Testimonial.deleteOne({ _id: req.params.id });
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