const express = require('express');
const app = express();

app.use(express.json());
app.set('view engine', 'ejs');

app.use('/api', require('./routes/api'));
app.use('/', require('./routes/controller'));

// app.all("/", (req, res) => { res.end("Invalid endpoint"); });
app.all("*", (req, res) => { res.end("Invalid endpoint"); });

app.listen(2050, () => { console.log("Melody Web UI is running on port 2050.") });