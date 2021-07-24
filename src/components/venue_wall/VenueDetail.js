import React, { useContext, useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Accordion, Card, Button } from "react-bootstrap";
import { VenueInfoContext } from '../../venue_info/VenueInfoProvider';
import { CommentContext } from '../comments/CommentProvider';
import { MyMapComponent } from '../map/map';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./venue_wall.css";

export const VenueDetail = ({venue}) => {
    const { getVenueInfo } = useContext(VenueInfoContext)
    const [ localVenueState, setLocalVenueState ] = useState({})
    const [intensity_display, setIntensity_display] = useState([])
    const [venAdd, setVenAdd] = useState([])
    const [positObj, setPositObj] = useState({})
    const { comments, addComment, getComments } = useContext(CommentContext)

    // sends GET fetch call to BestTime API to get current data re busyness
    useEffect(() => {
        getVenueInfo(venue.venId).then((data) => {
            setLocalVenueState(data.analysis.hour_analysis)
        })
    }, [venue])

    useEffect(() => {
        getComments()
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

    // renders Google Map centered on coordinates of venue
    const renderMap = (positObj) => {
        return (
            <MyMapComponent marker={positObj} key={new Date().getTime()} />
        )
    }

    const addCommentToDatabase = (venId, commId) => {
        addComment({
            venueId: venId,
            commentId: commId,
            timestamp: Date.now()
        })
    }



    const displayComments = (venId) => {
        let localComments = []
        let twoHourMarker = (Date.now() - 7200)

        for (let i = 0; i < comments.length; i++) {
            if (comments[i].venueId === venId && comments[i].timestamp >= twoHourMarker) {
                localComments.push(comments[i])
            }
        }
        let litttComments = 0
        let vibeyComments = 0
        let chillComments = 0
        let mehComments = 0
        for (let i = 0; i < localComments.length; i++) {
            if (localComments[i].commentId === 1) {
                litttComments++
            } else if (localComments[i].commentId === 2) {
                vibeyComments++
            } else if (localComments[i].commentId === 3) {
                chillComments++
            } else if (localComments[i].commentId === 4) {
                mehComments++
            }
        }

        let sum_total = (litttComments + vibeyComments + chillComments + mehComments)
        let litttPercent = (litttComments * 100) / sum_total
        let vibeyPercent = (vibeyComments * 100) / sum_total
        let chillPercent = (chillComments * 100) / sum_total
        let mehPercent = (mehComments * 100) / sum_total
        
    return (
        <> 
            <ProgressBar animated variant="warning" now={Math.ceil(litttPercent)} />
            <ProgressBar animated variant="success" now={Math.ceil(vibeyPercent)} />
            <ProgressBar animated variant="primary" now={Math.ceil(chillPercent)} />
            <ProgressBar animated variant="dark" now={Math.ceil(mehPercent)} />
        </>
    )

    }

    return (
        <div className="venue_card">
            {renderMap(positObj)}
            <div className="venue_name">{venue.name}</div>
            <div className="venue_address">{venAdd}</div>
            <div className="venue_open">Vibe level: {localVenueState.intensity_txt}</div>
            <ProgressBar animated now={intensity_display} variant="warning" />
            <br/>
            <div className="venue_buttons_flex">

            </div>
            <Accordion defaultActiveKey="0">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                    What's the vibe?
                    </Accordion.Toggle>                        <Accordion.Collapse eventKey="0">
                        <Card.Body>
                        <div className="vibe_button_flex">
                            <Button variant="warning" onClick={event => {
                                event.preventDefault()
                                addCommentToDatabase(venue.id, 1)}}>
                            Littt</Button>{' '}
                            <Button className="vibey_button" onClick={event => {
                                event.preventDefault()
                                addCommentToDatabase(venue.id, 2)}}>
                            Vibey</Button>{' '}
                            <Button variant="primary" onClick={event => {
                                event.preventDefault()
                                addCommentToDatabase(venue.id, 3)}}>
                            Chill</Button>{' '}
                            <Button className="meh_button" onClick={event => {
                                event.preventDefault()
                                addCommentToDatabase(venue.id, 4)}}>
                            Meh</Button>{' '}
                        </div>
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        Current Vibe
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                        <Card.Body>
                        {displayComments(venue.id)}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    )
}