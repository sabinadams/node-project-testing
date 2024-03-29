// Main routing file that gathers all the controller files and exports them to the index.js file
const express = require('express'),
    router = express.Router();

// Gathers all the route controller files and defines their usage
router.use('/example', require('./example-controller'));
router.use('/auth', require('./auth-controller'));

module.exports = router;