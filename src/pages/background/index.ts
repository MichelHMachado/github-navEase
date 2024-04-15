import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import { sendMessage } from '../content/injected/utils';

reloadOnUpdate('pages/background');

let activeTab: chrome.tabs.Tab | undefined;

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

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    getCurrentTab(currentTab => {
      activeTab = currentTab;
      chrome.tabs.sendMessage(activeTab.id, {
        type: 'INITIALIZE',
        activeTab,
      });
    });
  }
});

chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'NEW_URL') {
    chrome.tabs.update({ url: message.newUrl });
  } else if (message.type === 'NEW_DATA') {
    const obj = {
      dataChanged: message.dataChanged,
    };
    sendMessage('SEND_NEW_DATA', { obj });
  } else if (message.type === 'POPUP_OPEN') {
    chrome.tabs.sendMessage(activeTab.id, { type: 'POPUP_OPEN' });
  } 
});
