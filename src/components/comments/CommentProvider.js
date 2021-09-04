import React, { useState, createContext} from 'react';

export const CommentContext = createContext()

export const CommentProvider = (props) => {
    const [comments, setComments] = useState([])

    const getComments = () => {
        return fetch("https://vibehunt.herokuapp.com/comments")
        .then(res => res.json())
        .then(setComments)
    }

    const addComment = commentObj => {
        return fetch("https://vibehunt.herokuapp.com/comments", {
            mode: 'no-cors',
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(commentObj)
        })
        .then (getComments)
    }

    const getCommentsByVenueId = venId => {
        return fetch(`https://vibehunt.herokuapp.com/comments?venueId=${venId}`)
        .then(res => res.json())
        .then(setComments)
    }

    return (
        <CommentContext.Provider value={{
            comments, getComments, addComment, getCommentsByVenueId
        }}>
            {props.children}
        </CommentContext.Provider>
    )
}