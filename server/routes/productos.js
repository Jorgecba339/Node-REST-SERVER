const express = require('express');

const app = express();

const { verificaToken } = require('../middleware/autenticacion');

const Productos = require('../models/productos');

//================================================
// Obtener todos los productos 
//================================================
app.get('/productos', verificaToken, (req, res) => {

    //obtener todos los productos
    //.populate('usuario categoria')
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Productos.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                productos
            });
        });

});
//================================================
// Obtener productos por id
//================================================
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;

    Productos.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    err: 'El ID de ese producto no existe'
                });
            }

            res.status(200).json({
                ok: true,
                producto: productosDB
            });

        });

});
//================================================
// Buscar Productos
//================================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regExp = new RegExp(termino, 'i');

    Productos.find({ nombre: regExp })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});
//================================================
// Crear Productos
//================================================
app.post('/productos', verificaToken, (req, res) => {
    //grabar usuario
    //grabar una categoria del listado
    let body = req.body;

    let producto = new Productos({

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productosDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear productos',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            productos: productosDB
        });
    });
});
//================================================
// Actualizar un producto
//================================================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Productos.findById(id, (err, productosDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productosDB.nombre = body.nombre;
        productosDB.precioUni = body.precioUni;
        productosDB.descripcion = body.descripcion;
        productosDB.disponible = body.disponible;
        productosDB.categoria = body.categoria;

        productosDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    });
});
//================================================
// Borrar el producto
//================================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //grabar usuario
    //grabar una categoria del listado
    let id = req.params.id;

    Productos.findById(id, (err, productosDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        productosDB.disponible = false;

        productosDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productoBorrado,
                mensaje: 'Producto borrado'
            });
        });
    });

});



module.exports = app;