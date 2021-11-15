const Product = require('../models/product');


exports.create = (req, res) => {
    let p = new Product({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        departments: req.body.departments
    });
    p.save((err, prod) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(prod);
    })
}

exports.read = (req, res) => {
    Product.find({}).exec((err, prods) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(prods);
    });
}

exports.update = (req, res) => {
    Product.findById(req.params.id, (err, prod) => {
        if (err)
            res.status(500).send(err);
        else if (!prod)
            res.status(404).send({});
        else {
            prod.name = req.body.name;
            prod.price = req.body.price;
            prod.stock = req.body.stock;
            prod.departments = req.body.departments;
            prod.save((err, p) => {
                if (err)
                    res.status(500).send(err);
                else
                    res.status(200).send(p);
            })
        }
    })
}

exports.delete = (req, res) => {    
    Product.deleteOne({_id: req.params.id}, (err) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send({});
    });
}