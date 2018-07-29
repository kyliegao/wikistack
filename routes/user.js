const express = require('express');
const router = express.Router();
const { Page, User } = require('../models')
const { userList, userPages} = require('../views')

router.get ('/', async (req,res, next) =>{
  try {
    const users = await User.findAll()
    res.send(userList(users))
  }
  catch (err) {
    next (err)
  }
})

router.get('/:id', async (req,res, next)=>{
  try {
    // get user name
    const userName = await User.findById(req.params.id)
    const userPageList = await Page.findAll({
      where: { authorId: req.params.id }
    })

    res.send(userPages(userName,userPageList))
  }
  catch (err) {
    next (err)
  }
})

module.exports = router
