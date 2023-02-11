const express = require('express');
const router = express.Router();

const {detalle,list,creacion,edicion,create,update,remove} = require('../controllers/productController')

router
.get('/detalle/:id',detalle)
.get('/list',list)
.get('/creacion',creacion)
.post('/creacion',create)
.get('/edicion/:id',edicion)
.put('/update/:id',update)
.delete('/remove/:id',remove)



module.exports = router;
