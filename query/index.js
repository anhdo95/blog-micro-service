const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const posts = {};

app.use(bodyParser.json());
app.use(cors());

app.post("/events", (req, res) => {
  console.log('Received event', req.body.type)
  handleEvent(req.body);
  res.send();
});

app.get("/posts", (req, res) => {
  return res.send(posts);
});

app.listen(4002, () => {
  syncEvents();

  console.log("Listening on 4002");
});

async function syncEvents() {
  try {
    const { data: events } = await axios.get(
      "http://event-bus-srv:4005/events"
    );
    events.forEach(handleEvent);
  } catch (error) {
    console.log("syncEvents", error);
  }
}

function handleEvent({ type, data }) {
  switch (type) {
    case "PostCreated":
      {
        const { id } = data;
        posts[id] = { ...data, comments: [] };
      }
      break;

    case "CommentCreated":
      {
        const { postId } = data;
        posts[postId].comments.push(data);
      }
      break;

    case "CommentUpdated":
      {
        const { id, postId, status, content } = data;
        const comment = posts[postId].comments.find((c) => c.id === id);
        comment.content = content;
        comment.status = status;
      }
      break;
  }
}
