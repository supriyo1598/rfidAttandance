const express = require('express');
const router = express.Router();
// const { conn, asyncQuery } = require('../controllers/dbcontroller.js');
const {
    attend
} = require('../controllers/controller');

router.route('/attend?:uid')
    .get(attend)

router.route('/test?:a')
    .get(async (req, res) => {
        res.json({ a: req.query.a });
    })

module.exports = router;