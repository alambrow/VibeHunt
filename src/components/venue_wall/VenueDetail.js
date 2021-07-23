import React, { useContext, useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { VenueInfoContext } from '../../venue_info/VenueInfoProvider';
import { MyMapComponent } from '../map/map';
import "./venue_wall.css";

export const VenueDetail = ({venue}) => {
    const { getVenueInfo } = useContext(VenueInfoContext)
    const [ localVenueState, setLocalVenueState ] = useState({})
    const [intensity_display, setIntensity_display] = useState([])
    const [venAdd, setVenAdd] = useState([])
    const [positObj, setPositObj] = useState({})

    useEffect(() => {
        getVenueInfo(venue.venId).then((data) => {
            setLocalVenueState(data.analysis.hour_analysis)
        })
    }, [venue])

    useEffect(() => {
        const intensity = parseInt(localVenueState.intensity_nr)
        if (intensity === 2) {
            setIntensity_display(100)
        } else if (intensity === 1) {
            setIntensity_display(75)
        } else if (intensity === 0) {
            setIntensity_display(50)
        } else if (intensity === -1) {
            setIntensity_display(35)
        } else if (intensity === -2) {
            setIntensity_display(20)
        } else {
            setIntensity_display(5)
        }
    }, [localVenueState])
    
    useEffect(() => {
        const [venAddress,] = venue.address.split(",")
        setVenAdd(venAddress)
    }, [venue])

    useEffect(() => {
        let thisLocation = {
            lat: venue.lat,
            lng: venue.long
        }
        setPositObj(thisLocation)
    }, [venue])

    const renderMap = (positObj) => {
        return (
            <MyMapComponent marker={positObj} key={new Date().getTime()} />
        )
    }

    return (
        <div className="venue_card">
            {renderMap(positObj)}
            <div className="venue_name">{venue.name}</div>
            <div className="venue_address">{venAdd}</div>
            <div className="venue_open">Vibe level: {localVenueState.intensity_txt}</div>
                <div className="venue_vibe">
                    <ProgressBar animated now={intensity_display} variant="warning" />
                </div>
                <div className="venue_buttons_flex">
                    <div className="favorite_button">hii</div>
                    <div className="share_dropdown">hiii</div>
                </div>
        </div>
    )
}