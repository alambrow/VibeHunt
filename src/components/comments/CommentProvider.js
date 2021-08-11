import React, { useState, createContext} from 'react';

export const CommentContext = createContext()

export const CommentProvider = (props) => {
    const [comments, setComments] = useState([])

    const getComments = () => {
        return fetch("http://127.0.0.1:8000/comments")
        .then(res => res.json())
        .then(setComments)
    }

    const addComment = commentObj => {
        return fetch("http://127.0.0.1:8000/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(commentObj)
        })
        .then (getComments)
    }

    return (
        <CommentContext.Provider value={{
            comments, getComments, addComment
        }}>
            {props.children}
        </CommentContext.Provider>
    )
}