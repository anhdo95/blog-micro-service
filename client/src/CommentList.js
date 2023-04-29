import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    const content = {
      'pending': 'This comment is awaiting moderation',
      'rejected': 'This comment has been rejected'
    }[comment.status] || comment.content

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
