
// Requiring the dependances

const express = require('express')
const bodyParser = require('body-parser')
const request=require('request')

const app = express()

// Facebook tokens

const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN

app.set('port',(process.env.PORT || 5000))

//Allows us to process the data

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//ROUTES

app.get('/', function(req, res){
  res.send("Hello,I am chatbot!");
})

//Facebook Webhook
app.get('/webhook/', function(req, res){
  if(req.query['hub.verify_token'] === token){
    res.send(req.query['hub.challenge'])
  }
  res.send("wrong token")
})

//server

app.listen(app.get('port'), function(){
  console.log("running: port")
})

//posting data to the chatbot

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text

        if(text === "engine1"){
            sendTextMessage(sender, "engine 1 ok ")
        }
        else if(text === "engine2"){
            sendTextMessage(sender, "engine 2 operationg at 55% capacity ")
        }
        else if(text === "Hello"){
            sendTextMessage(sender, "Hello, nice to meet you!")
        }
        else {
            sendTextMessage(sender, "Please refer to spaceFeX manual to be able to chat with me about spaceEagle engine statuses.")
        }

      }

    }
    res.sendStatus(200)
  })


function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:access},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
