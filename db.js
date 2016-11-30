const model = require('./models')

const registerUser = (facebookId, email, name) =>
  model.User.create({
    email,
    fullName: name,
    reputation: 1,
    facebookId
  })

const createStory = (title, backgroundId) => model.Story.create({
  title,
  upvote: 1,
  background: backgroundId,
  opened: true
})

const findUser = (facebookId) => model.User.findOne({
  where: {facebookId}
}).then(u => u.dataValues)


const getUser = (facebookId) =>
  findUser(facebookId)
    .then(u =>
      model.Contributors.count({
        where: {userId: u.facebookId}
      })
      .then(storyCount => ({
        full_name: u.fullName, // eslint-disable-line
        profile_pic: 'https://profilepic.com/pic.jpg', // eslint-disable-line
        bio: 'not implemented',
        stories: storyCount,
        reputation: u.reputation
      }))
      .catch(err => console.log(err)))


const getFeed = () => model.Story.findAll()
  .map((e) => ({
    title: e.title,
    upvote: e.upvote,
    contributors: [],
    paragraphs: []
  }))

module.exports = {
  registerUser,
  getFeed,
  findUser,
  getUser,
  createStory
}
