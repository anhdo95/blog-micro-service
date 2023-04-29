const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { randomBytes } = require('crypto')
const axios = require('axios')

const app = express()
const commentsByPostId = {}

app.use(bodyParser.json())
app.use(cors())

app.post('/events', async (req, res) => {
    const { type, data } = req.body
    console.log('Received event', type)

    switch (type) {
        case 'CommentModerated': {
            const { postId, id, status } = data
            const comment = commentsByPostId[postId].find(c => c.id === id)
            comment.status = status
            
            try {
                await axios.post('http://event-bus-srv:4005/events', {
                    type: 'CommentUpdated',
                    data
                })
            } catch {}
        }
        break;
    
        default:
            break;
    }

    res.send()
})

app.get('/posts/:id/comments', (req, res) => {
    return res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
    const { content } = req.body
    const id = randomBytes(4).toString('hex')
    const postId = req.params.id
    const comments = commentsByPostId[postId] || []
    const newComment = { id, content, status: 'pending' }
    
    comments.push(newComment)
    commentsByPostId[postId] = comments

    try {
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentCreated',
            data: {
                ...newComment,
                postId,
            }
        })
    } catch {}

    res.status(201).send(comments)
})

app.listen(4001, () => console.log('Listening on 4001'))