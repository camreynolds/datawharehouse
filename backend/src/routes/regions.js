'use strict';
const express = require('express');
const router = express.Router();

const {
      createRegionCountryCity,
      updateRegionCountryCity,
      index,
      getAllRegionsCountryCity,
      deleteRegionCountryCity,
      downloadRegions
} = require('../services/regions');


router.get('/', index)
      .get('/download', downloadRegions)
      .get('/all', getAllRegionsCountryCity)
      .post('/', createRegionCountryCity)
      .delete('/', deleteRegionCountryCity)
      .put('/:id', updateRegionCountryCity);

module.exports = router;