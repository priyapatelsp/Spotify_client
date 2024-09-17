import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPlaylists = ({ accessToken, onSelectPlaylist }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (accessToken) {
      axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        setPlaylists(response.data.items);
      })
      .catch(error => {
        console.error('Error fetching playlists:', error);
      });
    }
  }, [accessToken]);

  return (
    <div>
      <h2>Your Playlists</h2>
      {playlists.length > 0 ? (
        <ul>
          {playlists.map(playlist => (
            <li key={playlist.id}>
              <button onClick={() => onSelectPlaylist(playlist.id)}>
                {playlist.name}
                {playlist.images.length > 0 && (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    width={100}
                    height={100}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No playlists found.</p>
      )}
    </div>
  );
};

export default UserPlaylists;
