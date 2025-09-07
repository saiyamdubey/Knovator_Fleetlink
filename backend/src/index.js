
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../server');

const PORT = 5000;
const MONGO_URI =
  "mongodb+srv://saiyamdubey8787_db_user:0dkbqDWeELSgOnAr@cluster0.evlvyp4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Mongo connected');
    const server = app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));

    // graceful shutdown
    process.on('SIGINT', async () => {
      console.log('SIGINT received — closing server and DB connection');
      await mongoose.disconnect();
      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
