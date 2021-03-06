import React, { useContext, useEffect, useState, Link } from 'react';
import { VenueDetailContext } from './VenueDetailProvider';
import { VenueInfoContext } from '../../venue_info/VenueInfoProvider';
import { VenueDetail } from './VenueDetail';
import { Form, OverlayTrigger, Tooltip, Col } from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import './venue_wall.css';

export const VenueWall = (props) => {
    const { venueDetail, getVenueDetail, searchTerms, setSearchTerms, getAllVenueDetail } = useContext(VenueDetailContext)
    const { getVenueInfo } = useContext(VenueInfoContext)
    const [ remoteVenueInfo, setRemoteVenueInfo ] = useState([])
    const [ filteredVenueIds, setFilteredVenueIds ] = useState([])
    const [ filteredVenueDetail, setFilteredVenueDetail] = useState([])
    const [ isSwitchOn, setIsSwitchOn ] = useState(false);
   
    // GETs venue details from JSON server
    useEffect(() => {
        if (props.neighborhood !== "All") {
            getVenueDetail(props.neighborhood)
        } else {
            getAllVenueDetail()
        }
        
    }, [])

    // Sends GET requests to BestTime API to get live data about venue busyness
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
    
    // Takes live data from API and sorts according to intensity_nr, busiest bars to the top
    // if the cool switch is on, bars with busy level of 0 (average) or below go to the top
    // returns list of IDs generated by API and recorded in local JSON database
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
    }, [remoteVenueInfo, isSwitchOn])

    // Takes list of filtered API-linked IDs and generates a list of venues using local JSON data
    // checks whether search terms have been put in box at top of page
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
    }, [filteredVenueIds, searchTerms])
  
    // sets the cool mode toggle boolean value
    const onSwitchAction = () => {
        if (isSwitchOn === false) {
            setIsSwitchOn(true)
        } else {
            setIsSwitchOn(false)
        }
    }

    // function to make tool tip appear over the cool mode description
    const renderTip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Cool mode pushes quieter bars to the top of the list
        </Tooltip>
    )

    const showLocatInSearch = () => {
        return `Search ${props.neighborhood}`
    }
 
    return (
        <>
            <Form className={isSwitchOn ? "vibe__toggle__cool" : "vibe__toggle"}>
                <Form.Row className="toggle__flex__outer">
                    <Col className="toggle__flex" xs={6}>
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 200, hide: 200 }}
                            overlay={renderTip}
                        >
                        <div className="cool_mode_descript">Toggle Cool Mode</div>
                        </OverlayTrigger>
                        <BootstrapSwitchButton 
                            label="cool mode switch"
                            onChange={onSwitchAction}
                            onstyle="primary"
                            offstyle="secondary"
                            width={50}
                            height={30}
                        />
                    </Col>
                    <Col>
                        <Form.Control 
                        type="search" 
                        placeholder={showLocatInSearch()} 
                        className="search_box" 
                        onKeyUp={(event) => setSearchTerms(event.target.value)}
                        />
                    </Col>
                </Form.Row>
            </Form>
            <div className={isSwitchOn ? "venues__info__cool" : "venues__info"}>
               
                {   
                    filteredVenueDetail.map(venue => {
                        return <VenueDetail venue={venue} />
                    })
                }
            </div>
            <div className="infobar__bottom">
                A full-stack web app by
                <a className="personal_website_link" href="https://www.alexanderlambrow.com">Alex Lambrow</a>
            </div>
        </>
    )
}