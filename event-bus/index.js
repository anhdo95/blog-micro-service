const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
const events = []

app.use(bodyParser.json())

app.get('/events', async (req, res) => {
    res.send(events)
})

app.post('/events', async (req, res) => {
    const event = req.body
    events.push(event)

    try {
        await Promise.allSettled([
            axios.post('http://posts-srv:4000/events', event),
            axios.post('http://comments-srv:4001/events', event),
            axios.post('http://query-srv:4002/events', event),
            axios.post('http://moderation-srv:4003/events', event),
        ])
    } catch (error) {
        console.log('error', error)
    }

    res.send({ status: 'OK' })
})

app.listen(4005, () => console.log('Listening on 4005'))