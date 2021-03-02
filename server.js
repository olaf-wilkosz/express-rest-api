const express = require('express');
const cors = require('cors')
const randomID = require('@olaf-wilkosz/unique-id-generator');
const db = require('./db');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/testimonials', (req, res) => {
  res.json(db.testimonials);
});

app.get('/testimonials/random', (req, res) => {
  const random = Math.ceil(Math.random() * db.testimonials.length);
  res.json(db.testimonials.find(item => item.id == random));
});

app.get('/testimonials/:id', (req, res) => {
  res.json(db.testimonials.find(item => item.id == req.params.id));
});

app.post('/testimonials', (req, res) => {
  const { author, text } = req.body;
  const newTestimonial = {
    id: randomID(8),
    author: author,
    text: text,
  }
  db.testimonials.push(newTestimonial);
  res.json({ message: 'OK' });
});

app.put('/testimonials/:id', (req, res) => {
  const { author, text } = req.body;
  const id = req.params.id;
  const updatedTestimonial = {
    id: id,
    author: author,
    text: text,
  };
  const testimonialToBeUpdated = db.testimonials.find(item => item.id == id);
  const index = db.testimonials.indexOf(testimonialToBeUpdated);
  db.testimonials[index] = updatedTestimonial;
  res.json({ message: 'OK' });
});

app.delete('/testimonials/:id', (req, res) => {
  const id = req.params;
  db.testimonials.splice(id, 1);
  res.json({ message: 'OK' });
});

app.get('/concerts', (req, res) => {
  res.json(db.concerts);
});

app.get('/concerts/:id', (req, res) => {
  res.json(db.concerts.find(item => item.id == req.params.id));
});

app.post('/concerts', (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  const newConcert = {
    id: randomID(8),
    performer: performer,
    genre: genre,
    price: price,
    day: day,
    image: image,
  }
  db.concerts.push(newConcert);
  res.json({ message: 'OK' });
});

app.delete('/concerts/:id', (req, res) => {
  const id = req.params;
  db.concerts.splice(id, 1);
  res.json({ message: 'OK' });
});

app.put('/concerts/:id', (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  const id = req.params.id;
  const updatedConcert = {
    id: id,
    performer: performer,
    genre: genre,
    price: price,
    day: day,
    image: image,
  }
  const concertToBeUpdated = db.concerts.find(item => item.id == id);
  const index = db.concerts.indexOf(concertToBeUpdated);
  db.concerts[index] = updatedConcert;
  res.json({ message: 'OK' });
});

app.get('/seats', (req, res) => {
  res.json(db.seats);
});

app.get('/seats/:id', (req, res) => {
  res.json(db.seats.find(item => item.id == req.params.id));
});

app.post('/seats', (req, res) => {
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

app.delete('/seats/:id', (req, res) => {
  const id = req.params;
  db.seats.splice(id, 1);
  res.json({ message: 'OK' });
});

app.put('/seats/:id', (req, res) => {
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

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});