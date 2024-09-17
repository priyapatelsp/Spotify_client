import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Callback from './Callback';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  </Router>
);

const Home = () => {
  const handleLogin = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    const scopes = 'user-read-private user-read-email user-library-read user-read-playback-state user-modify-playback-state';
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    window.location.href = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`;
  };

  return (
    <div>
      <h1>Spotify Client</h1>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default App;
