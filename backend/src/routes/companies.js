'use strict';
const express = require('express');
const router = express.Router();

const {
    index,
    createCompanies,
    deleteCompanies,
    findByIdCompanies,
    updateCompanies,
    downloadCompanies
} = require('../services/companies');

router.get('/', index)
    .get('/download', downloadCompanies)
    .get('/:id', findByIdCompanies)
    .post('/', createCompanies)
    .delete('/', deleteCompanies)
    .put('/:id', updateCompanies);

module.exports = router;