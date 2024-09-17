const express = require('express');
const cors = require('cors');
const querystring = require('querystring');
const request = require('request'); // `request` is deprecated; use `node-fetch` or `axios` instead

const app = express();
const port = 8888;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

app.use(cors());
app.use(express.json());

app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email user-library-read user-read-playback-state user-modify-playback-state';
  res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri
  })}`);
});

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + new Buffer.from(client_id + ':' + client_secret).toString('base64')
    },
    json: true
  };
  
  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;
      res.redirect(`http://localhost:3000/#access_token=${access_token}&refresh_token=${refresh_token}`);
    } else {
      res.redirect('/#/error/invalid token');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
