import { getAllRepos } from './github_api';
import { sendMessage } from './sendMessage';

type UpdateDataOptions = {
  data: object | void;
};

export const updateData = async (token: string, data: UpdateDataOptions) => {
  const newData = await getAllRepos(token);
  const dataChanged = JSON.stringify(data) !== JSON.stringify(newData);
  if (newData && dataChanged) {
    chrome.storage.local.set({ repositoriesData: newData });
    sendMessage('NEW_DATA', { dataChanged });
    return newData;
  }

  return data;
};
