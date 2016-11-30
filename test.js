const bluebird = require('bluebird')
const assert = require('assert')
const request = bluebird.promisify(require('request'), {multiArgs: true})
const route = require('./route.js')
const secret = require('./secret.js')
const servAddr = 'localhost'
const servPort = 3000

const call = (endpoint) =>
  request(`http://${servAddr}:${servPort}${endpoint}`)

const authCall = (query, sep = '&') =>
  call(`/token?access_token=${secret.TOKEN_TEST}`)
    .spread((res, body) => JSON.parse(body).token)
    .then(token => call(`${query}${sep}access_token=${token}`))

const basicStory = {
  title: 'Harry Potten',
  upvote: 32,
  contributors: [
    {
      name: 'Adri',
      id: 6872364
    }
  ],
  paragraphs: [
    {
      authorName: 'Adri',
      authorId: 7283746,
      parution: 78326482736,
      text: 'Paragraph content'
    }
  ]
}

const basicUser = {
  full_name: 'Donald Trump', // eslint-disable-line
  profile_pic: 'https://profilepic.com/pic.jpg', // eslint-disable-line
  bio: 'bio content',
  stories: 3,
  reputation: 45
}

const objectIsOfSameType = (objA, objB) => {

  if (JSON.stringify(objA)[0] === '[' && JSON.stringify(objB)[0] === '[') {
    return true
  }
  if (typeof objA !== 'object') {
    return typeof objA === typeof objB
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (JSON.stringify(keysA) !== JSON.stringify(keysB)) {
    return false
  }

  let sameType = true

  keysA.forEach((key) => {
    if (!objectIsOfSameType(objA[key], objB[key])) {
      sameType = false
    }
  })
  return sameType
}

route.startListening(3000)

describe('API', () => { // eslint-disable-line
  describe('GET', () => { // eslint-disable-line
    it('should return a token', () => // eslint-disable-line
      call(`/token?access_token=${secret.TOKEN_TEST}`)
        .spread((response, body) => assert(typeof JSON.parse(body).token === 'string')))
    it('should return a stories feed', () => authCall('/stories?filter=feed') // eslint-disable-line
      .spread((response, body) => assert(objectIsOfSameType(JSON.parse(body)[0], basicStory))))
    it('should return a user profile', () => authCall('/users/0', '?') // eslint-disable-line
      .spread((response, body) => assert(objectIsOfSameType(JSON.parse(body), basicUser))))
  })
})
