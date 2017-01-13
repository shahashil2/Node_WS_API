let express = require('express')

let app = express()

app.listen(1991, function () {
  console.log('Example app listening on port 1991!')
})


app.get('/demoGet', function (req, res) {

    
  res.send('Get Request Hit')
})


app.post('/demoPost', function (req, res) {
  res.send('Post Request Hit')
})


app.put('/demoPut', function (req, res) {
  res.send('Put Request Hit')
})

app.delete('/demoDelete', function (req, res) {
  res.send('Delete Request Hit!')
})

