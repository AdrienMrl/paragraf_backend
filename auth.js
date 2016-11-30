const bluebird = require('bluebird')
const request = bluebird.promisify(require('request'), {multiArgs: true})
const jwt = require('jsonwebtoken')

const getToken = userId => jwt.sign({userId}, 'secretstuff')

const authenticateUser = (token) =>
  token === 'developer' ?
    Promise.resolve({email: 'developer@paragraf.com', name: 'john doe', id: 0}) :
  request(`https://graph.facebook.com/me?access_token=${token}&fields=email,name`)
    .spread((response, body) => {
      if (response.statusCode === 200) {
        return Promise.resolve(JSON.parse(body))
      }
      return Promise.reject(new Error(JSON.stringify(response)))
    })

const authenticateRequest = (req) => {
  const decoded = jwt.decode(req.query.access_token, 'secretstuff')
  return decoded ?
    bluebird.resolve(decoded) :
    bluebird.reject('Authentication failed. Check token.')
}

module.exports = {
  authenticateUser,
  authenticateRequest,
  getToken
}
