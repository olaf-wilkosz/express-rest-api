const express = require('express');
const router = express.Router();
const randomID = require('@olaf-wilkosz/unique-id-generator');
const db = require('../db');

router.route('/testimonials').get((req, res) => {
  res.json(db.testimonials);
});

router.route('/testimonials/random').get((req, res) => {
  const random = Math.floor(Math.random() * db.testimonials.length);
  res.json(db.testimonials[random]);
});

router.route('/testimonials/:id').get((req, res) => {
  const id = req.params.id;
  const foundDbItem = db.testimonials.find(item => item.id == id);
  if (foundDbItem) {
    res.json(foundDbItem);
  } else {
    res.status(404).json({ message: 'Not found...' });
  };
});

router.route('/testimonials').post((req, res) => {
  const { author, text } = req.body;
  const newTestimonial = {
    id: randomID(8),
    author: author,
    text: text,
  };
  db.testimonials.push(newTestimonial);
  res.json({ message: 'OK' });
});

router.route('/testimonials/:id').put((req, res) => {
  const { author, text } = req.body;
  const id = req.params.id;
  const updatedTestimonial = {
    id: id,
    author: author,
    text: text,
  };
  const foundDbItem = db.testimonials.find(item => item.id == id);
  const index = db.testimonials.indexOf(foundDbItem);
  if (foundDbItem) {
    db.testimonials[index] = updatedTestimonial;
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  };
});

router.route('/testimonials/:id').delete((req, res) => {
  const id = req.params.id;
  const foundDbItem = db.testimonials.find(item => item.id == id);
  const index = db.testimonials.indexOf(foundDbItem);
  if (foundDbItem) {
    db.testimonials.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  };
});

module.exports = router;