//Only for local testing

const express = require('express');
const path = require('path');
const { readFile } = require('fs').promises;

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('./public'));

app.listen(port);
console.log('Server started at http://localhost:' + port);
//test