const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()

app.use(bodyParser.json())

app.post('/events', async (req, res) => {
    const { type, data } = req.body
    console.log('Received event', type)

    switch (type) {
        case 'CommentCreated': {
            try {
                await axios.post('http://event-bus-srv:4005/events', {
                    type: 'CommentModerated',
                    data: {
                        ...data,
                        status: data.content.includes('orange') ? 'rejected' : 'approved'
                    }
                })
            } catch {}
        }
        break;
    
        default:
            break;
    }

    res.send()
})

app.listen(4003, () => console.log('Listening on 4003'))