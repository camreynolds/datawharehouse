'use strict';
const express=require('express');
const router = express.Router();

const { index, createUser,deleteUser,findByIdUser,updateUser }=require('../services/users');

router.get('/', index )
      .get('/:id',findByIdUser)
      .post('/', createUser)
      .delete('/', deleteUser)
      .put('/:id',updateUser);

module.exports=router;