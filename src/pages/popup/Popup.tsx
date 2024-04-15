import React, { useEffect, useState } from 'react';
import { Repository } from '../types/repo';
import logo from '../../assets/img/icon-128.png';
import './Popup.css';
import '../../globals.css';
import { getCurrentTab } from '../background';

const Popup: React.FC = () => {
  const [repositories, setRepositories] = useState([]);
  const [userId, setUserId] = useState('');
  const [dataChanged, setDataChanged] = useState(false);
  const [isGitHubPage, setIsGitHubPage] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'POPUP_OPEN' });
  }, [isGitHubPage]);

  useEffect(() => {
    setLoading(true);
    chrome.storage.local.get(['repositoriesData', 'userId', 'apiKey'], result => {
      setRepositories(result.repositoriesData);
      setUserId(result.userId ? result.userId : '');
      setApiKey(result.apiKey);
      setLoading(false);
    });

    const handlePopupOpen = () => {
      chrome.runtime.sendMessage({ type: 'POPUP_OPEN' });
    };
    window.addEventListener('focus', handlePopupOpen);

    return () => {
      window.removeEventListener('focus', handlePopupOpen);
    };
  }, []);

  useEffect(() => {
    chrome.storage.local.get(['repositoriesData', 'userId'], result => {
      setRepositories(result.repositoriesData);
      setUserId(result.userId);
    });
  }, [dataChanged]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(message => {
      if (message.type === 'SEND_NEW_DATA') {
        setDataChanged(message.dataChanged);
      }
    });
  }, []);

  useEffect(() => {
    getCurrentTab(currentTab => {
      setIsGitHubPage(currentTab?.url?.includes('github.com') ? true : false);
    });
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    chrome.storage.local.set({ apiKey: key });    
  };

  const deleteApiKey = () => {
    setApiKey(null);
    chrome.storage.local.remove(['repositoriesData', 'apiKey']);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return isGitHubPage ? (
    apiKey ? (
      <div className="App">
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
      </div>
    ) : (
      <ApiKeyInput saveApiKey={saveApiKey} />
    )
  ) : (
    <h1 className="warning-text">This is not a GitHub page!</h1>
  );
};

export default Popup;

interface ApiKeyInputProps {
  saveApiKey: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ saveApiKey }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSaveApiKey = () => {
    saveApiKey(apiKey);
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <h1 className=" text-lg text-center">Please provide your GitHub Personal access token:</h1>
      <div>
        <h2>Required Permissions: </h2>
        <p>Repo Access; Admin:org; Read:user.</p>
      </div>

      <input
        className=" border border-gray-600 rounded-sm"
        type="text"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        placeholder="Enter your API key"
      />
      <button onClick={handleSaveApiKey}>Save API Key</button>
    </div>
  );
};

const RepositoryList: React.FC<{ repositories: Repository[]; title: string; onClick: (url: string) => void }> = ({
  repositories,
  title,
  onClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRepositories = repositories.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, repoUrl: string) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      onClick(repoUrl);
      setSearchQuery('');
    }
  };

  return (
    <>
      <div className="App__header-input-container">
        <input
          id="searchInput"
          className="App__header-input"
          type="text"
          placeholder=""
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => handleKeyPress(e, filteredRepositories[0]?.html_url || '')}
        />
        <label htmlFor="searchInput" className="App__header-label">
          Search repositories...
        </label>
      </div>
      <p className="App-container__title">{title}</p>
      <ul className="flex gap-2">
        {filteredRepositories.map(repo => (
          <li key={repo.id}>
            <button
              className="text-sm p-2 border-slate-500 border rounded-xl w-full uppercase transition-all duration-300 hover:bg-gray-200 hover:border-gray-300 hover:text-blue-950"
              onClick={() => onClick(repo.html_url)}>
              {repo.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
