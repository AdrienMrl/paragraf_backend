const Sequelize = require('sequelize')
const sequelize = new Sequelize('mysql://paragraf:motdepasse@localhost:3306/paragraf', {logging: null})

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING
  },
  fullName: {
    type: Sequelize.STRING
  },
  reputation: {
    type: Sequelize.INTEGER
  },
  facebookId: {
    type: Sequelize.STRING
  }
})

const Story = sequelize.define('story', {
  title: {
    type: Sequelize.STRING
  },
  upvote: {
    type: Sequelize.INTEGER
  },
  background: {
    type: Sequelize.INTEGER
  },
  opened: {
    type: Sequelize.BOOLEAN
  }
})

const Paragraph = sequelize.define('paragraph', {
  content: {
    type: Sequelize.STRING
  }
})

const Contributors = sequelize.define('contributors')

Story.hasMany(Paragraph)
User.belongsToMany(Story, {through: {model: Contributors}})
Paragraph.belongsTo(User, {as: 'author'})

const force = undefined //{force: true}

User.sync(force)
  .then(() => Story.sync(force))
  .then(() => Paragraph.sync(force))
  .then(() => Contributors.sync(force))
  .catch((err) => console.log(err))

module.exports = {
  User,
  Story,
  Contributors,
  Paragraph
}
