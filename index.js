const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);


const port = process.env.PORT || 3000;
//app.listen(port, () => winston.info(`Listening on port ${port}...`));
app.listen(port, () => console.log(`Listening on port ${port}...`));