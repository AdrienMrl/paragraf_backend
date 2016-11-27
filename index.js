const route = require('./route.js')

route.startListening(3000)
  .then(() => console.log('Welcome. Listening on port 3000. Happy writting :).'))
  .catch(err => console.error(err))
