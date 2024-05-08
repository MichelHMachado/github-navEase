import React, { useState } from 'react';
import Dropdown from '../dropdown/Dropdown';

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
      <Dropdown
        label={<h2>Personal Access Token instructions</h2>}
        content={
          <div>
            <ol className=" list-decimal">
              <li>Sign in to your GitHub account.</li>
              <li>Click on your profile photo in the upper-right corner of any page, then click on Settings.</li>
              <li>In the left sidebar, click on Developer settings.</li>
              <li>In the left sidebar, click on Personal access tokens.</li>
              <li>Click on Generate new token.</li>
              <li>Give your token a descriptive name in the Note field.</li>
              <li>Under the Select scopes, check the following options:</li>
              <ul className=" list-disc pl-4">
                <li>repo (Full control of private repositories)</li>
                <li>repo:status (Access commit status)</li>
                <li>repo_deployment (Access deployment status)</li>
                <li>public_repo (Access public repositories)</li>
                <li>repo:invite (Access repository invitations)</li>
                <li>security_events (Read and write security events)</li>
                <li>admin:org (Full control of orgs and teams, read and write org projects)</li>
                <li>write:org (Read and write org and team membership, read and write org projects)</li>
                <li>read:org (Read org and team membership, read org projects)</li>
                <li>manage_runners:org (Manage org runners and runner groups)</li>
                <li>read:user</li>
              </ul>
              <li>Click on Generate token.</li>
              <li>
                Copy the token to your clipboard. For security reasons, after you navigate off the page, you will not be
                able to see the token again.
              </li>
            </ol>
          </div>
        }
      />

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

export default ApiKeyInput;
