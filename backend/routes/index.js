const router = require('express').Router();

const cardsRoutes = require('./cards');
const usersRoutes = require('./users');

router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);

module.exports = router;
