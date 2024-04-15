import('@pages/content/injected/utils').then(async ({ getAllRepos, getAuthenticatedUser, updateData }) => {
  let repositoriesData;
  let apiKey: string | undefined;

  if (window.location.href.indexOf('github.com') > -1) {
    const result = await new Promise<{ apiKey?: string }>((resolve, reject) => {
      chrome.storage.local.get('apiKey', data => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(data);
        }
      });
    });
    apiKey = result.apiKey;
  }
  chrome.runtime.onMessage.addListener(async message => {
    if (message.type === 'INITIALIZE') {
      repositoriesData = await getAllRepos(apiKey);
      const user = await getAuthenticatedUser(apiKey);
      const userId = user.id;
      chrome.storage.local.set({
        repositoriesData: repositoriesData,
        userId: userId,
      });
    } else if (message.type === 'POPUP_OPEN') {
      const result = await new Promise<{ apiKey?: string }>((resolve, reject) => {
        chrome.storage.local.get('apiKey', data => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(data);
          }
        });
      });

      apiKey = result.apiKey;
      await updateData(apiKey, repositoriesData);
    }
  });
});
