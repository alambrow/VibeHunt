import React from 'react';
import { useMediaQuery } from 'react-responsive';
import './App.css';
import { Mobile } from './components/mobile';
import { Desktop } from './components/desktop';
import { VenueDetailProvider } from './components/venue_wall/VenueDetailProvider';
import { VenueInfoProvider } from './venue_info/VenueInfoProvider';
import { CommentProvider } from './components/comments/CommentProvider';
import { UserDataProvider } from './components/user_data/UserDataProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const isMobileDevice = useMediaQuery({
    query: "(min-device-width: 320px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1200px)",
  });


  return (
    <div className="App">
      <VenueDetailProvider>
        <VenueInfoProvider>
          <CommentProvider>
            <UserDataProvider>
              {isMobileDevice && <Mobile />}
              {isDesktop && <>
              <Desktop />
              </>}
            </UserDataProvider>
          </CommentProvider>
        </VenueInfoProvider>
      </VenueDetailProvider>
    </div>
  );
}

export default App;
