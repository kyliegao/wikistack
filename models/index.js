const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack',{
  logging: false
});



const Page = db.define('page',{
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open','closed'),
    defaultValue: 'open'
  }
})

Page.beforeValidate(pageInstance => {

  const generateSlug = (title) => {
  return title.replace(/\s+/g, '_').replace(/\W/g, '');
  }

  pageInstance.slug = generateSlug(pageInstance.title)
})

const User = db.define('user',{
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.TEXT,
    allowNull: false,
    // validate: {
    //   isEmail: true
    // }
  }
});

Page.belongsTo(User, { as: 'author' });
User.hasMany(Page)


module.exports = {
  db, Page, User
}
