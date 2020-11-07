import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import "./posts.css";

const Posts = ({ username, caption, imageUrl, postId, user }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
    });
    setComments("");
  };

  return (
    <div className="post">
      <div className="post-header">
        <Avatar
          src="./posts.css"
          alt={username}
          className="post-avatar"
        ></Avatar>
        <h3 className="PostUserName">{username}</h3>
      </div>

      <img className="post-image" src={imageUrl}></img>
      <div className="postCaptionBox">
        <h3 className="postCaption">{caption}</h3>
      </div>

      <form className="commentFormBox">
        <input
          className="inputComment"
          type="text"
          placeholder="Add Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></input>
        <button
          className="SubmitButton"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >
          Comment
        </button>
      </form>
      <div className="commentBox">
        {comments
          ? comments.map((comment) => (
              <p className="commentSection">
                <strong className="commentUserName">{`${comment.username} :`}</strong>
                {comment.text}
              </p>
            ))
          : null}
      </div>
    </div>
  );
};

export default Posts;
