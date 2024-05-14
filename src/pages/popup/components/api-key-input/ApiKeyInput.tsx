import React, { useState } from 'react';
import Dropdown from '../dropdown/Dropdown';
import { tokenInstructions } from '../../constants';

interface ApiKeyInputProps {
  saveApiKey: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ saveApiKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [displayValue, setDisplayValue] = useState('');

  const handleSaveApiKey = () => {
    saveApiKey(apiKey);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setApiKey(newValue);
    setDisplayValue('*'.repeat(newValue.length));
  };

  return (
    <div className="p-4 flex flex-col gap-2 ">
      <h1 className="text-lg text-center">Please provide your GitHub Personal access token:</h1>
      <div>
        <h2>Required Permissions: </h2>
        <p>Repo Access; Admin:org; Read:user.</p>
      </div>
      <Dropdown
        label={<h2>Personal Access Token instructions</h2>}
        content={
          <div>
            <ol className="list-decimal">
              {tokenInstructions.map((step, index) => (
                <>
                  <li className=" mb-2" key={`step-${index}`}>
                    {step.description}
                  </li>
                  {step?.substeps && (
                    <ul className=" list-disc pl-2 mb-2">
                      {step.substeps.map((substep, idx) => (
                        <li key={`substep-${idx}`}>{substep}</li>
                      ))}
                    </ul>
                  )}
                </>
              ))}
            </ol>
          </div>
        }
      />

      <input
        className=" border border-gray-600 rounded-sm"
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        placeholder="Enter your API key"
      />
      <button onClick={handleSaveApiKey}>Save API Key</button>
    </div>
  );
};

export default ApiKeyInput;
