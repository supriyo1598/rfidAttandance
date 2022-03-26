require('dotenv').config();
const port = 5000 || process.env.PORT;
const express = require('express');
const app = express();
const router = require('./routes/router');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

app.listen(port, console.log(`server is up on http://localhost:${port}`));