import React from 'react';
import { useMediaQuery } from 'react-responsive';
import './App.css';
import { Mobile } from './components/mobile';
import { Tablet } from './components/tablet';
import { Desktop } from './components/desktop';
import { Laptop } from './components/laptop';
import { BigScreen } from './components/big-screen';
import { VenueDetailProvider } from './components/venue_wall/VenueDetailProvider';
import { VenueInfoProvider } from './venue_info/VenueInfoProvider';
import { CommentProvider } from './components/comments/CommentProvider';
import { UserDataProvider } from './components/user_data/UserDataProvider';

function App() {

  const isMobileDevice = useMediaQuery({
    query: "(min-device-width: 320px)",
  });

  const isTabletDevice = useMediaQuery({
    query: "(min-device-width: 768px)",
  });

  const isLaptop = useMediaQuery({
    query: "(min-device-width: 1024px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1200px)",
  });

  const isBigScreen = useMediaQuery({
    query: "(min-device-width: 1201px )",
  });

  return (
    <div className="App">
      <VenueDetailProvider>
        <VenueInfoProvider>
          <CommentProvider>
            <UserDataProvider>
              {isMobileDevice && <Mobile />}
              {isTabletDevice && <>
              <Tablet />
              {isDesktop && <Desktop />}
              {isLaptop && <Laptop />}
              {isBigScreen && <BigScreen />}
              </>}
            </UserDataProvider>
          </CommentProvider>
        </VenueInfoProvider>
      </VenueDetailProvider>
    </div>
  );
}

export default App;
