// Function to get the value of a URL parameter
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const code = getParameterByName('code');
if (code) {
  // Construct the URL to open your extension's popup
  const extensionURL = `chrome-extension://${chrome.runtime.id}/src/pages/popup/Popup.tsx?code=${code}`;

  // Redirect to the extension popup
  window.location.href = extensionURL;
} else {
  // Handle case where 'code' is not present
  document.body.innerHTML = '<h1>Error: OAuth code not found.</h1>';
}
