const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));


mongoose.connect('mongodb://localhost:27017/http_app', {
  useNewUrlParser: true
});

const departmentsRouter = require('./routes/departments');
const productsRouter = require('./routes/products');

app.use('/departments', departmentsRouter);
app.use('/products', productsRouter);


app.use((req, res) =>{
  res.send({
    'name':'API de Produtos',
    'version': '1.0.0'
  });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Seridor rodando na porta', port);
});
