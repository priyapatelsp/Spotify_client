import React, { useEffect, useState } from 'react';

const PlaybackControls = ({ accessToken, selectedPlaylist }) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    // Function to initialize the player
    const initializePlayer = () => {
      if (!window.Spotify) {
        console.error('Spotify Web Playback SDK is not loaded.');
        return;
      }

      const newPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(accessToken); },
      });

      // Error handling
      newPlayer.addListener('initialization_error', ({ message }) => console.error(message));
      newPlayer.addListener('authentication_error', ({ message }) => console.error(message));
      newPlayer.addListener('account_error', ({ message }) => console.error(message));
      newPlayer.addListener('playback_error', ({ message }) => console.error(message));

      // Playback status updates
      newPlayer.addListener('player_state_changed', state => console.log(state));

      // Ready
      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        document.getElementById('play').onclick = () => {
          fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            body: JSON.stringify({ context_uri: `spotify:playlist:${selectedPlaylist}` }),
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
        };

        document.getElementById('pause').onclick = () => {
          fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
        };
      });

      newPlayer.connect();
      setPlayer(newPlayer);
    };

    // Load the Spotify Web Playback SDK script if it's not already loaded
    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      script.onload = initializePlayer;
      document.body.appendChild(script);
    } else {
      initializePlayer();
    }

  }, [accessToken, selectedPlaylist]);

  return (
    <div>
      <h2>Playback Controls</h2>
      <button id="play" disabled={!selectedPlaylist}>Play</button>
      <button id="pause">Pause</button>
    </div>
  );
};

export default PlaybackControls;
