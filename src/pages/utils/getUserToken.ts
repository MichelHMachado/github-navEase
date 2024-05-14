// Define constants
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPES = import.meta.env.VITE_SCOPES.split(' ').join('%20');

export const getUserToken = async () => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
  console.log('authUrl inside getUserToken: ', authUrl);
  await chrome.identity.launchWebAuthFlow(
    {
      url: authUrl,
      interactive: true,
    },
    redirectURL => {
      console.log('redirectURL: ', redirectURL);
      if (chrome.runtime.lastError) {
        console.error('Error in initiateOAuthFlow:', chrome.runtime.lastError.message);
        return;
      }
    },
  );
};

export const exchangeCodeForToken = async (code: string): Promise<string | null> => {
  const tokenUrl = 'https://github.com/login/oauth/access_token';
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    redirect_uri: REDIRECT_URI,
  };

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const data = await response.json();
    const accessToken = data.access_token;

    return accessToken;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
};
