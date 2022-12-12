const express = require('express');
const app = express();

app.all("/", (req, res) => { res.end("Invalid endpoint"); });
app.all("*", (req, res) => { res.end("Invalid endpoint"); });

app.listen(2050, () => { console.log("Melody Web UI is running on port 2050.") });