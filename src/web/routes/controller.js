const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => { res.render('pages/controller', { server: req.params.id }); });

module.exports = router;