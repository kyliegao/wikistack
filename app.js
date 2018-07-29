const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const layout = require('./views/layout')
const userRouter = require ('./routes/user')
const wikiRouter = require ('./routes/wiki')
// const { db } = require('./models');
const models = require('./models')

const app = express ()
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use('/wiki', wikiRouter)
app.use('/users', userRouter)

// db.authenticate().
// then(() => {
//   console.log('connected to the database');
// })


app.get('/', (req,res) => {
  res.redirect('/wiki')
})

const PORT = 3000;

const init = async() => {
  await models.db.sync({force: true})

  app.listen(PORT, () => {
  console.log(`app is listening in port ${PORT}`);
  });
};

init ();


