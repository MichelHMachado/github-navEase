import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import { sendMessage } from '../utils';
import { exchangeCodeForToken } from '../utils/getUserToken';

reloadOnUpdate('pages/background');

/* let activeTab: chrome.tabs.Tab | undefined; */

type TabCallback = (tab: chrome.tabs.Tab | undefined) => void;

export async function getCurrentTab(callback: TabCallback) {
  const queryOptions = { active: true };
  chrome.tabs.query(queryOptions, ([tab]) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    }
    callback(tab);
  });
}

/* chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    getCurrentTab(currentTab => {
      activeTab = currentTab;
      chrome.tabs.sendMessage(activeTab.id, {
        type: 'INITIALIZE',
        activeTab,
      });
    });
  }
}); */

chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'oauth') {
    console.log('Receiving message from oauth.html on the background: ', message);
    const url = new URL(message.url);
    const code = url.searchParams.get('code');

    if (code) {
      exchangeCodeForToken(code)
        .then(accessToken => {
          chrome.storage.local.set({ accessToken: accessToken }, () => {
            console.log('Access token saved:', accessToken);
          });
          if (accessToken) {
            console.log('Sending message with the token: ', message.accessToken);
            sendMessage('SENDING_ACCESS_TOKEN', { accessToken: accessToken });
          }
        })
        .catch(error => {
          console.error('Error exchanging code for token:', error);
        });
    } else {
      console.error('OAuth error: Code not found in URL');
    }
  }
  if (message.type === 'REQUEST_DATA' && !message.dataReceived) {
    getCurrentTab(tab => {
      if (tab) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'REQUEST_REPOSITORIES_DATA',
          dataReceived: message.dataReceived,
          accessToken: message.accessToken,
        });
      } else {
        console.error('Unable to get current tab.');
      }
    });
  }
  if (message.type === 'NEW_URL') {
    chrome.tabs.update({ url: message.newUrl });
  } else if (message.type === 'NEW_DATA') {
    const obj = {
      dataChanged: message.dataChanged,
    };
    sendMessage('SEND_NEW_DATA', { obj });
  } else if (message.type === 'REPOSITORIES_DATA') {
    chrome.runtime.sendMessage({ type: 'REPOSITORIES_DATA_POPUP', data: message.data, userId: message.userId });
  }
});
