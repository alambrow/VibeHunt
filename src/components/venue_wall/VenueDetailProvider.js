
import React, {useState, createContext} from 'react';

export const VenueDetailContext = createContext()

export const VenueDetailProvider = (props) => {
    const [venueDetail, setVenueDetail] = useState([])
    const [searchTerms, setSearchTerms] = useState("")

    const getVenueDetail = () => {
        return fetch("http://localhost:8088/venues")
        .then(res => res.json())
        .then(data => {
            setVenueDetail(data)
        })
    }

    const getVenueDetailById = venueId => {
        return fetch(`http://localhost:8088/venues/${venueId}`)
        .then(res => res.json())
    }

    return (
        <VenueDetailContext.Provider value={{
            venueDetail, getVenueDetail, getVenueDetailById, searchTerms, setSearchTerms
        }}>
            {props.children}
        </VenueDetailContext.Provider>
    )
}