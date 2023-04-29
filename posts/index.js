const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { randomBytes } = require('crypto')
const axios = require('axios')

const app = express()
const posts = {}

app.use(bodyParser.json())
app.use(cors())

app.post('/events', (req, res) => {
    console.log('Received event', req.body.type)
    res.send()
})

app.get('/posts', (req, res) => {
    return res.send(posts)
})

app.post('/posts/create', async (req, res) => {
    const { title } = req.body
    const id = randomBytes(4).toString('hex')
    posts[id] = {
        id, title
    }

    try {
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'PostCreated',
            data: {
                id, title
            }
        })
    } catch {}

    res.status(201).send(posts[id])
})

app.listen(4000, () => console.log('Listening on 4000'))