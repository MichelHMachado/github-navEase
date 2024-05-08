import React, { useEffect, useState } from 'react';

import logo from '../../assets/img/icon-128.png';
import './Popup.css';
import '../../globals.css';
import { getCurrentTab } from '../background';
import Loader from './components/loader/Loader';
import { sendMessage } from '../content/injected/utils';
import RepositoryList from './components/repository-list/RepositoryList';
import ApiKeyInput from './components/api-key-input/ApiKeyInput';

const Popup: React.FC = () => {
  const [repositories, setRepositories] = useState([]);
  const [userId, setUserId] = useState('');
  const [isGitHubPage, setIsGitHubPage] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataReceived, setDataReceived] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCurrentTab(currentTab => {
      setIsGitHubPage(currentTab?.url?.includes('github.com') ? true : false);
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get(['repositoriesData', 'userId'], result => {
      if (result.repositoriesData) {
        setRepositories(result.repositoriesData);
        setUserId(result.userId);
        setDataReceived(true);
        setLoading(false);
      } else {
        sendMessage('POPUP_OPEN', { dataReceived });
      }
    });

    if (!dataReceived && apiKey) {
      console.log('dataReceived: ', dataReceived);
      chrome.runtime.onMessage.addListener(message => {
        if (message.type === 'REPOSITORIES_DATA_POPUP') {
          setRepositories(message.data);
          chrome.storage.local.set({ repositoriesData: message.data, userId: message.userId });
          setUserId(message.userId);
          setLoading(false);
          setDataReceived(true);
        }
      });
    }
    chrome.storage.local.get(['apiKey'], result => {
      setApiKey(result.apiKey);
    });
    sendMessage('POPUP_OPEN', { dataReceived });
  });

  const saveApiKey = (key: string) => {
    setApiKey(key);
    chrome.storage.local.set({ apiKey: key });
  };

  const deleteApiKey = () => {
    setApiKey(null);
    chrome.storage.local.remove(['repositoriesData', 'apiKey', 'userId']);
  };

  const goToPageById = (repoUrl: string) => {
    chrome.runtime.sendMessage({
      type: 'NEW_URL',
      newUrl: repoUrl,
    });
  };

  const otherRepositories = repositories
    ?.filter(repo => repo.owner.id !== userId)
    .sort((a, b) => a.name.localeCompare(b.name));
  const userRepositories = repositories
    ?.filter(repo => repo.owner.id === userId)
    .sort((a, b) => a.name.localeCompare(b.name));

  console.log('repositories', repositories);

  return isGitHubPage ? (
    apiKey ? (
      <div className="App">
        {loading ? (
          <Loader />
        ) : (
          <>
            <header className="App-header">GitHub NavEase</header>
            <img className="rounded-full mx-auto" src={logo} alt="GitHub NavEase Logo" />
            <h1 className="App-container__heading">Effortlessly Navigate to Your Repositories</h1>
            <div className="App-container">
              <div>
                <RepositoryList
                  repositories={otherRepositories}
                  title="User's Not Authored Repositories"
                  onClick={goToPageById}
                />
              </div>

              <div>
                <RepositoryList
                  repositories={userRepositories}
                  title="User's Authored Repositories"
                  onClick={goToPageById}
                />
              </div>
            </div>
            <button className="delete-button" onClick={deleteApiKey}>
              <span className="delete-button-text">Delete API Key</span>
              <span className="delete-button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                </svg>
              </span>
            </button>
          </>
        )}
      </div>
    ) : (
      <ApiKeyInput saveApiKey={saveApiKey} />
    )
  ) : (
    <h1 className="warning-text">This is not a GitHub page!</h1>
  );
};

export default Popup;
