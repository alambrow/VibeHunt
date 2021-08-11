import React from 'react';
import { Route } from 'react-router-dom';
import { NavBar } from './nav/NavBar';
import { VenueWall } from './venue_wall/VenueWall';

export const Mobile = () => {
    return (
    <>
        <NavBar />
        <Route exact path="/">
            
        </Route>
        <Route exact path="/nashville/midtown">
            <VenueWall neighborhood="Midtown" />
        </Route>
        <Route exact path="/nashville/downtown">
            <VenueWall neighborhood="Downtown" />
        </Route>
        <Route exact path="/nashville/east">
            <VenueWall neighborhood="East Nashville" />
        </Route>
    </>
    )
}