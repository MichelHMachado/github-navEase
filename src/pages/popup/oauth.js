chrome.runtime.sendMessage({
  type: 'oauth',
  url: window.location.href,
});

chrome.runtime.onMessage.addListener(message => {
  console.log('message from ouath.js: ', message);
});

setTimeout(() => {
  window.close();
}, 5000);
