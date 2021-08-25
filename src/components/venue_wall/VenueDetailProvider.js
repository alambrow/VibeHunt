import React, {useState, createContext} from 'react';

export const VenueDetailContext = createContext()

export const VenueDetailProvider = (props) => {
    const [venueDetail, setVenueDetail] = useState([])
    const [searchTerms, setSearchTerms] = useState("")

    const getVenueDetail = (neighborhood) => {
        return fetch(`https://vibehunt.herokuapp.com/venues?neighborhood=${neighborhood}`)
        .then(res => res.json())
        .then(data => {
            setVenueDetail(data)
        })
    }

    const getAllVenueDetail = () => {
        return fetch(`https://vibehunt.herokuapp.com/venues`)
        .then(res => res.json())
        .then(data => {
            setVenueDetail(data)
        })
    }

    const getVenueDetailById = venueId => {
        return fetch(`https://vibehunt.herokuapp.com/venues/${venueId}`)
        .then(res => res.json())
    }

    return (
        <VenueDetailContext.Provider value={{
            venueDetail, getVenueDetail, getVenueDetailById, searchTerms, setSearchTerms, getAllVenueDetail
        }}>
            {props.children}
        </VenueDetailContext.Provider>
    )
}