import React from 'react';
import { Route } from 'react-router-dom';
import { NavBar } from './nav/NavBar';
import { VenueWall } from './venue_wall/VenueWall';

export const Mobile = () => {
    return (
    <>
        <NavBar />
        <Route exact path="/">
            <VenueWall />
        </Route>
    </>
    )
}