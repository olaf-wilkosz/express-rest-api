const express = require('express');
const cors = require('cors')
const randomID = require('@olaf-wilkosz/unique-id-generator');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const db = [
  { id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
  { id: 2, author: 'Amanda Doe', text: 'They really know how to make you happy.' },
];

app.get('/testimonials', (req, res) => {
  res.json(db);
});

app.get('/testimonials/random', (req, res) => {
  res.json(db[Math.floor(Math.random() * db.length)]);
});

app.get('/testimonials/:id', (req, res) => {
  res.json(db.filter(item => item.id == req.params.id));
});

app.post('/testimonials', (req, res) => {
  const { author, text } = req.body;
  const newTestimonial = {
    id: randomID(8),
    author: author,
    text: text,
  }
  db.push(newTestimonial);
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
  const testimonialToBeUpdated = db.find(item => item.id == id);
  const index = db.indexOf(testimonialToBeUpdated);
  db[index] = updatedTestimonial;
  res.json({ message: 'OK' });
});

app.delete('/testimonials/:id', (req, res) => {
  const id = req.params;
  db.splice(id, 1);
  res.json({ message: 'OK' });
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});