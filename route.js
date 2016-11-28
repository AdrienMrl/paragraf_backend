const express = require('express')
const bluebird = require('bluebird')
const app = bluebird.promisifyAll(express())
const auth = require('./auth.js')
const db = require('./db.js')

app.get('/token', (req, res) => {

  const token = req.query.access_token

  const sendToken = (user) =>
    res.send(JSON.stringify({
      token: auth.getToken(user.dataValues.id),
      user_id: user.dataValues.id
    }))


  auth.authenticateUser(token)
  .then(({email, name, id}) =>
  db.findUser(id)
  .then(user => sendToken(user))
  .catch(() => {
    return db.registerUser(id, email, name)
    .then(user => sendToken(user))
    .catch(err => console.error(err))
  }))
  .catch(err => res.status(403).send(`{"error": "${err}"`))
})

const startListening = port => app.listenAsync(port)

app.get('/stories', (req, res) =>
  auth.authenticateRequest(req, res)
    .then(() => db.getFeed())
    .then((feed) => res.send(feed))
    .catch(err => res.status(403).send(err)))

module.exports = {
  startListening
}
