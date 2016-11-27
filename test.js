const bluebird = require('bluebird')
const assert = require('assert')
const request = bluebird.promisify(require('request'), {multiArgs: true})
const route = require('./route.js')
const secret = require('./secret.js')
const servAddr = 'localhost'
const servPort = 3000

const call = (endpoint) =>
  request(`http://${servAddr}:${servPort}${endpoint}`)

const authCall = (query) =>
  call(`/token?access_token=${secret.TOKEN_TEST}`)
    .spread((res, body) => JSON.parse(body).token)
    .then(token => call(`${query}&access_token=${token}`))

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

const objectIsOfSameType = (objA, objB) => {
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (JSON.stringify(keysA) !== JSON.stringify(keysB)) {
    return false
  }

  let sameType = true

  keysA.forEach((key) => {
    if (!objectIsOfSameType(objA[key], objB[key]))
      sameType = false
  })
  return sameType
}

route.startListening(3000)

describe('API', () => {
  describe('GET', () => {
    it('should return a token', () =>
      call(`/token?access_token=${secret.TOKEN_TEST}`)
      .spread((response, body) => assert(typeof JSON.parse(body).token === 'string')))

    it('should return a stories feed', () => authCall('/stories?filter=feed')
      .spread((response, body) => assert(objectIsOfSameType(JSON.parse(body)[0], basicStory))))
  })
})
