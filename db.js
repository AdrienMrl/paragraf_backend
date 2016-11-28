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
})

/* JSON of a stroy
[
    {
        "title": "Harry Potten",
        "upvote": 32,
        "contributors": [
            {
                "name": "Adri",
                "id": 6872364
            }
        ],
        "paragraphs": [
            {
                "author_name": "Adri",
                "author_id": 7283746
                "parution": 78326482736,
                "text": "Paragraph content"
            }
        ]
    }
]
*/

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
  createStory
}
