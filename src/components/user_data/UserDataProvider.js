import React, {useState, createContext} from 'react';

export const UserDataContext = createContext()

export const UserDataProvider = (props) => {
    const [userData, setUserData] = useState([])

    const getUserData = () => {
        return fetch("http://api.db-ip.com/v2/free/self/ipAddress")
        .then(res => res.json())
        .then(data => {
            setUserData(data)
        })
    }

    return (
        <UserDataContext.Provider value={{
            userData, getUserData
        }}>
            {props.children}
        </UserDataContext.Provider>
    )
}