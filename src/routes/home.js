const express = require('express');
const router = express.Router();

const {home,detalle,carrito,search,navBar,dashboard,aboutUs,comments} = require('../controllers/homeController')

router
.get('/',home)
.get('/search',search)
.get('/products/list/:category',navBar)
.get('/dashboard',dashboard)
.get('/aboutUs',aboutUs)
.post('/aboutUs',comments)

module.exports = router;
