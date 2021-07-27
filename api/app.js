const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/words', require('./routes/words.routes'));
app.use('/images', require('./routes/images.routes'));
app.use('/user', require('./routes/user.routes'));

const PORT = config.get('port') || 5000;

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => console.log(`working on ${PORT}`))
  } catch(e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();