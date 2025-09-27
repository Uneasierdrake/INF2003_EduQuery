require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./pg-connection');
const connectMongo = require('./mongo-connection');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ... routes ...

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
