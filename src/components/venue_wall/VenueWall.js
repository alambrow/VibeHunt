import React, { useContext, useEffect, useState } from 'react';
import { Form, OverlayTrigger, Tooltip, Col } from 'react-bootstrap';
import { VenueDetailContext } from './VenueDetailProvider';
import { VenueInfoContext } from '../../venue_info/VenueInfoProvider';
import { VenueDetail } from './VenueDetail';
import './venue_wall.css';

export const VenueWall = () => {
    const { venueDetail, getVenueDetail, searchTerms } = useContext(VenueDetailContext)
    const { getVenueInfo } = useContext(VenueInfoContext)
    const [ remoteVenueInfo, setRemoteVenueInfo ] = useState([])
    const [ filteredVenueIds, setFilteredVenueIds ] = useState([])
    const [ filteredVenueDetail, setFilteredVenueDetail] = useState([])
    const [ isSwitchOn ] = useState(false);
   
    useEffect(() => {
        getVenueDetail()
    }, [])

    useEffect(() => {
        let promises = []
        for (let i = 0; i < venueDetail.length; i++) {
            let venueFetchCall = getVenueInfo(venueDetail[i].venId)
            promises.push(venueFetchCall)
        }
        Promise.all(promises)
            .then((data) => {
                setRemoteVenueInfo(data)
            })
    }, [venueDetail])
    
    useEffect(() => {
        let localArray = []
        let sortedVenueInfo = remoteVenueInfo
        sortedVenueInfo.sort(function (a, b) {
            return a.analysis.hour_analysis.intensity_nr - b.analysis.hour_analysis.intensity_nr;
        })
       
        if (isSwitchOn === true) {
            for (let i = 0; i < sortedVenueInfo.length; i++) {
                if (sortedVenueInfo[i].analysis.hour_analysis.intensity_nr <= 0) {
                    localArray.unshift(sortedVenueInfo[i].venue_info.venue_id)
                } else {
                    localArray.push(sortedVenueInfo[i].venue_info.venue_id)
                }
            }
        } else {
            for (let i = 0; i < sortedVenueInfo.length; i++) {
                if (sortedVenueInfo[i].analysis.hour_analysis.intensity_nr === "N/A" || sortedVenueInfo[i].analysis.hour_analysis.intensity_nr === "999") {
                    localArray.push(sortedVenueInfo[i].venue_info.venue_id)
                } else {
                    localArray.unshift(sortedVenueInfo[i].venue_info.venue_id)
                }
            }
        }
        setFilteredVenueIds(localArray)
    }, [remoteVenueInfo])

    useEffect(() => {
        let localArray = []
        for (let i = 0; i < filteredVenueIds.length; i++) {
            for (let n = 0; n < venueDetail.length; n++) {
                if (filteredVenueIds[i] === venueDetail[n].venId) {
                    localArray.push(venueDetail[n])
                }
            }
        }
        if (searchTerms !== "") {
            const newSearchTerms = searchTerms.toLowerCase()
            const subset = localArray.filter(venue => venue.name.toLowerCase().includes(newSearchTerms))
            setFilteredVenueDetail(subset)
        } else {
            setFilteredVenueDetail(localArray)
        }
    }, [filteredVenueIds])
  
    return (
        <>
            <div className={isSwitchOn ? "venues__info__cool" : "venues__info"}>
                {   
                    filteredVenueDetail.map(venue => {
                        console.log(venue)
                        return <VenueDetail venue={venue} />
                    })
                }
            </div>
        </>
    )
}