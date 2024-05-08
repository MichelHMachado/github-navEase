import React, { useState } from 'react';
import { Repository } from '../../../types/repo';

const RepositoryList: React.FC<{ repositories: Repository[]; title: string; onClick: (url: string) => void }> = ({
  repositories,
  title,
  onClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRepositories = repositories
    ? repositories.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

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

export default RepositoryList;
