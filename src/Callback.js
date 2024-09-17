import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import UserPlaylists from './UserPlaylists';
import PlaybackControls from './PlaybackControls';

const Callback = () => {
  const location = useLocation();
  const [accessToken, setAccessToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
    }
  }, [location]);

  useEffect(() => {
    if (accessToken) {
      axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        setUserProfile(response.data);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
    }
  }, [accessToken]);

  return (
    <div>
      <h1>Callback Page</h1>
      {userProfile ? (
        <div>
          <h2>Welcome, {userProfile.display_name}</h2>
          <img src={userProfile.images[0]?.url} alt="Profile" width={100} />
          <UserPlaylists 
            accessToken={accessToken} 
            onSelectPlaylist={setSelectedPlaylist} 
          />
          <PlaybackControls 
            accessToken={accessToken} 
            selectedPlaylist={selectedPlaylist} 
          />
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Callback;
