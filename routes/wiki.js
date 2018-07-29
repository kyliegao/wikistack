const express = require('express');
const router = express.Router();
const { addPage, wikiPage, main, editPage } = require('../views')
const { Page, User } = require('../models')


router.get('/', async (req,res,next)=>{
  try {
    const allPages = await Page.findAll()
    // console.log(allPages)
    res.send(main(allPages))
  } catch (error){ next(error)}
})

router.get('/add',(req,res) => {
  res.send(addPage())
})

router.post('/', async (req,res,next) =>{

  const user = new User({
    name: req.body.author,
    email: req.body.email
  })

  const page = new Page({
    title: req.body.title,
    content: req.body.content,
  });


  try {
  const checkUser = await User.findAll({
    where: {
      email: req.body.email
    }
  })

  if (!checkUser[0]){
    console.log('saving user')
    await user.save()
  }
    await page.save()

    const userID = await User.findOne({
      where: {name: req.body.author}
    })
    await page.setAuthor(userID.id)
    res.redirect('/wiki/' + page.slug)
  } catch (error) {next (error)}

  // console.log(Page.findAll({
  //   attributes: [[sequelize.fn('COUNT',sequelize.col('title')), 'pages']]
  // }))

  // console.log(User.findAll({
  //   attributes: [[sequelize.fn('COUNT',sequelize.col('author')), 'users']]
  // }))

})

router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });

    if (!page){
      res.status(404).send('404 NOT FOUND :( MEGA SAD FACE')

    } else {
    const author = await User.findById(page.authorId)
      res.send(wikiPage(page,author))
    }
  } catch (error) {next (error)}
});


router.get('/:slug/edit',async (req,res, next) => {
try {
  const page = await Page.findOne({
    where: {
      slug: req.params.slug
      }
    })

  const author = await User.findOne({
    where: {
      id: page.authorId
      }
    })

  res.send(editPage(page,author))

  } catch ( err ) { next (error) }

})


router.get('/:slug/delete', async (req, res, next)=>{
    try {
      const page = await Page.findOne({
        where: {
        slug: req.params.slug
        }
      })

      const deletedInstance = await Page.destroy({
        where: {
        title: page.title
        }
      })
    console.log(deletedInstance.length)
    res.redirect('/wiki')
  } catch (err) {next (err)}
})

// router.delete('/:slug/delete', async (req,res,next) => {
//   console.log('we are here')


// })


router.post('/:slug', async (req, res, next) => {
  try {

    let user = await User.findOne({
      where: {
        email: req.body.email
      }
    })

    if(!user){
      user  = new User ({
        name: req.body.author,
        email: req.body.email
      })
      await user.save()
    }


    let page = await Page.findOne({
      where: {
        authorId: user.id,
        title: req.body.title
      }
    })

    if (!page) {
        page = new Page ({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status
      })
      await page.save()
      await page.setAuthor(user.id)
    } else {
      await Page.update({
        content: req.body.content,
        status: req.body.status,
        title: req.body.title
      }, { where: {
        title: req.body.title,
        authorId: user.id
      }
    })
  }

    res.redirect('/wiki/' + page.slug)

  } catch (err) {next (err)}
})




module.exports = router

