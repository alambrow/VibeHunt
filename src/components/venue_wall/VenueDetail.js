import React, { useContext, useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Accordion, Card, Modal, Button } from "react-bootstrap";
import { VenueInfoContext } from '../../venue_info/VenueInfoProvider';
import { MyMapComponent } from '../map/map';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./venue_wall.css";

export const VenueDetail = ({venue}) => {
    const { getVenueInfo } = useContext(VenueInfoContext)
    const [ localVenueState, setLocalVenueState ] = useState({})
    const [intensity_display, setIntensity_display] = useState([])
    const [venAdd, setVenAdd] = useState([])
    const [positObj, setPositObj] = useState({})
    // sends GET fetch call to BestTime API to get current data re busyness
    useEffect(() => {
        getVenueInfo(venue.venId).then((data) => {
            setLocalVenueState(data.analysis.hour_analysis)
        })
    }, [venue])
    // converts data busy scale 2 through -2 to number between 5 and 100 for progress bar display
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
    
    // splits venue address to filter out the state and zip details
    useEffect(() => {
        const [venAddress,] = venue.address.split(",")
        setVenAdd(venAddress)
    }, [venue])

     // sets coordinates for Google Maps plug-in
    useEffect(() => {
        let thisLocation = {
            lat: venue.lat,
            lng: venue.long
        }
        setPositObj(thisLocation)
    }, [venue])

    // calls Google Map render
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
            <ProgressBar animated now={intensity_display} variant="warning" />
            <div className="venue_buttons_flex">

            </div>
            <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                        What's the vibe?
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                        <Card.Body>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1">
                        User Notes
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                        <Card.Body>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    </Accordion>
        </div>
    )
}