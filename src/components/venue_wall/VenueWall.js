import React, { useContext, useEffect, useState } from 'react';
import { VenueDetailContext } from './VenueDetailProvider';
import { VenueInfoContext } from '../../venue_info/VenueInfoProvider';
import { VenueDetail } from './VenueDetail';
import { Form, OverlayTrigger, Tooltip, Col } from 'react-bootstrap';
import FormCheck from 'react-bootstrap/FormCheck';
import './venue_wall.css';

export const VenueWall = () => {
    const { venueDetail, getVenueDetail, searchTerms, setSearchTerms } = useContext(VenueDetailContext)
    const { getVenueInfo } = useContext(VenueInfoContext)
    const [ remoteVenueInfo, setRemoteVenueInfo ] = useState([])
    const [ filteredVenueIds, setFilteredVenueIds ] = useState([])
    const [ filteredVenueDetail, setFilteredVenueDetail] = useState([])
    const [ isSwitchOn, setIsSwitchOn ] = useState(false);
   
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
  
    const onSwitchAction = () => {
        if (isSwitchOn === false) {
            setIsSwitchOn(true)
        } else {
            setIsSwitchOn(false)
        }
    }

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

    const renderTip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Cool mode pushes quieter bars to the top of the list
        </Tooltip>
    )

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
                        <Form.Switch
                            type='switch'
                            bsSwitchPrefix='form-check'
                            id="custom-switch"
                            onChange={onSwitchAction}
                        />
                    </Col>
                    <Col>
                        <Form.Control 
                        type="search" 
                        placeholder="Search" 
                        className="search_box" 
                        onKeyUp={(event) => setSearchTerms(event.target.value)}
                        />
                    </Col>
                </Form.Row>
            </Form>


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