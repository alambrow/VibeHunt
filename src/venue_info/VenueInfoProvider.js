import React, { createContext } from 'react';

export const VenueInfoContext = createContext()

export const VenueInfoProvider = (props) => {

    const getVenueInfo = venueId => {
        
        const params = new URLSearchParams({ 
            'api_key_public': `${process.env.BESTTIME_KEY}`,
            'venue_id': `${venueId.toString()}`,
         });
        return fetch(`https://besttime.app/api/v1/forecasts/now?${params}`, {method: 'GET'})
        .then(res => res.json())

    }

    return (
        <VenueInfoContext.Provider value={{
            getVenueInfo
        }}>
            {props.children}
        </VenueInfoContext.Provider>
    )
}