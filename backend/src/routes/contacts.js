'use strict';
const express = require('express');
const router = express.Router();

const {
      index,
      createContact,
      deleteContact,
      findByIdContact,
      updateContact,
      uploadContacts,
      getAllContact,
      downloadContacts
} = require('../services/contacts');
const { upload } = require('../utils');

router.get('/', index)
      .get('/all',getAllContact)
      .get('/download',downloadContacts)
      .get('/:id', findByIdContact)
      .post('/', createContact)
      .post('/upload',upload.single('file') ,uploadContacts)
      .delete('/', deleteContact)
      .put('/:id', updateContact);

module.exports = router;