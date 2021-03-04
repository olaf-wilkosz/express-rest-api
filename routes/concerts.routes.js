const express = require('express');
const router = express.Router();
const randomID = require('@olaf-wilkosz/unique-id-generator');
const db = require('../db');

router.route('/concerts').get((req, res) => {
  res.json(db.concerts);
});

router.route('/concerts/:id').get((req, res) => {
  const id = req.params.id;
  const foundDbItem = db.concerts.find(item => item.id == id);
  if (foundDbItem) {
    res.json(foundDbItem);
  } else {
    res.status(404).json({ message: 'Not found...' });
  };
});

router.route('/concerts').post((req, res) => {
  const { performer, genre, price, day, image } = req.body;
  const newConcert = {
    id: randomID(8),
    performer: performer,
    genre: genre,
    price: price,
    day: day,
    image: image,
  };
  db.concerts.push(newConcert);
  res.json({ message: 'OK' });
});

router.route('/concerts/:id').delete((req, res) => {
  const id = req.params.id;
  const foundDbItem = db.concerts.find(item => item.id == id);
  const index = db.concerts.indexOf(foundDbItem);
  if (foundDbItem) {
    db.concerts.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  };
});

router.route('/concerts/:id').put((req, res) => {
  const { performer, genre, price, day, image } = req.body;
  const id = req.params.id;
  const updatedConcert = {
    id: id,
    performer: performer,
    genre: genre,
    price: price,
    day: day,
    image: image,
  };
  const foundDbItem = db.concerts.find(item => item.id == id);
  const index = db.concerts.indexOf(foundDbItem);
  if (foundDbItem) {
    db.concerts[index] = updatedConcert;
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  };
});

module.exports = router;